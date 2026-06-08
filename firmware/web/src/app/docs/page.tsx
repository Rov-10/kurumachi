"use client";
import { useState } from "react";
import BomTab from "@/components/docs/BomTab";
import WiringTab from "@/components/docs/WiringTab";
import PrintSpecsTab from "@/components/docs/PrintSpecsTab";

type TabType = "bom" | "wiring" | "3dprint";

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("bom");

  const tabs: { id: TabType; label: string }[] = [
    { id: "bom", label: "[1] Hardware BOM List" },
    { id: "wiring", label: "[2] Wiring Map (Pinout)" },
    { id: "3dprint", label: "[3] 3D Print Specs" },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center pt-32 pb-20 px-6 max-w-5xl mx-auto">
      {/* Шапка Документації */}
      <div className="w-full text-left mb-12 border-b border-nothing-border pb-6">
        <h1 className="font-dot text-4xl text-white tracking-wide uppercase">Engineering Manual</h1>
        <p className="text-sm text-nothing-text/40 uppercase tracking-widest mt-1">
          Hardware Architecture & Open-Source Assembly Specification
        </p>
      </div>

      {/* Таби Керування */}
      <div className="w-full flex gap-2 border-b border-nothing-border/40 mb-8 pb-px font-dot text-xs tracking-widest uppercase overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 border-b-2 transition-all whitespace-nowrap ${
              activeTab === tab.id ? "border-nothing-red text-white" : "border-transparent text-nothing-text/40 hover:text-nothing-text/80"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Рендер активного компонента */}
      <div className="w-full text-left">
        {activeTab === "bom" && <BomTab />}
        {activeTab === "wiring" && <WiringTab />}
        {activeTab === "3dprint" && <PrintSpecsTab />}
      </div>
    </main>
  );
}