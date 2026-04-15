import type { AmbitionDomain } from "./plan";

/** Stable marketing funnel entry — URLs, analytics, persisted state */
export type MarketingIntent = "health_weight" | "relationships" | "money_stability";

export const MARKETING_INTENTS: readonly MarketingIntent[] = [
  "health_weight",
  "relationships",
  "money_stability",
] as const;

/** Query param aliases → canonical intent */
const INTENT_ALIASES: Record<string, MarketingIntent> = {
  health: "health_weight",
  health_weight: "health_weight",
  weight: "health_weight",
  body: "health_weight",
  relationships: "relationships",
  relationship: "relationships",
  love: "relationships",
  money: "money_stability",
  money_stability: "money_stability",
  finance: "money_stability",
  finances: "money_stability",
  work: "money_stability",
};

export function parseMarketingIntentParam(raw: string | null): MarketingIntent | null {
  if (!raw || typeof raw !== "string") return null;
  const key = raw.trim().toLowerCase().replace(/-/g, "_");
  const mapped = INTENT_ALIASES[key];
  if (mapped) return mapped;
  if ((MARKETING_INTENTS as readonly string[]).includes(key)) return key as MarketingIntent;
  return null;
}

/** Map quiz goal area → marketing intent for theming + API bias (no extra user screen). */
export function inferMarketingIntentFromQuizGoalArea(goalArea: string | null | undefined): MarketingIntent {
  if (!goalArea) return "money_stability";
  if (goalArea.includes("Health") || goalArea.includes("Energy")) return "health_weight";
  if (goalArea.includes("Relationship")) return "relationships";
  return "money_stability";
}

export function defaultAmbitionForIntent(intent: MarketingIntent): AmbitionDomain {
  switch (intent) {
    case "health_weight":
      return "weight_loss";
    case "relationships":
      return "relationships";
    case "money_stability":
      return "finance";
    default: {
      const _exhaustive: never = intent;
      return _exhaustive;
    }
  }
}
