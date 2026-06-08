"use client";
import { useEffect, useRef } from "react";
import type { ModelViewerElement } from "@google/model-viewer";

export default function ThreeViewer() {
  const viewerRef = useRef<ModelViewerElement | null>(null);

  useEffect(() => {
    import("@google/model-viewer").catch((err) =>
      console.error("Failed to load model-viewer:", err)
    );

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!viewerRef.current) return;

      const width = window.innerWidth;
      const height = window.innerHeight;

      const percentX = e.clientX / width - 0.5;
      const percentY = e.clientY / height - 0.5;

      // Інвертований рух камери навколо 180deg (лице корпусу)
      const orbitX = 180 - percentX * 50; 
      const orbitY = 75 - percentY * 30;

      viewerRef.current.cameraOrbit = `${orbitX}deg ${orbitY}deg auto`;
    };

    window.addEventListener("mousemove", handleGlobalMouseMove);
    return () => window.removeEventListener("mousemove", handleGlobalMouseMove);
  }, []);

  return (
    // Повністю очистили відступи. Компонент займе рівно стільки місця, скільки його контент
    <div className="w-full flex items-center justify-center m-0 p-0 relative select-none">
      
      {/* Зменшили розмір контейнера 3D моделі з w-80 до w-64, щоб прибрати порожнечу */}
      <div className="w-96 h-96 relative flex items-center justify-center bg-transparent m-0 p-0 overflow-visible">
        
        <model-viewer
          ref={viewerRef}
          src="/kurumachi.glb"
          alt="Kurumachi 3D Custom Shell"
          camera-orbit="180deg 75deg auto"
          interaction-prompt="none"
          disable-zoom
          auto-rotate-delay="0"
          
          // Експозиція (exposure): чим менше значення, тим темніша сцена. 
          // Якщо "0.4" все ще здається яскравим — сміливо став "0.2" або "0.15"
          exposure="0.35"
          shadow-intensity="1.8"
          shadow-softness="0.8"
          environment-image="neutral"
          className="z-10 pointer-events-none w-full h-full bg-transparent"
        />

      </div>

      {/* Фоновий напис у стилі Nothing */}
      <div className="absolute text-nothing-border font-dot text-6xl opacity-5 transform -rotate-12 select-none tracking-widest z-0 pointer-events-none">
        CORE SHELL C3
      </div>
    </div>
  );
}