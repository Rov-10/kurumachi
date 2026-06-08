"use client";

export default function PrintSpecsTab() {
  const specs = [
    { parameter: "Filament Material Type", value: "PLA / PETG (Matte Finish recommended)" },
    { parameter: "Layer Height Profile", value: "0.16 mm or 0.20 mm Fine Precision" },
    { parameter: "Infill Density Grid", value: "15% to 20% Gyroid Structural Infill" },
    { parameter: "Wall Line Count (Perimeters)", value: "3 Loops Minimum for rigid screw threads" },
    { parameter: "Support Structure Overhang", value: "Not required / Optimized design geometry" },
  ];

  return (
    <div className="border border-nothing-border bg-nothing-gray/10 rounded-3xl p-6 text-left">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
        <h3 className="font-dot text-xl text-white uppercase">3D Fabrication & Slicing Profile</h3>
        <span className="font-mono text-[10px] px-2 py-0.5 border border-nothing-border text-nothing-red rounded uppercase">
          Bambu Lab A1 / Mini Preset
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse font-space text-sm">
          <thead>
            <tr className="border-b border-nothing-border text-nothing-text/40 font-dot text-[11px] tracking-widest uppercase text-left">
              <th className="pb-3 font-normal">Slicer Parameter Type</th>
              <th className="pb-3 font-normal">Target Production Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-nothing-border/30 text-nothing-text/80">
            {specs.map((spec, idx) => (
              <tr key={idx} className="hover:bg-white/5 transition-colors">
                <td className="py-3.5 font-dot text-xs text-white uppercase">{spec.parameter}</td>
                <td className="py-3.5 text-nothing-text/60">{spec.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}