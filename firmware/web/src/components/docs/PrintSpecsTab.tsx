"use client";
import { useState } from "react";
import { Download, Box, Scale, ExternalLink, FolderArchive, Loader2 } from "lucide-react";
import dynamic from "next/dynamic";

// РЕАЛЬНА ОПТИМІЗАЦІЯ: Динамічний імпорт компонента. 
// ssr: false вимикає рендер на сервері (бо WebGL працює тільки в браузері),
// а loading дає красивий псевдо-прелоадер, поки качається JS-чанк Three.js.
const StlViewerLazy = dynamic(() => import("./StlViewer"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-nothing-text/40 font-space text-xs gap-3">
      <Loader2 className="w-5 h-5 animate-spin text-nothing-red" />
      <span className="uppercase tracking-widest">Booting WebGL Engine...</span>
    </div>
  ),
});

interface StlFile {
  name: string;
  filename: string;
}

export default function PrintSpecsTab() {
  const stlFiles: StlFile[] = [
    { name: "Housing Core Body", filename: "Housing-Body.stl" },
    { name: "Back Structural Plate", filename: "Back Plate-Body.stl" },
    { name: "Touch Holder Bracket", filename: "Touch Holder-Body.stl" },
    { name: "OLED Mounting Top", filename: "Large OLED Top-Body.stl" },
    { name: "OLED Mounting Bottom", filename: "Large OLED Bottom-Body.stl" },
    { name: "ESP32 Front Mount", filename: "ESP32 Holder Front-Body.stl" },
    { name: "ESP32 Rear Mount", filename: "ESP32 Holder Rear-Body.stl" },
    { name: "Vertical Base Left", filename: "Vertical Base Left.stl" },
    { name: "Vertical Base Right", filename: "Vertical Base Right.stl" },
    { name: "Ear Headphone Headband", filename: "Ear Headphone Headband-Body.stl" },
    { name: "Ear Headphone Driver v2", filename: "Ear Headphone Driver v2-Body.stl" },
    { name: "Ear Headphone Cup Driver", filename: "Ear Headphone Cup Driver v2-Body.stl" },
    { name: "Ear Headphone 1-Body", filename: "Ear Headphone 1-Body.stl" },
  ];

  const [selectedFile, setSelectedFile] = useState<StlFile>(stlFiles[0]);

  const slicerSpecs = [
    { parameter: "Filament Material Type", value: "PLA / PETG (Matte Black/White)" },
    { parameter: "Layer Height Profile", value: "0.16 mm or 0.20 mm Precision" },
    { parameter: "Infill Density Grid", value: "15% to 20% Gyroid Structure" },
    { parameter: "Wall Line Count per loop", value: "3 Loops Minimum for rigid threads" },
  ];

  return (
    <div className="space-y-6 w-full">
      <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        
        <div className="lg:col-span-1 border border-nothing-border bg-nothing-gray/10 p-6 rounded-3xl flex flex-col justify-between text-left">
          <div className="space-y-4">
            <h3 className="font-dot text-xl text-white uppercase flex items-center gap-2">
              <Box className="w-4 h-4 text-nothing-red" /> Component Box
            </h3>
            <p className="font-space text-xs text-nothing-text/40 uppercase tracking-wider pb-2 border-b border-nothing-border/30">
              Select element to inspect or extract
            </p>
            
            <div className="space-y-1.5 max-h-55 overflow-y-auto pr-1 select-none font-space text-sm custom-scrollbar">
              {stlFiles.map((file, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl transition-all border text-xs tracking-wide ${
                    selectedFile.filename === file.filename
                      ? "border-white bg-white text-black font-medium"
                      : "border-transparent text-nothing-text/60 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {file.name}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-nothing-border/30 space-y-2">
            <a
              href="/kurumachi/kurumachi_cad_blueprints.zip"
              download
              className="w-full py-3 font-dot text-xs tracking-widest uppercase border border-nothing-border text-white bg-transparent hover:bg-white hover:text-black flex items-center justify-center gap-2 transition-all duration-300"
            >
              <FolderArchive className="w-4 h-4 text-nothing-red" /> Download All (.ZIP)
            </a>
            <a
              href={`/kurumachi/${selectedFile.filename}`}
              download
              className="w-full py-3 font-dot text-xs tracking-widest uppercase border border-white bg-white text-black hover:bg-transparent hover:text-white flex items-center justify-center gap-2 transition-all duration-300"
            >
              <Download className="w-3.5 h-3.5" /> Download Selected STL
            </a>
          </div>
        </div>

        <div className="lg:col-span-2 border border-nothing-border bg-black/40 rounded-3xl p-6 flex flex-col min-h-95 relative overflow-hidden">
          <div className="flex items-center justify-between font-dot text-xs uppercase tracking-widest text-nothing-text/40 pb-2 border-b border-nothing-border/30 z-10">
            <span>3D Canvas Matrix Simulator</span>
            <span className="text-white">{selectedFile.filename}</span>
          </div>
          
          <div className="flex-1 w-full relative min-h-70">
            {/* Використовуємо наш лінивий компонент */}
            <StlViewerLazy url={`/kurumachi/${selectedFile.filename}`} />
          </div>
          
          <div className="text-[10px] text-left font-space text-nothing-text/30 uppercase tracking-widest z-10">
            * Drag mouse to rotate object matrix geometry
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left items-stretch">
        <div className="lg:col-span-2 border border-nothing-border bg-nothing-gray/10 rounded-3xl p-6">
          <h3 className="font-dot text-lg text-white uppercase mb-4">Global Slicing Profile Specification</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse font-space text-sm">
              <thead>
                <tr className="border-b border-nothing-border text-nothing-text/40 font-dot text-[11px] tracking-widest uppercase text-left">
                  <th className="pb-3 font-normal">Slicer Parameter Type</th>
                  <th className="pb-3 font-normal">Target Production Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-nothing-border/30 text-nothing-text/80">
                {slicerSpecs.map((spec, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 font-dot text-xs text-white uppercase">{spec.parameter}</td>
                    <td className="py-3.5 text-nothing-text/60">{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-1 border border-nothing-border bg-black/20 rounded-3xl p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-dot text-sm text-white uppercase tracking-wider">
              <Scale className="w-4 h-4 text-nothing-red" /> Attribution Matrix
            </div>
            <p className="font-space text-xs text-nothing-text/60 leading-relaxed">
              This digital hardware architecture is derived from the original geometry of 
              <span className="text-white font-medium"> &quot;The Mochi housing and inner frame&quot;</span>. 
              Modified and distributed strictly under the terms of the 
              <span className="text-white font-medium"> Creative Commons Attribution Non-Commercial ShareAlike</span> license rules.
            </p>
          </div>
          
          <div className="pt-4 border-t border-nothing-border/30">
            <a
              href="https://makerworld.com/en/models/1844353-the-mochi-housing-and-inner-frame-dasai-mochi"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-dot text-[11px] uppercase tracking-widest text-nothing-text hover:text-white transition-colors"
            >
              Source Blueprint <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}