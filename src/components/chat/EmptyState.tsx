"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";
import type { Persona } from "@/types";

interface EmptyStateProps {
  persona: Persona;
  onSuggestion: (text: string) => void;
}

const getSuggestions = (personaName: string) => {
  if (personaName.toLowerCase().includes("hitesh")) {
    return [
      "Explain JavaScript closures with a real-world example",
      "How do I optimize a large React application?",
      "Walk me through setting up a REST API with Node.js and Express",
      "What are the best practices for system design?",
    ];
  }
  if (personaName.toLowerCase().includes("piyush")) {
    return [
      "How do I implement authentication in Next.js 14?",
      "Explain the difference between Server Components and Client Components",
      "What's the best way to manage state in a large React app?",
      "Can you review this code snippet for performance?",
    ];
  }
  return [
    "Explain this concept to me like I'm 5",
    "Can you help me debug a piece of code?",
    "What are the best practices for this?",
    "Walk me through how to build a basic API",
  ];
};

export function EmptyState({ persona, onSuggestion }: EmptyStateProps) {
  const suggestions = getSuggestions(persona.name);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex flex-col items-center justify-center h-full px-6 py-16 text-center"
    >
      {/* Avatar */}
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-white/10 shadow-xl">
          <Image
            src={persona.avatar}
            alt={persona.name}
            width={80}
            height={80}
            className="object-cover w-full h-full"
          />
        </div>
        <div
          className="absolute bottom-0 right-0 w-6 h-6 rounded-full flex items-center justify-center ring-2 ring-background"
          style={{ background: persona.accentColor || 'var(--primary)' }}
        >
          <MessageSquare size={12} className="text-white" />
        </div>
      </div>

      {/* Greeting */}
      <h2 className="text-xl font-semibold text-foreground mb-2 tracking-tight">
        Chat with {persona.name}
      </h2>
      <p className="text-sm text-muted-foreground max-w-sm mb-8 leading-relaxed">
        {persona.description}. Ask anything about code, system design, or software engineering.
      </p>

      {/* Suggestion chips */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => onSuggestion(s)}
            className="
              text-left text-sm px-5 py-4 rounded-2xl
              bg-card/50 backdrop-blur-md
              border border-border/50
              text-muted-foreground
              hover:text-foreground hover:bg-card hover:border-border
              shadow-sm hover:shadow-md
              transition-all duration-300 leading-snug
            "
          >
            {s}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
