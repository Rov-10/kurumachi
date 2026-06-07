"use client";
import { useState, MouseEvent } from "react";
import Image from "next/image";
import { Box, Maximize2, RotateCcw } from "lucide-react";

export default function ThreeViewer() {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;
    
    // Розраховуємо кути нахилу на основі позиції мишки (ефект паралаксу)
    setRotate({
      x: -(y / box.height) * 25,
      y: (x / box.width) * 25,
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 }); // Повертаємо модель у дефолтний стан
  };

  return (
    <div className="w-full max-w-4xl aspect-video border border-nothing-border bg-nothing-gray/30 rounded-3xl mb-20 flex items-center justify-center relative overflow-hidden group">
      {/* Технічні сітки та інтерфейс сканера */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none z-0" />
      <div className="absolute top-6 right-8 font-mono text-[10px] text-nothing-text/40 uppercase tracking-widest flex items-center gap-4 z-20">
        <span className="flex items-center gap-1"><Maximize2 className="w-3 h-3" /> FOV: 45°</span>
        <span className="flex items-center gap-1"><RotateCcw className="w-3 h-3" /> FPS: 60.0</span>
      </div>

      <p className="font-dot text-nothing-text/40 z-20 absolute bottom-6 left-8 uppercase tracking-widest flex items-center gap-2 select-none">
        <span className="w-2 h-2 bg-nothing-red rounded-full animate-pulse"></span>
        Interactive Spatial Node
      </p>

      {/* Інтерактивна 3D Зона */}
      <div
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(${isHovered ? 1.05 : 1}, ${isHovered ? 1.05 : 1}, 1)`,
          transition: isHovered ? "none" : "transform 0.5s ease",
        }}
        className="w-[280px] h-[280px] relative z-10 cursor-grab active:cursor-grabbing flex items-center justify-center drop-shadow-[0_0_50px_rgba(255,255,255,0.03)] group"
      >
        {/* Світіння під пристроєм */}
        <div className="absolute w-44 h-44 bg-nothing-red/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        {/* Наш хардверний девайс */}
        <Image
          src="/kurumachi.png"
          alt="Kurumachi Hardware Render"
          width={240}
          height={240}
          priority
          className="object-contain filter brightness-105 contrast-105 select-none pointer-events-none transition-filter duration-300"
        />

        {/* Віртуальні рамки фокусування сканера */}
        <div className="absolute -inset-4 border border-dashed border-nothing-border/0 group-hover:border-nothing-border/40 transition-colors duration-500 rounded-2xl pointer-events-none">
          <Box className="absolute top-2 left-2 w-4 h-4 text-nothing-red/40" />
          <Box className="absolute bottom-2 right-2 w-4 h-4 text-nothing-text/20" />
        </div>
      </div>

      {/* Матричний бекграунд-текст */}
      <div className="absolute text-nothing-border font-dot text-7xl opacity-5 transform -rotate-12 select-none z-0 tracking-widest">
        CORE DEVICE DEV_KIT C3
      </div>
    </div>
  );
}