/**
 * Calm, adult-facing streak copy — consistency framing, no arcade metaphors.
 */

export type StreakRiskTier = "none" | "warning" | "urgent" | "critical";

/** StreakCard subline under the day count */
export function streakCardConsistencyLine(streak: number): string {
  if (streak >= 30) return "One month consistent";
  if (streak >= 14) return "Two weeks in a row";
  if (streak >= 7) return "Solid week behind you";
  if (streak >= 4) return "Building a rhythm";
  if (streak >= 1) return "Keep showing up";
  return "Start today";
}

/** StreakChain status under the number */
export function streakChainStatusLine(streak: number, atRisk: boolean): string {
  if (atRisk) return "Finish today before midnight";
  if (streak >= 30) return "30 days consistent";
  if (streak >= 21) return "Three weeks steady";
  if (streak >= 14) return "Two weeks steady";
  if (streak >= 7) return "One week steady";
  if (streak >= 3) return "Building momentum";
  if (streak === 0) return "Your run starts today";
  return "Building consistency";
}

export function streakRiskUrgencyLine(
  tier: Exclude<StreakRiskTier, "none">,
  hoursUntilMidnight: number,
): string {
  if (tier === "critical") return "Less than an hour to check in";
  if (tier === "urgent") return `${hoursUntilMidnight}h left to complete today`;
  return "Complete today’s check-in before midnight";
}

/** Tooltip / aria for earned passes */
export function gracePassLabel(count: number): string {
  return count === 1 ? "1 grace pass (covers a missed day)" : `${count} grace passes (cover missed days)`;
}

/** Short label for compact UI */
export function gracePassShort(count: number): string {
  return count === 1 ? "1 pass" : `${count} passes`;
}

export function streakNextCheckpointLine(streak: number, nextDay: number): string {
  const d = nextDay - streak;
  const days = d === 1 ? "day" : "days";
  if (nextDay === 7) return `${d} ${days} until your first grace pass`;
  return `${d} ${days} until day ${nextDay}`;
}

export function streakChainThirtyCompleteLine(): string {
  return "30 days — strong consistency";
}

export function streakWeekMilestoneMessage(streak: number): string | null {
  if (streak === 7) return "Seven consecutive days.";
  if (streak === 30) return "Thirty days of consistency.";
  return null;
}

export function streakMomentumContextLine(streak: number, bestStreak: number): string {
  if (streak <= 0) return "Log today to start counting.";
  if (bestStreak <= 0) return "Build your longest run.";
  if (streak >= bestStreak) return "Your longest run so far.";
  const gap = bestStreak - streak;
  if (gap <= 5) {
    return `${gap} day${gap === 1 ? "" : "s"} from your best (${bestStreak} days).`;
  }
  return `Best run: ${bestStreak} days`;
}

export function milestoneCardGracePassLine(gap: number, next: number): string {
  return `${gap} day${gap === 1 ? "" : "s"} until a grace pass at day ${next}`;
}

export function streakCardPersonalBestLine(isCurrentBest: boolean, bestVal: number): string {
  return isCurrentBest ? "Longest run so far" : `Best run: ${bestVal} days`;
}
