"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { MessageBubble } from "./MessageBubble";
import { EmptyState } from "./EmptyState";
import { ChatInput } from "./ChatInput";
import type { Message, Persona, StreamStatus } from "@/types";

interface ChatWindowProps {
  messages: Message[];
  persona: Persona;
  status: StreamStatus;
  error: string | null;
  onSend: (content: string) => void;
  onStop: () => void;
  onRegenerate: () => void;
}

export function ChatWindow({
  messages,
  persona,
  status,
  error,
  onSend,
  onStop,
  onRegenerate,
}: ChatWindowProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  // Auto-scroll to bottom while streaming (unless user scrolled up)
  const userScrolledUp = useRef(false);

  const scrollToBottom = useCallback((smooth = true) => {
    bottomRef.current?.scrollIntoView({ behavior: smooth ? "smooth" : "instant" });
  }, []);

  useEffect(() => {
    if (!userScrolledUp.current) {
      scrollToBottom(false);
    }
  }, [messages, scrollToBottom]);

  // Track if user scrolled up
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const onScroll = () => {
      const dist = el.scrollHeight - el.scrollTop - el.clientHeight;
      userScrolledUp.current = dist > 100;
      setShowScrollBtn(dist > 100 && messages.length > 0);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [messages.length]);

  const lastAssistantIdx = [...messages].map((m, i) => ({ m, i })).reverse()
    .find(({ m }) => m.role === "assistant")?.i ?? -1;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Messages area */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto px-4 py-6"
        role="log"
        aria-label="Chat messages"
        aria-live="polite"
      >
        <div className="max-w-[var(--chat-max-width)] mx-auto space-y-5">
          {messages.length === 0 ? (
            <EmptyState persona={persona} onSuggestion={onSend} />
          ) : (
            <>
              <AnimatePresence initial={false}>
                {messages.map((message, index) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    persona={persona}
                    isStreaming={status === "streaming" && index === messages.length - 1 && message.role === "assistant"}
                    onRegenerate={onRegenerate}
                    isLastAssistant={index === lastAssistantIdx}
                  />
                ))}
              </AnimatePresence>

              {/* Error state */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <p className="text-sm text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-[var(--radius-md)] px-4 py-2 inline-block">
                    {error}
                  </p>
                </motion.div>
              )}
            </>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Scroll-to-bottom button */}
      <AnimatePresence>
        {showScrollBtn && (
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            onClick={() => {
              userScrolledUp.current = false;
              scrollToBottom();
            }}
            className="
              absolute bottom-24 right-6
              flex items-center justify-center
              w-8 h-8 rounded-full
              bg-[var(--bg-base)] border border-[var(--border-medium)]
              shadow-[var(--shadow-md)]
              text-[var(--text-secondary)] hover:text-[var(--text-primary)]
              transition-colors z-10
            "
            aria-label="Scroll to bottom"
          >
            <ArrowDown size={15} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Input */}
      <div className="bg-transparent pb-6 pt-2 shrink-0">
        <div className="max-w-[var(--chat-max-width)] mx-auto px-4 sm:px-0">
          <ChatInput
            onSend={onSend}
            onStop={onStop}
            isStreaming={status === "streaming"}
          />
        </div>
      </div>
    </div>
  );
}
