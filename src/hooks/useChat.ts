"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type { Message, Persona, StreamStatus } from "@/types";
import { generateId } from "@/lib/utils";

interface UseChatOptions {
  persona: Persona;
}

interface UseChatReturn {
  messages: Message[];
  status: StreamStatus;
  error: string | null;
  sendMessage: (content: string, images?: string[]) => Promise<void>;
  stopGenerating: () => void;
  regenerate: () => Promise<void>;
  clearMessages: () => void;
}

export function useChat({ persona }: UseChatOptions): UseChatReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState<StreamStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  
  // Hydrate from local storage on mount or when persona changes
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`chat_history_${persona.id}`);
      if (stored) {
        const parsed: Message[] = JSON.parse(stored);
        // Revive date objects
        const revived = parsed.map((m) => ({
          ...m,
          createdAt: new Date(m.createdAt),
        }));
        setMessages(revived);
      } else {
        setMessages([]);
      }
    } catch (e) {
      console.error("Failed to parse local storage chat history", e);
      setMessages([]);
    }
  }, [persona.id]);

  // Save to local storage whenever messages change
  useEffect(() => {
    try {
      if (messages.length > 0) {
        localStorage.setItem(`chat_history_${persona.id}`, JSON.stringify(messages));
      } else {
        localStorage.removeItem(`chat_history_${persona.id}`);
      }
    } catch (e) {
      console.error("Failed to save chat history to local storage", e);
    }
  }, [messages, persona.id]);

  // AbortController ref so we can cancel in-flight requests
  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(
    async (content: string, images?: string[]) => {
      if ((!content.trim() && (!images || images.length === 0)) || status === "streaming") return;

      const userMessage: Message = {
        id: generateId(),
        role: "user",
        content: content.trim(),
        images,
        createdAt: new Date(),
      };

      const assistantMessage: Message = {
        id: generateId(),
        role: "assistant",
        content: "",
        createdAt: new Date(),
        personaId: persona.id,
      };

      setMessages((prev) => [...prev, userMessage, assistantMessage]);
      setStatus("streaming");
      setError(null);

      abortControllerRef.current = new AbortController();

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: abortControllerRef.current.signal,
          body: JSON.stringify({
            messages: [...messages, userMessage].map((m) => ({
              role: m.role,
              content: m.content,
              images: m.images,
            })),
            personaId: persona.id,
            systemPrompt: persona.systemPrompt,
          }),
        });

        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          throw new Error(err.error ?? `HTTP ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error("No response body");

        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (!last || last.role !== "assistant") return prev;
            return [
              ...prev.slice(0, -1),
              { ...last, content: last.content + chunk },
            ];
          });
        }

        setStatus("idle");
      } catch (err) {
        if ((err as Error).name === "AbortError") {
          // User stopped generation — keep whatever was streamed
          setStatus("idle");
        } else {
          setError(err instanceof Error ? err.message : "Something went wrong");
          setStatus("error");
          // Remove the empty assistant message on error
          setMessages((prev) =>
            prev.filter((m) => m.id !== assistantMessage.id)
          );
        }
      } finally {
        abortControllerRef.current = null;
      }
    },
    [messages, persona, status]
  );

  const stopGenerating = useCallback(() => {
    abortControllerRef.current?.abort();
  }, []);

  const regenerate = useCallback(async () => {
    // Find the last user message and re-send from that point
    const lastUserIdx = [...messages].reverse().findIndex((m) => m.role === "user");
    if (lastUserIdx === -1) return;

    const actualIdx = messages.length - 1 - lastUserIdx;
    const lastUserMessage = messages[actualIdx];

    // Trim messages back to before the last user message
    setMessages((prev) => prev.slice(0, actualIdx));

    await sendMessage(lastUserMessage.content, lastUserMessage.images);
  }, [messages, sendMessage]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setStatus("idle");
    setError(null);
  }, []);

  return { messages, status, error, sendMessage, stopGenerating, regenerate, clearMessages };
}
