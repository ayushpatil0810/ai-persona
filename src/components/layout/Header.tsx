"use client";

import Image from "next/image";
import { BotMessageSquare, Trash2 } from "lucide-react";
import { PersonaToggle } from "@/components/persona/PersonaToggle";
import type { Persona } from "@/types";

interface HeaderProps {
  persona: Persona;
  onSelectPersona: (id: string) => void;
  onClearChat: () => void;
}

export function Header({ persona, onSelectPersona, onClearChat }: HeaderProps) {
  return (
    <header className="
      sticky top-0 z-50
      grid grid-cols-3 items-center
      px-6 py-4
      bg-background/80 backdrop-blur-xl
      border-b border-border
    ">
      {/* Left: Logo */}
      <div className="flex items-center justify-start gap-2">
        <div className="w-9 h-9 rounded-[14px] bg-orange-500/10 flex items-center justify-center">
          <BotMessageSquare size={20} className="text-orange-500" />
        </div>
        <span className="font-semibold text-lg tracking-tight hidden sm:block text-foreground">ai-persona</span>
      </div>

      {/* Center: Persona Toggle */}
      <div className="flex items-center justify-center">
        <PersonaToggle 
          activePersonaId={persona.id} 
          onSelect={onSelectPersona} 
          width={96} 
          height={48} 
        />
      </div>

      {/* Right: Actions */}
      <div className="flex items-center justify-end">
        <button
          onClick={onClearChat}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-orange-500 hover:bg-orange-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-full transition-colors"
          title="Clear History"
          aria-label="Clear chat history"
        >
          <Trash2 size={16} />
          <span className="hidden sm:inline">Clear</span>
        </button>
      </div>
    </header>
  );
}
