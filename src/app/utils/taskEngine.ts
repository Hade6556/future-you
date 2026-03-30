import type { DailyScoreEntry } from "./scoreEngine";
import type { EnergyLevel, TimeAvailable } from "../types/pipeline";

// ─── Completion rate (last N days) ──────────────────────────────────────────

export function computeCompletionRate7d(
  dailyScores: Record<string, DailyScoreEntry>,
): number {
  const today = new Date();
  let totalTasks = 0;
  let doneTasks = 0;

  for (let i = 1; i <= 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    const entry = dailyScores[iso];
    if (entry && entry.taskCount > 0) {
      totalTasks += entry.taskCount;
      doneTasks += entry.tasksDone;
    }
  }

  return totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 50;
}

// ─── Must-do completion rate (last 7 days) ──────────────────────────────────

export function computeMustDoCompletionRate7d(
  dailyScores: Record<string, DailyScoreEntry>,
): number {
  const today = new Date();
  let totalMustDo = 0;
  let doneMustDo = 0;

  for (let i = 1; i <= 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    const entry = dailyScores[iso];
    if (entry && (entry.mustDoCount ?? 0) > 0) {
      totalMustDo += entry.mustDoCount ?? 0;
      doneMustDo += entry.mustDoDone ?? 0;
    }
  }

  return totalMustDo > 0 ? Math.round((doneMustDo / totalMustDo) * 100) : 75;
}

// ─── Average daily score (last 7 days) ──────────────────────────────────────

export function computeAvgScore7d(
  dailyScores: Record<string, DailyScoreEntry>,
): number {
  const today = new Date();
  let sum = 0;
  let count = 0;

  for (let i = 1; i <= 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    const entry = dailyScores[iso];
    if (entry) {
      sum += entry.close * 100;
      count++;
    }
  }

  return count > 0 ? Math.round(sum / count) : 0;
}

// ─── Missed task patterns ───────────────────────────────────────────────────

export function detectMissedPatterns(
  taskHistory: Record<string, boolean>,
): string[] {
  const labelCounts: Record<string, { total: number; skipped: number }> = {};

  for (const [key, done] of Object.entries(taskHistory)) {
    // Keys look like "2026-03-26:taskId" — we only care about label patterns
    const parts = key.split(":");
    if (parts.length < 2) continue;
    const label = parts.slice(1).join(":");
    if (!labelCounts[label]) labelCounts[label] = { total: 0, skipped: 0 };
    labelCounts[label].total++;
    if (!done) labelCounts[label].skipped++;
  }

  return Object.entries(labelCounts)
    .filter(([, counts]) => counts.total >= 3 && counts.skipped / counts.total > 0.6)
    .map(([label]) => label);
}

// ─── Day of week ────────────────────────────────────────────────────────────

const DAY_NAMES = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

export function getDayOfWeek(): string {
  return DAY_NAMES[new Date().getDay()];
}

export function getDayOfWeekNumber(): number {
  const d = new Date().getDay();
  return d === 0 ? 7 : d; // 1=Mon ... 7=Sun
}

// ─── Task count calibration ─────────────────────────────────────────────────

export function getMaxTasks(energy: EnergyLevel, timeAvailable: TimeAvailable): number {
  if (energy === "low") return 2;
  if (timeAvailable <= 15) return 2;
  if (timeAvailable <= 30) return 3;
  if (energy === "high" && timeAvailable >= 120) return 5;
  return 4;
}

export function getMaxMinutes(timeAvailable: TimeAvailable): number {
  return timeAvailable;
}

// ─── Auto checkin status from task completion ───────────────────────────────

export function deriveCheckinStatus(
  mustDoTotal: number,
  mustDoDone: number,
  totalDone: number,
): "done" | "partial" | "pending" {
  if (mustDoTotal === 0) return totalDone > 0 ? "done" : "pending";
  if (mustDoDone >= mustDoTotal) return "done";
  if (mustDoDone > 0 || totalDone > 0) return "partial";
  return "pending";
}
