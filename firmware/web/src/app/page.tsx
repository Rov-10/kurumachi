"use client";
import HeroSection from "../components/HeroSection";
import CodeShowcase from "../components/CodeShowcase";
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
      {/* Hero-зона з 3D девайсом */}
      <HeroSection onScrollToSection={scrollToSection} />

      {/* Демонстрація коду ініціалізації */}
      <CodeShowcase />
      
      {/* Матриця емоцій (Конфігуратор звідси повністю ВИДАЛЕНО) */}
      <div id="matrix" className="w-full flex justify-center scroll-mt-24">
        <AnimationsShowcase />
      </div>

      {/* Кнопка швидкого повернення вгору */}
      <ScrollButton />
    </main>
  );
}