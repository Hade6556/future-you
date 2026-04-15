import type { GoalPlan, PipelineEvent, UserContext } from "@/app/types/pipeline";
import type { EventSearchContext } from "@/lib/events/resolveEventGoal";
import { parseGoal } from "./goalParser";
import { buildPersonalizedPlan } from "./planBuilder";
import { getCuratedExperts } from "./experts";
import { findRelevantEvents } from "./eventMatcher";

/**
 * Plan-only pipeline — no event fetching.
 * Returns a GoalPlan with empty recommended_events so the UI can load fast.
 */
export async function runPipeline(
  goal: string,
  location: string | null,
  userContext?: UserContext
): Promise<GoalPlan> {
  const { goalKey, goalConfig } = parseGoal(goal);
  const experts = getCuratedExperts(goalKey);
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
