import { PixelCanvas } from './PixelCanvas';
import { PixelEngineType } from './usePixelEngine';

export function StudioCanvasPanel({ engine }: { engine: PixelEngineType }) {
  return (
    // ЗМІНА: h-full
    <div className="lg:col-span-2 border border-zinc-800/80 rounded-2xl p-6 bg-[#050505] flex flex-col relative h-full">
      <div className="flex items-start gap-4 mb-2 shrink-0">
        <div className="text-red-500 font-dot text-xs leading-tight flex flex-col items-center">
          <span>02</span>
          <span>10</span>
        </div>
        <div>
          <h2 className="text-white font-dot text-lg uppercase tracking-wider">PIXEL ART STUDIO</h2>
          <p className="text-zinc-500 text-[10px] font-sans uppercase mt-1 tracking-widest">
            OLED CANVAS EDITOR & BRUSH ENGINE.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center overflow-hidden">
        <PixelCanvas engine={engine} />
      </div>

      <div className="mt-auto flex items-center gap-4 bg-black border border-zinc-800/80 rounded-xl p-4 text-zinc-400 shrink-0">
        <span className="font-dot text-xs uppercase text-zinc-500 whitespace-nowrap">
          FRAME: {engine.currentFrameIdx + 1}/{engine.frames.length}
        </span>
        <input
          type="range"
          min="0"
          max={engine.frames.length - 1}
          value={engine.currentFrameIdx}
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
  );
}
