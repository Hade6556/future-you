import { create } from "zustand";
import type { AmbitionDomain, ArchetypeId } from "../types/plan";

const STORAGE_KEY = "future-you-plan-state";

export type DailyStatus = "align" | "act" | "reflect" | "complete";

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
};

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
  };
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

  setIdentityComplete: (v: boolean) => void;
  setPlanReady: (planId: string) => void;
  setDailyStatus: (s: DailyStatus) => void;
  incrementStreak: () => void;
  setFutureScore: (score: number) => void;
  acceptPlan: () => void;
  setHomeAssistantOpen: (v: boolean) => void;
  setUserName: (name: string) => void;
  setArchetype: (id: ArchetypeId) => void;
  setAmbitionType: (t: AmbitionDomain) => void;
  completeQuiz: (archetype: ArchetypeId, ambition: AmbitionDomain) => void;
  setEmail: (email: string) => void;
  setGender: (g: string) => void;
  completeOnboarding: () => void;
  startTrial: () => void;
  setPremium: () => void;
  setPaywallSeen: () => void;
  resetForDemo: () => void;
};

export const usePlanStore = create<PlanState>((set, get) => {
  const persisted = typeof window !== "undefined" ? getPersisted() : getDefaultPersisted();
  return {
    identityComplete: false,
    planReady: !!persisted.planId,
    planId: persisted.planId,
    dailyStatus: "align",
    streak: persisted.streak,
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
    trialStartedAt: persisted.trialStartedAt,
    quizGender: persisted.quizGender,

    setIdentityComplete: (v) => set({ identityComplete: v }),

    setPlanReady: (planId) => {
      setPersisted({ planId });
      set({ planReady: true, planId });
    },

    setDailyStatus: (s) => set({ dailyStatus: s }),

    incrementStreak: () => {
      const next = get().streak + 1;
      setPersisted({ streak: next });
      set({ streak: next });
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

    resetForDemo: () => {
      setPersisted(getDefaultPersisted());
      set({
        identityComplete: false,
        planReady: false,
        planId: null,
        dailyStatus: "align",
        streak: 0,
        futureScore: 0,
        acceptedPlanAt: null,
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
      });
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
    trialStartedAt: p.trialStartedAt,
    quizGender: p.quizGender,
    userName: p.userName || "",
  });
}
