import type { CheckinStatus } from "../types/pipeline";

// ─── Types ──────────────────────────────────────────────────────────────────

export type DailyScoreEntry = {
  open: number;
  close: number;
  high: number;
  low: number;
  volume: number;
  checkin: number;
  tasks: number;
  journal: number;
  streakBonus: number;
  taskCount: number;
  tasksDone: number;
  mustDoCount: number;
  mustDoDone: number;
};

export type OHLCPoint = {
  open: number;
  close: number;
  high: number;
  low: number;
  vol: number;
  isToday: boolean;
  inStreak: boolean;
};

// ─── Scoring ────────────────────────────────────────────────────────────────

const CHECKIN_POINTS: Record<CheckinStatus, number> = {
  done: 40,
  partial: 20,
  skipped: 5,
  pending: 0,
};

export function computeDailyScore(
  checkinStatus: CheckinStatus,
  tasksDone: number,
  taskCount: number,
  journaledToday: boolean,
  streak: number,
): number {
  const checkin = CHECKIN_POINTS[checkinStatus] ?? 0;
  const tasks = taskCount > 0 ? Math.round((tasksDone / taskCount) * 30) : 0;
  const journal = journaledToday ? 15 : 0;
  const streakBonus = Math.min(15, Math.round(streak * 2.5));
  return Math.min(100, checkin + tasks + journal + streakBonus);
}

// ─── Daily entry management ─────────────────────────────────────────────────

export function recordScoringAction(
  dailyScores: Record<string, DailyScoreEntry>,
  today: string,
  checkinStatus: CheckinStatus,
  tasksDone: number,
  taskCount: number,
  journaledToday: boolean,
  streak: number,
  mustDoDone: number = 0,
  mustDoCount: number = 0,
): { entry: DailyScoreEntry; scores: Record<string, DailyScoreEntry> } {
  const newScore = computeDailyScore(checkinStatus, tasksDone, taskCount, journaledToday, streak);

  // Normalise score to 0–1 for chart
  const normScore = newScore / 100;

  // Get previous day's close for the open value
  const previousClose = getPreviousClose(dailyScores, today);
  const existing = dailyScores[today];

  const entry: DailyScoreEntry = existing
    ? {
        ...existing,
        close: normScore,
        high: Math.max(existing.high, normScore),
        low: Math.min(existing.low, normScore),
        volume: existing.volume + 1,
        checkin: CHECKIN_POINTS[checkinStatus] ?? 0,
        tasks: taskCount > 0 ? Math.round((tasksDone / taskCount) * 30) : 0,
        journal: journaledToday ? 15 : 0,
        streakBonus: Math.min(15, Math.round(streak * 2.5)),
        taskCount,
        tasksDone,
        mustDoCount,
        mustDoDone,
      }
    : {
        open: previousClose,
        close: normScore,
        high: Math.max(previousClose, normScore),
        low: Math.min(previousClose, normScore),
        volume: 1,
        checkin: CHECKIN_POINTS[checkinStatus] ?? 0,
        tasks: taskCount > 0 ? Math.round((tasksDone / taskCount) * 30) : 0,
        journal: journaledToday ? 15 : 0,
        streakBonus: Math.min(15, Math.round(streak * 2.5)),
        taskCount,
        tasksDone,
        mustDoCount,
        mustDoDone,
      };

  return {
    entry,
    scores: { ...dailyScores, [today]: entry },
  };
}

// ─── Chart data builder ─────────────────────────────────────────────────────

/**
 * Build OHLC points forward from `planStartDate` up to today (capped at totalDays).
 * Days beyond today are not included — the chart component draws its own projection.
 */
export function buildChartData(
  dailyScores: Record<string, DailyScoreEntry>,
  planStartDate: string,
  totalDays: number,
): OHLCPoint[] {
  const start = new Date(planStartDate);
  start.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayISO = today.toISOString().slice(0, 10);

  const points: OHLCPoint[] = [];

  for (let i = 0; i < totalDays; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    if (d > today) break;

    const iso = d.toISOString().slice(0, 10);
    const entry = dailyScores[iso];
    const isToday = iso === todayISO;

    if (entry) {
      points.push({
        open: entry.open,
        close: entry.close,
        high: entry.high,
        low: entry.low,
        vol: normalizeVolume(entry.volume),
        isToday,
        inStreak: entry.close >= entry.open,
      });
    } else {
      const prevClose = points.length > 0 ? points[points.length - 1].close : 0;
      points.push({
        open: prevClose,
        close: prevClose,
        high: prevClose,
        low: prevClose,
        vol: 0,
        isToday,
        inStreak: false,
      });
    }
  }

  return points;
}

// ─── Future score (14-day EMA) ──────────────────────────────────────────────

export function computeFutureScore(
  dailyScores: Record<string, DailyScoreEntry>,
  windowDays: number = 14,
): number {
  const today = new Date();
  const closes: number[] = [];

  for (let i = windowDays - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    const entry = dailyScores[iso];
    closes.push(entry ? entry.close * 100 : 0);
  }

  if (closes.length === 0) return 0;

  // EMA: multiplier = 2 / (N + 1)
  const k = 2 / (windowDays + 1);
  let ema = closes[0];
  for (let i = 1; i < closes.length; i++) {
    ema = closes[i] * k + ema * (1 - k);
  }

  return Math.round(Math.min(100, Math.max(0, ema)));
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function getPreviousClose(
  dailyScores: Record<string, DailyScoreEntry>,
  today: string,
): number {
  const d = new Date(today);
  d.setDate(d.getDate() - 1);
  const yesterday = d.toISOString().slice(0, 10);
  return dailyScores[yesterday]?.close ?? 0;
}

function normalizeVolume(rawCount: number): number {
  return Math.min(1, rawCount / 5);
}

// ─── Backfill missed days ───────────────────────────────────────────────────

export function backfillMissedDays(
  dailyScores: Record<string, DailyScoreEntry>,
  lastActiveDate: string | null,
  today: string,
): Record<string, DailyScoreEntry> {
  if (!lastActiveDate) return dailyScores;

  const result = { ...dailyScores };
  const start = new Date(lastActiveDate);
  start.setDate(start.getDate() + 1);
  const end = new Date(today);

  const cursor = new Date(start);
  while (cursor < end) {
    const iso = cursor.toISOString().slice(0, 10);
    if (!result[iso]) {
      const prevClose = getPreviousClose(result, iso);
      result[iso] = {
        open: prevClose,
        close: 0,
        high: prevClose,
        low: 0,
        volume: 0,
        checkin: 0,
        tasks: 0,
        journal: 0,
        streakBonus: 0,
        taskCount: 0,
        tasksDone: 0,
        mustDoCount: 0,
        mustDoDone: 0,
      };
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  return result;
}
