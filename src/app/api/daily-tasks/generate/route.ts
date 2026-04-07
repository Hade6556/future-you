import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { rateLimitResponse } from "@/lib/rateLimit";
import { requireAuth } from "@/lib/auth";
import type { DailyTasksRequest, DailyTasksResponse, GeneratedTask } from "../../../types/pipeline";

export const maxDuration = 30;

const ARCHETYPE_VOICE: Record<string, string> = {
  steady:
    "Warm and grounding. Frame tasks as building blocks. Use 'we' language.",
  strategist:
    "Direct and precise. Lead with the outcome. No fluff — they want the plan.",
  endurance:
    "Gritty and resilient. Acknowledge the grind. Remind them this is where others quit.",
  creative:
    "Energetic and curious. Frame tasks as experiments or discoveries.",
  guardian:
    "Grounded and structured. Focus on protecting progress. Clear expectations.",
  explorer:
    "Adventurous and playful. Frame tasks as new frontiers to discover.",
};

function buildSystemPrompt(req: DailyTasksRequest): string {
  const voice = req.archetype ? (ARCHETYPE_VOICE[req.archetype] ?? "") : "";

  const maxTasks = req.energy === "low" ? 2 : req.timeAvailable <= 30 ? 3 : req.energy === "high" && req.timeAvailable >= 120 ? 5 : 4;
  const totalMinutesCap = req.timeAvailable;

  const adaptationHints: string[] = [];
  if (req.energy === "low") adaptationHints.push("User has LOW energy today. Keep tasks short and manageable. Include 1 wellbeing task.");
  if (req.completionRate7d < 50) adaptationHints.push("Completion rate is below 50% this week. Reduce difficulty. Make tasks feel achievable.");
  if (req.lastJournalSentiment === "negative") adaptationHints.push("Last journal was negative sentiment. Include a wellbeing/self-care task. Be supportive.");
  if (req.streak > 7) adaptationHints.push(`${req.streak}-day streak. They're in flow. Push slightly harder — add a bonus task if time allows.`);
  if (["saturday", "sunday"].includes(req.dayOfWeek)) adaptationHints.push("It's the weekend. Default to lighter tasks unless user chose high energy.");
  if (req.missedTaskPatterns.length > 0) adaptationHints.push(`User often skips these task types: ${req.missedTaskPatterns.join(", ")}. Avoid or reframe them.`);

  const recurringSection = req.recurringTasks.length > 0
    ? `\nUser has these recurring tasks that MUST be included:\n${req.recurringTasks.map((t) => `- "${t.label}" (~${t.estimatedMinutes} min)`).join("\n")}`
    : "";

  return `You are Behavio — an AI daily task generator for a personal development app. You create specific, actionable daily tasks that are directly tied to the user's 90-day plan.

Archetype voice: ${voice || "Warm, direct, no fluff."}

CURRENT PLAN CONTEXT:
- Day ${req.day} of ${req.totalDays} (${Math.round(req.overallProgress * 100)}% through the plan)
- Phase: ${req.currentPhase?.phase_name ?? "unknown"} — "${req.currentPhase?.goal ?? "make progress"}"
- Current step: "${req.currentStep?.title ?? "continue your plan"}"
- Step description: ${req.currentStep?.description ?? "No description"}
- Success metric: ${req.currentStep?.success_metric ?? "Make progress"}
- Step resources: ${req.currentStep?.resources?.join(", ") || "None specified"}
${req.nextStep ? `- Next step coming: "${req.nextStep.title}"` : "- This is the final step."}

USER CONTEXT:
- Name: ${req.userName || "there"}
- Goal domain: ${req.ambitionType ?? "personal growth"}
- Energy today: ${req.energy}
- Time available: ${req.timeAvailable} minutes
${req.focusArea ? `- Focus area today: ${req.focusArea}` : ""}
- Streak: ${req.streak} days
- 7-day completion rate: ${req.completionRate7d}%
- 7-day avg score: ${req.avgDailyScore7d}/100
- Day: ${req.dayOfWeek}

${adaptationHints.length > 0 ? "ADAPTATIONS:\n" + adaptationHints.map((h) => `- ${h}`).join("\n") : ""}
${recurringSection}

TASK GENERATION RULES:
1. Generate ${maxTasks} tasks max. Total estimated time must not exceed ${totalMinutesCap} minutes.
2. Tasks MUST be specific and actionable — never say "work on your goal" or "make progress".
3. Break the current plan step into a concrete daily action. Reference specific tools, numbers, or deliverables from the step description.
4. Time-box every task (e.g., "30-min deep work on X", not just "Do X").
5. Every task needs a clear done/not-done criteria.

PRIORITY RULES:
- "must-do": 1-2 tasks directly from the current plan step. These are the core needle-movers.
- "should-do": 1 supporting habit or practice task that reinforces the plan.
- "bonus": 0-1 stretch tasks, only when energy is high and time allows.

CATEGORY RULES:
- "plan": Tasks derived from the current plan step/phase
- "habit": Regular supporting habits (nutrition tracking, exercise, reading, etc.)
- "wellbeing": Self-care, rest, mindfulness (include when energy is low or sentiment is negative)
- "custom": Never generate these — only the user adds custom tasks

Return valid JSON only:
{
  "tasks": [
    {
      "id": "gen-1",
      "label": "Short actionable label (5-10 words)",
      "description": "1-2 sentences explaining WHY this matters today specifically",
      "category": "plan|habit|wellbeing",
      "estimatedMinutes": 15,
      "priority": "must-do|should-do|bonus",
      "intensity": "routine|challenging|stretch",
      "planStepRef": ${req.currentStep?.step_number ?? "null"},
      "source": "ai",
      "completed": false,
      "deferred": false
    }
  ],
  "dayMessage": "1-2 sentence motivational context for the day (max 40 words). Reference where they are in the plan.",
  "adaptationNote": "Short note if tasks were adapted (e.g., 'Lighter day — your energy is low') or null"
}`;
}

const MOCK_RESPONSE: DailyTasksResponse = {
  tasks: [
    {
      id: "gen-1",
      label: "Complete today's plan action",
      description: "Your plan step needs daily progress. Focus on the core action for 30 minutes.",
      category: "plan",
      estimatedMinutes: 30,
      priority: "must-do",
      intensity: "challenging",
      planStepRef: 1,
      source: "ai",
      completed: false,
      deferred: false,
    },
    {
      id: "gen-2",
      label: "Review and reflect on progress",
      description: "Take 10 minutes to review what you've accomplished and plan tomorrow.",
      category: "habit",
      estimatedMinutes: 10,
      priority: "should-do",
      intensity: "routine",
      planStepRef: null,
      source: "ai",
      completed: false,
      deferred: false,
    },
  ],
  dayMessage: "Day by day, step by step. Focus on what matters most right now.",
  adaptationNote: null,
};

const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
const anthropic = anthropicApiKey ? new Anthropic({ apiKey: anthropicApiKey }) : null;

export async function POST(request: Request) {
  const auth = await requireAuth();
  if (auth.error) {
    // Fall back to mock tasks instead of blocking the user
    console.warn("/api/daily-tasks/generate: auth failed, returning mock tasks");
    return NextResponse.json(MOCK_RESPONSE);
  }

  const limited = rateLimitResponse(request);
  if (limited) return limited;

  try {
    const body = (await request.json()) as DailyTasksRequest;

    if (!anthropic) {
      return NextResponse.json(MOCK_RESPONSE);
    }

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1200,
      system: buildSystemPrompt(body),
      messages: [
        {
          role: "user",
          content: `Generate today's tasks for ${body.userName || "the user"}. Day ${body.day}, energy: ${body.energy}, time: ${body.timeAvailable}min${body.focusArea ? `, focus: ${body.focusArea}` : ""}.`,
        },
      ],
    });

    const text = response.content[0]?.type === "text" ? response.content[0].text : null;
    if (!text) return NextResponse.json(MOCK_RESPONSE);

    try {
      const stripped = text.replace(/```(?:json)?\n?/g, "").trim();
      const parsed = JSON.parse(stripped) as DailyTasksResponse;

      // Validate and sanitize
      if (!Array.isArray(parsed.tasks) || parsed.tasks.length === 0) {
        return NextResponse.json(MOCK_RESPONSE);
      }

      // Ensure all tasks have required fields
      const sanitized: GeneratedTask[] = parsed.tasks.map((t, i) => ({
        id: t.id || `gen-${i + 1}`,
        label: t.label || "Complete today's task",
        description: t.description || "",
        category: (["plan", "habit", "wellbeing", "custom"].includes(t.category) ? t.category : "plan") as GeneratedTask["category"],
        estimatedMinutes: typeof t.estimatedMinutes === "number" ? t.estimatedMinutes : 15,
        priority: (["must-do", "should-do", "bonus"].includes(t.priority) ? t.priority : "should-do") as GeneratedTask["priority"],
        intensity: (["routine", "challenging", "stretch"].includes(t.intensity)
          ? t.intensity
          : "routine") as GeneratedTask["intensity"],
        planStepRef: t.planStepRef ?? null,
        source: "ai" as const,
        completed: false,
        deferred: false,
      }));

      // Inject recurring tasks
      if (body.recurringTasks.length > 0) {
        for (const rt of body.recurringTasks) {
          sanitized.push({
            id: `recurring-${rt.id}`,
            label: rt.label,
            description: "Your recurring daily task.",
            category: "habit",
            estimatedMinutes: rt.estimatedMinutes,
            priority: "should-do",
            intensity: "routine",
            planStepRef: null,
            source: "recurring",
            completed: false,
            deferred: false,
          });
        }
      }

      return NextResponse.json({
        tasks: sanitized,
        dayMessage: parsed.dayMessage || MOCK_RESPONSE.dayMessage,
        adaptationNote: parsed.adaptationNote ?? null,
      });
    } catch {
      return NextResponse.json(MOCK_RESPONSE);
    }
  } catch (error) {
    console.error("/api/daily-tasks/generate error", error);
    return NextResponse.json(MOCK_RESPONSE);
  }
}
