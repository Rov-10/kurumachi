'use client';
import { CornerDownRight } from 'lucide-react';
import ThreeViewer from './ThreeViewer';

interface HeroSectionProps {
  onScrollToSection: (id: string) => void;
}

export default function HeroSection({ onScrollToSection }: HeroSectionProps) {
  return (
    <section className="w-full max-w-6xl px-6 pt-44 pb-12 flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20 min-h-[80vh]">
      {/* Ліва частина: Наш 3D Корпус (моделька слухає мишу) */}
      <div className="flex justify-center items-center flex-1 w-full min-h-[400px]">
        <ThreeViewer />
      </div>

      {/* Права частина: Преміальний текст у стилі Nothing */}
      <div className="flex-1 text-left space-y-6 max-w-xl">
        <h1 className="font-dot text-4xl sm:text-5xl lg:text-6xl text-white tracking-wide uppercase select-none leading-tight">
          MEE
          <span className="inline-block scale-y-110 scale-x-105 origin-bottom translate-y-[2px] mx-[2px]">
            T
          </span>{' '}
          KURUMACHI
        </h1>
        <p className="text-nothing-text/60 text-lg font-light leading-relaxed">
          Your open-source companion. Engineered with precise ESP32-C3 architecture, dynamic OLED
          expressions, and seamless sensor integration.
        </p>

        {/* Навігаційні кнопки-якорі */}
        <div className="pt-4 flex flex-col sm:flex-row gap-4 font-dot text-xs tracking-widest uppercase">
          <button
            onClick={() => onScrollToSection('matrix')}
            className="border border-nothing-border px-5 py-3 rounded-lg flex items-center gap-2 hover:border-white transition-colors text-left"
          >
            <CornerDownRight className="w-3 h-3 text-nothing-red" />
            Expression Library
          </button>
          <button
            onClick={() => onScrollToSection('configurator')}
            className="border border-nothing-border px-5 py-3 rounded-lg flex items-center gap-2 hover:border-white transition-colors text-left"
          >
            <CornerDownRight className="w-3 h-3 text-nothing-red" />
            Device Config
          </button>
        </div>
      </div>
    </section>
  );
}
