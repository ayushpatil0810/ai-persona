import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Format a Date as a human-readable time string, e.g. "2:34 PM" */
export function formatTimestamp(date: Date): string {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/** Generate a random ID for messages */
export function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}
