"use client";

import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { usePersona } from "@/hooks/usePersona";
import { useChat } from "@/hooks/useChat";
import { personas } from "@/personas";

/**
 * We instantiate one useChat per persona at the top level so each persona
 * keeps its own independent chat history for the lifetime of the session.
 * Hooks must be called unconditionally, so we call them for both personas
 * and then select the active one.
 */
function useChatPerPersona() {
  const chatByPersona = {
    hitesh: useChat({ persona: personas[0] }), // eslint-disable-line react-hooks/rules-of-hooks
    piyush: useChat({ persona: personas[1] }), // eslint-disable-line react-hooks/rules-of-hooks
  };
  return chatByPersona;
}

export default function ChatPage() {
  const { activePersona, setPersona } = usePersona();
  const chatByPersona = useChatPerPersona();

  const chat = chatByPersona[activePersona.id as keyof typeof chatByPersona];

  const handlePersonaSelect = useCallback(
    (id: string) => {
      setPersona(id);
    },
    [setPersona]
  );

  return (
    <div className="relative flex flex-col h-full overflow-hidden bg-zinc-50 dark:bg-black w-full">
      {/* Background Layer */}
      <div
        className="absolute inset-0 pointer-events-none z-0 [background-size:24px_24px] [background-image:radial-gradient(#d4d4d4_1px,transparent_1px)] dark:[background-image:radial-gradient(#333333_1px,transparent_1px)]"
      />
      <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center bg-zinc-50 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black" />

      {/* Foreground Content */}
      <div className="relative z-10 flex flex-col h-full w-full">
        <Header
          persona={activePersona}
          onSelectPersona={handlePersonaSelect}
          onClearChat={chat.clearMessages}
        />

        {/* Main content */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden max-w-[var(--chat-max-width)] mx-auto w-full">
        {/* Animated persona transition */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activePersona.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex-1 overflow-hidden relative"
          >
            <ChatWindow
              messages={chat.messages}
              persona={activePersona}
              status={chat.status}
              error={chat.error}
              onSend={chat.sendMessage}
              onStop={chat.stopGenerating}
              onRegenerate={chat.regenerate}
            />
          </motion.div>
        </AnimatePresence>
      </div>
      </div>
    </div>
  );
}
