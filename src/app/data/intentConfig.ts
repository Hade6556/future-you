import type { MarketingIntent } from "@/app/types/marketingIntent";

export type IntentVisual = {
  accent: string;
  accentHover: string;
  accentRgb: string;
};

export type IntentCopy = {
  cardTitle: string;
  cardSubtitle: string;
  narrativePlaceholder: string;
  /** Passed to /api/intake as `tone` and woven into AI context */
  intakeTone: string;
  /** Short line for plan / profile digest */
  planContext: string;
};

export const INTENT_VISUAL: Record<MarketingIntent, IntentVisual> = {
  health_weight: {
    accent: "#5ECDAA",
    accentHover: "#4BB892",
    accentRgb: "94,205,161",
  },
  relationships: {
    accent: "#E8A0BF",
    accentHover: "#D080A0",
    accentRgb: "232,160,191",
  },
  money_stability: {
    accent: "#7EB6E8",
    accentHover: "#5E9AD4",
    accentRgb: "126,182,232",
  },
};

export const INTENT_COPY: Record<MarketingIntent, IntentCopy> = {
  health_weight: {
    cardTitle: "Health & weight",
    cardSubtitle: "Sustainable habits, energy, and confidence in your body.",
    narrativePlaceholder:
      "e.g. I want to lose weight steadily, feel stronger, and stop starting over every few weeks…",
    intakeTone: "Supportive health coach — no shame, no crash-diet framing. Emphasise consistency, sleep, and small wins.",
    planContext:
      "User entered via the health & weight path. Prioritise sustainable nutrition and movement habits, body-neutral language, and realistic weekly pacing.",
  },
  relationships: {
    cardTitle: "Dating & relationships",
    cardSubtitle: "Connection, boundaries, and clarity in your love life.",
    narrativePlaceholder:
      "e.g. I want to feel secure dating again, communicate better with my partner, or meet someone aligned with my values…",
    intakeTone: "Warm relationship coach — dignified, non-judgmental. Focus on communication, self-worth, and clear intentions.",
    planContext:
      "User entered via the relationships path. Prioritise emotional safety, communication skills, and values-aligned actions — avoid pickup or manipulative framing.",
  },
  money_stability: {
    cardTitle: "Money & stability",
    cardSubtitle: "Income, spending, and stress — getting grounded step by step.",
    narrativePlaceholder:
      "e.g. I want to get out of paycheck-to-paycheck stress, build a small safety buffer, and stop avoiding my finances…",
    intakeTone: "Practical financial-wellbeing coach — concrete numbers, low shame, small repeatable actions.",
    planContext:
      "User entered via the money & stability path. Prioritise cash-flow clarity, emergency buffer steps, and stress reduction — avoid get-rich-quick tone.",
  },
};

/** Phase B hook: return extra step keys or alternate flow; currently same 4-step funnel for all intents. */
export function getOnboardingStepIds(_intent: MarketingIntent | null): readonly string[] {
  return ["name", "goal", "location", "narrative"] as const;
}

/** Phase B: intent-specific onboarding steps / question sets — extend getOnboardingStepIds / onboarding UI. */
export const INTENT_PHASE_B_NOTE =
  "Optional: branch onboarding step indices for per-intent MCQs using getOnboardingStepIds(intent).";
