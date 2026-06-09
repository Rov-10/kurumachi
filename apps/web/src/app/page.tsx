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
    // ДОДАНО клас text-base, щоб скинути глобальне збільшення шрифту
    <main className="flex min-h-screen flex-col items-center overflow-hidden pb-32 text-base">
      <HeroSection onScrollToSection={scrollToSection} />
      <CodeShowcase />
      <div id="matrix" className="w-full flex justify-center scroll-mt-24">
        <AnimationsShowcase />
      </div>
      <ScrollButton />
    </main>
  );
}