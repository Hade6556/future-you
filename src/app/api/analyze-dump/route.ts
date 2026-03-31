import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { rateLimitResponse } from "@/lib/rateLimit";
import { requireAuth } from "@/lib/auth";

export const maxDuration = 30;

interface AnalyzeRequest {
  transcript: string;
}

const KEYWORD_MAP: Record<string, string[]> = {
  "Fitness":    ["gym", "workout", "exercise", "training", "run", "sport", "arms", "legs", "muscle", "lift", "cardio", "yoga", "swim"],
  "Health":     ["health", "sleep", "hurt", "pain", "tired", "energy", "sick", "doctor", "rest", "recover", "sore"],
  "Business":   ["business", "work", "meeting", "client", "project", "team", "company", "startup", "revenue", "sales", "pitch", "investor", "market"],
  "Learning":   ["learn", "read", "study", "course", "book", "skill", "research", "practice", "improve"],
  "Planning":   ["plan", "goal", "tomorrow", "next week", "schedule", "future", "strategy", "deadline", "target"],
  "Personal":   ["family", "friend", "home", "feel", "emotion", "relationship", "love", "social", "people"],
  "Finance":    ["money", "budget", "invest", "save", "income", "expense", "profit", "cash", "finance", "pay"],
  "Travel":     ["travel", "trip", "flight", "hotel", "city", "country", "visit", "abroad", "airport"],
};

function keywordFallback(transcript: string): Array<{ label: string; pct: number }> {
  const lower = transcript.toLowerCase();
  const scores: [string, number][] = Object.entries(KEYWORD_MAP)
    .map(([label, words]) => [label, words.filter((w) => lower.includes(w)).length] as [string, number])
    .filter(([, score]) => score > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  if (scores.length === 0) return [{ label: "Reflection", pct: 100 }];

  const total = scores.reduce((s, [, n]) => s + n, 0);
  const cats = scores.map(([label, n]) => ({ label, pct: Math.round((n / total) * 100) }));
  // Ensure percentages sum to 100
  const diff = 100 - cats.reduce((s, c) => s + c.pct, 0);
  cats[0].pct += diff;
  return cats;
}

const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
const anthropic = anthropicApiKey ? new Anthropic({ apiKey: anthropicApiKey }) : null;

export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const limited = rateLimitResponse(req);
  if (limited) return limited;
  const { transcript } = (await req.json()) as AnalyzeRequest;

  if (!transcript?.trim()) {
    return NextResponse.json({ categories: [] });
  }

  if (!anthropic) {
    console.warn("[analyze-dump] ANTHROPIC_API_KEY not set — using keyword fallback");
    return NextResponse.json({ categories: keywordFallback(transcript) });
  }

  try {
    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
      messages: [
        {
          role: "user",
          content: `Classify the main topics in this voice transcript. Return ONLY a valid JSON array — no explanation, no markdown, no code fences.

Format: [{"label":"Topic name","pct":60},{"label":"Other topic","pct":40}]
- Labels: 1–3 natural words (e.g. "Fitness", "Work stress", "Family")
- Percentages: integers summing to exactly 100

Transcript: ${transcript}`,
        },
      ],
    });

    const raw = (response.content[0] as { type: string; text: string }).text.trim();
    const match = raw.match(/\[[\s\S]*\]/);
    if (!match) {
      console.warn("[analyze-dump] no JSON array in response, falling back. raw:", raw);
      return NextResponse.json({ categories: keywordFallback(transcript) });
    }

    const categories = JSON.parse(match[0]) as Array<{ label: string; pct: number }>;
    if (!Array.isArray(categories) || !categories.length) {
      return NextResponse.json({ categories: keywordFallback(transcript) });
    }
    return NextResponse.json({ categories });
  } catch (err) {
    console.error("[analyze-dump] error:", err);
    return NextResponse.json({ categories: keywordFallback(transcript) });
  }
}
