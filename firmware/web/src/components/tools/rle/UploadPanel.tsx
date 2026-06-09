import { useRef, useState, DragEvent, ChangeEvent } from "react";
import { UploadCloud, FileImage } from "lucide-react";

interface UploadPanelProps {
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  invert: boolean;
  setInvert: (val: boolean) => void;
  threshold: number;
  setThreshold: (val: number) => void;
  onProcess: () => void;
}

export function UploadPanel({ selectedFile, setSelectedFile, invert, setInvert, threshold, setThreshold, onProcess }: UploadPanelProps) {
  const [isDragActive, setIsDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
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
      }
    }
  };

  return (
    // ЗМІНА: Додано h-[480px] для ідеального вирівнювання з правим терміналом
    <div className="lg:col-span-1 border border-zinc-800/80 bg-[#050505] p-6 rounded-2xl flex flex-col justify-between text-left relative h-[480px]">
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
          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/gif" />
          {selectedFile ? (
            <>
              <FileImage className="w-8 h-8 text-white mb-2" />
              <span className="font-dot text-xs uppercase tracking-wider text-white max-w-full truncate px-2">{selectedFile.name}</span>
              <span className="font-sans text-[10px] text-zinc-500 mt-1 uppercase">{(selectedFile.size / 1024).toFixed(1)} KB | Asset loaded</span>
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
            <input type="checkbox" checked={invert} onChange={(e) => setInvert(e.target.checked)} className="w-4 h-4 rounded border-zinc-800 bg-black text-white focus:ring-0 cursor-pointer accent-white" />
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
          onClick={onProcess}
          disabled={!selectedFile ? true : undefined}
          className={`w-full py-3 rounded-xl font-dot text-xs tracking-widest uppercase transition-all duration-300 font-bold ${
            selectedFile ? "bg-white text-black hover:bg-zinc-200 cursor-pointer" : "border border-zinc-800 text-zinc-600 bg-black cursor-not-allowed"
          }`}
        >
          {selectedFile ? "Process & Compress" : "Awaiting File Upload"}
        </button>
      </div>
    </div>
  );
}