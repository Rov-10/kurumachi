import { ArrowRight, Cpu, Monitor, Radio } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center overflow-hidden">
      {/* Навігація */}
      <nav className="w-full max-w-7xl flex justify-between items-center p-6 border-b border-nothing-border backdrop-blur-sm fixed top-0 z-50">
        <div className="font-dot text-2xl tracking-widest text-nothing-text">KURUMACHI<span className="text-nothing-red">.</span></div>
        <button className="text-sm uppercase tracking-widest border border-nothing-border px-4 py-2 hover:bg-white hover:text-black transition-colors duration-300">
          Connect Device
        </button>
      </nav>

      {/* Головний Hero-блок */}
      <section className="w-full max-w-7xl px-6 pt-40 pb-20 flex flex-col items-center text-center">
        <h1 className="font-dot text-6xl md:text-8xl lg:text-9xl text-white tracking-tighter mb-6">
          MEET KURUMACHI
        </h1>
        <p className="text-nothing-text/60 max-w-xl text-lg md:text-xl font-light mb-12">
          Your open-source companion. Engineered with precise ESP32-C3 architecture, dynamic OLED expressions, and seamless sensor integration.
        </p>

        {/* Місце під 3D модель */}
        <div className="w-full max-w-4xl aspect-video border border-nothing-border bg-nothing-gray/50 rounded-3xl mb-20 flex items-center justify-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
          <p className="font-dot text-nothing-text/40 z-20 absolute bottom-6 left-8 uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 bg-nothing-red rounded-full animate-pulse"></span>
            3D Visualizer Active
          </p>
          <div className="text-nothing-border font-dot text-6xl opacity-20 transform -rotate-12 group-hover:scale-110 transition-transform duration-700">
            [ 3D MODEL PLACEHOLDER ]
          </div>
        </div>

        {/* Характеристики (Specs Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl text-left">
          <div className="border border-nothing-border p-8 hover:border-nothing-text transition-colors duration-300">
            <Cpu className="w-8 h-8 text-nothing-red mb-4" />
            <h3 className="font-dot text-2xl mb-2">ESP32-C3 Core</h3>
            <p className="text-nothing-text/60 text-sm">RISC-V architecture delivering optimal performance and power efficiency.</p>
          </div>
          <div className="border border-nothing-border p-8 hover:border-nothing-text transition-colors duration-300">
            <Monitor className="w-8 h-8 text-nothing-red mb-4" />
            <h3 className="font-dot text-2xl mb-2">OLED Matrix</h3>
            <p className="text-nothing-text/60 text-sm">High-contrast display interface for fluid animations and system status.</p>
          </div>
          <div className="border border-nothing-border p-8 hover:border-nothing-text transition-colors duration-300">
            <Radio className="w-8 h-8 text-nothing-red mb-4" />
            <h3 className="font-dot text-2xl mb-2">Smart Sensors</h3>
            <p className="text-nothing-text/60 text-sm">Integrated environmental and motion tracking for real-time responsiveness.</p>
          </div>
        </div>
      </section>
    </main>
  );
}