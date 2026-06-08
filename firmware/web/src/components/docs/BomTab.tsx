"use client";

export default function BomTab() {
  const components = [
    { name: "ESP32-C3 Super Mini", qty: "1 pcs", desc: "Main MCU core with Wi-Fi/BLE & RISC-V architecture" },
    { name: "OLED Display SH1106", qty: "1 pcs", desc: "1.3 inch monochromatic 128x64 px matrix screen via I2C" },
    { name: "TP4056 Charge Module", qty: "1 pcs", desc: "Lithium battery charger with Type-C power input interface" },
    { name: "Li-Po Battery 602030", qty: "1 pcs", desc: "3.7V 300mAh compact rechargeable power cell node" },
    { name: "Custom 3D Printed Case", qty: "1 set", desc: "Cyber-organic minimalist structural shell body components" },
  ];

  return (
    <div className="border border-nothing-border bg-nothing-gray/10 rounded-3xl p-6 text-left">
      <h3 className="font-dot text-xl text-white uppercase mb-4">Bill of Materials</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse font-space text-sm">
          <thead>
            <tr className="border-b border-nothing-border text-nothing-text/40 font-dot text-[11px] tracking-widest uppercase text-left">
              <th className="pb-3 font-normal">Component Name</th>
              <th className="pb-3 font-normal">Quantity</th>
              <th className="pb-3 font-normal">Technical Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-nothing-border/30 text-nothing-text/80">
            {components.map((item, idx) => (
              <tr key={idx} className="hover:bg-white/5 transition-colors">
                <td className="py-3.5 font-dot text-xs text-white uppercase">{item.name}</td>
                <td className="py-3.5 font-mono text-xs">{item.qty}</td>
                <td className="py-3.5 text-nothing-text/60">{item.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}