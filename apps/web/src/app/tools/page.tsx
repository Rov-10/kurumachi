"use client";
import RleConverter from "@/components/tools/RleConverter";
import PixelStudio from "@/components/tools/pixel-studio";

export default function ToolsPage() {
  return (
    <main className="flex min-h-screen flex-col items-center pt-32 pb-20 px-6 max-w-7xl mx-auto space-y-8">
      {/* Title Header */}
      <div className="w-full text-left border-b border-nothing-border pb-6">
        <h1 className="font-dot text-4xl text-white tracking-wide uppercase">Developer Suite</h1>
        <p className="text-sm text-nothing-text/40 uppercase tracking-widest mt-2 font-space">
          Low-level compression tools and RLE encoders for optimal asset matrix packing
        </p>
      </div>

      {/* Atomic RLE Tool Subblock */}
      <RleConverter />

      <PixelStudio />
    </main>
  );
}