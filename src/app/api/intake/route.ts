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
  values: ["Autonomy", "Craft excellence", "Health", "Adventure"],
  roles: ["Calm founder", "Creative director", "Connector", "Athlete"],
  paths: [
    {
      name: "Balanced Builder",
      description:
        "Grow your studio to $30k/mo while keeping 4-day weeks. Layer in 2 flagship clients and protect creative time.",
      timeHorizon: "9-12 months",
      tradeoffs: "Slower growth, more focus on systemizing ops",
    },
    {
      name: "All-in Lab",
      description:
        "Launch a Future You product sprint. Build in public, run weekly opportunity scans, ship one offer per month.",
      timeHorizon: "6 months",
      tradeoffs: "Higher stress, more public accountability",
    },
    {
      name: "Restoration Arc",
      description:
        "Prioritize health, depth, and network. Train daily, host small salons, and rebuild energy before the next push.",
      timeHorizon: "3 months",
      tradeoffs: "Revenue plateaus short-term",
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
            "You are Future You, an ambitious but calm planner. Always reply with valid JSON only.",
        },
        {
          role: "user",
          content: `Turn the narrative below into JSON with this exact shape:\n{\n  "values": ["value", ...],\n  "roles": ["role", ...],\n  "paths": [\n    {\n      "name": "",
      "description": "",
      "timeHorizon": "",
      "tradeoffs": ""
    }
  ]
}\nEach path should highlight a different mode (balanced, intense, restorative, etc.).\nNarrative: ${narrative}\nPreferred tone: ${body.tone ?? "Calming mentor"}\nReturn ONLY JSON.`,
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
      { error: "Unable to structure Future You right now" },
      { status: 500 }
    );
  }
}
