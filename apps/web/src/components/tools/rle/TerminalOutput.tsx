import { useState } from 'react';
import { Binary, Copy, Check } from 'lucide-react';

export function TerminalOutput({ generatedCode }: { generatedCode: string }) {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = () => {
    if (!generatedCode) return;
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="lg:col-span-2 border border-zinc-800/80 bg-[#050505] rounded-2xl p-6 flex flex-col h-[480px] min-w-0">
      <div className="flex items-center justify-between text-zinc-500 font-dot text-xs uppercase tracking-widest mb-4 pb-2 border-b border-zinc-800/50 shrink-0">
        <span className="flex items-center gap-2">
          <Binary className="w-4 h-4" /> Output custom_frame.h
        </span>
        {generatedCode && (
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            {copied ? (
              <span className="flex items-center gap-1.5 text-white">
                <Check className="w-3.5 h-3.5" /> Copied!
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Copy className="w-3.5 h-3.5" /> Copy Code
              </span>
            )}
          </button>
        )}
      </div>

      <div className="flex-1 overflow-auto font-mono text-[10px] sm:text-xs text-left bg-black p-4 rounded-xl border border-zinc-800/50 select-text relative scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent min-w-0">
        {generatedCode ? (
          <pre className="text-zinc-300 whitespace-pre leading-relaxed inline-block min-w-full">
            {generatedCode}
          </pre>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-zinc-600 font-sans text-xs uppercase tracking-widest">
            Awaiting matrix upload for byte-stream generation...
          </div>
        )}
      </div>
    </div>
  );
}
