import { create } from "zustand";
import type { AmbitionDomain, ArchetypeId } from "../types/plan";
import type { CheckinStatus, GoalPlan, PipelineStatus, PipelineStep } from "../types/pipeline";

const PIPELINE_SESSION_KEY = "future-you-pipeline";

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

const STORAGE_KEY = "future-you-plan-state";

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
  };
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
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
    monday: monday.toISOString().slice(0, 10),
    sunday: sunday.toISOString().slice(0, 10),
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
    return d.toISOString().slice(0, 10);
  });
}

function yesterdayISO(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
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

  // Pipeline (Future You workflow) state — not persisted to localStorage
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

  // Phoenix comeback mechanic
  phoenixDay: boolean;
  phoenixPriorStreak: number;
  streakExpiredAt: string | null;
  exitPhoenixMode: () => void;
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

    // Weekly tracking & gift
    weeklyCompletions: persisted.weeklyCompletions ?? {},
    weeklyBest: persisted.weeklyBest ?? 0,
    lastGiftDate: persisted.lastGiftDate ?? null,
    lastGiftType: persisted.lastGiftType ?? null,

    // Phoenix comeback
    phoenixDay: persisted.phoenixDay ?? false,
    phoenixPriorStreak: persisted.phoenixPriorStreak ?? 0,
    streakExpiredAt: persisted.streakExpiredAt ?? null,

    setIdentityComplete: (v) => set({ identityComplete: v }),

    setPlanReady: (planId) => {
      const existing = getPersisted().planStartDate;
      const startDate = existing ?? todayISO();
      setPersisted({ planId, planStartDate: startDate });
      set({ planReady: true, planId, planStartDate: startDate });
    },

    setDailyStatus: (s) => set({ dailyStatus: s }),

    incrementStreak: () => {
      const next = get().streak + 1;
      const today = todayISO();
      const newBest = Math.max(get().bestStreak, next);
      const SHIELD_MILESTONES = [7, 14, 30];
      const newShields = SHIELD_MILESTONES.includes(next)
        ? get().streakShields + 1
        : get().streakShields;
      setPersisted({ streak: next, lastCompletedDate: today, bestStreak: newBest, streakShields: newShields });
      set({ streak: next, lastCompletedDate: today, bestStreak: newBest, streakShields: newShields });
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
      // Track weekly completion when user marks "done"
      if (status === "done") {
        const current = get().weeklyCompletions;
        const updated = { ...current, [today]: true };
        const count = countWeekCompletions(updated);
        const newBest = Math.max(get().weeklyBest, count);
        setPersisted({ weeklyCompletions: updated, weeklyBest: newBest });
        set({ weeklyCompletions: updated, weeklyBest: newBest });
      }
    },

    setGiftRevealed: (giftType) => {
      const today = todayISO();
      setPersisted({ lastGiftDate: today, lastGiftType: giftType });
      set({ lastGiftDate: today, lastGiftType: giftType });
    },

    exitPhoenixMode: () => {
      setPersisted({ phoenixDay: false, phoenixPriorStreak: 0, streakExpiredAt: null });
      set({ phoenixDay: false, phoenixPriorStreak: 0, streakExpiredAt: null });
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
