"use client";
import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { Binary, Copy, Check, UploadCloud, FileImage } from "lucide-react";

export default function RleConverter() {
  const [copied, setCopied] = useState<boolean>(false);
  const [invert, setInvert] = useState<boolean>(false);
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragActive, setIsDragActive] = useState<boolean>(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setSelectedFile(e.target.files[0]);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragActive(true); };
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragActive(false); };
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "image/gif" || file.type === "image/png") setSelectedFile(file);
    }
  };

  // ── РЕАЛЬНИЙ RLE ЕНКОДЕР НА HTML5 CANVAS ───────────────────────────────────
  const processImageMatrix = () => {
    if (!selectedFile) return;

    const img = new Image();
    img.src = URL.createObjectURL(selectedFile);
    
    img.onload = () => {
      // Фіксовані розміри OLED екрану Kurumachi
      const TARGET_W = 128;
      const TARGET_H = 64;

      const canvas = document.createElement("canvas");
      canvas.width = TARGET_W;
      canvas.height = TARGET_H;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Малюємо картинку з масштабуванням під розмір екрану
      ctx.drawImage(img, 0, 0, TARGET_W, TARGET_H);
      const imgData = ctx.getImageData(0, 0, TARGET_W, TARGET_H);
      const pixels = imgData.data;

      // 1. Переводимо 32-бітний RGBA масив у лінійний масив бітів (0 або 1)
      const bitMatrix: number[] = [];
      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i+1];
        const b = pixels[i+2];
        
        // Вираховуємо яскравість пікселя (Grayscale за стандартом ITU)
        const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
        
        // Порогове бінарне розділення (порог 128) + враховуємо чекбокс інверсії
        let bit = brightness > 128 ? 1 : 0;
        if (invert) bit = bit === 1 ? 0 : 1;
        
        bitMatrix.push(bit);
      }

      // 2. Стискаємо матрицю за алгоритмом RLE: ((count - 1) << 1) | pixel
      const rleBytes: string[] = [];
      let currentPixel = bitMatrix[0];
      let runLength = 1;

      for (let i = 1; i < bitMatrix.length; i++) {
        // Максимальна довжина серії в одному байті — 128 пікселів (бо зсув на 1 біт вліво)
        if (bitMatrix[i] === currentPixel && runLength < 128) {
          runLength++;
        } else {
          // Пакуємо фінальний байт
          const rleByte = ((runLength - 1) << 1) | currentPixel;
          rleBytes.push("0x" + rleByte.toString(16).toUpperCase().padStart(2, "0"));
          
          // Переходимо до наступної серії
          currentPixel = bitMatrix[i];
          runLength = 1;
        }
      }
      // Допаковуємо останній хвіст матриці
      const lastByte = ((runLength - 1) << 1) | currentPixel;
      rleBytes.push("0x" + lastByte.toString(16).toUpperCase().padStart(2, "0"));

      // 3. Форматуємо масив рядків у красивий C++ код для прошивки
      const formattedBytes: string[] = [];
      for (let i = 0; i < rleBytes.length; i += 12) {
        formattedBytes.push("  " + rleBytes.slice(i, i + 12).join(", "));
      }

      const safeName = selectedFile.name.toLowerCase().replace(/[^a-z0-9]/g, "_");
      const outputHeader = `// Generated via Kurumachi Developer Suite\n// Source Node: ${selectedFile.name}\n// Mode: Monochromatic RLE Compression\n// Compressed Size: ${rleBytes.length} bytes (Original: 1024 bytes)\nconst uint8_t anim_${safeName}[] PROGMEM = {\n${formattedBytes.join(",\n")}\n};`;
      
      setGeneratedCode(outputHeader);
      URL.revokeObjectURL(img.src);
    };
  };

  const handleCopy = () => {
    if (!generatedCode) return;
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch animate-in fade-in slide-in-from-bottom-2 duration-500">
      
      {/* Upload and Settings Panel */}
      <div className="lg:col-span-1 border border-nothing-border bg-nothing-gray/10 p-6 rounded-3xl flex flex-col justify-between text-left">
        <div className="space-y-6">
          <div>
            <h3 className="font-dot text-2xl text-white uppercase flex items-center gap-2">
              <Binary className="w-5 h-5 text-nothing-red" /> RLE Asset Matrix
            </h3>
            <p className="text-xs text-nothing-text/40 uppercase tracking-widest mt-0.5 font-space">
              OLED Frame ByteEncoder Suite
            </p>
          </div>

          <div 
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed bg-black/20 rounded-2xl p-8 text-center cursor-pointer transition-all group flex flex-col items-center justify-center min-h-[180px] ${
              isDragActive ? "border-nothing-red bg-nothing-red/5 animate-pulse" : "border-nothing-border/60 hover:border-nothing-text/40"
            }`}
          >
            <input 
              type="file" ref={fileInputRef} onChange={handleFileChange}
              className="hidden" accept="image/gif,image/png" 
            />
            
            {selectedFile ? (
              <>
                <FileImage className="w-8 h-8 text-nothing-red mb-2" />
                <span className="font-dot text-xs uppercase tracking-wider text-white max-w-full truncate px-2">
                  {selectedFile.name}
                </span>
                <span className="font-space text-[10px] text-nothing-text/40 mt-1">
                  {(selectedFile.size / 1024).toFixed(1)} KB | Asset loaded
                </span>
              </>
            ) : (
              <>
                <UploadCloud className="w-8 h-8 text-nothing-text/30 group-hover:text-nothing-red transition-colors mb-2" />
                <span className="font-dot text-xs uppercase tracking-wider text-white">Drop PNG or GIF frame</span>
                <span className="font-space text-[10px] text-nothing-text/40 mt-1">Target viewport: 128x64 px</span>
              </>
            )}
          </div>

          <div className="space-y-3 font-dot text-xs tracking-widest uppercase">
            <label className="flex items-center gap-3 cursor-pointer select-none text-nothing-text/80 hover:text-white transition-colors">
              <input 
                type="checkbox" checked={invert} onChange={(e) => setInvert(e.target.checked)}
                className="w-4 h-4 rounded border-nothing-border bg-black text-nothing-red focus:ring-0 cursor-pointer accent-nothing-red" 
              />
              Invert Pixel Matrix Colors
            </label>
          </div>
        </div>

        <div className="pt-6 border-t border-nothing-border/40">
          <button
            onClick={processImageMatrix}
            disabled={!selectedFile}
            className={`w-full py-3 font-dot text-xs tracking-widest uppercase border transition-all duration-300 ${
              selectedFile 
                ? "border-white bg-white text-black hover:bg-transparent hover:text-white cursor-pointer" 
                : "border-nothing-border text-nothing-text/30 bg-transparent cursor-not-allowed opacity-50"
            }`}
          >
            {selectedFile ? "Process & Compress Frame" : "Awaiting File Upload"}
          </button>
        </div>
      </div>

      {/* Code Terminal Output */}
      <div className="lg:col-span-2 border border-nothing-border bg-black/40 rounded-3xl p-6 flex flex-col h-[400px] lg:h-auto min-h-[350px]">
        <div className="flex items-center justify-between text-nothing-text/50 font-dot text-xs uppercase tracking-widest mb-4 pb-2 border-b border-nothing-border">
          <span className="flex items-center gap-2"><Binary className="w-4 h-4" /> Output custom_frame.h</span>
          {generatedCode && (
            <button 
              onClick={handleCopy}
              className="flex items-center gap-1.5 hover:text-white font-dot tracking-widest uppercase text-[11px] transition-colors"
            >
              {copied ? (
                <><Check className="w-3.5 h-3.5 text-green-400" /> Copied!</>
              ) : (
                <><Copy className="w-3.5 h-3.5" /> Copy Code</>
              )}
            </button>
          )}
        </div>

        <div className="flex-1 overflow-auto font-mono text-xs text-left bg-black/30 p-4 rounded-xl border border-nothing-border/40 select-text relative">
          {generatedCode ? (
            <pre className="text-white whitespace-pre-wrap leading-relaxed">{generatedCode}</pre>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-nothing-text/20 italic font-space text-sm">
              Awaiting image matrix upload for byte-stream generation...
            </div>
          )}
        </div>
      </div>

    </div>
  );
}