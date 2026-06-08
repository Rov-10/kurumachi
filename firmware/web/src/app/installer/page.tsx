"use client";
import { useSerial } from "@/hooks/useSerial";
import FlasherBlock from "@/components/installer/FlasherBlock";
import ConfiguratorBlock from "@/components/installer/ConfiguratorBlock";

export default function InstallerPage() {
  const serial = useSerial();

  return (
    <main className="flex min-h-screen flex-col items-center pt-32 pb-20 px-6 max-w-7xl mx-auto space-y-8">
      {/* Шапка Сторінки */}
      <div className="w-full text-left border-b border-nothing-border pb-6">
        <h1 className="font-dot text-4xl text-white tracking-wide uppercase">Web Deployment Suite</h1>
        <p className="text-sm text-nothing-text/40 uppercase tracking-widest mt-1">
          Flash firmware binaries and configure your hardware nodes directly from the cloud
        </p>
      </div>

      {/* Атомарна сітка інтерфейсу */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div className="lg:col-span-1">
          <FlasherBlock />
        </div>
        <div className="lg:col-span-2">
          <ConfiguratorBlock serial={serial} />
        </div>
      </div>
    </main>
  );
}