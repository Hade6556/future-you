"use client";

import type { GoalPlan, PipelinePhase, UserContext } from "@/app/types/pipeline";
import type { AmbitionDomain } from "@/app/types/plan";
import type { MarketingIntent } from "@/app/types/marketingIntent";
import { AMBITION_GOAL_MAP } from "@/app/types/pipeline";
import { BEHAVIO_INTAKE_SAVED_EVENT } from "@/lib/behavio-intake-event";

import fitnessTemplate from "@/data/templates/fitness_weight_loss.json";
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

const STARTER_PLAN_STORAGE_PREFIX = "behavio-plan-";
const PENDING_NARRATIVE_KEY = "behavio-pending-narrative";

type StarterTemplate = {
  horizon_weeks: number;
  phases: PipelinePhase[];
};

const TEMPLATE_BY_DOMAIN: Record<AmbitionDomain, StarterTemplate> = {
  entrepreneur:  entrepreneurshipTemplate as StarterTemplate,
  athlete:       athleticsTemplate as StarterTemplate,
  weight_loss:   fitnessTemplate as StarterTemplate,
  creative:      creativeTemplate as StarterTemplate,
  student:       studentTemplate as StarterTemplate,
  wellness:      wellnessTemplate as StarterTemplate,
  career:        careerTemplate as StarterTemplate,
  finance:       financeTemplate as StarterTemplate,
  language:      languageTemplate as StarterTemplate,
  travel:        travelTemplate as StarterTemplate,
  relationships: relationshipsTemplate as StarterTemplate,
  productivity:  productivityTemplate as StarterTemplate,
  mindfulness:   mindfulnessTemplate as StarterTemplate,
  confidence:    confidenceTemplate as StarterTemplate,
};

function generatePlanId(): string {
  return `plan-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

interface BuildStarterArgs {
  ambition: AmbitionDomain;
  narrative: string;
}

/**
 * Returns a complete `GoalPlan` synthesized from the existing JSON template
 * for the user's ambition domain — ready to be set on planStore immediately,
 * with no LLM call. Phases/steps come straight from the curated template.
 * `recommended_events` and `recommended_experts` are empty until the
 * background AI upgrade returns.
 */
export function buildStarterPlan({ ambition, narrative }: BuildStarterArgs): GoalPlan {
  const template = TEMPLATE_BY_DOMAIN[ambition] ?? TEMPLATE_BY_DOMAIN.confidence;
  return {
    plan_id: generatePlanId(),
    goal_raw: narrative.slice(0, 500),
    goal_key: ambition,
    goal_category: ambition,
    generated_at: new Date().toISOString(),
    horizon_weeks: template.horizon_weeks,
    phases: template.phases,
    recommended_events: [],
    recommended_experts: [],
  };
}

/** Stub intake — same shape used previously by /generating. */
function stubIntakeFromNarrative(narrative: string) {
  const clip = narrative.trim().slice(0, 200);
  return {
    values: ["Focus", "Growth", "Momentum"],
    roles: ["Builder"],
    paths: [
      {
        name: "Your roadmap",
        description: clip || "We're tailoring paths from what you shared — richer detail appears in a moment.",
        timeHorizon: "90 days",
        tradeoffs: "",
      },
    ],
  };
}

/** Persist a starter intake payload right away (sessionStorage + localStorage). */
export function persistStarterIntake(planId: string, narrative: string) {
  if (typeof window === "undefined") return;
  const payload = JSON.stringify(stubIntakeFromNarrative(narrative));
  try {
    sessionStorage.setItem(`${STARTER_PLAN_STORAGE_PREFIX}${planId}`, payload);
  } catch { /* private mode */ }
  try {
    localStorage.setItem(`${STARTER_PLAN_STORAGE_PREFIX}${planId}`, payload);
  } catch { /* quota */ }
}

interface BackgroundUpgradeArgs {
  ambition: AmbitionDomain;
  narrative: string;
  location: string | null;
  archetypeId: string | null;
  marketingIntent: MarketingIntent | null;
  intakeTone: string;
  planId: string;
  onPlanUpgrade: (plan: GoalPlan) => void;
}

/**
 * Fire-and-forget background upgrade. Calls `/api/plan` (and `/api/intake` in
 * parallel). When the AI plan returns, calls `onPlanUpgrade(plan)` to swap
 * the starter for the personalized version. Failures are swallowed — the
 * starter plan stays in place.
 */
export function triggerBackgroundUpgrade({
  ambition,
  narrative,
  location,
  archetypeId,
  marketingIntent,
  intakeTone,
  planId,
  onPlanUpgrade,
}: BackgroundUpgradeArgs) {
  if (typeof window === "undefined") return;

  const goalString = AMBITION_GOAL_MAP[ambition] ?? narrative.slice(0, 100);
  const userContext: UserContext = {
    dreamNarrative: narrative,
    archetype: archetypeId ?? undefined,
    ambitionDomain: ambition,
    marketingIntent: marketingIntent ?? undefined,
  };

  // Intake — runs in parallel; replaces the stub if it succeeds.
  fetch("/api/intake", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      narrative,
      tone: intakeTone,
      marketingIntent: marketingIntent ?? undefined,
    }),
    credentials: "include",
  })
    .then((res) => (res.ok ? res.json() : null))
    .then((intakeData) => {
      if (!intakeData) return;
      try {
        const payload = JSON.stringify(intakeData);
        sessionStorage.setItem(`${STARTER_PLAN_STORAGE_PREFIX}${planId}`, payload);
        localStorage.setItem(`${STARTER_PLAN_STORAGE_PREFIX}${planId}`, payload);
      } catch { /* ignore */ }
      window.dispatchEvent(
        new CustomEvent(BEHAVIO_INTAKE_SAVED_EVENT, { detail: { planId } }),
      );
    })
    .catch(() => { /* ignore */ });

  // Plan upgrade — replaces starter when AI version returns.
  fetch("/api/plan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      goal: goalString,
      location: location || null,
      userContext,
    }),
    credentials: "include",
  })
    .then((res) => (res.ok ? (res.json() as Promise<GoalPlan>) : null))
    .then((planData) => {
      if (!planData || !Array.isArray(planData.phases) || planData.phases.length === 0) return;
      // Reuse the existing planId so any references still resolve.
      onPlanUpgrade({ ...planData, plan_id: planId });
    })
    .catch(() => { /* user keeps the starter, no error surfaced */ });

  // Clear pending narrative — plan is committed.
  try {
    sessionStorage.removeItem(PENDING_NARRATIVE_KEY);
  } catch { /* ignore */ }
}
