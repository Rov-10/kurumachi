"use client";

export default function WiringTab() {
  const pinout = [
    { mcu: "GPIO 4 (SDA)", device: "OLED SH1106 Display", type: "I2C Data Line" },
    { mcu: "GPIO 5 (SCL)", device: "OLED SH1106 Display", type: "I2C Clock Line" },
    { mcu: "3V3 Power Node", device: "VCC / OLED & Sensors", type: "DC 3.3V Output Rail" },
    { mcu: "GND Bus Line", device: "GND / Common Ground", type: "System Reference Ground" },
    { mcu: "GPIO 2 (ADC)", device: "Battery Sensor Array", type: "Analog Voltage Divider Input" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
      {/* Ліва частина: таблиця контактів */}
      <div className="lg:col-span-2 border border-nothing-border bg-nothing-gray/10 rounded-3xl p-6">
        <h3 className="font-dot text-xl text-white uppercase mb-4">I2C & Power Pin Mapping</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse font-space text-sm">
            <thead>
              <tr className="border-b border-nothing-border text-nothing-text/40 font-dot text-[11px] tracking-widest uppercase text-left">
                <th className="pb-3 font-normal">ESP32-C3 Pin</th>
                <th className="pb-3 font-normal">Target Hardware Connection</th>
                <th className="pb-3 font-normal">Signal Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-nothing-border/30 text-nothing-text/80">
              {pinout.map((pin, idx) => (
                <tr key={idx} className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 font-mono text-xs text-nothing-red">{pin.mcu}</td>
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
          <h4 className="font-dot text-sm text-white uppercase tracking-wider">Critical Hardware Alerts</h4>
          <ul className="space-y-3 font-space text-xs text-nothing-text/60 list-disc list-inside leading-relaxed">
            <li>Ensure the I2C bus has pull-up resistors active if the display module omits them.</li>
            <li>Do not feed native 5V rails directly into GPIO logic lanes to avoid breakdown.</li>
            <li>Verify solid common ground links between ESP32 and battery sensor blocks.</li>
          </ul>
        </div>
        <div className="pt-4 border-t border-nothing-border font-mono text-[10px] text-nothing-text/40 uppercase">
          Architecture Core: Rev 1.2-Stable
        </div>
      </div>
    </div>
  );
}