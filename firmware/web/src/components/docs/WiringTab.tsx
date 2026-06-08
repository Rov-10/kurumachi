import { Cpu, ShieldAlert } from "lucide-react";

export default function WiringTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="border border-nothing-border bg-nothing-gray/10 p-6 rounded-2xl space-y-4">
        <h3 className="font-dot text-xl text-white uppercase flex items-center gap-2">
          <Cpu className="w-5 h-5 text-nothing-red" /> Hardware Pin Mapping
        </h3>
        <p className="text-xs text-nothing-text/40 font-mono">DEFINED IN CONFIG.H</p>
        <div className="space-y-2 font-mono text-sm">
          <div className="flex justify-between p-2.5 bg-black/40 border border-nothing-border rounded-lg">
            <span className="text-nothing-text/50">I2C Master SDA Пін</span>
            <span className="text-white font-bold">GPIO 8</span>
          </div>
          <div className="flex justify-between p-2.5 bg-black/40 border border-nothing-border rounded-lg">
            <span className="text-nothing-text/50">I2C Master SCL Пін</span>
            <span className="text-white font-bold">GPIO 9</span>
          </div>
          <div className="flex justify-between p-2.5 bg-black/40 border border-nothing-border rounded-lg">
            <span className="text-nothing-text/50">TTP223 Touch Button</span>
            <span className="text-white font-bold">GPIO 4</span>
          </div>
          <div className="flex justify-between p-2.5 bg-black/40 border border-nothing-border rounded-lg">
            <span className="text-nothing-text/50">Passive Buzzer Out</span>
            <span className="text-white font-bold">GPIO 1</span>
          </div>
          <div className="flex justify-between p-2.5 bg-black/40 border border-nothing-border rounded-lg">
            <span className="text-nothing-text/50">Battery ADC Sensor</span>
            <span className="text-white font-bold">GPIO 3 (A3)</span>
          </div>
        </div>
      </div>

      <div className="border border-nothing-border bg-nothing-gray/10 p-6 rounded-2xl flex flex-col justify-between">
        <div>
          <h3 className="font-dot text-xl text-white uppercase flex items-center gap-2 mb-3">
            <ShieldAlert className="w-5 h-5 text-yellow-500" /> I2C Bus Topology
          </h3>
          <p className="text-sm text-nothing-text/60 leading-relaxed font-sans">
            Дисплей SH1106, акселерометр BMI160 та датчики клімату BMP/AHT підключені паралельно на одну загальну шину <strong className="text-white font-mono">Wire</strong> (GPIO 8/9). Шина розігнана до частоти <strong className="text-white font-mono">400 кГц (Fast Mode)</strong> за допомогою інструкції <code className="bg-black px-1.5 py-0.5 rounded text-nothing-red font-mono">Wire.setClock(400000)</code> для забезпечення плавності рендерингу RLE фреймів на частоті 60 FPS.
          </p>
        </div>
        <div className="mt-4 p-3.5 border border-yellow-500/20 bg-yellow-500/5 rounded-xl font-mono text-xs text-yellow-500/80">
          ⚠️ ВАЖЛИВО: Обов&apos;язково використовуйте підтягуючі резистори (Pull-up) на 4.7 кОм на лініях SDA та SCL до живлення 3.3V.
        </div>
      </div>
    </div>
  );
}