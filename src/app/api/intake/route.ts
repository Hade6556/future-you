import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { rateLimitResponse } from "@/lib/rateLimit";

export const maxDuration = 30;

interface IntakeRequestBody {
  narrative: string;
  tone?: string;
}

interface IntakePath {
  name: string;
  description: string;
  timeHorizon: string;
  tradeoffs: string;
}

interface IntakeApiResponse {
  values: string[];
  roles: string[];
  paths: IntakePath[];
}

const MOCK_RESPONSE: IntakeApiResponse = {
  values: ["Discipline", "Growth", "Health", "Creativity"],
  roles: ["Focused founder", "Endurance athlete", "Creative thinker", "Wellness advocate"],
  paths: [
    {
      name: "Balanced Builder",
      description:
        "Build your venture while protecting energy. Grow revenue steadily, train 3x a week, and protect creative time.",
      timeHorizon: "9-12 months",
      tradeoffs: "Slower growth, stronger foundation",
    },
    {
      name: "Peak Performance Sprint",
      description:
        "Go all-in on fitness and discipline. Train daily, track nutrition, build the habits that make everything else easier.",
      timeHorizon: "3 months",
      tradeoffs: "Less time for projects, maximum physical gains",
    },
    {
      name: "Creative Momentum",
      description:
        "Ship one creative project per month. Whether it's content, art, or a product — build in public and find your audience.",
      timeHorizon: "6 months",
      tradeoffs: "Higher output pressure, more public accountability",
    },
  ],
};

const SYSTEM_PROMPT = `You are Behavio, an AI life coach that helps people with any ambition — business, fitness, weight loss, creativity, academics, or personal wellness. You are warm, focused, and action-oriented.

Extract identity signals from the user's narrative and return a JSON object with this exact shape:
{
  "values": ["value1", "value2", ...],
  "roles": ["role1", "role2", ...],
  "paths": [
    {
      "name": "Path name",
      "description": "Path description",
      "timeHorizon": "X months",
      "tradeoffs": "Trade-off summary"
    }
  ]
}

Rules:
- values: 3-5 core values extracted from the narrative (e.g. "Discipline", "Creativity", "Impact")
- roles: 3-5 identity roles, mixing current and aspirational (e.g. "Focused founder", "Endurance athlete")
- paths: exactly 3 alternative trajectories, each with a distinct approach (balanced, intense, restorative, or creative)
- Each path should reflect cross-domain suggestions covering fitness, business, creativity, or wellness as relevant to the user
- Return ONLY valid JSON, no markdown, no explanation`;

const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
const anthropic = anthropicApiKey ? new Anthropic({ apiKey: anthropicApiKey }) : null;

function extractJson(text: string): IntakeApiResponse {
  // Strip markdown code fences if present
  const stripped = text.replace(/```(?:json)?\n?/g, "").trim();
  return JSON.parse(stripped) as IntakeApiResponse;
}

export async function POST(request: Request) {
  const limited = rateLimitResponse(request);
  if (limited) return limited;
  try {
    const body = (await request.json()) as IntakeRequestBody;
    const narrative = body.narrative?.trim();

    if (!narrative) {
      return NextResponse.json({ error: "Narrative is required" }, { status: 400 });
    }

    if (!anthropic) {
      return NextResponse.json(MOCK_RESPONSE);
    }

    const userMessage = `Turn the narrative below into the JSON structure requested.

Preferred tone: ${body.tone ?? "Life Coach"}
Narrative: ${narrative}`;

    let textOutput: string | null = null;

    try {
      const message = await anthropic.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userMessage }],
      });
      textOutput = message.content[0]?.type === "text" ? message.content[0].text : null;
    } catch {
      // Retry once on failure
      const retry = await anthropic.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userMessage }],
      });
      textOutput = retry.content[0]?.type === "text" ? retry.content[0].text : null;
    }

    if (!textOutput) {
      return NextResponse.json(MOCK_RESPONSE);
    }

    try {
      const parsed = extractJson(textOutput);
      return NextResponse.json(parsed);
    } catch {
      // JSON parse failed — fall back to mock
      console.error("/api/intake: failed to parse Claude response", textOutput);
      return NextResponse.json(MOCK_RESPONSE);
    }
  } catch (error) {
    console.error("/api/intake error", error);
    return NextResponse.json(
      { error: "Behavio hit a snag. Try again in a moment." },
      { status: 500 }
    );
  }
}
