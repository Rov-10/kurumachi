"use client";
import { CornerDownRight } from "lucide-react";
import ThreeViewer from "../components/ThreeViewer";
import CodeShowcase from "../components/CodeShowcase";
import Configurator from "../components/Configurator";
import AnimationsShowcase from "../components/AnimationsShowcase";
import ScrollButton from "../components/ScrollButton";

export default function Home() {
  const scrollToSection = (id: string) => {
    if (typeof document !== "undefined") {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center overflow-hidden pb-32">
      {/* Навігація */}
      <nav className="w-full max-w-7xl flex justify-between items-center p-6 border-b border-nothing-border backdrop-blur-md fixed top-0 z-50 bg-black/10">
        <div className="font-dot text-2xl tracking-widest text-nothing-text">
          KURUMACHI<span className="text-nothing-red">.</span>
        </div>
        <button 
          onClick={() => scrollToSection("configurator")}
          className="text-sm uppercase tracking-widest border border-nothing-border px-4 py-2 hover:bg-white hover:text-black transition-colors duration-300"
        >
          Connect Device
        </button>
      </nav>

      {/* Hero Section */}
      <section className="w-full max-w-6xl px-6 pt-44 pb-12 flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20 min-h-[80vh]">
        {/* Ліва частина: Наш 3D Куб */}
        <div className="flex justify-center items-center flex-1 w-full min-h-[400px]">
          <ThreeViewer />
        </div>

        {/* Права частина: Текст */}
        <div className="flex-1 text-left space-y-6 max-w-xl">
          <h1 className="font-dot text-4xl sm:text-5xl lg:text-6xl text-white tracking-wide uppercase select-none leading-tight">
            MEE<span className="inline-block scale-y-110 scale-x-105 origin-bottom translate-y-[2px] mx-[2px]">T</span> KURUMACHI
          </h1>
          <p className="text-nothing-text/60 text-lg font-light leading-relaxed">
            Your open-source companion. Engineered with precise ESP32-C3 architecture, dynamic OLED expressions, and seamless sensor integration.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row gap-4 font-dot text-xs tracking-widest uppercase">
            <button 
              onClick={() => scrollToSection("matrix")} 
              className="border border-nothing-border px-5 py-3 rounded-lg flex items-center gap-2 hover:border-white transition-colors text-left"
            >
              <CornerDownRight className="w-3 h-3 text-nothing-red" />
              Expression Library
            </button>
            <button 
              onClick={() => scrollToSection("configurator")} 
              className="border border-nothing-border px-5 py-3 rounded-lg flex items-center gap-2 hover:border-white transition-colors text-left"
            >
              <CornerDownRight className="w-3 h-3 text-nothing-red" />
              Device Config
            </button>
          </div>
        </div>
      </section>

      <CodeShowcase />
      
      <div id="configurator" className="w-full flex justify-center scroll-mt-24">
        <Configurator />
      </div>
      
      <div id="matrix" className="w-full flex justify-center scroll-mt-24">
        <AnimationsShowcase />
      </div>

      <ScrollButton />
    </main>
  );
}