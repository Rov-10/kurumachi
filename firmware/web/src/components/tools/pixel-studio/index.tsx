"use client";

import { useEffect, useState } from "react";
import { usePixelEngine } from "./usePixelEngine";
import { StudioCanvasPanel } from "./StudioCanvasPanel";
import { StudioControlsPanel } from "./StudioControlsPanel";
import { GIFEncoder } from "gifenc";

export default function PixelStudio() {
  const engine = usePixelEngine();
  
  const [fps, setFps] = useState(10);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  // --- Безшовна генерація GIF ---
  useEffect(() => {
    const timer = setTimeout(() => {
      if (engine.frames.length === 0) return;

      try {
        const enc = new GIFEncoder();
        const palette = [[0, 0, 0], [255, 255, 255]];
        
        engine.frames.forEach(frame => {
          const index = new Uint8Array(128 * 64);
          for (let y = 0; y < 64; y++) {
            for (let x = 0; x < 128; x++) index[y * 128 + x] = frame[y][x];
          }
          enc.writeFrame(index, 128, 64, { palette, delay: 1000 / fps });
        });
        
        enc.finish();
        const gifBytes = enc.bytes();
        const cleanBytes = new Uint8Array(gifBytes.buffer, gifBytes.byteOffset, gifBytes.byteLength);
        const blob = new Blob([cleanBytes], { type: "image/gif" });
        
        const newUrl = URL.createObjectURL(blob);
        setPreviewUrl(prev => {
          if (prev) URL.revokeObjectURL(prev);
          return newUrl;
        });
      } catch (error) {
        console.error("Error generating GIF:", error);
      }
    }, 400); 
    
    return () => clearTimeout(timer);
  }, [engine.frames, fps]);

  const handleDownload = () => {
    if (!previewUrl) return;
    const a = document.createElement("a");
    a.href = previewUrl;
    a.download = "kurumachi_custom_anim.gif";
    a.click();
  };

  const handleGenerateCode = async () => {
    if (!previewUrl) return;
    const response = await fetch(previewUrl);
    const blob = await response.blob();
    const file = new File([blob], "kurumachi_custom_anim.gif", { type: "image/gif" });
    
    window.dispatchEvent(new CustomEvent("kurumachi-load-gif", { detail: file }));
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  return (
    <div className="w-full mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6 select-none items-stretch">
      <StudioCanvasPanel engine={engine} />
      <StudioControlsPanel 
        engine={engine}
        fps={fps} setFps={setFps}
        previewUrl={previewUrl}
        isPlaying={isPlaying} setIsPlaying={setIsPlaying}
        onGenerateCode={handleGenerateCode}
        onDownload={handleDownload}
      />
    </div>
  );
}