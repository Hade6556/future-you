"use client";

import { create } from "zustand";
import type {
  EventSearchParams,
  EventSearchStep,
  EventFormatId,
  BudgetId,
  HowOftenId,
  EventSearchGoalId,
} from "../types/eventSearch";
import { STEPS } from "../types/eventSearch";

type EventSearchState = {
  stepIndex: number;
  params: Partial<EventSearchParams>;
  setGoal: (goal: EventSearchGoalId) => void;
  setLocation: (location: string) => void;
  setEventFormat: (format: EventFormatId) => void;
  setBudget: (budget: BudgetId) => void;
  setTimeframe: (timeframe: string) => void;
  setHowOften: (howOften: HowOftenId) => void;
  nextStep: () => void;
  currentStep: () => EventSearchStep;
  isComplete: () => boolean;
  reset: () => void;
};

const initialParams: Partial<EventSearchParams> = {
  goal: undefined,
  location: "",
  eventFormat: undefined,
  budget: undefined,
  timeframe: "",
  howOften: undefined,
};

export const useEventSearchStore = create<EventSearchState>((set, get) => ({
  stepIndex: 0,
  params: { ...initialParams },

  setGoal: (goal) => set((s) => ({ params: { ...s.params, goal } })),
  setLocation: (location) => set((s) => ({ params: { ...s.params, location: location.trim() } })),
  setEventFormat: (eventFormat) => set((s) => ({ params: { ...s.params, eventFormat } })),
  setBudget: (budget) => set((s) => ({ params: { ...s.params, budget } })),
  setTimeframe: (timeframe) => set((s) => ({ params: { ...s.params, timeframe: timeframe.trim() } })),
  setHowOften: (howOften) => set((s) => ({ params: { ...s.params, howOften } })),

  nextStep: () =>
    set((s) => ({
      stepIndex: Math.min(s.stepIndex + 1, STEPS.length - 1),
    })),

  currentStep: () => STEPS[get().stepIndex] ?? "summary",

  isComplete: () => {
    const p = get().params;
    return !!(
      p.goal &&
      p.location &&
      p.eventFormat &&
      p.budget &&
      p.timeframe &&
      p.howOften
    );
  },

  reset: () =>
    set({
      stepIndex: 0,
      params: { ...initialParams },
    }),
}));
