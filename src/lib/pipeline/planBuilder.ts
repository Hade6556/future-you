import { randomUUID } from "crypto";
import type { GoalPlan, PipelineEvent, PipelineExpert, UserContext } from "@/app/types/pipeline";
import type { GoalConfig } from "./goalParser";
import fitnessTemplate from "@/data/templates/fitness_weight_loss.json";
import realEstateTemplate from "@/data/templates/real_estate_house_purchase.json";
import entrepreneurshipTemplate from "@/data/templates/entrepreneurship.json";
import athleticsTemplate from "@/data/templates/athletics.json";
import creativeTemplate from "@/data/templates/creative.json";
import studentTemplate from "@/data/templates/student.json";
import wellnessTemplate from "@/data/templates/wellness.json";
import careerTemplate from "@/data/templates/career.json";
import financeTemplate from "@/data/templates/finance.json";
import languageTemplate from "@/data/templates/language.json";
import travelTemplate from "@/data/templates/travel.json";
import relationshipsTemplate from "@/data/templates/relationships.json";
import productivityTemplate from "@/data/templates/productivity.json";
import mindfulnessTemplate from "@/data/templates/mindfulness.json";
import confidenceTemplate from "@/data/templates/confidence.json";

type TemplateStep = {
  step_number: number;
  title: string;
  description: string;
  duration_weeks: number;
  resources: string[];
  success_metric: string;
};

type TemplatePhase = {
  phase_number: number;
  phase_name: string;
  duration_weeks: number;
  goal: string;
  steps: TemplateStep[];
  milestones: string[];
};

type PlanTemplate = {
  horizon_weeks: number;
  phases: TemplatePhase[];
};

const TEMPLATES: Record<string, PlanTemplate> = {
  fitness_weight_loss: fitnessTemplate as PlanTemplate,
  real_estate_house_purchase: realEstateTemplate as PlanTemplate,
  entrepreneurship: entrepreneurshipTemplate as PlanTemplate,
  athletics: athleticsTemplate as PlanTemplate,
  creative: creativeTemplate as PlanTemplate,
  student: studentTemplate as PlanTemplate,
  wellness: wellnessTemplate as PlanTemplate,
  career: careerTemplate as PlanTemplate,
  finance: financeTemplate as PlanTemplate,
  language: languageTemplate as PlanTemplate,
  travel: travelTemplate as PlanTemplate,
  relationships: relationshipsTemplate as PlanTemplate,
  productivity: productivityTemplate as PlanTemplate,
  mindfulness: mindfulnessTemplate as PlanTemplate,
  confidence: confidenceTemplate as PlanTemplate,
};

const TIMELINE_HORIZON: Record<string, number> = {
  "This week": 4,
  "Within a month": 8,
  "In the next 3 months": 12,
  "No rush — I want it done right": 0, // 0 = use template default
};

const COMMITMENT_MULTIPLIER: Record<string, number> = {
  "All in — ready to start now": 0.75,
  "Pretty serious": 1.0,
  "Exploring my options": 1.25,
  "Just curious": 1.5,
};

export function buildPlan(
  goalRaw: string,
  goalKey: string,
  goalConfig: GoalConfig,
  events: PipelineEvent[],
  experts: PipelineExpert[],
  userContext?: UserContext
): GoalPlan {
  const template = TEMPLATES[goalConfig.plan_template];
  if (!template) {
    throw new Error(`No template found for plan_template: ${goalConfig.plan_template}`);
  }

  // Apply userContext adaptations
  let horizonWeeks = template.horizon_weeks;
  let phases = template.phases;

  if (userContext) {
    // Timeline override
    if (userContext.timeline) {
      const override = TIMELINE_HORIZON[userContext.timeline];
      if (override && override > 0) horizonWeeks = override;
    }

    // Commitment multiplier on phase durations
    if (userContext.commitment) {
      const multiplier = COMMITMENT_MULTIPLIER[userContext.commitment] ?? 1.0;
      if (multiplier !== 1.0) {
        phases = phases.map((phase) => ({
          ...phase,
          duration_weeks: Math.max(1, Math.round(phase.duration_weeks * multiplier)),
        }));
        // Recalculate horizon as sum of scaled phase durations
        horizonWeeks = phases.reduce((sum, p) => sum + p.duration_weeks, 0);
      }
    }
  }

  return {
    plan_id: randomUUID(),
    goal_raw: goalRaw,
    goal_key: goalKey,
    goal_category: goalConfig.category,
    generated_at: new Date().toISOString(),
    horizon_weeks: horizonWeeks,
    phases,
    recommended_events: events,
    recommended_experts: experts,
  };
}
