import { useState } from "react";
import { parseGIF, decompressFrames } from "gifuct-js";

export function useGifProcessor() {
  const [generatedCode, setGeneratedCode] = useState<string>("");

  const processGif = async (selectedFile: File | null, threshold: number, invert: boolean) => {
    if (!selectedFile) return;

    try {
      const buffer = await selectedFile.arrayBuffer();
      const gif = parseGIF(buffer);
      const frames = decompressFrames(gif, true);

      const TARGET_W = 128;
      const TARGET_H = 64;

      const framesRle: number[][] = [];
      const delays: number[] = [];

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

        const frameImageData = new ImageData(
          new Uint8ClampedArray(frame.patch),
          frame.dims.width,
          frame.dims.height
        );

        tempCanvas.width = frame.dims.width;
        tempCanvas.height = frame.dims.height;
        tempCtx?.putImageData(frameImageData, 0, 0);

        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, TARGET_W, TARGET_H);

        const srcW = frame.dims.width;
        const srcH = frame.dims.height;
        const ratio = Math.min(TARGET_W / srcW, TARGET_H / srcH);
        const newW = Math.floor(srcW * ratio);
        const newH = Math.floor(srcH * ratio);
        const dx = Math.floor((TARGET_W - newW) / 2);
        const dy = Math.floor((TARGET_H - newH) / 2);

        ctx.drawImage(tempCanvas, dx, dy, newW, newH);

        const imgData = ctx.getImageData(0, 0, TARGET_W, TARGET_H);
        const pixels = imgData.data;

        const bitMatrix: number[] = [];
        for (let p = 0; p < pixels.length; p += 4) {
          const r = pixels[p];
          const g = pixels[p + 1];
          const b = pixels[p + 2];
          const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
          let isWhite = brightness >= threshold;
          if (invert) isWhite = !isWhite;
          bitMatrix.push(isWhite ? 1 : 0);
        }

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

  return { generatedCode, setGeneratedCode, processGif };
}