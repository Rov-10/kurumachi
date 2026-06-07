"use client";
import { useState } from "react";
import { useSerial } from "../hooks/useSerial";
import { Sliders, Terminal, Power, RefreshCw, MessageSquare } from "lucide-react";

export default function Configurator() {
  const { status, logs, connect, disconnect, sendData } = useSerial();
  const [brightness, setBrightness] = useState(80);
  const [customText, setCustomText] = useState("");

  const handleBrightnessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setBrightness(val);
    sendData(`SET_DISP_BRIGHT:${val}`);
  };

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (customText.trim()) {
      sendData(`PRINT_OLED:${customText}`);
      setCustomText("");
    }
  };

  return (
    <div id="configurator" className="w-full max-w-4xl mt-32 border border-nothing-border bg-nothing-gray/20 rounded-3xl overflow-hidden backdrop-blur-sm">
      {/* Шапка панелі */}
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

      {/* Основна сітка налаштувань */}
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-nothing-border">
        
        {/* Ліва частина: Елементи керування */}
        <div className={`p-8 space-y-8 transition-opacity duration-300 ${status === "connected" ? "opacity-100" : "opacity-40 pointer-events-none"}`}>
          <div>
            <label className="font-dot text-lg text-nothing-text/80 uppercase block mb-4">
              OLED Brightness: {brightness}%
            </label>
            <input
              type="range"
              min="10"
              max="100"
              value={brightness}
              onChange={handleBrightnessChange}
              className="w-full h-1 bg-nothing-border accent-nothing-red rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div>
            <label className="font-dot text-lg text-nothing-text/80 uppercase block mb-3">
              Push Notification to Screen
            </label>
            <form onSubmit={handleSendText} className="flex gap-2">
              <input
                type="text"
                placeholder="Type system alert..."
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                className="flex-1 bg-black border border-nothing-border px-4 py-2 text-sm focus:outline-none focus:border-nothing-red font-mono"
              />
              <button type="submit" className="border border-nothing-border px-4 py-2 hover:bg-white hover:text-black transition-colors">
                <MessageSquare className="w-4 h-4" />
              </button>
            </form>
          </div>

          <div className="pt-4 border-t border-nothing-border flex gap-4">
            <button
              onClick={() => sendData("SYS_RESET")}
              className="flex-1 border border-nothing-border py-3 text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:border-nothing-red hover:text-nothing-red transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> Reset Dev Kit
            </button>
          </div>
        </div>

        {/* Права частина: Логи терміналу */}
        <div className="p-6 bg-black/50 flex flex-col h-[320px]">
          <div className="flex items-center gap-2 text-nothing-text/50 font-dot text-sm uppercase tracking-widest mb-3 pb-2 border-b border-nothing-border">
            <Terminal className="w-4 h-4" />
            System Live Logs
          </div>
          <div className="flex-1 overflow-y-auto font-mono text-xs text-left space-y-2 pr-2 select-text">
            {logs.length === 0 ? (
              <p className="text-nothing-text/20 italic">Awaiting hardware initialization sequence...</p>
            ) : (
              logs.map((log, idx) => (
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