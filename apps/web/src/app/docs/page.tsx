"use client";
import { useState } from "react";
import { Layers, Cpu, Printer } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import BomTab from "@/components/docs/BomTab";
import WiringTab from "@/components/docs/WiringTab";
import PrintSpecsTab from "@/components/docs/PrintSpecsTab";

type TabType = "bom" | "wiring" | "print";

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("bom");

  // Явно вказуємо тип Variants, щоб TypeScript правильно зрозумів літерали ease
  const tabVariants: Variants = {
    hidden: { opacity: 0, y: 10, filter: "blur(4px)" },
    enter: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, y: -10, filter: "blur(4px)", transition: { duration: 0.2, ease: "easeIn" } },
  };

  return (
    <main className="flex min-h-screen flex-col items-center pt-32 pb-20 px-6 max-w-7xl mx-auto space-y-8 w-full">
      <div className="w-full text-left border-b border-nothing-border pb-6">
        <h1 className="font-dot text-4xl text-white tracking-wide uppercase">Hardware Specification</h1>
        <p className="text-sm text-nothing-text/40 uppercase tracking-widest mt-2 font-space">
          Complete blueprints, hardware pinouts, and fabrication guidelines for Kurumachi ecosystem
        </p>
      </div>

      <div className="w-full flex flex-wrap gap-2 border-b border-nothing-border/40 pb-4 font-dot text-xs tracking-widest uppercase">
        <button
          onClick={() => setActiveTab("bom")}
          className={`px-5 py-2.5 border transition-all flex items-center gap-2 ${
            activeTab === "bom" ? "border-white bg-white text-black" : "border-nothing-border text-nothing-text/60 hover:border-nothing-text/40 hover:text-white"
          }`}
        >
          <Layers className="w-3.5 h-3.5" /> BOM List
        </button>

        <button
          onClick={() => setActiveTab("wiring")}
          className={`px-5 py-2.5 border transition-all flex items-center gap-2 ${
            activeTab === "wiring" ? "border-white bg-white text-black" : "border-nothing-border text-nothing-text/60 hover:border-nothing-text/40 hover:text-white"
          }`}
        >
          <Cpu className="w-3.5 h-3.5" /> Wiring Diagram
        </button>

        <button
          onClick={() => setActiveTab("print")}
          className={`px-5 py-2.5 border transition-all flex items-center gap-2 ${
            activeTab === "print" ? "border-white bg-white text-black" : "border-nothing-border text-nothing-text/60 hover:border-nothing-text/40 hover:text-white"
          }`}
        >
          <Printer className="w-3.5 h-3.5" /> 3D Print Specs
        </button>
      </div>

      {/* [Tailwind Фікс]: min-h-[500px] -> min-h-125 */}
      <div className="w-full min-h-125 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={tabVariants}
            initial="hidden"
            animate="enter"
            exit="exit"
            className="w-full"
          >
            {activeTab === "bom" && <BomTab />}
            {activeTab === "wiring" && <WiringTab />}
            {activeTab === "print" && <PrintSpecsTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}