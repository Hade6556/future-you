import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { rateLimitResponse } from "@/lib/rateLimit";
import { requireAuth } from "@/lib/auth";
import type { GeneratedTask, PipelineStep } from "../../../types/pipeline";

interface SwapRequest {
  taskToReplace: GeneratedTask;
  currentStep: PipelineStep | null;
  ambitionType: string | null;
  energy: string;
  timeAvailable: number;
}

const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
const anthropic = anthropicApiKey ? new Anthropic({ apiKey: anthropicApiKey }) : null;

export async function POST(request: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const limited = rateLimitResponse(request);
  if (limited) return limited;

  try {
    const body = (await request.json()) as SwapRequest;

    if (!anthropic) {
      return NextResponse.json({
        replacement: {
          ...body.taskToReplace,
          label: "Alternative: " + body.taskToReplace.label,
          description: "An alternative approach to the same goal.",
        },
      });
    }

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 400,
      messages: [
        {
          role: "user",
          content: `The user wants to swap this daily task for an alternative:

Current task: "${body.taskToReplace.label}" (${body.taskToReplace.estimatedMinutes} min, category: ${body.taskToReplace.category}, priority: ${body.taskToReplace.priority})
Plan step context: ${body.currentStep?.title ?? "general progress"} — ${body.currentStep?.description ?? ""}
Goal domain: ${body.ambitionType ?? "personal growth"}
Energy: ${body.energy}, Time: ${body.timeAvailable} min

Generate ONE alternative task that:
1. Serves the same purpose/priority but with a different approach
2. Stays within the same time estimate
3. Is equally specific and actionable

Return JSON only:
{
  "label": "5-10 word task label",
  "description": "1-2 sentence explanation",
  "estimatedMinutes": ${body.taskToReplace.estimatedMinutes}
}`,
        },
      ],
    });

    const text = response.content[0]?.type === "text" ? response.content[0].text : null;
    if (!text) {
      return NextResponse.json({
        replacement: { ...body.taskToReplace, label: "Alternative: " + body.taskToReplace.label },
      });
    }

    try {
      const stripped = text.replace(/```(?:json)?\n?/g, "").trim();
      const parsed = JSON.parse(stripped) as { label: string; description: string; estimatedMinutes: number };
      return NextResponse.json({
        replacement: {
          ...body.taskToReplace,
          label: parsed.label,
          description: parsed.description,
          estimatedMinutes: parsed.estimatedMinutes ?? body.taskToReplace.estimatedMinutes,
        },
      });
    } catch {
      return NextResponse.json({
        replacement: { ...body.taskToReplace, label: "Alternative: " + body.taskToReplace.label },
      });
    }
  } catch (error) {
    console.error("/api/daily-tasks/swap error", error);
    return NextResponse.json({ error: "Failed to swap" }, { status: 500 });
  }
}
