// ─── Core Domain Types ───────────────────────────────────────────────────────

export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  images?: string[]; // base64 encoded images
  createdAt: Date;
  personaId?: string; // which persona authored this assistant message
}

export interface Persona {
  id: string;
  name: string;
  /** URL or relative path to the avatar image */
  avatar: string;
  /** Short tagline shown in the persona switcher */
  description: string;
  /** System prompt sent as the first message to the LLM */
  systemPrompt: string;
  /** Accent color used to tint this persona's messages (CSS color) */
  accentColor: string;
}

// ─── Chat State ───────────────────────────────────────────────────────────────

export type StreamStatus = "idle" | "streaming" | "error";

// ─── API ─────────────────────────────────────────────────────────────────────

export interface ChatRequestBody {
  messages: Pick<Message, "role" | "content" | "images">[];
  personaId: string;
  systemPrompt: string;
}
