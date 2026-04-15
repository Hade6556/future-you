/** TypeScript types mirroring the Python GoalPlan Pydantic model. */

import type { MarketingIntent } from "./marketingIntent";

export type PipelineStep = {
  step_number: number;
  title: string;
  description: string;
  duration_weeks: number;
  resources: string[];
  success_metric: string;
};

export type PipelinePhase = {
  phase_number: number;
  phase_name: string;
  duration_weeks: number;
  goal: string;
  steps: PipelineStep[];
  milestones: string[];
};

export type PipelineEvent = {
  event_id: string;
  title: string;
  description: string | null;
  start_date: string | null;
  location: string | null;
  virtual: boolean;
  price_label: string | null;
  image_url: string | null;
  goal_category: string;
  source_name: string;
  source_url: string;
};

export type PipelineExpert = {
  resource_id: string;
  name: string;
  role: string;
  specialty: string;
  bio_snippet: string;
  url: string;
  verified: boolean;
  tags: string[];
};

export type GoalPlan = {
  plan_id: string;
  goal_raw: string;
  goal_key: string;
  goal_category: string;
  generated_at: string;
  horizon_weeks: number;
  phases: PipelinePhase[];
  recommended_events: PipelineEvent[];
  recommended_experts: PipelineExpert[];
};

export type PipelineStatus = "idle" | "loading" | "ready" | "error";

export type UserContext = {
  // Existing
  timeline?: string | null;
  commitment?: string | null;
  schedule?: string | null;
  obstacles?: string[];
  primaryGoal?: string | null;
  pastAttempts?: string | null;
  currentState?: string | null;
  vision?: string | null;
  gender?: string | null;

  // Quiz signals
  ageGroup?: string | null;
  specificGoals?: string[];
  motivations?: string[];
  badHabits?: string[];
  selfTrust?: string | null;
  problems?: string[];

  // Intake signals
  dreamNarrative?: string | null;
  values?: string[];
  roles?: string[];
  intakePaths?: Array<{ name: string; description: string; timeHorizon: string }>;

  // Identity signals
  archetype?: string | null;
  ambitionDomain?: string | null;
  /** Universal landing funnel entry — biases plan generation */
  marketingIntent?: MarketingIntent | null;

  // Wellbeing signals
  moodRating?: number | null;
  sleepQuality?: string | null;
  energyLevel?: string | null;
  stressLevel?: string | null;

  // Domain-specific deep dive answers
  domainAnswers?: Record<string, string[]>;
};

// ─── Mentor / Check-in types ─────────────────────────────────────────────────

export type CheckinStatus = "pending" | "done" | "partial" | "skipped";

export type DailyMentorMessage = {
  morningMessage: string;
  taskTitle: string;
  estimatedMinutes: number;
  reminderMessage: string;
};

export type CheckinResponse = {
  reply: string;
  tomorrowPreview: string | null;
};

// ─────────────────────────────────────────────────────────────────────────────

// ─── Daily Tasks types ──────────────────────────────────────────────────────

export type EnergyLevel = "low" | "medium" | "high";
export type TimeAvailable = 15 | 30 | 60 | 120;
export type ChallengeLevel = "comfort" | "push" | "stretch";
export type TaskCategory = "plan" | "habit" | "wellbeing" | "custom";
export type TaskPriority = "must-do" | "should-do" | "bonus";
export type TaskSource = "ai" | "recurring" | "user";
export type TaskIntensity = "routine" | "challenging" | "stretch";

export type GeneratedTask = {
  id: string;
  label: string;
  description: string;
  category: TaskCategory;
  estimatedMinutes: number;
  priority: TaskPriority;
  intensity: TaskIntensity;
  planStepRef: number | null;
  source: TaskSource;
  completed: boolean;
  deferred: boolean;
};

export type RecurringTask = {
  id: string;
  label: string;
  estimatedMinutes: number;
  daysOfWeek: number[]; // 1=Mon, 7=Sun
  active: boolean;
};

export type DailyTasksRequest = {
  currentStep: PipelineStep | null;
  currentPhase: PipelinePhase | null;
  nextStep: PipelineStep | null;
  day: number;
  totalDays: number;
  overallProgress: number;
  userName: string;
  archetype: string | null;
  ambitionType: string | null;
  energy: EnergyLevel;
  timeAvailable: TimeAvailable;
  focusArea: string | null;
  streak: number;
  completionRate7d: number;
  avgDailyScore7d: number;
  lastJournalSentiment: string | null;
  missedTaskPatterns: string[];
  dayOfWeek: string;
  recurringTasks: RecurringTask[];
  userProfileDigest: string | null;
  challengeLevel: ChallengeLevel;
  mustDoCompletionRate7d: number;
  /** False when cached plan phases don't match ambitionType — model must follow ambition, not old plan text */
  planAlignedWithAmbition?: boolean;
};

export type DailyTasksResponse = {
  tasks: GeneratedTask[];
  dayMessage: string;
  adaptationNote: string | null;
};

// ─────────────────────────────────────────────────────────────────────────────

/** Maps the app's ambition domain to a goal string the pipeline understands. */
export const AMBITION_GOAL_MAP: Partial<Record<string, string>> = {
  entrepreneur: "become an entrepreneur",
  athlete: "become an athlete",
  weight_loss: "lose weight",
  creative: "pursue creative work",
  student: "excel as a student",
  wellness: "improve wellness",
  career: "advance my career",
  finance: "build financial security",
  language: "learn a language",
  travel: "travel and live freely",
  relationships: "build better relationships",
  productivity: "master productivity",
  mindfulness: "practice mindfulness",
  confidence: "build confidence",
};
