import { Wrench } from "lucide-react";

export default function PrintSpecsTab() {
  return (
    <div className="border border-nothing-border bg-nothing-gray/10 p-6 rounded-2xl space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <h3 className="font-dot text-xl text-white uppercase flex items-center gap-2">
        <Wrench className="w-5 h-5 text-nothing-red" /> FDM 3D Printing Guidelines
      </h3>
      <p className="text-sm text-nothing-text/60 leading-relaxed font-sans">
        Для отримання фірмової матової &quot;Cyber-organic&quot; текстури корпусу Kurumachi, як на рендерах з Blender, дотримуйтесь наступних параметрів слайсингу в OrcaSlicer або Bambu Studio:
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs pt-2">
        <div className="p-3 bg-black/40 border border-nothing-border rounded-xl">
          <span className="text-nothing-text/40 block uppercase">Filament</span>
          <span className="text-white font-bold text-sm">PLA / PETG Matte</span>
        </div>
        <div className="p-3 bg-black/40 border border-nothing-border rounded-xl">
          <span className="text-nothing-text/40 block uppercase">Layer Height</span>
          <span className="text-white font-bold text-sm">0.16 мм - 0.20 мм</span>
        </div>
        <div className="p-3 bg-black/40 border border-nothing-border rounded-xl">
          <span className="text-nothing-text/40 block uppercase">Infill Density</span>
          <span className="text-white font-bold text-sm">15% Gyroid</span>
        </div>
        <div className="p-3 bg-black/40 border border-nothing-border rounded-xl">
          <span className="text-nothing-text/40 block uppercase">Supports</span>
          <span className="text-white font-bold text-sm">No (Self-supporting)</span>
        </div>
      </div>
    </div>
  );
}