/** Event search flow: supported goal labels (display) and pipeline keys. */
export const EVENT_SEARCH_GOALS = [
  { id: "fitness_weight_loss", label: "Fitness & Weight Loss", pipelineGoal: "lose weight" },
  { id: "buy_house", label: "Buy a House", pipelineGoal: "buy house" },
  { id: "entrepreneur", label: "Become an Entrepreneur", pipelineGoal: "become entrepreneur" },
  { id: "athlete", label: "Become an Athlete", pipelineGoal: "become athlete" },
] as const;

export type EventSearchGoalId = (typeof EVENT_SEARCH_GOALS)[number]["id"];

export const EVENT_FORMATS = [
  { id: "in_person", label: "In-person only" },
  { id: "online", label: "Online / virtual only" },
  { id: "both", label: "Both" },
] as const;

export type EventFormatId = (typeof EVENT_FORMATS)[number]["id"];

export const BUDGET_OPTIONS = [
  { id: "free_only", label: "Free only" },
  { id: "paid_ok", label: "Paid is okay" },
  { id: "no_preference", label: "No preference" },
] as const;

export type BudgetId = (typeof BUDGET_OPTIONS)[number]["id"];

export const HOW_OFTEN_OPTIONS = [
  { id: "once", label: "One-time search" },
  { id: "daily", label: "Check daily" },
  { id: "weekly", label: "Check weekly" },
] as const;

export type HowOftenId = (typeof HOW_OFTEN_OPTIONS)[number]["id"];

export type EventSearchParams = {
  goal: EventSearchGoalId;
  location: string;
  eventFormat: EventFormatId;
  budget: BudgetId;
  timeframe: string;
  howOften: HowOftenId;
};

export type EventSearchStep =
  | "goal"
  | "location"
  | "format"
  | "budget"
  | "timeframe"
  | "howOften"
  | "summary";

export const STEPS: EventSearchStep[] = [
  "goal",
  "location",
  "format",
  "budget",
  "timeframe",
  "howOften",
  "summary",
];
