"use client";

import Image from "next/image";

export default function WiringTab() {
  const pinout = [
    { mcu: "GPIO 9", device: "I2C Clock (SH1106, BMI160, AHT20/BMP280)", type: "SCL (I2C Bus)" },
    { mcu: "GPIO 8", device: "I2C Data (SH1106, BMI160, AHT20/BMP280)", type: "SDA (I2C Bus)" },
    { mcu: "GPIO 4", device: "TTP223B Touch Sensor", type: "Digital Input (Touch Trigger)" },
    { mcu: "GPIO 3", device: "TP4057 Battery Node (via 100k+100k Divider)", type: "Analog Input (ADC VBAT)" },
    { mcu: "GPIO 1", device: "Passive Piezo Buzzer", type: "PWM / Square Wave Output" },
    { mcu: "5V IN", device: "Slide Switch -> 1N4007 Diode", type: "Main Power Drop (from 4.2V)" },
    { mcu: "3V3 OUT", device: "VCC to all Sensors & OLED Display", type: "Regulated 3.3V Logic" },
    { mcu: "GND", device: "System Common Ground Array", type: "Reference Ground" },
  ];

  return (
    <div className="space-y-6 text-left animate-in fade-in slide-in-from-bottom-2 duration-300">
      
      {/* Схема підключення (Зображення) */}
      <div className="border border-nothing-border bg-nothing-gray/10 rounded-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-dot text-xl text-white uppercase">Hardware Wiring Schematic</h3>
          <span className="font-mono text-[10px] text-nothing-text/40 uppercase border border-nothing-border/50 px-2 py-1 rounded-md">
            Rev 1.0 / Kurumachi
          </span>
        </div>
        {/* Контейнер для твоєї Fritzing схеми */}
        <div className="relative w-full aspect-[2/1] md:aspect-[2.5/1] rounded-xl overflow-hidden border border-nothing-border/50 bg-[#050505]">
          <Image 
            src="/wiring.jpg" 
            alt="Kurumachi Wiring Diagram" 
            fill 
            className="object-contain p-2"
            priority
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ліва частина: таблиця контактів */}
        <div className="lg:col-span-2 border border-nothing-border bg-nothing-gray/10 rounded-3xl p-6">
          <h3 className="font-dot text-xl text-white uppercase mb-4">Firmware Pin Mapping</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse font-space text-sm">
              <thead>
                <tr className="border-b border-nothing-border text-nothing-text/40 font-dot text-[11px] tracking-widest uppercase text-left">
                  <th className="pb-3 font-normal">ESP32-C3 Pin</th>
                  <th className="pb-3 font-normal">Target Hardware</th>
                  <th className="pb-3 font-normal">Signal Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-nothing-border/30 text-nothing-text/80">
                {pinout.map((pin, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 font-mono text-xs text-nothing-red whitespace-nowrap">{pin.mcu}</td>
                    <td className="py-3.5 font-dot text-xs text-white uppercase">{pin.device}</td>
                    <td className="py-3.5 text-nothing-text/60">{pin.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Права частина: Швидкі інженерні замітки */}
        <div className="lg:col-span-1 border border-nothing-border bg-black/40 rounded-3xl p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="font-dot text-sm text-white uppercase tracking-wider">Engineering Notes</h4>
            <ul className="space-y-3 font-space text-xs text-nothing-text/60 list-disc list-inside leading-relaxed">
              <li>
                <strong>I2C Bus Topography:</strong> All peripheral modules (OLED, IMU, Environment Matrix) are wired in parallel to <span className="text-white">GPIO 8 (SDA)</span> and <span className="text-white">GPIO 9 (SCL)</span>.
              </li>
              <li>
                <strong>ADC Protection Circuit:</strong> A <span className="text-nothing-red">100kΩ + 100kΩ voltage divider</span> is mandatory between the Li-Po battery and GPIO 3 (VBAT). It halves the 4.2V peak voltage to a safe 2.1V for the ESP32-C3 ADC logic.
              </li>
              <li>
                <strong>Power Routing:</strong> Main power runs from the battery → Slide Switch → 1N4007 Diode → ESP32 5V Pin, utilizing the onboard LDO to supply stable 3.3V to the sensors.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}