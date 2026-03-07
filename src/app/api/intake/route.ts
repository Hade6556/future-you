import { NextResponse } from "next/server";
import OpenAI from "openai";

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

const openaiApiKey = process.env.OPENAI_API_KEY;
const openai = openaiApiKey ? new OpenAI({ apiKey: openaiApiKey }) : null;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as IntakeRequestBody;
    const narrative = body.narrative?.trim();

    if (!narrative) {
      return NextResponse.json(
        { error: "Narrative is required" },
        { status: 400 }
      );
    }

    // If no API key is set, fall back to a mock response so local dev still works.
    if (!openai) {
      return NextResponse.json(MOCK_RESPONSE);
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.3,
      messages: [
        {
          role: "system",
          content:
            "You are Future Me, an AI life coach that helps people with any ambition — business, fitness, weight loss, creativity, academics, or personal wellness. You are warm, focused, and action-oriented. Always reply with valid JSON only.",
        },
        {
          role: "user",
          content: `Turn the narrative below into JSON with this exact shape:\n{\n  "values": ["value", ...],\n  "roles": ["role", ...],\n  "paths": [\n    {\n      "name": "",
      "description": "",
      "timeHorizon": "",
      "tradeoffs": ""
    }
  ]
}\nEach path should highlight a different approach suited to the user's ambition (e.g., balanced, intense, restorative, creative). Include cross-domain suggestions covering fitness, business, creativity, or wellness as relevant.\nNarrative: ${narrative}\nPreferred tone: ${body.tone ?? "Life Coach"}\nReturn ONLY JSON.`,
        },
      ],
    });

    const textOutput = completion.choices[0]?.message?.content;

    if (!textOutput) {
      throw new Error("No response from model");
    }

    const parsed = JSON.parse(textOutput) as IntakeApiResponse;

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("/api/intake error", error);
    return NextResponse.json(
      { error: "Future Me hit a snag. Try again in a moment." },
      { status: 500 }
    );
  }
}
