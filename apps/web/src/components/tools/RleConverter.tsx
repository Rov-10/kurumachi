"use client";

import { useState, useEffect } from "react";
import { useGifProcessor } from "./rle/useGifProcessor";
import { UploadPanel } from "./rle/UploadPanel";
import { TerminalOutput } from "./rle/TerminalOutput";

export default function RleConverter() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [invert, setInvert] = useState<boolean>(false);
  const [threshold, setThreshold] = useState<number>(128);

  const { generatedCode, setGeneratedCode, processGif } = useGifProcessor();

  // Слухач для отримання кастомних малюнків з Pixel Studio
  useEffect(() => {
    const handleCustomGif = (e: Event) => {
      const customEvent = e as CustomEvent<File>;
      if (customEvent.detail) {
        setSelectedFile(customEvent.detail);
        setGeneratedCode("");
      }
    };
    window.addEventListener("kurumachi-load-gif", handleCustomGif);
    return () => window.removeEventListener("kurumachi-load-gif", handleCustomGif);
  }, [setGeneratedCode]);

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6 items-start animate-in fade-in slide-in-from-bottom-2 duration-500">
      <UploadPanel
        selectedFile={selectedFile}
        setSelectedFile={(file) => {
          setSelectedFile(file);
          setGeneratedCode(""); // Скидаємо термінал при новому файлі
        }}
        invert={invert}
        setInvert={setInvert}
        threshold={threshold}
        setThreshold={setThreshold}
        onProcess={() => processGif(selectedFile, threshold, invert)}
      />
      <TerminalOutput generatedCode={generatedCode} />
    </div>
  );
}