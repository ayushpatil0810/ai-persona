import OpenAI from "openai";
import type { ChatRequestBody } from "@/types";

// Initialize OpenAI client — key read from env
const openai = new OpenAI({
  baseURL: process.env.OPENAI_BASEURL,
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body: ChatRequestBody = await request.json();
    const { messages, systemPrompt } = body;

    const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

    const stream = await openai.chat.completions.create({
      model,
      stream: true,
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.map((m) => {
          if (m.images && m.images.length > 0) {
            return {
              role: m.role,
              content: [
                { type: "text", text: m.content },
                ...m.images.map((img) => ({
                  type: "image_url",
                  image_url: { url: img },
                })),
              ],
            };
          }
          return { role: m.role, content: m.content };
        }),
      ],
    });

    // Pipe OpenAI stream → Web ReadableStream so Next.js can stream to client
    const readable = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content ?? "";
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
        } finally {
          controller.close();
        }
      },
      cancel() {
        stream.controller.abort();
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "no-cache",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
