import { CheckCircle2 } from "lucide-react";

export default function BomTab() {
  const components = [
    { name: "ESP32-C3 Super Mini", type: "MCU", purpose: "Основне обчислювальне ядро проєкту, обробка RLE анімацій", status: "Required" },
    { name: "SH1106 OLED Display (I2C)", type: "Display", purpose: "Відображення емоцій, годинника, телеметрії сенсорів (128x64)", status: "Required" },
    { name: "BMI160 (I2C)", type: "IMU Sensor", purpose: "Відстеження руху, жестів та розрахунку нахилу кузова (Tilt)", status: "Required" },
    { name: "AHT20 + BMP280", type: "ENV Sensors", purpose: "Вимірювання температури, вологості та атмосферного тиску", status: "Required" },
    { name: "TTP223 Touch Button", type: "Input", purpose: "Перемикання 5 системних сцен та калібрування пристрою", status: "Required" },
    { name: "Passive Buzzer", type: "Audio", purpose: "Звуковий супровід при старті та перемиканні екранів", status: "Required" },
    { name: "Li-Po Battery 3.7V", type: "Power", purpose: "Автономне живлення девайсу, моніторинг (A3)", status: "Required" }
  ];

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="border border-nothing-border bg-nothing-gray/10 rounded-2xl overflow-hidden">
        <table className="w-full border-collapse font-sans text-sm text-left">
          <thead className="bg-nothing-gray/30 border-b border-nothing-border font-dot uppercase text-xs tracking-wider text-nothing-text/60">
            <tr>
              <th className="p-4">Component</th>
              <th className="p-4">Type</th>
              <th className="p-4">System Purpose</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-nothing-border/50 text-nothing-text/80">
            {components.map((comp, idx) => (
              <tr key={idx} className="hover:bg-white/2 transition-colors">
                <td className="p-4 font-mono font-bold text-white">{comp.name}</td>
                <td className="p-4"><span className="px-2 py-0.5 bg-nothing-border text-[11px] rounded uppercase font-mono">{comp.type}</span></td>
                <td className="p-4 text-nothing-text/60">{comp.purpose}</td>
                <td className="p-4 font-mono text-xs flex items-center gap-1.5 text-green-400">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {comp.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}