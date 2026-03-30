import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { rateLimitResponse } from "@/lib/rateLimit";
import type { GoalPlan, PipelinePhase } from "@/app/types/pipeline";

type RefreshRequest = {
  plan: GoalPlan;
  progress: {
    currentDay: number;
    tasksCompleted: number;
    totalTasks: number;
    averageEnergy: string;
    journalSentiment: string;
    skippedAreas: string[];
    strongAreas: string[];
  };
};

export async function POST(req: NextRequest) {
  const limited = rateLimitResponse(req);
  if (limited) return limited;

  let body: RefreshRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { plan, progress } = body;
  if (!plan?.phases?.length || !progress) {
    return NextResponse.json({ error: "Missing plan or progress data" }, { status: 400 });
  }

  const completionRate = progress.totalTasks > 0
    ? Math.round((progress.tasksCompleted / progress.totalTasks) * 100)
    : 0;

  // Determine which phases are still upcoming (rough calculation)
  const weeksElapsed = Math.floor(progress.currentDay / 7);
  let accumulatedWeeks = 0;
  const currentPhaseIndex = plan.phases.findIndex((p) => {
    accumulatedWeeks += p.duration_weeks;
    return accumulatedWeeks >= weeksElapsed;
  });

  // Only refresh future phases (don't rewrite completed ones)
  const completedPhases = plan.phases.slice(0, Math.max(0, currentPhaseIndex));
  const phasesToRefresh = plan.phases.slice(Math.max(0, currentPhaseIndex));

  try {
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2048,
      system: `You are a plan optimization engine for an AI life coaching app. Given a user's original plan phases and their progress data, adjust the REMAINING phases to better fit their actual behavior.

Rules:
- Keep the same phase structure (phase_number, phase_name format)
- Adjust step descriptions, durations, and priorities based on the progress data
- If the user is behind, simplify next steps and reduce scope slightly
- If the user is ahead, add stretch goals or accelerate timelines
- If certain areas are consistently skipped, redistribute that time to stronger areas
- Keep the same JSON structure for each phase
- Return ONLY a JSON array of the adjusted phases, no commentary`,
      messages: [
        {
          role: "user",
          content: `## Original remaining phases:
${JSON.stringify(phasesToRefresh, null, 2)}

## User progress:
- Day ${progress.currentDay} of ${plan.horizon_weeks * 7}
- Task completion rate: ${completionRate}%
- Average energy level: ${progress.averageEnergy}
- Journal sentiment: ${progress.journalSentiment}
- Areas they skip: ${progress.skippedAreas.join(", ") || "none"}
- Areas they're strong in: ${progress.strongAreas.join(", ") || "none"}

Adjust the remaining phases based on this progress. Return only the JSON array of adjusted phases.`,
        },
      ],
    });

    const text = (response.content[0] as { type: string; text: string }).text.trim();

    // Parse the adjusted phases
    let adjustedPhases: PipelinePhase[];
    try {
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      adjustedPhases = jsonMatch ? JSON.parse(jsonMatch[0]) : phasesToRefresh;
    } catch {
      adjustedPhases = phasesToRefresh;
    }

    // Merge completed + adjusted phases
    const updatedPlan: GoalPlan = {
      ...plan,
      phases: [...completedPhases, ...adjustedPhases],
    };

    return NextResponse.json({
      plan: updatedPlan,
      adjustedCount: adjustedPhases.length,
      summary: `Adjusted ${adjustedPhases.length} phase(s) based on ${completionRate}% completion rate.`,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Plan refresh failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
