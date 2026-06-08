"use client";

import { usePixelEngine } from "./usePixelEngine";
import { PixelCanvas } from "./PixelCanvas";

// --- Векторні іконки для інструментів ---
const Icons = {
  pencil: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mx-auto"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" /></svg>,
  bucket: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mx-auto"><path d="M19.428 15.428a2 2 0 0 0-1.022-.547l-2.387-.477a6 6 0 0 0-3.86.517l-.318.158a6 6 0 0 1-3.86.517L6.05 15.21a2 2 0 0 0-1.806.547M8 4h8l-1 1v5.172a2 2 0 0 0 .586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 0 0 9 10.172V5L8 4z" /></svg>,
  line: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mx-auto"><line x1="5" y1="19" x2="19" y2="5" /></svg>,
  rect: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mx-auto"><rect x="4" y="4" width="16" height="16" rx="2" /></svg>,
  circle: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mx-auto"><circle cx="12" cy="12" r="8" /></svg>,
  triangle: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mx-auto"><path d="M12 3L3 20h18L12 3z" /></svg>,
};

export default function PixelStudio() {
  const engine = usePixelEngine();

  return (
    <div className="w-full mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6 select-none">
      
      {/* ЛІВИЙ БЛОК: КАНВАС */}
      <div className="lg:col-span-2 border border-zinc-800/80 rounded-2xl p-6 bg-[#050505] flex flex-col relative">
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

        <div className="mt-auto flex items-center gap-4 bg-black border border-zinc-800/80 rounded-xl p-4 text-zinc-400">
          <span className="font-dot text-xs uppercase text-zinc-500 whitespace-nowrap">
            FRAME: {engine.currentFrameIdx + 1}/{engine.frames.length}
          </span>
          <input
            type="range" min="0" max={engine.frames.length - 1} value={engine.currentFrameIdx}
            onChange={(e) => engine.setCurrentFrameIdx(Number(e.target.value))}
            className="flex-1 accent-white bg-zinc-900 h-1 appearance-none cursor-pointer rounded-full"
          />
          <button
            onClick={() => {
              engine.setFrames([...engine.frames, engine.currentFrame.map((r: number[]) => [...r])]);
              engine.setCurrentFrameIdx(engine.frames.length);
            }}
            className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs uppercase font-dot hover:border-zinc-500 hover:text-white transition"
          >
            + Add
          </button>
          <button
            onClick={() => {
              if (engine.frames.length === 1) return;
              engine.setFrames(engine.frames.filter((_, i) => i !== engine.currentFrameIdx));
              engine.setCurrentFrameIdx(Math.max(0, engine.currentFrameIdx - 1));
            }}
            className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs uppercase font-dot hover:border-red-900 text-red-500 transition"
          >
            - Delete
          </button>
        </div>
      </div>

      {/* ПРАВИЙ БЛОК: ТУЛЗЫ */}
      <div className="border border-zinc-800/80 rounded-2xl p-6 bg-[#050505] flex flex-col relative">
        <div className="flex items-start gap-4 mb-2">
          <div className="text-red-500 font-dot text-xs leading-tight flex flex-col items-center">
            <span>03</span><span>10</span>
          </div>
          <div>
            <h2 className="text-white font-dot text-lg uppercase tracking-wider">STUDIO CONTROLS</h2>
            <p className="text-zinc-500 text-[10px] font-sans uppercase mt-1 tracking-widest">TOOLS, BRUSHES & EXPORT.</p>
          </div>
        </div>

        <div className="space-y-5 mt-6 flex-1">
          
          <div className="space-y-2">
            {/* Оновлена сітка інструментів з іконками */}
            <div className="grid grid-cols-6 gap-2">
              <button title="Draw" onClick={() => engine.setActiveTool('pencil')} className={`py-2 rounded-lg border transition ${engine.activeTool === 'pencil' ? 'bg-white text-black border-white' : 'border-zinc-800 text-zinc-500 bg-black hover:bg-zinc-900 hover:text-zinc-300'}`}>{Icons.pencil}</button>
              <button title="Fill" onClick={() => engine.setActiveTool('bucket')} className={`py-2 rounded-lg border transition ${engine.activeTool === 'bucket' ? 'bg-white text-black border-white' : 'border-zinc-800 text-zinc-500 bg-black hover:bg-zinc-900 hover:text-zinc-300'}`}>{Icons.bucket}</button>
              <button title="Line" onClick={() => engine.setActiveTool('line')} className={`py-2 rounded-lg border transition ${engine.activeTool === 'line' ? 'bg-white text-black border-white' : 'border-zinc-800 text-zinc-500 bg-black hover:bg-zinc-900 hover:text-zinc-300'}`}>{Icons.line}</button>
              <button title="Rectangle" onClick={() => engine.setActiveTool('rect')} className={`py-2 rounded-lg border transition ${engine.activeTool === 'rect' ? 'bg-white text-black border-white' : 'border-zinc-800 text-zinc-500 bg-black hover:bg-zinc-900 hover:text-zinc-300'}`}>{Icons.rect}</button>
              <button title="Circle" onClick={() => engine.setActiveTool('circle')} className={`py-2 rounded-lg border transition ${engine.activeTool === 'circle' ? 'bg-white text-black border-white' : 'border-zinc-800 text-zinc-500 bg-black hover:bg-zinc-900 hover:text-zinc-300'}`}>{Icons.circle}</button>
              <button title="Triangle" onClick={() => engine.setActiveTool('triangle')} className={`py-2 rounded-lg border transition ${engine.activeTool === 'triangle' ? 'bg-white text-black border-white' : 'border-zinc-800 text-zinc-500 bg-black hover:bg-zinc-900 hover:text-zinc-300'}`}>{Icons.triangle}</button>
            </div>
            {/* Кольори залишаємо текстом, бо це важливо візуально */}
            <div className="flex gap-2 pt-1">
              <button onClick={() => engine.setColor(1)} className={`flex-1 py-1.5 text-[10px] rounded font-dot border transition ${engine.color === 1 ? 'bg-zinc-700 text-white border-zinc-500' : 'border-zinc-900 text-zinc-600 bg-black hover:border-zinc-700'}`}>WHITE</button>
              <button onClick={() => engine.setColor(0)} className={`flex-1 py-1.5 text-[10px] rounded font-dot border transition ${engine.color === 0 ? 'bg-zinc-700 text-white border-zinc-500' : 'border-zinc-900 text-zinc-600 bg-black hover:border-zinc-700'}`}>BLACK</button>
            </div>
          </div>

          {engine.activeTool !== 'bucket' && (
            <div className="space-y-3 pt-4 border-t border-zinc-800/50">
              <span className="font-dot text-[10px] text-zinc-500 uppercase tracking-widest block">Brush Settings</span>
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

          <div className="space-y-3 pt-4 border-t border-zinc-800/50">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" checked={engine.showGrid} onChange={() => engine.setShowGrid(!engine.showGrid)} className="rounded border-zinc-800 bg-black text-white focus:ring-0 accent-white w-4 h-4" />
              <span className="font-dot text-xs text-zinc-400 group-hover:text-white transition uppercase">Show Overlay Grid</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" checked={engine.showOnion} onChange={() => engine.setShowOnion(!engine.showOnion)} className="rounded border-zinc-800 bg-black text-white focus:ring-0 accent-white w-4 h-4" />
              <span className="font-dot text-xs text-zinc-400 group-hover:text-white transition uppercase">Enable Onion Skinning</span>
            </label>
          </div>
        </div>

        <div className="space-y-3 mt-6 pt-4 border-t border-zinc-800/50">
          <button className="w-full py-3 rounded-xl bg-white text-black font-dot text-xs uppercase tracking-widest hover:bg-zinc-200 transition font-bold">Generate Code</button>
          <button className="w-full py-3 rounded-xl border border-zinc-800 text-zinc-400 font-dot text-xs bg-black uppercase hover:border-zinc-600 hover:text-white transition">Download GIF</button>
        </div>
      </div>
    </div>
  );
}