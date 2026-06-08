"use client";
import { useEffect, useRef } from "react";
import type { ModelViewerElement } from "@google/model-viewer";

export default function ThreeViewer() {
  const viewerRef = useRef<ModelViewerElement | null>(null);

  useEffect(() => {
    import("@google/model-viewer").then(() => {
      // Хак для жорсткої фіксації освітлення при клієнтському роутингу Next.js
      if (viewerRef.current) {
        viewerRef.current.exposure = 0.35;
      }
    }).catch((err) =>
      console.error("Failed to load model-viewer:", err)
    );

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!viewerRef.current) return;

      const width = window.innerWidth;
      const height = window.innerHeight;

      const percentX = e.clientX / width - 0.5;
      const percentY = e.clientY / height - 0.5;

      const orbitX = 180 - percentX * 50; 
      const orbitY = 75 - percentY * 30;

      viewerRef.current.cameraOrbit = `${orbitX}deg ${orbitY}deg auto`;
    };

    window.addEventListener("mousemove", handleGlobalMouseMove);
    return () => window.removeEventListener("mousemove", handleGlobalMouseMove);
  }, []);

  return (
    <div className="w-full flex items-center justify-center m-0 p-0 relative select-none">
      <div className="w-96 h-96 relative flex items-center justify-center bg-transparent m-0 p-0 overflow-visible">
        
        <model-viewer
          ref={viewerRef}
          src="/kurumachi.glb"
          alt="Kurumachi 3D Custom Shell"
          camera-orbit="180deg 75deg auto"
          interaction-prompt="none"
          disable-zoom
          auto-rotate-delay="0"
          
          // Залишаємо декларативні атрибути для першого рендеру
          exposure="0.35"
          shadow-intensity="1.8"
          shadow-softness="0.8"
          environment-image="neutral"
          className="z-10 pointer-events-none w-full h-full bg-transparent"
        />

      </div>

      <div className="absolute text-nothing-border font-dot text-6xl opacity-5 transform -rotate-12 select-none tracking-widest z-0 pointer-events-none">
        CORE SHELL C3
      </div>
    </div>
  );
}