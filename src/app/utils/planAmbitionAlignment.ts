import type { GoalPlan } from "../types/pipeline";
import type { AmbitionDomain } from "../types/plan";
import { AMBITION_GOAL_MAP } from "../types/pipeline";
import { parseGoal } from "@/lib/pipeline/goalParser";

/** Expected Stripe / pipeline goal_key for this ambition (from goals.json via parseGoal). */
export function expectedGoalKeyForAmbition(ambition: AmbitionDomain | null): string | null {
  if (!ambition) return null;
  const phrase = AMBITION_GOAL_MAP[ambition];
  if (!phrase) return null;
  try {
    return parseGoal(phrase).goalKey;
  } catch {
    return null;
  }
}

/** True when the stored 90-day plan matches the user's selected ambition domain. */
export function planMatchesAmbition(plan: GoalPlan | null, ambition: AmbitionDomain | null): boolean {
  if (!plan || !ambition) return true;
  const expected = expectedGoalKeyForAmbition(ambition);
  if (!expected) return true;
  return plan.goal_key === expected;
}
