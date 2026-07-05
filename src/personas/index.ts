import hitesh from "./hitesh";
import piyush from "./piyush";
import type { Persona } from "@/types";

export const personas: Persona[] = [hitesh, piyush];

export const personaMap: Record<string, Persona> = {
  hitesh,
  piyush,
};


export const defaultPersona = hitesh;
