"use client";
import HeroSection from "../components/HeroSection";
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
      {/* Декомпозована Hero-зона з 3D */}
      <HeroSection onScrollToSection={scrollToSection} />

      {/* Блок з підсвіткою коду C++ */}
      <CodeShowcase />
      
      {/* Конфігуратор пристрою */}
      <div id="configurator" className="w-full flex justify-center scroll-mt-24">
        <Configurator />
      </div>
      
      {/* Матриця емоцій */}
      <div id="matrix" className="w-full flex justify-center scroll-mt-24">
        <AnimationsShowcase />
      </div>

      {/* Кнопка швидкого повернення вгору */}
      <ScrollButton />
    </main>
  );
}