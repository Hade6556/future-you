/** TypeScript types mirroring the Python GoalPlan Pydantic model. */

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
  timeline?: string | null;
  commitment?: string | null;
  schedule?: string | null;
  obstacles?: string[];
  // Quiz funnel context — used to personalise the 90-day plan
  primaryGoal?: string | null;
  pastAttempts?: string | null;
  currentState?: string | null;
  vision?: string | null;
  gender?: string | null;
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

/** Maps the app's ambition domain to a goal string the pipeline understands. */
export const AMBITION_GOAL_MAP: Partial<Record<string, string>> = {
  entrepreneur: "become entrepreneur",
  athlete: "become athlete",
  weight_loss: "lose weight",
  creative: "creative",
  student: "student",
  wellness: "wellness",
  career: "advance my career",
  finance: "build financial security",
  language: "learn a language",
  travel: "travel and live freely",
  relationships: "build better relationships",
  productivity: "master productivity",
  mindfulness: "practice mindfulness",
  confidence: "build confidence",
};
