"use client";
import Image from "next/image";
import { KURUMACHI_ANIMATIONS, AnimationItem } from "../app/animations";
import { Smile } from "lucide-react";

export default function AnimationsShowcase() {
  return (
    <div className="w-full max-w-4xl mt-32">
      <div className="text-left mb-10">
        <h2 className="font-dot text-3xl text-white flex items-center gap-2 uppercase">
          <Smile className="w-6 h-6 text-nothing-red" />
          Expression Matrix
        </h2>
        <p className="text-sm text-nothing-text/40 uppercase tracking-widest mt-1">
          Rendered Asset Preview Library
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {KURUMACHI_ANIMATIONS.map((anim: AnimationItem) => (
          <div 
            key={anim.id} 
            className="border border-nothing-border bg-nothing-gray/10 rounded-xl overflow-hidden group hover:border-nothing-text/50 transition-all duration-300 flex flex-col"
          >
            {/* Контейнер для Гіфки */}
            <div className="w-full aspect-square bg-black relative flex items-center justify-center p-4 border-b border-nothing-border group-hover:bg-nothing-gray/30 transition-colors duration-300">
              <div className="w-[128px] h-[64px] relative border border-dashed border-nothing-border/40 flex items-center justify-center bg-black rounded shadow-[0_0_15px_rgba(255,255,255,0.02)]">
                {/* Використовуємо нативні шляхи public/animations/ */}
                <Image
                    src={`/animations/${anim.gifName}`}// <-- Просто передаємо імпортований модуль
                    alt={anim.name}
                    width={128}
                    height={64}
                    unoptimized
                    className="object-contain pixelated filter contrast-125 brightness-110"
                />
              </div>
              <span className="absolute top-2 right-2 font-mono text-[9px] px-1.5 py-0.5 bg-nothing-border text-nothing-text/50 uppercase rounded">
                {anim.category}
              </span>
            </div>

            {/* Опис */}
            <div className="p-3 text-left">
              <p className="font-dot text-sm text-white truncate">{anim.name}</p>
              <p className="font-mono text-[10px] text-nothing-text/40 uppercase tracking-tight truncate mt-0.5">
                {anim.id}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}