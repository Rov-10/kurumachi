"use client";
import { useState } from "react";
import { Download, CheckCircle } from "lucide-react";

export default function FlasherBlock() {
  const [progress, setProgress] = useState<number>(0);
  const [isFlashing, setIsFlashing] = useState<boolean>(false);

  const startFlashingSequence = () => {
    setIsFlashing(true);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsFlashing(false);
          return 100;
        }
        return prev + 4;
      });
    }, 150);
  };

  return (
    <div className="border border-nothing-border bg-nothing-gray/10 p-6 rounded-3xl text-left flex flex-col justify-between h-full">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-dot text-2xl text-white uppercase flex items-center gap-2">
              <Download className="w-5 h-5 text-nothing-red" /> Web Flasher
            </h3>
            <p className="text-xs text-nothing-text/40 uppercase tracking-widest mt-0.5 font-dot">
              Binary ROM Node Deployment
            </p>
          </div>
          <span className="font-mono text-[10px] px-2 py-0.5 border border-nothing-border text-nothing-text/50 rounded uppercase">
            v1.0.4-stable
          </span>
        </div>

        {/* [ФІКС ШРИФТУ]: змінено на font-space */}
        <p className="text-sm text-nothing-text/60 leading-relaxed font-space">
          Flash the pre-compiled firmware core directly into the ESP32-C3 flash memory using your browser. It does not require any local installation of esptool or native system drivers.
        </p>

        {progress > 0 && (
          <div className="space-y-2 font-mono text-xs pt-2">
            <div className="flex justify-between text-nothing-text/60 uppercase">
              <span>{progress === 100 ? "Flashing Complete" : "Writing sectors..."}</span>
              <span className="text-white font-bold">{progress}%</span>
            </div>
            <div className="w-full h-1 bg-nothing-border/40 rounded-full overflow-hidden">
              <div 
                style={{ width: `${progress}%` }} 
                className="h-full bg-nothing-red transition-all duration-150"
              />
            </div>
          </div>
        )}
      </div>

      <div className="pt-6 border-t border-nothing-border/40 flex items-center gap-4">
        <button
          onClick={startFlashingSequence}
          disabled={isFlashing}
          className="flex-1 py-3 font-dot text-xs tracking-widest uppercase border border-white bg-white text-black hover:bg-transparent hover:text-white transition-all duration-300"
        >
          {isFlashing ? "Writing Code..." : "Flash Firmware Binary"}
        </button>
        
        {/* [ФІКС ШРИФТУ]: підказка тепер на font-space */}
        <div className="font-space text-[10px] text-nothing-text/40 text-left leading-tight max-w-[180px]">
          {progress === 100 ? (
            <span className="text-green-400 flex items-center gap-1 font-mono">
              <CheckCircle className="w-3 h-3" /> Bootloader active. Ready.
            </span>
          ) : (
            "• Put the device into bootloader mode (BOOT + RESET) before flashing."
          )}
        </div>
      </div>
    </div>
  );
}