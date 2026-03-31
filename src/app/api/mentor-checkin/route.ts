import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { rateLimitResponse } from "@/lib/rateLimit";
import { requireAuth } from "@/lib/auth";
import type { CheckinResponse, CheckinStatus } from "../../types/pipeline";

export const maxDuration = 30;

interface CheckinRequest {
  status: CheckinStatus;
  day: number;
  totalDays: number;
  userName: string;
  archetype: string | null;
  ambitionType: string | null;
  currentStepTitle: string | null;
  nextStepTitle: string | null;
  streak: number;
}

const MOCK_RESPONSES: Record<CheckinStatus, CheckinResponse> = {
  done: {
    reply: "That's Day {day} locked in — consistency is the whole game. Tomorrow we keep building.",
    tomorrowPreview: null,
  },
  partial: {
    reply: "Partial counts — you showed up and that's not nothing. Tomorrow we go again from where you left off.",
    tomorrowPreview: null,
  },
  skipped: {
    reply: "Noted. Life happens. Tomorrow we pick back up exactly where we left off — no drama.",
    tomorrowPreview: null,
  },
  pending: {
    reply: "Check back in when you're done today.",
    tomorrowPreview: null,
  },
};

function buildPrompt(req: CheckinRequest): string {
  const name = req.userName || "there";
  const statusLine =
    req.status === "done"
      ? "They completed today's task."
      : req.status === "partial"
        ? "They partially completed today's task."
        : "They skipped today's task.";

  const tomorrowLine = req.nextStepTitle
    ? `Tomorrow's task: "${req.nextStepTitle}"`
    : "This is near the end of their plan.";

  return `You are Behavio — a direct mentor responding to a daily check-in.

${statusLine}
User: ${name}, Day ${req.day} of ${req.totalDays}, ${req.streak} day streak
Today: "${req.currentStepTitle ?? "their daily task"}"
${tomorrowLine}

Write exactly 2 sentences:
1. Acknowledge what happened today — specific, not generic. No "great job!" fluff. Be real.
2. Set up tomorrow — mention the next task by name if available, or close the loop on the journey.

Rules:
- If they skipped: no shame, no "you should have" — just neutral and forward-looking
- If done: brief celebration, immediately pivot to tomorrow
- If partial: validate the effort, state we continue tomorrow
- Max 40 words total
- Do not ask any questions

Also return tomorrowPreview: a 1-sentence preview of tomorrow's task (or null if on last step).

Return JSON only:
{
  "reply": "...",
  "tomorrowPreview": "..." | null
}`;
}

const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
const anthropic = anthropicApiKey ? new Anthropic({ apiKey: anthropicApiKey }) : null;

export async function POST(request: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const limited = rateLimitResponse(request);
  if (limited) return limited;
  try {
    const body = (await request.json()) as CheckinRequest;
    const { status } = body;

    if (status === "pending") {
      return NextResponse.json(MOCK_RESPONSES.pending);
    }

    if (!anthropic) {
      const mock = { ...MOCK_RESPONSES[status] };
      mock.reply = mock.reply.replace("{day}", String(body.day));
      if (body.nextStepTitle) mock.tomorrowPreview = body.nextStepTitle;
      return NextResponse.json(mock);
    }

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 256,
      messages: [{ role: "user", content: buildPrompt(body) }],
    });

    const text = response.content[0]?.type === "text" ? response.content[0].text : null;
    if (!text) {
      const mock = { ...MOCK_RESPONSES[status] };
      mock.reply = mock.reply.replace("{day}", String(body.day));
      return NextResponse.json(mock);
    }

    try {
      const stripped = text.replace(/```(?:json)?\n?/g, "").trim();
      const parsed = JSON.parse(stripped) as CheckinResponse;
      return NextResponse.json(parsed);
    } catch {
      return NextResponse.json({
        reply: text.slice(0, 200),
        tomorrowPreview: body.nextStepTitle ?? null,
      });
    }
  } catch (error) {
    console.error("/api/mentor-checkin error", error);
    return NextResponse.json({ reply: "Noted. Tomorrow we keep going.", tomorrowPreview: null });
  }
}
