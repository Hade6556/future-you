import { create } from "zustand";
import type { AmbitionDomain, ArchetypeId } from "../types/plan";
import type { CheckinStatus, GoalPlan, PipelineStatus, PipelineStep, GeneratedTask, RecurringTask, EnergyLevel, TimeAvailable, ChallengeLevel } from "../types/pipeline";
import type { DailyScoreEntry } from "../utils/scoreEngine";
import { recordScoringAction, computeFutureScore, backfillMissedDays } from "../utils/scoreEngine";

const PIPELINE_SESSION_KEY = "behavio-pipeline";
const OLD_PIPELINE_SESSION_KEY = "future-you-pipeline";

const STORAGE_KEY = "behavio-plan-state";
const OLD_STORAGE_KEY = "future-you-plan-state";

function migrateStorageKey(oldKey: string, newKey: string) {
  if (typeof window === "undefined") return;
  try {
    if (!localStorage.getItem(newKey) && localStorage.getItem(oldKey)) {
      localStorage.setItem(newKey, localStorage.getItem(oldKey)!);
      localStorage.removeItem(oldKey);
    }
  } catch { /* ignore */ }
}

if (typeof window !== "undefined") {
  migrateStorageKey(OLD_PIPELINE_SESSION_KEY, PIPELINE_SESSION_KEY);
  migrateStorageKey(OLD_STORAGE_KEY, STORAGE_KEY);
}

function getStoredPipelinePlan(): GoalPlan | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PIPELINE_SESSION_KEY);
    return raw ? (JSON.parse(raw) as GoalPlan) : null;
  } catch {
    return null;
  }
}

function storePipelinePlan(plan: GoalPlan) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PIPELINE_SESSION_KEY, JSON.stringify(plan));
  } catch {
    // ignore quota errors
  }
}

export type DailyStatus = "align" | "act" | "reflect" | "complete";

export type AmbitionCategory = {
  label: string;
  shortLabel: string;
  pct: number;
  prevPct: number;
};

export type MentalHealthFields = {
  moodRating: number | null;
  hasSupportSystem: boolean | null;
  energyLevel: string | null;
  sleepQuality: string | null;
  dailyRoutine: string | null;
  stressLevel: number | null;
  expressionText: string | null;
  // Quiz funnel fields
  quizPrimaryGoal: string | null;
  quizPastAttempts: string | null;
  quizCurrentState: string | null;
  quizVision: string | null;
  // Expanded quiz funnel fields
  quizAgeGroup: string | null;
  quizDream: string | null;
  quizSecondaryGoal: string | null;
  quizLifePhase: string | null;
  quizAccountability: string | null;
  quizSuccessDefinition: string | null;
  multiSelectAnswers: Record<string, string[]>;
};

type Persisted = {
  streak: number;
  futureScore: number;
  planId: string | null;
  dogArchetype: ArchetypeId | null;
  ambitionType: AmbitionDomain | null;
  quizComplete: boolean;
  email: string;
  onboardingComplete: boolean;
  isPremium: boolean;
  paywallSeen: boolean;
  trialStartedAt: string | null;
  quizGender: string | null;
  userName: string;
  location: string;
  /** ISO date (e.g. "2026-02-25") when user last completed the daily brief. */
  lastCompletedDate: string | null;
  /** ISO date when we showed "You missed yesterday"; used to show banner once per reset. */
  streakLostShownForDate: string | null;
  /** All-time highest streak count. */
  bestStreak: number;
  /** Earned shields that protect the streak from resetting once. */
  streakShields: number;
  /** Quiz context for plan personalization */
  quizTimeline: string | null;
  quizCommitment: string | null;
  quizSchedule: string | null;
  quizObstacles: string[];
  activeStepIndex: number;
  /** ISO date when the user's plan started (set once when plan is first generated). */
  planStartDate: string | null;
  /** Mentor check-in status for today. Resets each day. */
  todayStatus: CheckinStatus;
  /** ISO date the todayStatus was last set — used to detect midnight rollover. */
  todayStatusDate: string | null;
  /** AI coaching memory */
  lastReflection: string | null;
  chatHistory: Array<{ role: "user" | "assistant"; content: string }>;
  taskHistory: Record<string, boolean>;
  googleCalendarConnected: boolean;
  ambitionCategories: AmbitionCategory[];
  /** Whether the one-time post-onboarding app tour has been dismissed. */
  appTourSeen: boolean;
  /** Weekly completion tracker — keys are ISO dates (e.g. "2026-03-20"), value true = completed */
  weeklyCompletions: Record<string, boolean>;
  /** All-time best weekly completion count (max 7). */
  weeklyBest: number;
  /** ISO date of the last daily gift revealed (prevents double-reveal same day). */
  lastGiftDate: string | null;
  /** Type key of the last gift revealed. */
  lastGiftType: string | null;
  /** True when the streak just reset from > 0; shows Phoenix comeback screen. */
  phoenixDay: boolean;
  /** Streak value before the reset, shown as a ghost chain on the Phoenix screen. */
  phoenixPriorStreak: number;
  /** ISO date the streak expired; used for 48-hour auto-clear of phoenix state. */
  streakExpiredAt: string | null;
  /** Historical daily score data. Key = ISO date string. */
  dailyScores: Record<string, DailyScoreEntry>;
  /** ISO dates on which user submitted a journal entry. */
  journalDates: Record<string, boolean>;

  // ─── Daily tasks system ─────────────────────────────────────────────────
  /** Morning energy check-in for today. */
  morningEnergy: EnergyLevel | null;
  /** Morning time available check-in for today. */
  morningTimeAvailable: TimeAvailable | null;
  /** Morning focus area check-in for today. */
  morningFocus: string | null;
  /** Morning challenge level check-in for today. */
  morningChallengeLevel: ChallengeLevel | null;
  /** ISO date of last morning check-in (reset daily). */
  morningCheckinDate: string | null;
  /** Today's generated tasks. */
  todayTasks: GeneratedTask[];
  /** ISO date when todayTasks were generated. */
  todayTasksDate: string | null;
  /** User-defined recurring tasks. */
  recurringTasks: RecurringTask[];
  /** Day message from AI task generation. */
  todayDayMessage: string | null;
  /** Adaptation note from AI (e.g., "Lighter day"). */
  todayAdaptationNote: string | null;
  /** ISO date when the plan was last refreshed by the weekly cron. */
  planLastRefreshedAt: string | null;
  /** Summary of what changed in the last plan refresh. */
  planRefreshSummary: string | null;
  /** Whether the user has dismissed the plan refresh notification. */
  planRefreshSeen: boolean;
  /** Mental health / wellness assessment from onboarding quiz */
} & MentalHealthFields;

function getDefaultPersisted(): Persisted {
  return {
    streak: 0,
    futureScore: 0,
    planId: null,
    dogArchetype: null,
    ambitionType: null,
    quizComplete: false,
    email: "",
    onboardingComplete: false,
    isPremium: false,
    paywallSeen: false,
    trialStartedAt: null,
    quizGender: null,
    userName: "",
    location: "",
    lastCompletedDate: null,
    streakLostShownForDate: null,
    bestStreak: 0,
    streakShields: 0,
    quizTimeline: null,
    quizCommitment: null,
    quizSchedule: null,
    quizObstacles: [],
    activeStepIndex: 0,
    planStartDate: null,
    todayStatus: "pending",
    todayStatusDate: null,
    lastReflection: null,
    chatHistory: [],
    taskHistory: {},
    googleCalendarConnected: false,
    ambitionCategories: [],
    appTourSeen: false,
    weeklyCompletions: {},
    weeklyBest: 0,
    lastGiftDate: null,
    lastGiftType: null,
    phoenixDay: false,
    phoenixPriorStreak: 0,
    streakExpiredAt: null,
    // Mental health assessment
    moodRating: null,
    hasSupportSystem: null,
    energyLevel: null,
    sleepQuality: null,
    dailyRoutine: null,
    stressLevel: null,
    expressionText: null,
    quizPrimaryGoal: null,
    quizPastAttempts: null,
    quizCurrentState: null,
    quizVision: null,
    quizAgeGroup: null,
    quizDream: null,
    quizSecondaryGoal: null,
    quizLifePhase: null,
    quizAccountability: null,
    quizSuccessDefinition: null,
    multiSelectAnswers: {},
    dailyScores: {},
    journalDates: {},
    morningEnergy: null,
    morningTimeAvailable: null,
    morningFocus: null,
    morningChallengeLevel: null,
    morningCheckinDate: null,
    todayTasks: [],
    todayTasksDate: null,
    recurringTasks: [],
    todayDayMessage: null,
    todayAdaptationNote: null,
    planLastRefreshedAt: null,
    planRefreshSummary: null,
    planRefreshSeen: false,
  };
}

/** Format a Date as YYYY-MM-DD in the user's local timezone (NOT UTC). */
function localDateISO(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function todayISO(): string {
  return localDateISO(new Date());
}

/** Returns the Monday–Sunday bounds for the current calendar week as ISO date strings. */
function getCurrentWeekBounds(): { monday: string; sunday: string } {
  const now = new Date();
  const day = now.getDay(); // 0=Sun, 1=Mon … 6=Sat
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return {
    monday: localDateISO(monday),
    sunday: localDateISO(sunday),
  };
}

/** Count how many ISO-date keys in the record fall within the current week and are true. */
export function countWeekCompletions(completions: Record<string, boolean>): number {
  const { monday, sunday } = getCurrentWeekBounds();
  return Object.entries(completions).filter(([date, done]) => done && date >= monday && date <= sunday).length;
}

/** Return the ISO dates Mon–Sun of the current week. */
export function getCurrentWeekDates(): string[] {
  const { monday } = getCurrentWeekBounds();
  const base = new Date(monday);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    return localDateISO(d);
  });
}

function yesterdayISO(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return localDateISO(d);
}

/** Apply streak reset and daily todayStatus reset on load; pure, no side effects. */
function applyStreakResetOnLoad(p: Persisted): Persisted {
  const today = todayISO();
  let result = { ...p };
  // Reset streak if last completed was before yesterday
  if (p.lastCompletedDate) {
    const yesterday = yesterdayISO();
    if (p.lastCompletedDate < yesterday) {
      if ((p.streakShields ?? 0) > 0) {
        // Shield absorbs the missed day — preserve streak, consume one shield
        result = { ...result, streakShields: p.streakShields - 1, lastCompletedDate: yesterday };
      } else {
        // Streak breaks — enter Phoenix mode if streak was > 0
        const priorStreak = p.streak ?? 0;
        result = {
          ...result,
          streak: 0,
          streakLostShownForDate: today,
          phoenixDay: priorStreak > 0,
          phoenixPriorStreak: priorStreak > 0 ? priorStreak : (p.phoenixPriorStreak ?? 0),
          streakExpiredAt: priorStreak > 0 ? today : (p.streakExpiredAt ?? null),
        };
      }
    }
  }
  // Auto-clear phoenix state after 48 hours
  if (result.phoenixDay && result.streakExpiredAt) {
    const expiredMs = new Date(result.streakExpiredAt).getTime();
    if (Date.now() - expiredMs > 48 * 60 * 60 * 1000) {
      result = { ...result, phoenixDay: false, phoenixPriorStreak: 0, streakExpiredAt: null };
    }
  }
  // Reset todayStatus if it was set on a different day
  if (p.todayStatusDate && p.todayStatusDate !== today) {
    result = { ...result, todayStatus: "pending", todayStatusDate: null };
  }
  // Backfill missed days in dailyScores with flat zero candles
  if (result.dailyScores && p.lastCompletedDate) {
    result = {
      ...result,
      dailyScores: backfillMissedDays(result.dailyScores ?? {}, p.lastCompletedDate, today),
    };
  }
  return result;
}

function getPersisted(): Persisted {
  if (typeof window === "undefined") return getDefaultPersisted();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultPersisted();
    return { ...getDefaultPersisted(), ...JSON.parse(raw) };
  } catch {
    return getDefaultPersisted();
  }
}

function setPersisted(partial: Partial<Persisted>) {
  if (typeof window === "undefined") return;
  try {
    const next = { ...getPersisted(), ...partial };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
}

type PlanState = {
  identityComplete: boolean;
  planReady: boolean;
  planId: string | null;
  dailyStatus: DailyStatus;
  streak: number;
  futureScore: number;
  acceptedPlanAt: string | null;
  homeAssistantOpen: boolean;
  userName: string;
  dogArchetype: ArchetypeId | null;
  ambitionType: AmbitionDomain | null;
  quizComplete: boolean;
  email: string;
  onboardingComplete: boolean;
  isPremium: boolean;
  paywallSeen: boolean;
  trialStartedAt: string | null;
  quizGender: string | null;
  location: string;
  lastCompletedDate: string | null;
  streakLostShownForDate: string | null;
  quizTimeline: string | null;
  quizCommitment: string | null;
  quizSchedule: string | null;
  quizObstacles: string[];
  activeStepIndex: number;
  planStartDate: string | null;
  todayStatus: CheckinStatus;
  todayStatusDate: string | null;
  lastReflection: string | null;
  chatHistory: Array<{ role: "user" | "assistant"; content: string }>;
  taskHistory: Record<string, boolean>;
  ambitionCategories: AmbitionCategory[];

  // Mental health assessment fields
  moodRating: number | null;
  hasSupportSystem: boolean | null;
  energyLevel: string | null;
  sleepQuality: string | null;
  dailyRoutine: string | null;
  stressLevel: number | null;
  expressionText: string | null;
  quizPrimaryGoal: string | null;
  quizPastAttempts: string | null;
  quizCurrentState: string | null;
  quizVision: string | null;
  quizAgeGroup: string | null;
  quizDream: string | null;
  quizSecondaryGoal: string | null;
  quizLifePhase: string | null;
  quizAccountability: string | null;
  quizSuccessDefinition: string | null;

  bestStreak: number;
  streakShields: number;

  setIdentityComplete: (v: boolean) => void;
  setPlanReady: (planId: string) => void;
  setDailyStatus: (s: DailyStatus) => void;
  incrementStreak: () => void;
  /** Use a shield to protect the streak on a partial check-in. Returns true if a shield was consumed. */
  useStreakShield: () => boolean;
  setFutureScore: (score: number) => void;
  acceptPlan: () => void;
  setHomeAssistantOpen: (v: boolean) => void;
  setUserName: (name: string) => void;
  setArchetype: (id: ArchetypeId) => void;
  setAmbitionType: (t: AmbitionDomain) => void;
  completeQuiz: (archetype: ArchetypeId, ambition: AmbitionDomain) => void;
  setEmail: (email: string) => void;
  setGender: (g: string) => void;
  setLocation: (loc: string) => void;
  setQuizContext: (ctx: { timeline?: string; commitment?: string; schedule?: string; obstacles?: string[] }) => void;
  incrementActiveStep: () => void;
  getCurrentStep: () => PipelineStep | null;
  completeOnboarding: () => void;
  startTrial: () => void;
  setPremium: () => void;
  setPaywallSeen: () => void;
  setAppTourSeen: () => void;
  appTourSeen: boolean;
  resetForDemo: () => void;
  setLastReflection: (text: string) => void;
  setChatHistory: (history: Array<{ role: "user" | "assistant"; content: string }>) => void;
  setTaskCompletion: (key: string, done: boolean) => void;
  setAmbitionCategories: (cats: AmbitionCategory[]) => void;
  setPlanStartDate: (date: string) => void;
  setTodayStatus: (status: CheckinStatus) => void;

  // Pipeline (Behavio workflow) state — not persisted to localStorage
  pipelinePlan: GoalPlan | null;
  pipelineStatus: PipelineStatus;
  setPipelinePlan: (plan: GoalPlan) => void;
  setPipelineStatus: (s: PipelineStatus) => void;

  // Google Calendar
  googleCalendarConnected: boolean;
  setGoogleCalendarConnected: (v: boolean) => void;
  setMentalHealthData: (data: Partial<MentalHealthFields>) => void;

  // Weekly tracking & daily gift
  weeklyCompletions: Record<string, boolean>;
  weeklyBest: number;
  lastGiftDate: string | null;
  lastGiftType: string | null;
  setGiftRevealed: (giftType: string) => void;

  // Multi-select quiz answers (keyed by screen id)
  multiSelectAnswers: Record<string, string[]>;
  setMultiSelectAnswer: (screenId: string, labels: string[]) => void;

  // Phoenix comeback mechanic
  phoenixDay: boolean;
  phoenixPriorStreak: number;
  streakExpiredAt: string | null;
  exitPhoenixMode: () => void;

  // Gap closure scoring
  dailyScores: Record<string, DailyScoreEntry>;
  journalDates: Record<string, boolean>;
  recalculateAndPersistScore: () => void;
  recordJournalEntry: () => void;

  // Daily tasks system
  morningEnergy: EnergyLevel | null;
  morningTimeAvailable: TimeAvailable | null;
  morningFocus: string | null;
  morningChallengeLevel: ChallengeLevel | null;
  morningCheckinDate: string | null;
  todayTasks: GeneratedTask[];
  todayTasksDate: string | null;
  recurringTasks: RecurringTask[];
  todayDayMessage: string | null;
  todayAdaptationNote: string | null;
  setMorningCheckin: (energy: EnergyLevel, time: TimeAvailable, focus: string | null, challengeLevel: ChallengeLevel) => void;
  setTodayTasks: (tasks: GeneratedTask[], dayMessage: string, adaptationNote: string | null) => void;
  toggleDailyTask: (taskId: string) => void;
  deferDailyTask: (taskId: string) => void;
  addCustomDailyTask: (label: string, estimatedMinutes: number) => void;
  swapDailyTask: (taskId: string, replacement: GeneratedTask) => void;
  addRecurringTask: (task: RecurringTask) => void;
  removeRecurringTask: (taskId: string) => void;

  // Daily visit (opening the app maintains streak)
  recordDailyVisit: () => void;

  // Plan refresh (living plan)
  planLastRefreshedAt: string | null;
  planRefreshSummary: string | null;
  planRefreshSeen: boolean;
  setPlanRefreshed: (summary: string) => void;
  dismissPlanRefresh: () => void;

  // Server sync
  synced: boolean;
  syncToServer: () => Promise<void>;
  hydrateFromServer: () => Promise<void>;
};

export const usePlanStore = create<PlanState>((set, get) => {
  const raw = typeof window !== "undefined" ? getPersisted() : getDefaultPersisted();
  const persisted = typeof window !== "undefined" ? applyStreakResetOnLoad(raw) : raw;
  if (typeof window !== "undefined" && (persisted.streak !== raw.streak || persisted.streakLostShownForDate !== raw.streakLostShownForDate)) {
    setPersisted(persisted);
  }
  const storedPlan = typeof window !== "undefined" ? getStoredPipelinePlan() : null;
  const hasCachedPlan = !!storedPlan && (storedPlan.recommended_events?.length ?? 0) > 0;
  return {
    pipelinePlan: hasCachedPlan ? storedPlan : null,
    pipelineStatus: hasCachedPlan ? "ready" : "idle",

    identityComplete: false,
    planReady: !!persisted.planId,
    planId: persisted.planId,
    dailyStatus: "align",
    streak: persisted.streak,
    lastCompletedDate: persisted.lastCompletedDate ?? null,
    streakLostShownForDate: persisted.streakLostShownForDate ?? null,
    bestStreak: persisted.bestStreak ?? 0,
    streakShields: persisted.streakShields ?? 0,
    futureScore: Math.min(100, Math.max(0, persisted.futureScore)),
    acceptedPlanAt: null,
    homeAssistantOpen: false,
    userName: persisted.userName || "",
    dogArchetype: persisted.dogArchetype,
    ambitionType: persisted.ambitionType,
    quizComplete: persisted.quizComplete,
    email: persisted.email || "",
    onboardingComplete: persisted.onboardingComplete,
    isPremium: persisted.isPremium,
    paywallSeen: persisted.paywallSeen,
    appTourSeen: persisted.appTourSeen ?? false,
    trialStartedAt: persisted.trialStartedAt,
    quizGender: persisted.quizGender,
    location: persisted.location || "",
    quizTimeline: persisted.quizTimeline ?? null,
    quizCommitment: persisted.quizCommitment ?? null,
    quizSchedule: persisted.quizSchedule ?? null,
    quizObstacles: persisted.quizObstacles ?? [],
    activeStepIndex: persisted.activeStepIndex ?? 0,
    planStartDate: persisted.planStartDate ?? null,
    todayStatus: persisted.todayStatus ?? "pending",
    todayStatusDate: persisted.todayStatusDate ?? null,
    lastReflection: persisted.lastReflection ?? null,
    chatHistory: persisted.chatHistory ?? [],
    taskHistory: persisted.taskHistory ?? {},
    ambitionCategories: (persisted as Persisted & { ambitionCategories?: AmbitionCategory[] }).ambitionCategories ?? [],

    // Mental health assessment
    moodRating: persisted.moodRating ?? null,
    hasSupportSystem: persisted.hasSupportSystem ?? null,
    energyLevel: persisted.energyLevel ?? null,
    sleepQuality: persisted.sleepQuality ?? null,
    dailyRoutine: persisted.dailyRoutine ?? null,
    stressLevel: persisted.stressLevel ?? null,
    expressionText: persisted.expressionText ?? null,
    quizPrimaryGoal: persisted.quizPrimaryGoal ?? null,
    quizPastAttempts: persisted.quizPastAttempts ?? null,
    quizCurrentState: persisted.quizCurrentState ?? null,
    quizVision: persisted.quizVision ?? null,
    quizAgeGroup: persisted.quizAgeGroup ?? null,
    quizDream: persisted.quizDream ?? null,
    quizSecondaryGoal: persisted.quizSecondaryGoal ?? null,
    quizLifePhase: persisted.quizLifePhase ?? null,
    quizAccountability: persisted.quizAccountability ?? null,
    quizSuccessDefinition: persisted.quizSuccessDefinition ?? null,

    // Weekly tracking & gift
    weeklyCompletions: persisted.weeklyCompletions ?? {},
    weeklyBest: persisted.weeklyBest ?? 0,
    lastGiftDate: persisted.lastGiftDate ?? null,
    lastGiftType: persisted.lastGiftType ?? null,

    // Multi-select quiz answers
    multiSelectAnswers: persisted.multiSelectAnswers ?? {},

    // Phoenix comeback
    phoenixDay: persisted.phoenixDay ?? false,
    phoenixPriorStreak: persisted.phoenixPriorStreak ?? 0,
    streakExpiredAt: persisted.streakExpiredAt ?? null,

    // Daily tasks system
    morningEnergy: persisted.morningCheckinDate === todayISO() ? (persisted.morningEnergy ?? null) : null,
    morningTimeAvailable: persisted.morningCheckinDate === todayISO() ? (persisted.morningTimeAvailable ?? null) : null,
    morningFocus: persisted.morningCheckinDate === todayISO() ? (persisted.morningFocus ?? null) : null,
    morningChallengeLevel: persisted.morningCheckinDate === todayISO() ? (persisted.morningChallengeLevel ?? null) : null,
    morningCheckinDate: persisted.morningCheckinDate ?? null,
    todayTasks: persisted.todayTasksDate === todayISO() ? (persisted.todayTasks ?? []) : [],
    todayTasksDate: persisted.todayTasksDate ?? null,
    recurringTasks: persisted.recurringTasks ?? [],
    todayDayMessage: persisted.todayTasksDate === todayISO() ? (persisted.todayDayMessage ?? null) : null,
    todayAdaptationNote: persisted.todayTasksDate === todayISO() ? (persisted.todayAdaptationNote ?? null) : null,

    // Gap closure scoring
    dailyScores: persisted.dailyScores ?? {},
    journalDates: persisted.journalDates ?? {},

    setIdentityComplete: (v) => set({ identityComplete: v }),

    setPlanReady: (planId) => {
      const existing = getPersisted().planStartDate;
      const startDate = existing ?? todayISO();
      setPersisted({ planId, planStartDate: startDate });
      set({ planReady: true, planId, planStartDate: startDate });
    },

    setDailyStatus: (s) => set({ dailyStatus: s }),

    incrementStreak: () => {
      const today = todayISO();
      // Idempotent: only increment once per day
      if (get().lastCompletedDate === today) return;

      const next = get().streak + 1;
      const newBest = Math.max(get().bestStreak, next);
      const SHIELD_MILESTONES = [7, 14, 30];
      const newShields = SHIELD_MILESTONES.includes(next)
        ? get().streakShields + 1
        : get().streakShields;
      setPersisted({ streak: next, lastCompletedDate: today, bestStreak: newBest, streakShields: newShields });
      set({ streak: next, lastCompletedDate: today, bestStreak: newBest, streakShields: newShields });
      // Persist to server immediately
      void get().syncToServer();
    },

    recordDailyVisit: () => {
      // Opening the app on a new day maintains the streak
      get().incrementStreak();
    },

    useStreakShield: () => {
      const { streakShields, streak, bestStreak } = get();
      if (streakShields <= 0) return false;
      const next = streak + 1;
      const today = todayISO();
      const newBest = Math.max(bestStreak, next);
      setPersisted({ streak: next, lastCompletedDate: today, bestStreak: newBest, streakShields: streakShields - 1 });
      set({ streak: next, lastCompletedDate: today, bestStreak: newBest, streakShields: streakShields - 1 });
      return true;
    },

    setFutureScore: (score) => {
      const clamped = Math.min(100, Math.max(0, score));
      setPersisted({ futureScore: clamped });
      set({ futureScore: clamped });
    },

    acceptPlan: () => set({ acceptedPlanAt: new Date().toISOString() }),

    setHomeAssistantOpen: (v) => set({ homeAssistantOpen: v }),

    setUserName: (name) => {
      setPersisted({ userName: name });
      set({ userName: name });
    },

    setArchetype: (id) => {
      setPersisted({ dogArchetype: id });
      set({ dogArchetype: id });
    },

    setAmbitionType: (t) => {
      setPersisted({ ambitionType: t });
      set({ ambitionType: t });
    },

    completeQuiz: (archetype, ambition) => {
      setPersisted({ dogArchetype: archetype, ambitionType: ambition, quizComplete: true });
      set({ dogArchetype: archetype, ambitionType: ambition, quizComplete: true });
    },

    setEmail: (email) => {
      setPersisted({ email });
      set({ email });
    },

    setGender: (g) => {
      setPersisted({ quizGender: g });
      set({ quizGender: g });
    },

    setLocation: (loc) => {
      setPersisted({ location: loc });
      set({ location: loc });
    },

    setQuizContext: (ctx) => {
      const patch: Partial<Persisted> = {};
      if (ctx.timeline !== undefined) patch.quizTimeline = ctx.timeline;
      if (ctx.commitment !== undefined) patch.quizCommitment = ctx.commitment;
      if (ctx.schedule !== undefined) patch.quizSchedule = ctx.schedule;
      if (ctx.obstacles !== undefined) patch.quizObstacles = ctx.obstacles;
      setPersisted(patch);
      set(patch);
    },

    incrementActiveStep: () => {
      const { pipelinePlan, activeStepIndex } = get();
      const allSteps = pipelinePlan?.phases.flatMap((p) => p.steps) ?? [];
      const next = Math.min(activeStepIndex + 1, Math.max(0, allSteps.length - 1));
      setPersisted({ activeStepIndex: next });
      set({ activeStepIndex: next });
    },

    getCurrentStep: () => {
      const { pipelinePlan, activeStepIndex } = get();
      if (!pipelinePlan) return null;
      const allSteps = pipelinePlan.phases.flatMap((p) => p.steps);
      return allSteps[activeStepIndex] ?? null;
    },

    completeOnboarding: () => {
      setPersisted({ onboardingComplete: true });
      set({ onboardingComplete: true });
    },

    startTrial: () => {
      const now = new Date().toISOString();
      setPersisted({ trialStartedAt: now });
      set({ trialStartedAt: now });
    },

    setPremium: () => {
      setPersisted({ isPremium: true });
      set({ isPremium: true });
    },

    setPaywallSeen: () => {
      setPersisted({ paywallSeen: true });
      set({ paywallSeen: true });
    },

    setAppTourSeen: () => {
      setPersisted({ appTourSeen: true });
      set({ appTourSeen: true });
    },

    setLastReflection: (text) => {
      setPersisted({ lastReflection: text });
      set({ lastReflection: text });
    },

    setChatHistory: (history) => {
      const trimmed = history.slice(-10);
      setPersisted({ chatHistory: trimmed });
      set({ chatHistory: trimmed });
    },

    setTaskCompletion: (key, done) => {
      const next = { ...get().taskHistory, [key]: done };
      setPersisted({ taskHistory: next });
      set({ taskHistory: next });
    },

    setAmbitionCategories: (cats) => {
      (setPersisted as (p: Partial<Persisted & { ambitionCategories: AmbitionCategory[] }>) => void)({ ambitionCategories: cats });
      set({ ambitionCategories: cats });
    },

    setPlanStartDate: (date) => {
      setPersisted({ planStartDate: date });
      set({ planStartDate: date });
    },

    setTodayStatus: (status) => {
      const today = todayISO();
      setPersisted({ todayStatus: status, todayStatusDate: today });
      set({ todayStatus: status, todayStatusDate: today });
      // Track weekly completion and increment streak when user marks "done"
      if (status === "done") {
        const current = get().weeklyCompletions;
        const updated = { ...current, [today]: true };
        const count = countWeekCompletions(updated);
        const newBest = Math.max(get().weeklyBest, count);
        setPersisted({ weeklyCompletions: updated, weeklyBest: newBest });
        set({ weeklyCompletions: updated, weeklyBest: newBest });

        // Increment streak if not already incremented today
        if (get().lastCompletedDate !== today) {
          get().incrementStreak();
        }
      }
    },

    setGiftRevealed: (giftType) => {
      const today = todayISO();
      setPersisted({ lastGiftDate: today, lastGiftType: giftType });
      set({ lastGiftDate: today, lastGiftType: giftType });
    },

    setMultiSelectAnswer: (screenId, labels) => {
      const current = get().multiSelectAnswers;
      const next = { ...current, [screenId]: labels };
      setPersisted({ multiSelectAnswers: next });
      set({ multiSelectAnswers: next });
    },

    exitPhoenixMode: () => {
      setPersisted({ phoenixDay: false, phoenixPriorStreak: 0, streakExpiredAt: null });
      set({ phoenixDay: false, phoenixPriorStreak: 0, streakExpiredAt: null });
    },

    recalculateAndPersistScore: () => {
      const state = get();
      const today = todayISO();
      const taskHistory = state.taskHistory;

      // Count today's tasks (keys like "2026-03-26:1")
      const todayPrefix = today + ":";
      let tasksDone = 0;
      let taskCount = 0;
      for (const key of Object.keys(taskHistory)) {
        if (key.startsWith(todayPrefix)) {
          taskCount++;
          if (taskHistory[key]) tasksDone++;
        }
      }

      // Count must-do tasks from today's generated tasks
      const activeTasks = (state.todayTasks ?? []).filter((t) => !t.deferred);
      const mustDoTasks = activeTasks.filter((t) => t.priority === "must-do");
      const mustDoCount = mustDoTasks.length;
      const mustDoDone = mustDoTasks.filter((t) => t.completed).length;

      const journaledToday = !!(state.journalDates ?? {})[today];
      const { entry, scores } = recordScoringAction(
        state.dailyScores ?? {},
        today,
        state.todayStatus,
        tasksDone,
        taskCount,
        journaledToday,
        state.streak,
        mustDoDone,
        mustDoCount,
      );
      void entry;
      const futureScore = computeFutureScore(scores);

      setPersisted({ dailyScores: scores, futureScore });
      set({ dailyScores: scores, futureScore });
    },

    // ─── Daily tasks actions ────────────────────────────────────────────────

    setMorningCheckin: (energy, time, focus, challengeLevel) => {
      const today = todayISO();
      setPersisted({ morningEnergy: energy, morningTimeAvailable: time, morningFocus: focus, morningChallengeLevel: challengeLevel, morningCheckinDate: today });
      set({ morningEnergy: energy, morningTimeAvailable: time, morningFocus: focus, morningChallengeLevel: challengeLevel, morningCheckinDate: today });
    },

    setTodayTasks: (tasks, dayMessage, adaptationNote) => {
      const today = todayISO();
      setPersisted({ todayTasks: tasks, todayTasksDate: today, todayDayMessage: dayMessage, todayAdaptationNote: adaptationNote });
      set({ todayTasks: tasks, todayTasksDate: today, todayDayMessage: dayMessage, todayAdaptationNote: adaptationNote });
      // Also sync task count into the old taskHistory for scoring compatibility
      for (const t of tasks) {
        const key = `${today}:${t.id}`;
        const existing = get().taskHistory[key];
        if (existing === undefined) {
          get().setTaskCompletion(key, t.completed);
        }
      }
    },

    toggleDailyTask: (taskId) => {
      const today = todayISO();
      const tasks = get().todayTasks.map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t,
      );
      setPersisted({ todayTasks: tasks });
      set({ todayTasks: tasks });
      // Sync to taskHistory for scoring
      const task = tasks.find((t) => t.id === taskId);
      if (task) {
        get().setTaskCompletion(`${today}:${taskId}`, task.completed);
      }
      setTimeout(() => get().recalculateAndPersistScore(), 0);
    },

    deferDailyTask: (taskId) => {
      const tasks = get().todayTasks.map((t) =>
        t.id === taskId ? { ...t, deferred: true, completed: false } : t,
      );
      setPersisted({ todayTasks: tasks });
      set({ todayTasks: tasks });
      setTimeout(() => get().recalculateAndPersistScore(), 0);
    },

    addCustomDailyTask: (label, estimatedMinutes) => {
      const today = todayISO();
      const newTask: GeneratedTask = {
        id: `custom-${Date.now()}`,
        label,
        description: "",
        category: "custom",
        estimatedMinutes,
        priority: "should-do",
        intensity: "routine",
        planStepRef: null,
        source: "user",
        completed: false,
        deferred: false,
      };
      const tasks = [...get().todayTasks, newTask];
      setPersisted({ todayTasks: tasks });
      set({ todayTasks: tasks });
      get().setTaskCompletion(`${today}:${newTask.id}`, false);
      setTimeout(() => get().recalculateAndPersistScore(), 0);
    },

    swapDailyTask: (taskId, replacement) => {
      const today = todayISO();
      const tasks = get().todayTasks.map((t) =>
        t.id === taskId ? { ...replacement, id: taskId } : t,
      );
      setPersisted({ todayTasks: tasks });
      set({ todayTasks: tasks });
      get().setTaskCompletion(`${today}:${taskId}`, false);
    },

    addRecurringTask: (task) => {
      const tasks = [...get().recurringTasks, task];
      setPersisted({ recurringTasks: tasks });
      set({ recurringTasks: tasks });
    },

    removeRecurringTask: (taskId) => {
      const tasks = get().recurringTasks.filter((t) => t.id !== taskId);
      setPersisted({ recurringTasks: tasks });
      set({ recurringTasks: tasks });
    },

    recordJournalEntry: () => {
      const today = todayISO();
      const updated = { ...(get().journalDates ?? {}), [today]: true };
      setPersisted({ journalDates: updated });
      set({ journalDates: updated });
      // Recalculate score with journal bonus
      get().recalculateAndPersistScore();
    },

    googleCalendarConnected: persisted.googleCalendarConnected ?? false,

    setGoogleCalendarConnected: (v) => {
      setPersisted({ googleCalendarConnected: v });
      set({ googleCalendarConnected: v });
    },

    setMentalHealthData: (data) => {
      setPersisted(data);
      set(data);
    },

    // Plan refresh (living plan)
    planLastRefreshedAt: persisted.planLastRefreshedAt ?? null,
    planRefreshSummary: persisted.planRefreshSummary ?? null,
    planRefreshSeen: persisted.planRefreshSeen ?? false,

    setPlanRefreshed: (summary: string) => {
      const now = new Date().toISOString();
      setPersisted({ planLastRefreshedAt: now, planRefreshSummary: summary, planRefreshSeen: false });
      set({ planLastRefreshedAt: now, planRefreshSummary: summary, planRefreshSeen: false });
    },

    dismissPlanRefresh: () => {
      setPersisted({ planRefreshSeen: true });
      set({ planRefreshSeen: true });
    },

    // Server sync
    synced: false,

    syncToServer: async () => {
      try {
        const state = get();
        const res = await fetch("/api/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            streak: state.streak,
            bestStreak: state.bestStreak,
            streakShields: state.streakShields,
            futureScore: state.futureScore,
            lastCompletedDate: state.lastCompletedDate,
            userName: state.userName,
            archetype: state.dogArchetype,
            ambitionType: state.ambitionType,
            onboardingComplete: state.onboardingComplete,
            quizData: {
              quizGender: state.quizGender,
              quizTimeline: state.quizTimeline,
              quizCommitment: state.quizCommitment,
              quizSchedule: state.quizSchedule,
              quizObstacles: state.quizObstacles,
              multiSelectAnswers: state.multiSelectAnswers,
              moodRating: state.moodRating,
              sleepQuality: state.sleepQuality,
              stressLevel: state.stressLevel,
              energyLevel: state.energyLevel,
              quizPrimaryGoal: (state as unknown as MentalHealthFields).quizPrimaryGoal,
              quizCurrentState: (state as unknown as MentalHealthFields).quizCurrentState,
              quizVision: (state as unknown as MentalHealthFields).quizVision,
              quizAgeGroup: (state as unknown as MentalHealthFields).quizAgeGroup,
            },
            planId: state.planId,
            planStartDate: state.planStartDate,
            goal: null,
            intakeResponse: null,
            pipelineOutput: null,
          }),
          credentials: "include",
        });
        if (!res.ok) return;
        const data = await res.json();
        // Apply authoritative server state
        const derivedQuizComplete = Boolean(
          data.onboardingComplete || data.archetype || data.ambitionType,
        );
        const patch: Partial<Persisted> = {
          streak: data.streak,
          bestStreak: data.bestStreak,
          streakShields: data.streakShields,
          futureScore: data.futureScore,
          lastCompletedDate: data.lastCompletedDate,
          isPremium: data.isPremium,
          trialStartedAt: data.trialStartedAt,
          userName: data.userName ?? "",
          dogArchetype: data.archetype ?? null,
          ambitionType: data.ambitionType ?? null,
          onboardingComplete: data.onboardingComplete ?? false,
          planId: data.planId ?? null,
          quizComplete: derivedQuizComplete,
        };
        setPersisted(patch);
        set({
          streak: patch.streak,
          bestStreak: patch.bestStreak,
          streakShields: patch.streakShields,
          futureScore: patch.futureScore,
          lastCompletedDate: patch.lastCompletedDate,
          isPremium: patch.isPremium,
          trialStartedAt: patch.trialStartedAt,
          userName: patch.userName ?? "",
          dogArchetype: patch.dogArchetype ?? null,
          ambitionType: patch.ambitionType ?? null,
          onboardingComplete: patch.onboardingComplete ?? false,
          planId: patch.planId ?? null,
          planReady: !!patch.planId,
          quizComplete: patch.quizComplete ?? false,
          synced: true,
        });
      } catch {
        // Sync failed silently — localStorage stays as fallback
      }
    },

    hydrateFromServer: async () => {
      await get().syncToServer();
    },

    setPipelinePlan: (plan) => {
      storePipelinePlan(plan);
      set({ pipelinePlan: plan, pipelineStatus: "ready" });
    },

    setPipelineStatus: (s) => {
      if (s === "idle" && typeof window !== "undefined") {
        localStorage.removeItem(PIPELINE_SESSION_KEY);
      }
      set({ pipelineStatus: s });
    },

    resetForDemo: () => {
      setPersisted(getDefaultPersisted());
      set({
        identityComplete: false,
        planReady: false,
        planId: null,
        dailyStatus: "align",
        streak: 0,
        bestStreak: 0,
        streakShields: 0,
        futureScore: 0,
        acceptedPlanAt: null,
        dogArchetype: null,
        ambitionType: null,
        quizComplete: false,
        email: "",
        onboardingComplete: false,
        isPremium: false,
        paywallSeen: false,
        appTourSeen: false,
        trialStartedAt: null,
        quizGender: null,
        userName: "",
        location: "",
        lastCompletedDate: null,
        streakLostShownForDate: null,
        quizTimeline: null,
        quizCommitment: null,
        quizSchedule: null,
        quizObstacles: [],
        activeStepIndex: 0,
        planStartDate: null,
        todayStatus: "pending",
        todayStatusDate: null,
        pipelinePlan: null,
        pipelineStatus: "idle",
        googleCalendarConnected: false,
        ambitionCategories: [],
        moodRating: null,
        hasSupportSystem: null,
        energyLevel: null,
        sleepQuality: null,
        dailyRoutine: null,
        stressLevel: null,
        expressionText: null,
        quizPrimaryGoal: null,
        quizPastAttempts: null,
        quizCurrentState: null,
        quizVision: null,
        quizAgeGroup: null,
        quizDream: null,
        quizSecondaryGoal: null,
        quizLifePhase: null,
        quizAccountability: null,
        quizSuccessDefinition: null,
        phoenixDay: false,
        phoenixPriorStreak: 0,
        streakExpiredAt: null,
        multiSelectAnswers: {},
        dailyScores: {},
        journalDates: {},
        morningEnergy: null,
        morningTimeAvailable: null,
        morningFocus: null,
        morningChallengeLevel: null,
        morningCheckinDate: null,
        todayTasks: [],
        todayTasksDate: null,
        recurringTasks: [],
        todayDayMessage: null,
        todayAdaptationNote: null,
      });
      if (typeof window !== "undefined") {
        localStorage.removeItem(PIPELINE_SESSION_KEY);
      }
    },
  };
});

if (typeof window !== "undefined") {
  const p = getPersisted();
  usePlanStore.setState({
    planId: p.planId,
    planReady: !!p.planId,
    streak: p.streak,
    futureScore: p.futureScore,
    dogArchetype: p.dogArchetype,
    ambitionType: p.ambitionType,
    quizComplete: p.quizComplete,
    email: p.email,
    onboardingComplete: p.onboardingComplete,
    isPremium: p.isPremium,
    paywallSeen: p.paywallSeen,
    appTourSeen: p.appTourSeen ?? false,
    trialStartedAt: p.trialStartedAt,
    quizGender: p.quizGender,
    userName: p.userName || "",
    location: p.location || "",
    lastCompletedDate: p.lastCompletedDate ?? null,
    streakLostShownForDate: p.streakLostShownForDate ?? null,
  });
}
