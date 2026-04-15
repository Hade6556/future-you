import { create } from "zustand";

export type GoalArea =
  | "Career & Purpose"
  | "Money & Financial Freedom"
  | "Relationships & Connection"
  | "Health & Energy"
  | "Mindset & Personal Growth";

export type Archetype =
  | "Steady Builder"
  | "Laser Strategist"
  | "Endurance Engine"
  | "Creative Spark"
  | "Guardian"
  | "Explorer";

export interface QuizAnswers {
  goalArea: GoalArea | null;
  specificGoals: string[];
  gender: string | null;
  ageRange: string | null;
  problems: string[];
  currentState: string | null;
  badHabits: string[];
  pastAttempts: string[];
  dailyTime: string | null;
  email: string;
  archetype: Archetype | null;
}

interface QuizStore {
  answers: QuizAnswers;
  step: number;
  setStep: (step: number) => void;
  setGoalArea: (v: GoalArea) => void;
  setSpecificGoals: (v: string[]) => void;
  setGender: (v: string) => void;
  setAgeRange: (v: string) => void;
  setProblems: (v: string[]) => void;
  setCurrentState: (v: string) => void;
  setBadHabits: (v: string[]) => void;
  setPastAttempts: (v: string[]) => void;
  setDailyTime: (v: string) => void;
  setEmail: (v: string) => void;
  setArchetype: (v: Archetype) => void;
  reset: () => void;
}

const initialAnswers: QuizAnswers = {
  goalArea: null,
  specificGoals: [],
  gender: null,
  ageRange: null,
  problems: [],
  currentState: null,
  badHabits: [],
  pastAttempts: [],
  dailyTime: null,
  email: "",
  archetype: null,
};

export const useQuizStore = create<QuizStore>((set) => ({
  answers: { ...initialAnswers },
  step: 0,
  setStep: (step) => set({ step }),
  setGoalArea: (v) => set((s) => ({ answers: { ...s.answers, goalArea: v } })),
  setSpecificGoals: (v) => set((s) => ({ answers: { ...s.answers, specificGoals: v } })),
  setGender: (v) => set((s) => ({ answers: { ...s.answers, gender: v } })),
  setAgeRange: (v) => set((s) => ({ answers: { ...s.answers, ageRange: v } })),
  setProblems: (v) => set((s) => ({ answers: { ...s.answers, problems: v } })),
  setCurrentState: (v) => set((s) => ({ answers: { ...s.answers, currentState: v } })),
  setBadHabits: (v) => set((s) => ({ answers: { ...s.answers, badHabits: v } })),
  setPastAttempts: (v) => set((s) => ({ answers: { ...s.answers, pastAttempts: v } })),
  setDailyTime: (v) => set((s) => ({ answers: { ...s.answers, dailyTime: v } })),
  setEmail: (v) => set((s) => ({ answers: { ...s.answers, email: v } })),
  setArchetype: (v) => set((s) => ({ answers: { ...s.answers, archetype: v } })),
  reset: () => set({ answers: { ...initialAnswers }, step: 0 }),
}));
