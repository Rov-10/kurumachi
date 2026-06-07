"use client";
import { useState } from "react";
import { Sliders, Terminal, Power, RefreshCw, MessageSquare, Play } from "lucide-react";
import { useSerial } from "../hooks/useSerial";
import { KURUMACHI_ANIMATIONS, AnimationItem } from "../app/animations";

export default function Configurator() {
  const { status, logs, connect, disconnect, sendData } = useSerial();
  const [brightness, setBrightness] = useState<number>(80);
  const [animSpeed, setAnimSpeed] = useState<number>(50);
  const [customText, setCustomText] = useState<string>("");

  const handleBrightnessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setBrightness(val);
    sendData(`SET_DISP_BRIGHT:${val}`);
  };

  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setAnimSpeed(val);
    sendData(`SET_ANIM_SPEED:${val}`); // Передаємо команду швидкості
  };

  const handleSendText = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (customText.trim()) {
      sendData(`PRINT_OLED:${customText}`);
      setCustomText("");
    }
  };

  const triggerHardwareAnimation = (animId: string) => {
    sendData(`SET_ANIM:${animId}`); // Команда негайного перемикання емоції
  };

  return (
    <div id="configurator" className="w-full max-w-4xl mt-32 border border-nothing-border bg-nothing-gray/20 rounded-3xl overflow-hidden backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 border-b border-nothing-border gap-4 bg-nothing-gray/30">
        <div>
          <h2 className="font-dot text-3xl text-white flex items-center gap-2">
            <Sliders className="w-6 h-6 text-nothing-red" />
            CORE CONFIGURATOR
          </h2>
          <p className="text-sm text-nothing-text/40 uppercase tracking-widest mt-1">Hardware Interface Subsystem</p>
        </div>
        
        <button
          onClick={status === "connected" ? disconnect : connect}
          className={`w-full sm:w-auto px-6 py-3 font-dot tracking-widest uppercase text-sm border transition-all duration-300 flex items-center justify-center gap-2 ${
            status === "connected"
              ? "border-nothing-red bg-nothing-red/10 text-nothing-red hover:bg-nothing-red hover:text-white"
              : status === "connecting"
              ? "border-yellow-500 text-yellow-500 animate-pulse"
              : "border-nothing-text bg-transparent text-white hover:bg-white hover:text-black"
          }`}
        >
          <Power className="w-4 h-4" />
          {status === "connected" ? "Disconnect" : status === "connecting" ? "Connecting..." : "Connect via WebSerial"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-nothing-border">
        {/* Керування */}
        <div className={`p-8 space-y-6 transition-opacity duration-300 ${status === "connected" ? "opacity-100" : "opacity-40 pointer-events-none"}`}>
          <div>
            <label className="font-dot text-lg text-nothing-text/80 uppercase block mb-2">
              OLED Brightness: {brightness}%
            </label>
            <input
              type="range" min="10" max="100" value={brightness} onChange={handleBrightnessChange}
              className="w-full h-1 bg-nothing-border accent-nothing-red rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div>
            <label className="font-dot text-lg text-nothing-text/80 uppercase block mb-2">
              Animation Frame Delay: {animSpeed}ms
            </label>
            <input
              type="range" min="10" max="200" value={animSpeed} onChange={handleSpeedChange}
              className="w-full h-1 bg-nothing-border accent-nothing-red rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div>
            <label className="font-dot text-lg text-nothing-text/80 uppercase block mb-2">
              Quick Trigger Local Emotion
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-[110px] overflow-y-auto pr-1">
              {KURUMACHI_ANIMATIONS.slice(0, 6).map((anim: AnimationItem) => (
                <button
                  key={anim.id}
                  onClick={() => triggerHardwareAnimation(anim.id)}
                  className="border border-nothing-border px-3 py-1.5 text-xs font-mono rounded hover:border-nothing-red text-left flex items-center justify-between group/btn truncate"
                >
                  <span className="truncate">{anim.name}</span>
                  <Play className="w-3 h-3 text-nothing-text/40 group-hover/btn:text-nothing-red flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="font-dot text-lg text-nothing-text/80 uppercase block mb-2">
              Push Notification to Screen
            </label>
            <form onSubmit={handleSendText} className="flex gap-2">
              <input
                type="text" placeholder="Type system alert..." value={customText}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomText(e.target.value)}
                className="flex-1 bg-black border border-nothing-border px-4 py-2 text-sm focus:outline-none focus:border-nothing-red font-mono"
              />
              <button type="submit" className="border border-nothing-border px-4 py-2 hover:bg-white hover:text-black transition-colors">
                <MessageSquare className="w-4 h-4" />
              </button>
            </form>
          </div>

          <div className="pt-2">
            <button
              onClick={() => sendData("SYS_RESET")}
              className="w-full border border-nothing-border py-2.5 text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:border-nothing-red hover:text-nothing-red transition-colors"
            >
              <RefreshCw className="w-3 h-3" /> Reset Dev Kit
            </button>
          </div>
        </div>

        {/* Логи терміналу */}
        <div className="p-6 bg-black/50 flex flex-col h-[380px]">
          <div className="flex items-center gap-2 text-nothing-text/50 font-dot text-sm uppercase tracking-widest mb-3 pb-2 border-b border-nothing-border">
            <Terminal className="w-4 h-4" />
            System Live Logs
          </div>
          <div className="flex-1 overflow-y-auto font-mono text-xs text-left space-y-2 pr-2 select-text">
            {logs.length === 0 ? (
              <p className="text-nothing-text/20 italic">Awaiting hardware initialization sequence...</p>
            ) : (
              logs.map((log: string, idx: number) => (
                <p key={idx} className={log.includes("Sending") ? "text-nothing-red" : log.includes("connected") ? "text-green-500" : "text-nothing-text/60"}>
                  {log}
                </p>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}