import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { requireAuth } from "@/lib/auth";

export const maxDuration = 30;

interface RewriteRequest {
  transcript: string;
  lang: string;
}

export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const { transcript, lang } = (await req.json()) as RewriteRequest;

  if (!transcript?.trim()) {
    return NextResponse.json({ cleaned: transcript });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ cleaned: transcript });
  }

  try {
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 512,
      system: `You are a transcript editor. The user recorded a voice brain dump using speech-to-text, which produces run-on sentences with no punctuation. Your job is to clean it up into well-structured, readable text.

Rules:
- Fix punctuation and capitalisation
- Break into logical sentences and paragraphs where natural
- Preserve every idea and detail — do not add, remove, or reinterpret content
- Keep the same language as the input (lang hint: ${lang})
- Return ONLY the cleaned text, no commentary, no quotes`,
      messages: [{ role: "user", content: transcript }],
    });

    const cleaned = (response.content[0] as { type: string; text: string }).text.trim();
    return NextResponse.json({ cleaned });
  } catch {
    // Fall back to raw transcript if API unavailable
    return NextResponse.json({ cleaned: transcript });
  }
}
