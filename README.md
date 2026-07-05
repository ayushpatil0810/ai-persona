# AI Persona Chat

A highly polished, distraction-free AI Mentor Chat application built with Next.js. This application allows users to interact with uniquely defined AI personas (e.g., Hitesh and Piyush Garg) designed with deep, specialized system prompts to emulate their exact conversational style, humor, and technical focus.

## Features

- **Distinct Personas**: Deeply integrated system prompts to provide distinct, opinionated, and realistic conversational experiences.
- **Multimodal Support**: Users can attach images to their prompts for better context.
- **Minimalist UI**: A sleek, dark-themed interface built using Tailwind CSS v4 and a unified OKLCH color system.
- **Fluid Animations**: Smooth transitions and micro-interactions powered by Framer Motion, including a highly custom animated persona toggle.
- **Markdown Rendering**: Robust real-time rendering of markdown and code blocks in chat messages.

## Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Fonts**: Inter & Geist

## Getting Started

First, install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Customizing Personas

Personas are defined in `src/personas/`. You can easily add or modify existing personas by updating the exported objects. Each persona contains its name, avatar, description, and a highly detailed `systemPrompt` that dictates its personality and boundaries.

Example:

```typescript
import type { Persona } from "@/types";

const customPersona: Persona = {
  id: "custom",
  name: "Custom Mentor",
  avatar: "/avatar.png",
  description: "A helpful custom mentor.",
  accentColor: "var(--primary)",
  systemPrompt: "You are a helpful software engineering mentor...",
};
```
