import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { rateLimitResponse } from "@/lib/rateLimit";
import { requireAuth } from "@/lib/auth";

interface CoachRequestBody {
  /** The user's reflection or message */
  message: string;
  /** Context injected from Zustand store */
  context: {
    archetype: string | null;
    ambitionType: string | null;
    streak: number;
    userName: string;
    currentPlanStepTitle?: string | null;
    lastReflection?: string | null;
  };
  /** Last few exchanges for continuity (max 5) */
  history?: Array<{ role: "user" | "assistant"; content: string }>;
  /** "reflect" = end-of-brief reflection; "chat" = freeform coaching */
  mode?: "reflect" | "chat";
}

interface CoachResponse {
  message: string;
  actionItem?: string | null;
  sentiment?: "positive" | "neutral" | "negative";
}

const MOCK_REFLECT_RESPONSE: CoachResponse = {
  message: "That reflection shows real self-awareness. Keep building on moments like this — they compound.",
  actionItem: null,
  sentiment: "positive",
};

const MOCK_CHAT_RESPONSE: CoachResponse = {
  message: "You're asking the right questions. Let's break it down into one clear next step.",
  actionItem: "Write down your top priority for tomorrow before you sleep.",
  sentiment: "positive",
};

function buildSystemPrompt(context: CoachRequestBody["context"], mode: string): string {
  const name = context.userName || "there";
  const archetype = context.archetype ?? "motivated person";
  const ambition = context.ambitionType ?? "personal growth";
  const streak = context.streak;

  return `You are Behavio — a sharp, warm AI life coach. You speak directly and avoid generic advice.

User profile:
- Name: ${name}
- Archetype: ${archetype}
- Goal domain: ${ambition}
- Current streak: ${streak} day${streak === 1 ? "" : "s"}
${context.currentPlanStepTitle ? `- Today's focus: ${context.currentPlanStepTitle}` : ""}
${context.lastReflection ? `- Last reflection: "${context.lastReflection}"` : ""}

${mode === "reflect"
    ? `The user just completed their daily brief and submitted a reflection. Respond with:
1. One sentence of genuine acknowledgment (specific to what they said, not generic)
2. One forward-looking insight that connects today to their bigger goal
Keep it under 60 words total. Be warm but don't over-praise.`
    : `The user is chatting with their AI coach. Respond with:
1. A direct, useful coaching response (2-3 sentences max)
2. Optionally, one concrete action item they can do today or tomorrow
Be like a sharp mentor — honest, encouraging, no fluff.`
  }

Return JSON only:
{
  "message": "coaching message",
  "actionItem": "one concrete action or null",
  "sentiment": "positive" | "neutral" | "negative"
}`;
}

function detectSentiment(text: string): "positive" | "neutral" | "negative" {
  const lower = text.toLowerCase();
  const positive = ["great", "good", "well", "amazing", "proud", "accomplished", "progress", "success", "win", "better", "happy", "excited", "motivated", "strong"];
  const negative = ["struggled", "failed", "bad", "hard", "difficult", "missed", "didn't", "can't", "tired", "frustrated", "stuck", "behind", "stressed", "overwhelmed"];
  const posScore = positive.filter((w) => lower.includes(w)).length;
  const negScore = negative.filter((w) => lower.includes(w)).length;
  if (posScore > negScore) return "positive";
  if (negScore > posScore) return "negative";
  return "neutral";
}

const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
const anthropic = anthropicApiKey ? new Anthropic({ apiKey: anthropicApiKey }) : null;

export async function POST(request: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const limited = rateLimitResponse(request);
  if (limited) return limited;
  try {
    const body = (await request.json()) as CoachRequestBody;
    const { message, context, history = [], mode = "chat" } = body;

    if (!message?.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const sentiment = detectSentiment(message);

    if (!anthropic) {
      const mock = mode === "reflect" ? MOCK_REFLECT_RESPONSE : MOCK_CHAT_RESPONSE;
      return NextResponse.json({ ...mock, sentiment });
    }

    const systemPrompt = buildSystemPrompt(context, mode);

    // Keep last 5 exchanges max
    const recentHistory = history.slice(-5);
    const messages: Anthropic.MessageParam[] = [
      ...recentHistory.map((h) => ({ role: h.role as "user" | "assistant", content: h.content })),
      { role: "user", content: message },
    ];

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 512,
      system: systemPrompt,
      messages,
    });

    const textOutput = response.content[0]?.type === "text" ? response.content[0].text : null;

    if (!textOutput) {
      const mock = mode === "reflect" ? MOCK_REFLECT_RESPONSE : MOCK_CHAT_RESPONSE;
      return NextResponse.json({ ...mock, sentiment });
    }

    try {
      const stripped = textOutput.replace(/```(?:json)?\n?/g, "").trim();
      const parsed = JSON.parse(stripped) as CoachResponse;
      return NextResponse.json({ ...parsed, sentiment: parsed.sentiment ?? sentiment });
    } catch {
      // Claude didn't return clean JSON — wrap the text as a message
      return NextResponse.json({
        message: textOutput.slice(0, 300),
        actionItem: null,
        sentiment,
      });
    }
  } catch (error) {
    console.error("/api/coach error", error);
    return NextResponse.json(
      { error: "Coach is unavailable right now. Try again in a moment." },
      { status: 500 }
    );
  }
}
