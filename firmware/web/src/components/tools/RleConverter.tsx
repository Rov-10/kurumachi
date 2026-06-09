"use client";

import { useState, useRef, DragEvent, ChangeEvent, useEffect } from "react";
import { Binary, Copy, Check, UploadCloud, FileImage } from "lucide-react";
// @ts-ignore
import { parseGIF, decompressFrames } from "gifuct-js";

export default function RleConverter() {
  const [copied, setCopied] = useState<boolean>(false);
  const [invert, setInvert] = useState<boolean>(false);
  const [threshold, setThreshold] = useState<number>(128);
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragActive, setIsDragActive] = useState<boolean>(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Слухач для отримання GIF з PixelStudio
  useEffect(() => {
    const handleCustomGif = (e: Event) => {
      const customEvent = e as CustomEvent<File>;
      if (customEvent.detail) {
        setSelectedFile(customEvent.detail);
        setGeneratedCode("");
      }
    };
    window.addEventListener("kurumachi-load-gif", handleCustomGif);
    return () => window.removeEventListener("kurumachi-load-gif", handleCustomGif);
  }, []);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setGeneratedCode("");
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragActive(true); };
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragActive(false); };
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "image/gif" || file.type === "image/png") {
        setSelectedFile(file);
        setGeneratedCode("");
      }
    }
  };

  // --- Логіка конвертації (порт з Python gif2header.py) ---
  const processGif = async () => {
    if (!selectedFile) return;

    try {
      const buffer = await selectedFile.arrayBuffer();
      const gif = parseGIF(buffer);
      const frames = decompressFrames(gif, true);

      const TARGET_W = 128;
      const TARGET_H = 64;

      const framesRle: number[][] = [];
      const delays: number[] = [];

      // Використовуємо тимчасовий канвас для ресайзу (тут scale="fit")
      const canvas = document.createElement("canvas");
      canvas.width = TARGET_W;
      canvas.height = TARGET_H;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const tempCanvas = document.createElement("canvas");
      const tempCtx = tempCanvas.getContext("2d");

      for (let i = 0; i < frames.length; i++) {
        const frame = frames[i];
        delays.push(frame.delay || 100);

        // Створюємо ImageData з кадру GIF
        const frameImageData = new ImageData(
          new Uint8ClampedArray(frame.patch),
          frame.dims.width,
          frame.dims.height
        );

        // Малюємо кадр на тимчасовий канвас
        tempCanvas.width = frame.dims.width;
        tempCanvas.height = frame.dims.height;
        tempCtx?.putImageData(frameImageData, 0, 0);

        // Очищаємо основний канвас (білий фон)
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, TARGET_W, TARGET_H);

        // Масштабуємо (Fit)
        const srcW = frame.dims.width;
        const srcH = frame.dims.height;
        const ratio = Math.min(TARGET_W / srcW, TARGET_H / srcH);
        const newW = Math.floor(srcW * ratio);
        const newH = Math.floor(srcH * ratio);
        const dx = Math.floor((TARGET_W - newW) / 2);
        const dy = Math.floor((TARGET_H - newH) / 2);

        // Малюємо відмасштабований кадр на основний канвас
        ctx.drawImage(tempCanvas, dx, dy, newW, newH);

        const imgData = ctx.getImageData(0, 0, TARGET_W, TARGET_H);
        const pixels = imgData.data;

        // 1. Збираємо біти (0 або 1)
        const bitMatrix: number[] = [];
        for (let p = 0; p < pixels.length; p += 4) {
          const r = pixels[p];
          const g = pixels[p + 1];
          const b = pixels[p + 2];
          // Grayscale
          const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
          let isWhite = brightness >= threshold;
          if (invert) isWhite = !isWhite;
          bitMatrix.push(isWhite ? 1 : 0);
        }

        // 2. RLE Encoding: ((count - 1) << 1) | pixel
        if (bitMatrix.length === 0) {
          framesRle.push([]);
          continue;
        }

        const rle: number[] = [];
        let currentPixel = bitMatrix[0];
        let count = 1;

        for (let p = 1; p < bitMatrix.length; p++) {
          if (bitMatrix[p] === currentPixel && count < 128) {
            count++;
          } else {
            rle.push(((count - 1) << 1) | currentPixel);
            currentPixel = bitMatrix[p];
            count = 1;
          }
        }
        rle.push(((count - 1) << 1) | currentPixel);
        framesRle.push(rle);
      }

      // --- Генерація C Code ---
      const varName = selectedFile.name.toLowerCase().replace(/[^a-z0-9]/g, "_").replace("_gif", "");
      const frameCount = framesRle.length;
      let rleSize = 0;
      framesRle.forEach(f => rleSize += f.length);
      const rawSize = frameCount * TARGET_W * TARGET_H / 8;

      let code = `// Source: ${selectedFile.name}\n`;
      code += `#pragma once\n`;
      code += `#include <pgmspace.h>\n\n`;
      code += `#define ${varName.toUpperCase()}_FRAME_COUNT ${frameCount}\n`;
      code += `#define ${varName.toUpperCase()}_WIDTH        ${TARGET_W}\n`;
      code += `#define ${varName.toUpperCase()}_HEIGHT       ${TARGET_H}\n\n`;

      code += `const uint16_t ${varName}_delays[${frameCount}] PROGMEM = {${delays.join(", ")}};\n\n`;

      framesRle.forEach((rle, i) => {
        const hexVals = rle.map(b => "0x" + b.toString(16).toUpperCase().padStart(2, "0"));
        const rows: string[] = [];
        for (let k = 0; k < hexVals.length; k += 16) {
          rows.push("  " + hexVals.slice(k, k + 16).join(", "));
        }
        code += `const uint8_t ${varName}_frame${i.toString().padStart(3, "0")}[${rle.length}] PROGMEM = {\n`;
        code += rows.join(",\n") + "\n};\n\n";
      });

      const sizeVals = framesRle.map(f => f.length).join(", ");
      code += `const uint16_t ${varName}_sizes[${frameCount}] PROGMEM = {${sizeVals}};\n\n`;

      const ptrList = framesRle.map((_, i) => `${varName}_frame${i.toString().padStart(3, "0")}`);
      code += `const uint8_t* const ${varName}_frames[${frameCount}] PROGMEM = {\n`;
      for (let k = 0; k < ptrList.length; k += 4) {
        const chunk = ptrList.slice(k, k + 4);
        const comma = k + 4 < frameCount ? "," : "";
        code += "  " + chunk.join(", ") + comma + "\n";
      }
      code += `};\n`;

      code = `// Compressed Size: ${rleSize} bytes (Original: ${rawSize} bytes)\n` + code;
      setGeneratedCode(code);

    } catch (error) {
      console.error("Error processing GIF:", error);
      alert("Failed to process GIF. Make sure it's a valid animated GIF.");
    }
  };

  const handleCopy = () => {
    if (!generatedCode) return;
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch animate-in fade-in slide-in-from-bottom-2 duration-500">
      
      {/* Upload Panel */}
      <div className="lg:col-span-1 border border-zinc-800/80 bg-[#050505] p-6 rounded-2xl flex flex-col justify-between text-left relative">
        <div className="flex items-start gap-4 mb-6">
          <div className="text-red-500 font-dot text-xs leading-tight flex flex-col items-center">
            <span>01</span><span>10</span>
          </div>
          <div>
            <h2 className="text-white font-dot text-lg uppercase tracking-wider">RLE ASSET MATRIX</h2>
            <p className="text-zinc-500 text-[10px] font-sans uppercase mt-1 tracking-widest">OLED FRAME BYTEENCODER SUITE.</p>
          </div>
        </div>

        <div className="space-y-6">
          <div 
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border border-dashed rounded-xl p-8 text-center cursor-pointer transition-all group flex flex-col items-center justify-center min-h-[140px] ${
              isDragActive ? "border-white bg-white/5" : "border-zinc-800 bg-black hover:border-zinc-600"
            }`}
          >
            <input 
              type="file" ref={fileInputRef} onChange={handleFileChange}
              className="hidden" accept="image/gif" 
            />
            {selectedFile ? (
              <>
                <FileImage className="w-8 h-8 text-white mb-2" />
                <span className="font-dot text-xs uppercase tracking-wider text-white max-w-full truncate px-2">
                  {selectedFile.name}
                </span>
                <span className="font-sans text-[10px] text-zinc-500 mt-1 uppercase">
                  {(selectedFile.size / 1024).toFixed(1)} KB | Asset loaded
                </span>
              </>
            ) : (
              <>
                <UploadCloud className="w-8 h-8 text-zinc-600 group-hover:text-white transition-colors mb-2" />
                <span className="font-dot text-xs uppercase tracking-wider text-white">Drop GIF frame</span>
                <span className="font-sans text-[10px] text-zinc-500 mt-1 uppercase">Target viewport: 128x64 px</span>
              </>
            )}
          </div>

          <div className="space-y-3 font-dot text-xs uppercase pt-2">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox" checked={invert} onChange={(e) => setInvert(e.target.checked)}
                className="w-4 h-4 rounded border-zinc-800 bg-black text-white focus:ring-0 cursor-pointer accent-white" 
              />
              <span className="text-zinc-400 group-hover:text-white transition">Invert Pixel Colors</span>
            </label>
            <div className="flex items-center gap-3 bg-black border border-zinc-800 rounded-lg p-2">
                <span className="text-zinc-500 w-24">THRESH: {threshold}</span>
                <input type="range" min="1" max="255" value={threshold} onChange={(e) => setThreshold(Number(e.target.value))} className="flex-1 accent-zinc-500 h-1 appearance-none cursor-pointer rounded-full" />
            </div>
          </div>
        </div>

        <div className="pt-6 mt-6 border-t border-zinc-800/50">
          <button
            onClick={processGif}
            disabled={!selectedFile}
            className={`w-full py-3 rounded-xl font-dot text-xs tracking-widest uppercase transition-all duration-300 font-bold ${
              selectedFile 
                ? "bg-white text-black hover:bg-zinc-200 cursor-pointer" 
                : "border border-zinc-800 text-zinc-600 bg-black cursor-not-allowed"
            }`}
          >
            {selectedFile ? "Process & Compress" : "Awaiting File Upload"}
          </button>
        </div>
      </div>

      {/* Code Terminal Output */}
      <div className="lg:col-span-2 border border-zinc-800/80 bg-[#050505] rounded-2xl p-6 flex flex-col min-h-[400px]">
        <div className="flex items-center justify-between text-zinc-500 font-dot text-xs uppercase tracking-widest mb-4 pb-2 border-b border-zinc-800/50">
          <span className="flex items-center gap-2"><Binary className="w-4 h-4" /> Output custom_frame.h</span>
          {generatedCode && (
            <button 
              onClick={handleCopy}
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              {copied ? (
                <><Check className="w-3.5 h-3.5 text-white" /> Copied!</>
              ) : (
                <><Copy className="w-3.5 h-3.5" /> Copy Code</>
              )}
            </button>
          )}
        </div>

        <div className="flex-1 overflow-auto font-mono text-[10px] sm:text-xs text-left bg-black p-4 rounded-xl border border-zinc-800/50 select-text relative scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
          {generatedCode ? (
            <pre className="text-zinc-300 whitespace-pre-wrap leading-relaxed">{generatedCode}</pre>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-zinc-600 font-sans text-xs uppercase tracking-widest">
              Awaiting matrix upload for byte-stream generation...
            </div>
          )}
        </div>
      </div>

    </div>
  );
}