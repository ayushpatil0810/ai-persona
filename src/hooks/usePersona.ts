"use client";

import { useState, useCallback } from "react";
import type { Persona } from "@/types";
import { defaultPersona, personaMap } from "@/personas";

interface UsePersonaReturn {
  activePersona: Persona;
  setPersona: (id: string) => void;
}

export function usePersona(): UsePersonaReturn {
  const [activePersona, setActivePersona] = useState<Persona>(defaultPersona);

  const setPersona = useCallback((id: string) => {
    const persona = personaMap[id];
    if (persona) setActivePersona(persona);
  }, []);

  return { activePersona, setPersona };
}
