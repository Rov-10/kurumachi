'use client';

export default function BomTab() {
  const components = [
    {
      name: 'ESP32-C3 Super Mini',
      qty: '1 pcs',
      desc: 'RISC-V core @ 160 MHz | Wi-Fi 2.4GHz + BLE 5.0 | Central MCU node',
    },
    {
      name: 'OLED Display SH1106 1.3″',
      qty: '1 pcs',
      desc: 'Monochromatic 128x64 px matrix screen via I2C bus @ 400 kHz',
    },
    {
      name: 'IMU Sensor BMI160',
      qty: '1 pcs',
      desc: '6-axis tracking (3-axis Gyro + Accelerometer) for gesture control',
    },
    {
      name: 'AHT20 + BMP280 Matrix',
      qty: '1 pcs',
      desc: 'Combined environmental sensor array (Temp, Humidity, Barometric Pressure)',
    },
    {
      name: 'Li-Po Battery 3.7V',
      qty: '1 pcs',
      desc: 'Compact rechargeable lithium-polymer power cell for standalone operation',
    },
    {
      name: 'TP4057 Charge Module',
      qty: '1 pcs',
      desc: 'Lithium battery charger with custom analog ADC voltage divider feedback',
    },
    {
      name: 'TTP223B Touch Sensor',
      qty: '1 pcs',
      desc: 'Capacitive touch switch module for seamless scene cycling controls',
    },
    {
      name: 'Passive Piezo Buzzer',
      qty: '1 pcs',
      desc: 'Resonant frequency tone generator for UI sound sequences and alerts',
    },
    {
      name: '1N4007 Rectifier Diode',
      qty: '1 pcs',
      desc: 'Power rail reverse polarity breakdown protection diode (recycled source)',
    },
    {
      name: 'Sub-Miniature Slide Switch',
      qty: '1 pcs',
      desc: 'SPDT mechanical latching switch for hard system ON/OFF isolation',
    },
  ];

  return (
    <div className="border border-nothing-border bg-nothing-gray/10 rounded-3xl p-6 text-left animate-in fade-in slide-in-from-bottom-2 duration-300">
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
