"use client";

import { type FC } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { personas } from "@/personas";

interface PersonaToggleProps {
  activePersonaId: string;
  onSelect: (id: string) => void;
  width?: number;
  height?: number;
}

export const PersonaToggle: FC<PersonaToggleProps> = ({
  activePersonaId,
  onSelect,
  width = 80,
  height = 40,
}) => {
  const isPiyush = activePersonaId === personas[1].id;

  // Theme styling (Dark / Orange) mapped to CSS variables
  const trackColor = "var(--muted)";
  const knobColor = "#f97316";
  const borderColor = "var(--border)";

  const iconSize = height * 0.7;

  const togglePersona = () => {
    if (isPiyush) {
      onSelect(personas[0].id);
    } else {
      onSelect(personas[1].id);
    }
  };

  return (
    <motion.button
      role="switch"
      aria-checked={!isPiyush}
      aria-label="Toggle Persona"
      onClick={togglePersona}
      className="relative flex items-center rounded-full border-2 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      style={{
        width,
        height,
        borderColor,
      }}
    >
      {/* TRACK */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{ backgroundColor: trackColor }}
        transition={{ duration: 0.4 }}
      />

      {/* SLIDING KNOB */}
      <motion.div
        layout
        layoutId="persona-knob"
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="absolute rounded-full border-2 z-30"
        style={{
          width: height,
          height,
          right: isPiyush ? -2 : undefined,
          left: isPiyush ? undefined : -2,
          backgroundColor: knobColor,
          borderColor: knobColor,
        }}
      />

      {/* HITESH AVATAR */}
      <motion.div
        className="relative z-30 flex items-center justify-center rounded-full overflow-hidden"
        style={{ width: height, height }}
      >
        <Image
          src={personas[0].avatar}
          alt={personas[0].name}
          width={iconSize}
          height={iconSize}
          className={`rounded-full object-cover transition-opacity duration-200 ${isPiyush ? "opacity-50 grayscale" : "opacity-100 ring-2 ring-white/90"}`}
        />
      </motion.div>

      {/* PIYUSH AVATAR */}
      <motion.div
        className="relative z-30 flex items-center justify-center rounded-full overflow-hidden"
        style={{ width: height, height }}
      >
        <Image
          src={personas[1].avatar}
          alt={personas[1].name}
          width={iconSize}
          height={iconSize}
          className={`rounded-full object-cover transition-opacity duration-200 ${!isPiyush ? "opacity-50 grayscale" : "opacity-100 ring-2 ring-white/90"}`}
        />
      </motion.div>
    </motion.button>
  );
};
