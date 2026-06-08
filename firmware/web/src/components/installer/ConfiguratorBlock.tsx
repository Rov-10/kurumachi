"use client";
import { useState } from "react";
import { Sliders, Terminal, Power, RefreshCw, MessageSquare, Play } from "lucide-react";
import { KURUMACHI_ANIMATIONS, AnimationItem } from "@/app/animations";

interface ConfiguratorBlockProps {
  serial: {
    status: "disconnected" | "connecting" | "connected";
    logs: string[];
    connect: () => Promise<void>;
    disconnect: () => Promise<void>;
    sendData: (command: string) => Promise<void>;
  };
}

export default function ConfiguratorBlock({ serial }: ConfiguratorBlockProps) {
  const { status, logs, connect, disconnect, sendData } = serial;
  const [brightness, setBrightness] = useState<number>(80);
  const [customText, setCustomText] = useState<string>("");

  const handleBrightnessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setBrightness(val);
    sendData(`SET_DISP_BRIGHT:${val}`);
  };

  const handleSendText = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (customText.trim()) {
      sendData(`PRINT_OLED:${customText}`);
      setCustomText("");
    }
  };

  return (
    <div className="border border-nothing-border bg-nothing-gray/10 rounded-3xl overflow-hidden backdrop-blur-sm h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 border-b border-nothing-border gap-4 bg-nothing-gray/20">
        <div className="text-left">
          <h2 className="font-dot text-2xl text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-nothing-red" /> CORE CONFIGURATOR
          </h2>
          <p className="text-xs text-nothing-text/40 uppercase tracking-widest mt-0.5">Hardware Interface Subsystem</p>
        </div>
        
        <button
          onClick={status === "connected" ? disconnect : connect}
          className={`w-full sm:w-auto px-6 py-2.5 font-dot tracking-widest uppercase text-xs border transition-all duration-300 flex items-center justify-center gap-2 ${
            status === "connected"
              ? "border-nothing-red bg-nothing-red/10 text-nothing-red hover:bg-nothing-red hover:text-white"
              : status === "connecting"
              ? "border-yellow-500 text-yellow-500 animate-pulse"
              : "border-nothing-text bg-transparent text-white hover:bg-white hover:text-black"
          }`}
        >
          <Power className="w-3.5 h-3.5" />
          {status === "connected" ? "Disconnect" : status === "connecting" ? "Connecting..." : "Connect via WebSerial"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-nothing-border flex-1">
        <div className={`p-6 space-y-5 text-left transition-opacity duration-300 ${status === "connected" ? "opacity-100" : "opacity-40 pointer-events-none"}`}>
          <div>
            <label className="font-dot text-sm text-nothing-text/80 uppercase block mb-1.5">
              OLED Brightness: {brightness}%
            </label>
            <input
              type="range" min="10" max="100" value={brightness} onChange={handleBrightnessChange}
              className="w-full h-1 bg-nothing-border accent-nothing-red rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div>
            <label className="font-dot text-sm text-nothing-text/80 uppercase block mb-1.5">
              Trigger Hardware Emotion
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-[110px] overflow-y-auto pr-1">
              {KURUMACHI_ANIMATIONS.slice(0, 6).map((anim: AnimationItem) => (
                <button
                  key={anim.id}
                  onClick={() => sendData(`SET_ANIM:${anim.id}`)}
                  className="border border-nothing-border px-2.5 py-1.5 text-[11px] font-mono rounded hover:border-nothing-red text-left flex items-center justify-between group/btn truncate"
                >
                  <span className="truncate">{anim.name}</span>
                  <Play className="w-2.5 h-2.5 text-nothing-text/40 group-hover/btn:text-nothing-red flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="font-dot text-sm text-nothing-text/80 uppercase block mb-1.5">
              Push Notification to Screen
            </label>
            <form onSubmit={handleSendText} className="flex gap-2">
              <input
                type="text" placeholder="Type system alert..." value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                className="flex-1 bg-black border border-nothing-border px-3 py-1.5 text-xs focus:outline-none focus:border-nothing-red font-mono"
              />
              <button type="submit" className="border border-nothing-border px-3 py-1.5 hover:bg-white hover:text-black transition-colors">
                <MessageSquare className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          <div className="pt-1">
            <button
              onClick={() => sendData("SYS_RESET")}
              className="w-full border border-nothing-border py-2 text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:border-nothing-red hover:text-nothing-red transition-colors"
            >
              <RefreshCw className="w-3 h-3" /> Reset Dev Kit
            </button>
          </div>
        </div>

        {/* Логи терміналу */}
        <div className="p-4 bg-black/40 flex flex-col h-[320px] md:h-auto">
          <div className="flex items-center gap-2 text-nothing-text/50 font-dot text-xs uppercase tracking-widest mb-2 pb-1.5 border-b border-nothing-border">
            <Terminal className="w-3.5 h-3.5" /> System Live Logs
          </div>
          <div className="flex-1 overflow-y-auto font-mono text-[11px] text-left space-y-1.5 pr-1 select-text">
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