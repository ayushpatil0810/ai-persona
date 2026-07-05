"use client";

import Image from "next/image";
import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Copy, Check, RefreshCw } from "lucide-react";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { TypingIndicator } from "./TypingIndicator";
import { formatTimestamp } from "@/lib/utils";
import type { Message, Persona } from "@/types";

interface MessageBubbleProps {
  message: Message;
  persona: Persona;
  isStreaming?: boolean;
  onRegenerate?: () => void;
  isLastAssistant?: boolean;
}

export function MessageBubble({
  message,
  persona,
  isStreaming = false,
  onRegenerate,
  isLastAssistant = false,
}: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";
  const isEmpty = !message.content && isStreaming;

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }, [message.content]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className={`flex gap-3 group ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      {!isUser && (
        <div className="flex-shrink-0 mt-0.5">
          <div className="w-7 h-7 rounded-full overflow-hidden ring-1 ring-[var(--border-light)]">
            <Image
              src={persona.avatar}
              alt={persona.name}
              width={28}
              height={28}
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      )}

      {/* Bubble */}
      <div className={`flex flex-col gap-1 max-w-[85%] ${isUser ? "items-end" : "items-start"}`}>
        {/* Name row */}
        {!isUser && (
          <span className="text-xs text-muted-foreground font-medium ml-1">
            {persona.name}
          </span>
        )}

        <div
          className={`
            relative rounded-2xl px-5 py-3 text-sm
            shadow-sm backdrop-blur-md
            ${isUser
              ? "bg-orange-500/90 text-white rounded-tr-sm"
              : "bg-card/80 text-card-foreground rounded-tl-sm border border-border/50"
            }
          `}
        >
          {isEmpty ? (
            <TypingIndicator />
          ) : isUser ? (
            <div className="flex flex-col gap-2">
              {message.images && message.images.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {message.images.map((img, idx) => (
                    <div key={idx} className="relative w-48 h-auto rounded-md overflow-hidden">
                      <Image
                        src={img}
                        alt={`Attachment ${idx + 1}`}
                        width={200}
                        height={200}
                        className="object-cover w-full h-auto"
                      />
                    </div>
                  ))}
                </div>
              )}
              {message.content && <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>}
            </div>
          ) : (
            <>
              <MarkdownRenderer content={message.content} />
              {isStreaming && (
                <span className="inline-block w-0.5 h-4 bg-current opacity-70 animate-pulse ml-0.5 align-middle" />
              )}
            </>
          )}
        </div>

        {/* Footer: timestamp + actions */}
        <div
          className={`flex items-center gap-2 px-1 transition-opacity duration-150 ${
            isUser ? "flex-row-reverse" : "flex-row"
          } opacity-0 group-hover:opacity-100`}
        >
          <span className="text-[11px] text-muted-foreground">
            {formatTimestamp(message.createdAt)}
          </span>

          {!isStreaming && message.content && (
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-sm px-1 py-0.5 transition-colors"
              aria-label="Copy message"
            >
              {copied ? <Check size={11} /> : <Copy size={11} />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
          )}

          {!isUser && isLastAssistant && !isStreaming && onRegenerate && (
            <button
              onClick={onRegenerate}
              className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-sm px-1 py-0.5 transition-colors"
              aria-label="Regenerate response"
            >
              <RefreshCw size={11} />
              <span>Regenerate</span>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
