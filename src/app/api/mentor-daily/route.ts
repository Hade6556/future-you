import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { rateLimitResponse } from "@/lib/rateLimit";
import type { DailyMentorMessage } from "../../types/pipeline";

interface MentorDailyRequest {
  day: number;
  totalDays: number;
  userName: string;
  archetype: string | null;
  ambitionType: string | null;
  currentStep: {
    title: string;
    description: string;
    success_metric: string;
    duration_weeks: number;
  } | null;
  phaseGoal: string | null;
  phaseName: string | null;
  yesterdayStatus: string | null;
}

const MOCK_RESPONSE: DailyMentorMessage = {
  morningMessage:
    "Today you're tracking everything — every meal, every snack. This is your data foundation; nothing in the next 90 days works without it. Open your tracking app now and log breakfast before anything else.",
  taskTitle: "Track your calories for the full day",
  estimatedMinutes: 15,
  reminderMessage: "Did you get your tracking in today? One tap when done.",
};

const ARCHETYPE_VOICE: Record<string, string> = {
  steady_builder:
    "Warm and encouraging. Emphasise consistency over intensity. Use 'we' language — you're in this together.",
  laser_strategist:
    "Direct, precise, no fluff. Lead with the outcome. Skip the motivation — they already have it.",
  endurance_engine:
    "Gritty and resilient. Acknowledge it's hard. Remind them this is exactly where others quit.",
  creative_spark:
    "Energetic and curious. Frame the task as an experiment or discovery, not a chore.",
  guardian:
    "Grounded and supportive. Focus on sustainability. Remind them why they started.",
  explorer:
    "Adventurous and open. Frame the task as a new frontier. Keep it light.",
};

function buildSystemPrompt(req: MentorDailyRequest): string {
  const voice = req.archetype ? (ARCHETYPE_VOICE[req.archetype] ?? "") : "";
  const yesterdayNote =
    req.yesterdayStatus === "skipped"
      ? "They skipped yesterday. Don't shame them — just bring them back."
      : req.yesterdayStatus === "partial"
        ? "They partially completed yesterday. Acknowledge the effort."
        : req.yesterdayStatus === "done"
          ? "They completed yesterday. Build on that momentum."
          : "";

  return `You are Future Me — a proactive AI mentor who already knows what this person is doing today. You do not ask questions. You do not offer options. You tell them what to do, briefly and specifically.

Archetype voice: ${voice || "Warm, direct, no fluff."}
${yesterdayNote ? `\nContext: ${yesterdayNote}` : ""}

Write a morning mentor message with exactly 3 sentences:
1. State today's task concretely (name the specific action, not the step title).
2. Explain in one sentence why this matters RIGHT NOW in their journey (not generic motivation).
3. End with one specific micro-action they can do in the next 60 seconds to get started.

Rules:
- Never open with "Good morning" or "Hey"
- Never ask how they are
- Never say "today we're going to" — just state the task
- Be specific to their goal domain: ${req.ambitionType ?? "personal growth"}
- Maximum 55 words total

Also return:
- taskTitle: A short 4–7 word task label
- estimatedMinutes: How many minutes this task realistically takes (number)
- reminderMessage: A 1-sentence evening nudge (under 20 words) if they haven't checked in

Return valid JSON only:
{
  "morningMessage": "...",
  "taskTitle": "...",
  "estimatedMinutes": 15,
  "reminderMessage": "..."
}`;
}

function buildUserPrompt(req: MentorDailyRequest): string {
  return `User: ${req.userName || "there"}
Day ${req.day} of ${req.totalDays}
Phase: ${req.phaseName ?? "unknown"}
Phase goal: ${req.phaseGoal ?? "make progress"}
Current step: ${req.currentStep?.title ?? "continue your plan"}
Step description: ${req.currentStep?.description ?? ""}
Success metric: ${req.currentStep?.success_metric ?? ""}`;
}

const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
const anthropic = anthropicApiKey ? new Anthropic({ apiKey: anthropicApiKey }) : null;

export async function POST(request: Request) {
  const limited = rateLimitResponse(request);
  if (limited) return limited;
  try {
    const body = (await request.json()) as MentorDailyRequest;

    if (!anthropic) {
      return NextResponse.json(MOCK_RESPONSE);
    }

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 400,
      system: buildSystemPrompt(body),
      messages: [{ role: "user", content: buildUserPrompt(body) }],
    });

    const text = response.content[0]?.type === "text" ? response.content[0].text : null;
    if (!text) return NextResponse.json(MOCK_RESPONSE);

    try {
      const stripped = text.replace(/```(?:json)?\n?/g, "").trim();
      const parsed = JSON.parse(stripped) as DailyMentorMessage;
      return NextResponse.json(parsed);
    } catch {
      // Claude didn't return clean JSON — wrap text as morning message
      return NextResponse.json({
        ...MOCK_RESPONSE,
        morningMessage: text.slice(0, 300),
      });
    }
  } catch (error) {
    console.error("/api/mentor-daily error", error);
    return NextResponse.json(MOCK_RESPONSE);
  }
}
