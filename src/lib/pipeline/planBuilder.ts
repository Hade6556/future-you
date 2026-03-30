import { randomUUID } from "crypto";
import Anthropic from "@anthropic-ai/sdk";
import type { GoalPlan, PipelineEvent, PipelineExpert, PipelinePhase, UserContext } from "@/app/types/pipeline";
import type { GoalConfig } from "./goalParser";
import { buildUserProfileDigest } from "./profileDigest";
import { validatePlanResponse } from "./planValidator";

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
  "No rush — I want it done right": 0,
};

const COMMITMENT_MULTIPLIER: Record<string, number> = {
  "All in — ready to start now": 0.75,
  "Pretty serious": 1.0,
  "Exploring my options": 1.25,
  "Just curious": 1.5,
};

const SYSTEM_PROMPT = `You are a world-class life coach creating a hyper-personalized action plan.
You will receive a user profile and a reference plan template. Your job is to generate
a completely personalized plan that feels like it was written specifically for this person.

CRITICAL RULES:
- Output ONLY valid JSON — no markdown, no commentary, no backticks
- The JSON must be an object with: { "horizon_weeks": number, "phases": [...] }
- Each phase: { "phase_number": number, "phase_name": string, "duration_weeks": number, "goal": string, "steps": [...], "milestones": string[] }
- Each step: { "step_number": number, "title": string, "description": string, "duration_weeks": number, "resources": [], "success_metric": string }
- Keep 3-4 phases, 2-4 steps per phase
- Step descriptions should be 2-4 sentences, specific and actionable
- resources array should always be empty []

PERSONALIZATION RULES:
- The plan MUST address the user's SPECIFIC goals, not generic domain goals
- If the user wrote a dream/vision, weave it into phase goals and milestone descriptions as the north star
- Adapt language and framing to the user's archetype voice (see Coaching Flags)
- Follow EVERY instruction in the Coaching Flags section — these are non-negotiable adaptations
- If the user has specific sub-goals, map them directly to phase objectives
- Connect motivations back to WHY each step matters in the descriptions
- If the user mentioned what they've already tried, avoid recommending the same approaches
- Do NOT use generic filler — every sentence should feel specific to THIS person
- Success metrics should be concrete and measurable, not vague ("Published 1 article" not "Made progress")`;

function getTargetHorizon(template: PlanTemplate, userContext?: UserContext): number {
  let horizon = template.horizon_weeks;
  if (userContext?.timeline) {
    const override = TIMELINE_HORIZON[userContext.timeline];
    if (override && override > 0) horizon = override;
  }
  return horizon;
}

/** Fallback: original template-based plan builder (no AI). */
function buildTemplatePlan(
  goalRaw: string,
  goalKey: string,
  goalConfig: GoalConfig,
  events: PipelineEvent[],
  experts: PipelineExpert[],
  userContext?: UserContext,
): GoalPlan {
  const template = TEMPLATES[goalConfig.plan_template];
  if (!template) {
    throw new Error(`No template found for plan_template: ${goalConfig.plan_template}`);
  }

  let horizonWeeks = template.horizon_weeks;
  let phases = template.phases as PipelinePhase[];

  if (userContext) {
    if (userContext.timeline) {
      const override = TIMELINE_HORIZON[userContext.timeline];
      if (override && override > 0) horizonWeeks = override;
    }
    if (userContext.commitment) {
      const multiplier = COMMITMENT_MULTIPLIER[userContext.commitment] ?? 1.0;
      if (multiplier !== 1.0) {
        phases = phases.map((phase) => ({
          ...phase,
          duration_weeks: Math.max(1, Math.round(phase.duration_weeks * multiplier)),
        }));
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

/** AI-powered personalized plan builder with template fallback. */
export async function buildPersonalizedPlan(
  goalRaw: string,
  goalKey: string,
  goalConfig: GoalConfig,
  events: PipelineEvent[],
  experts: PipelineExpert[],
  userContext?: UserContext,
): Promise<GoalPlan> {
  const template = TEMPLATES[goalConfig.plan_template];
  if (!template) {
    throw new Error(`No template found for plan_template: ${goalConfig.plan_template}`);
  }

  // If no API key or no meaningful user context, fall back to template
  if (!process.env.ANTHROPIC_API_KEY || !userContext) {
    return buildTemplatePlan(goalRaw, goalKey, goalConfig, events, experts, userContext);
  }

  const targetHorizon = getTargetHorizon(template, userContext);
  const profileDigest = buildUserProfileDigest(userContext);

  // Check if we have enough user data to justify AI generation
  const hasSubstantialData =
    userContext.specificGoals?.length ||
    userContext.dreamNarrative ||
    userContext.problems?.length ||
    userContext.archetype ||
    userContext.obstacles?.length;

  if (!hasSubstantialData) {
    return buildTemplatePlan(goalRaw, goalKey, goalConfig, events, experts, userContext);
  }

  try {
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2500,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `## Reference Template (use as structural guide — do NOT copy its content verbatim):
${JSON.stringify(template, null, 2)}

## Target Plan Duration: ${targetHorizon} weeks

## User Profile:
${profileDigest}

Generate a hyper-personalized plan for this specific person. Remember: every phase, step, and milestone should feel like it was written just for them.`,
        },
      ],
    });

    const text = (response.content[0] as { type: string; text: string }).text.trim();

    // Extract JSON from response (handle potential markdown wrapping)
    let parsed: unknown;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch {
      console.error("[planBuilder] Failed to parse AI response as JSON, falling back to template");
      return buildTemplatePlan(goalRaw, goalKey, goalConfig, events, experts, userContext);
    }

    const validation = validatePlanResponse(parsed);
    if (!validation.valid) {
      console.error(`[planBuilder] AI response failed validation: ${validation.reason}, falling back to template`);
      return buildTemplatePlan(goalRaw, goalKey, goalConfig, events, experts, userContext);
    }

    const horizonWeeks =
      typeof (parsed as Record<string, unknown>).horizon_weeks === "number"
        ? (parsed as Record<string, unknown>).horizon_weeks as number
        : validation.phases.reduce((sum, p) => sum + p.duration_weeks, 0);

    return {
      plan_id: randomUUID(),
      goal_raw: goalRaw,
      goal_key: goalKey,
      goal_category: goalConfig.category,
      generated_at: new Date().toISOString(),
      horizon_weeks: horizonWeeks,
      phases: validation.phases,
      recommended_events: events,
      recommended_experts: experts,
    };
  } catch (err) {
    console.error("[planBuilder] AI plan generation failed, falling back to template:", err);
    return buildTemplatePlan(goalRaw, goalKey, goalConfig, events, experts, userContext);
  }
}
