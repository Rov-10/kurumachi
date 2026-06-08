"use client";
import { useState } from "react";
import { Layers, Cpu, Printer } from "lucide-react";
import BomTab from "@/components/docs/BomTab";
import WiringTab from "@/components/docs/WiringTab";
import PrintSpecsTab from "@/components/docs/PrintSpecsTab";

type TabType = "bom" | "wiring" | "print";

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("bom");

  return (
    <main className="flex min-h-screen flex-col items-center pt-32 pb-20 px-6 max-w-7xl mx-auto space-y-8 w-full">
      {/* Title Header */}
      <div className="w-full text-left border-b border-nothing-border pb-6">
        <h1 className="font-dot text-4xl text-white tracking-wide uppercase">Hardware Specification</h1>
        <p className="text-sm text-nothing-text/40 uppercase tracking-widest mt-2 font-space">
          Complete blueprints, hardware pinouts, and fabrication guidelines for Kurumachi ecosystem
        </p>
      </div>

      {/* Navigation Tabs Control */}
      <div className="w-full flex flex-wrap gap-2 border-b border-nothing-border/40 pb-4 font-dot text-xs tracking-widest uppercase">
        <button
          onClick={() => setActiveTab("bom")}
          className={`px-5 py-2.5 border transition-all flex items-center gap-2 ${
            activeTab === "bom"
              ? "border-white bg-white text-black"
              : "border-nothing-border text-nothing-text/60 hover:border-nothing-text/40 hover:text-white"
          }`}
        >
          <Layers className="w-3.5 h-3.5" /> BOM List
        </button>

        <button
          onClick={() => setActiveTab("wiring")}
          className={`px-5 py-2.5 border transition-all flex items-center gap-2 ${
            activeTab === "wiring"
              ? "border-white bg-white text-black"
              : "border-nothing-border text-nothing-text/60 hover:border-nothing-text/40 hover:text-white"
          }`}
        >
          <Cpu className="w-3.5 h-3.5" /> Wiring Diagram
        </button>

        <button
          onClick={() => setActiveTab("print")}
          className={`px-5 py-2.5 border transition-all flex items-center gap-2 ${
            activeTab === "print"
              ? "border-white bg-white text-black"
              : "border-nothing-border text-nothing-text/60 hover:border-nothing-text/40 hover:text-white"
          }`}
        >
          <Printer className="w-3.5 h-3.5" /> 3D Print Specs
        </button>
      </div>

      {/* Dynamic Tab Content Viewport */}
      <div className="w-full min-h-[400px] animate-in fade-in slide-in-from-bottom-2 duration-300">
        {activeTab === "bom" && <BomTab />}
        {activeTab === "wiring" && <WiringTab />}
        {activeTab === "print" && <PrintSpecsTab />}
      </div>
    </main>
  );
}