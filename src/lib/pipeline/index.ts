import type { GoalPlan, PipelineEvent, UserContext } from "@/app/types/pipeline";
import type { EventSearchContext } from "@/lib/events/resolveEventGoal";
import goalsData from "@/data/goals.json";
import { parseGoal, type GoalConfig } from "./goalParser";
import { buildPersonalizedPlan } from "./planBuilder";
import { getRankedExperts, goalKeyFromText } from "./experts";
import { findRelevantEvents } from "./eventMatcher";

const allGoals = (goalsData as { goals: Record<string, GoalConfig> }).goals;

/**
 * Plan-only pipeline — no event fetching.
 * Returns a GoalPlan with empty recommended_events so the UI can load fast.
 */
export async function runPipeline(
  goal: string,
  location: string | null,
  userContext?: UserContext
): Promise<GoalPlan> {
  let { goalKey, goalConfig } = parseGoal(goal);

  // Direct mapping: if the user's narrative or specificGoals contains one of
  // the 25 quiz phrases, that always wins over parseGoal's fuzzy match.
  const combinedText = [goal, ...(userContext?.specificGoals ?? [])].join(" ");
  const directKey = goalKeyFromText(combinedText);
  if (directKey && allGoals[directKey]) {
    goalKey = directKey;
    goalConfig = allGoals[directKey];
  }

  const experts = getRankedExperts(goalKey, goalConfig, userContext);
  return buildPersonalizedPlan(goal, goalKey, goalConfig, [], experts, userContext);
}

/**
 * Event-only pipeline — uses curated keyword DB + AI relevance scoring.
 * Called asynchronously from /api/events after the plan is already displayed.
 */
export async function runEventPipeline(
  ctx: EventSearchContext,
  location: string
): Promise<PipelineEvent[]> {
  const { goalConfig } = parseGoal(ctx.goalRaw);
  return findRelevantEvents(ctx, location, goalConfig.category);
}
