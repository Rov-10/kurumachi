"use client";

import { useEffect, useState } from "react";
import { usePixelEngine } from "./usePixelEngine";
import { PixelCanvas } from "./PixelCanvas";
import { GIFEncoder } from "gifenc";
import { Play, Pause, Download, Code } from "lucide-react";

const Icons = {
  pencil: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mx-auto"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" /></svg>,
  bucket: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mx-auto"><path d="m19 11-8-8-8.6 8.6a2 2 0 0 0 0 2.8l5.2 5.2c.8.8 2 .8 2.8 0L19 11Z"/><path d="m5 2 5 5"/><path d="M2 13h15"/><path d="M22 20a2 2 0 1 1-4 0c0-1.6 1.7-2.4 2-4 .3 1.6 2 2.4 2 4Z"/></svg>,
  line: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mx-auto"><line x1="5" y1="19" x2="19" y2="5" /></svg>,
  rect: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mx-auto"><rect x="4" y="4" width="16" height="16" rx="2" /></svg>,
  circle: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mx-auto"><circle cx="12" cy="12" r="8" /></svg>,
  triangle: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mx-auto"><path d="M12 3L3 20h18L12 3z" /></svg>,
};

export default function PixelStudio() {
  const engine = usePixelEngine();
  
  const [fps, setFps] = useState(10);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  // --- Фонова генерація GIF ---
  useEffect(() => {
    let url: string | null = null;
    
    const timer = setTimeout(() => {
      if (engine.frames.length === 0) return;

      const enc = new GIFEncoder();
      const palette = [[0, 0, 0], [255, 255, 255]];
      
      engine.frames.forEach(frame => {
        const index = new Uint8Array(128 * 64);
        for (let y = 0; y < 64; y++) {
          for (let x = 0; x < 128; x++) {
            index[y * 128 + x] = frame[y][x];
          }
        }
        enc.writeFrame(index, 128, 64, { palette, delay: 1000 / fps });
      });
      
      enc.finish();
      const gifBytes = enc.bytes();
      const cleanBytes = new Uint8Array(gifBytes.buffer, gifBytes.byteOffset, gifBytes.byteLength);
      const blob = new Blob([cleanBytes], { type: "image/gif" });
      
      url = URL.createObjectURL(blob);
      setPreviewUrl(url);
    }, 400); // 400ms debounce
    
    return () => {
      clearTimeout(timer);
      if (url) URL.revokeObjectURL(url);
    };
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
    
    // Скролимо до терміналу
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  return (
    <div className="w-full mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6 select-none items-start">
      <div className="lg:col-span-2 border border-zinc-800/80 rounded-2xl p-6 bg-[#050505] flex flex-col relative min-h-[520px]">
        <div className="flex items-start gap-4 mb-2">
          <div className="text-red-500 font-dot text-xs leading-tight flex flex-col items-center">
            <span>02</span><span>10</span>
          </div>
          <div>
            <h2 className="text-white font-dot text-lg uppercase tracking-wider">PIXEL ART STUDIO</h2>
            <p className="text-zinc-500 text-[10px] font-sans uppercase mt-1 tracking-widest">OLED CANVAS EDITOR & BRUSH ENGINE.</p>
          </div>
        </div>

        <PixelCanvas engine={engine} />

        <div className="mt-auto flex items-center gap-4 bg-black border border-zinc-800/80 rounded-xl p-4 text-zinc-400 shrink-0">
          <span className="font-dot text-xs uppercase text-zinc-500 whitespace-nowrap">
            FRAME: {engine.currentFrameIdx + 1}/{engine.frames.length}
          </span>
          <input
            type="range" min="0" max={engine.frames.length - 1} value={engine.currentFrameIdx}
            onChange={(e) => engine.setCurrentFrameIdx(Number(e.target.value))}
            className="flex-1 accent-white bg-zinc-900 h-1 appearance-none cursor-pointer rounded-full"
          />
          <button
            onClick={engine.addFrame}
            className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs uppercase font-dot hover:border-zinc-500 hover:text-white transition"
          >
            + Add
          </button>
          <button
            onClick={engine.deleteFrame}
            className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs uppercase font-dot hover:border-red-900 text-red-500 transition"
          >
            - Delete
          </button>
        </div>
      </div>

      <div className="border border-zinc-800/80 rounded-2xl p-6 bg-[#050505] flex flex-col relative min-h-[520px]">
        <div className="flex items-start gap-4 mb-2">
          <div className="text-red-500 font-dot text-xs leading-tight flex flex-col items-center">
            <span>03</span><span>10</span>
          </div>
          <div>
            <h2 className="text-white font-dot text-lg uppercase tracking-wider">STUDIO CONTROLS</h2>
            <p className="text-zinc-500 text-[10px] font-sans uppercase mt-1 tracking-widest">TOOLS, BRUSHES & EXPORT.</p>
          </div>
        </div>

        <div className="space-y-4 mt-6 flex-1">
          <div className="space-y-2">
            <div className="grid grid-cols-6 gap-2">
              <button title="Draw" onClick={() => engine.setActiveTool('pencil')} className={`py-2 rounded-lg border transition ${engine.activeTool === 'pencil' ? 'bg-white text-black border-white' : 'border-zinc-800 text-zinc-500 bg-black hover:bg-zinc-900 hover:text-zinc-300'}`}>{Icons.pencil}</button>
              <button title="Fill" onClick={() => engine.setActiveTool('bucket')} className={`py-2 rounded-lg border transition ${engine.activeTool === 'bucket' ? 'bg-white text-black border-white' : 'border-zinc-800 text-zinc-500 bg-black hover:bg-zinc-900 hover:text-zinc-300'}`}>{Icons.bucket}</button>
              <button title="Line" onClick={() => engine.setActiveTool('line')} className={`py-2 rounded-lg border transition ${engine.activeTool === 'line' ? 'bg-white text-black border-white' : 'border-zinc-800 text-zinc-500 bg-black hover:bg-zinc-900 hover:text-zinc-300'}`}>{Icons.line}</button>
              <button title="Rectangle" onClick={() => engine.setActiveTool('rect')} className={`py-2 rounded-lg border transition ${engine.activeTool === 'rect' ? 'bg-white text-black border-white' : 'border-zinc-800 text-zinc-500 bg-black hover:bg-zinc-900 hover:text-zinc-300'}`}>{Icons.rect}</button>
              <button title="Circle" onClick={() => engine.setActiveTool('circle')} className={`py-2 rounded-lg border transition ${engine.activeTool === 'circle' ? 'bg-white text-black border-white' : 'border-zinc-800 text-zinc-500 bg-black hover:bg-zinc-900 hover:text-zinc-300'}`}>{Icons.circle}</button>
              <button title="Triangle" onClick={() => engine.setActiveTool('triangle')} className={`py-2 rounded-lg border transition ${engine.activeTool === 'triangle' ? 'bg-white text-black border-white' : 'border-zinc-800 text-zinc-500 bg-black hover:bg-zinc-900 hover:text-zinc-300'}`}>{Icons.triangle}</button>
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={() => engine.setColor(1)} className={`flex-1 py-1.5 text-[10px] rounded font-dot border transition ${engine.color === 1 ? 'bg-zinc-700 text-white border-zinc-500' : 'border-zinc-900 text-zinc-600 bg-black hover:border-zinc-700'}`}>WHITE</button>
              <button onClick={() => engine.setColor(0)} className={`flex-1 py-1.5 text-[10px] rounded font-dot border transition ${engine.color === 0 ? 'bg-zinc-700 text-white border-zinc-500' : 'border-zinc-900 text-zinc-600 bg-black hover:border-zinc-700'}`}>BLACK</button>
            </div>
          </div>

          {engine.activeTool !== 'bucket' && (
            <div className="space-y-3 pt-3 border-t border-zinc-800/50">
              <span className="font-dot text-[10px] text-zinc-500 uppercase tracking-widest block">// Brush Settings</span>
              <div className="flex gap-2">
                <button onClick={() => engine.setBrushShape('square')} className={`flex-1 py-2 text-[10px] rounded font-dot border uppercase transition ${engine.brushShape === 'square' ? 'bg-zinc-800 text-white border-zinc-600' : 'border-zinc-900 text-zinc-600 bg-black'}`}>Square</button>
                <button onClick={() => engine.setBrushShape('circle')} className={`flex-1 py-2 text-[10px] rounded font-dot border uppercase transition ${engine.brushShape === 'circle' ? 'bg-zinc-800 text-white border-zinc-600' : 'border-zinc-900 text-zinc-600 bg-black'}`}>Circle</button>
              </div>
              <div className="flex items-center gap-3 bg-black border border-zinc-800 rounded-lg p-2">
                <span className="font-dot text-[10px] text-zinc-500 w-16">SIZE: {engine.brushSize}px</span>
                <input type="range" min="1" max="15" value={engine.brushSize} onChange={(e) => engine.setBrushSize(Number(e.target.value))} className="flex-1 accent-zinc-500 h-1 appearance-none cursor-pointer rounded-full" />
              </div>
            </div>
          )}

          <div className="space-y-3 pt-3 border-t border-zinc-800/50">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" checked={engine.showGrid} onChange={() => engine.setShowGrid(!engine.showGrid)} className="rounded border-zinc-800 bg-black text-white focus:ring-0 accent-white w-4 h-4" />
              <span className="font-dot text-xs text-zinc-400 group-hover:text-white transition uppercase">Show Overlay Grid</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" checked={engine.showOnion} onChange={() => engine.setShowOnion(!engine.showOnion)} className="rounded border-zinc-800 bg-black text-white focus:ring-0 accent-white w-4 h-4" />
              <span className="font-dot text-xs text-zinc-400 group-hover:text-white transition uppercase">Enable Onion Skinning</span>
            </label>
          </div>

          <div className="space-y-3 pt-3 border-t border-zinc-800/50">
            <div className="flex justify-between items-center mb-2">
              <span className="font-dot text-[10px] text-zinc-500 uppercase tracking-widest">// Preview & Speed</span>
              <span className="font-dot text-[10px] text-zinc-400">{fps} FPS</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-24 h-12 bg-black border border-zinc-800 rounded shrink-0 overflow-hidden relative group">
                {previewUrl && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img 
                    src={isPlaying ? previewUrl : undefined} 
                    alt="Preview" 
                    className="w-full h-full object-contain" 
                    style={{ imageRendering: "pixelated", display: isPlaying ? "block" : "none" }} 
                  />
                )}
                {!isPlaying && (
                  <div className="w-full h-full bg-[#050505] flex items-center justify-center text-[8px] font-dot text-zinc-600">PAUSED</div>
                )}
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                >
                  {isPlaying ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white" />}
                </button>
              </div>
              <input type="range" min="1" max="30" value={fps} onChange={(e) => setFps(Number(e.target.value))} className="flex-1 accent-white bg-zinc-900 h-1 appearance-none cursor-pointer rounded-full" />
            </div>
          </div>
        </div>

        <div className="space-y-3 mt-4 pt-4 border-t border-zinc-800/50 shrink-0">
          <button onClick={handleGenerateCode} className="w-full py-3 rounded-xl bg-white text-black font-dot text-xs uppercase tracking-widest hover:bg-zinc-200 transition font-bold flex items-center justify-center gap-2">
            <Code className="w-4 h-4" /> Generate Code
          </button>
          <button onClick={handleDownload} className="w-full py-3 rounded-xl border border-zinc-800 text-zinc-400 font-dot text-xs bg-black uppercase hover:border-zinc-600 hover:text-white transition flex items-center justify-center gap-2">
            <Download className="w-4 h-4" /> Download GIF
          </button>
        </div>
      </div>
    </div>
  );
}