"use client";

import { useState, useCallback } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  language?: string;
  filename?: string;
  code: string;
}

export function CodeBlock({ language, filename, code }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API not available
    }
  }, [code]);

  const displayLang = language ?? "text";

  return (
    <div className="rounded-[var(--radius-md)] overflow-hidden border border-[var(--border-light)] my-3 bg-[#1e1e2e]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          {filename && (
            <span className="text-xs text-[#a6adc8] font-mono">{filename}</span>
          )}
          {!filename && (
            <span className="text-xs text-[#6c7086] font-mono uppercase tracking-wider">
              {displayLang}
            </span>
          )}
        </div>
        <button
          onClick={handleCopy}
          className={cn(
            "flex items-center gap-1.5 text-xs px-2 py-1 rounded transition-all duration-150",
            "text-[#6c7086] hover:text-[#cdd6f4] hover:bg-white/[0.06]",
            copied && "text-green-400"
          )}
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <Check size={12} />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy size={12} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code */}
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
        <code
          className={`language-${displayLang} text-[#cdd6f4] font-mono`}
          dangerouslySetInnerHTML={{ __html: code }}
        />
      </pre>
    </div>
  );
}
