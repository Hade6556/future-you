import type { GoalPlan } from "@/app/types/pipeline";
import { matchGoalTheme, GOAL_THEMES, type GoalTheme } from "./goalKeywords";

export type EventSearchContext = {
  searchQueries: string[];
  scoringHint: string;
  goalRaw: string;
};

/** Direct mapping from quiz ambitionType slugs to theme IDs in the database. */
const QUIZ_SLUG_TO_THEME: Record<string, string> = {
  entrepreneur: "entrepreneurship",
  athlete: "sports",
  weight_loss: "weight_loss",
  creative: "art",
  student: "coding",
  wellness: "mental_health",
  career: "job_search",
  finance: "side_hustle",
  language: "language_learning",
  travel: "travel",
  relationships: "networking",
  productivity: "productivity",
  mindfulness: "meditation",
  confidence: "confidence",
};

function findThemeById(id: string): GoalTheme | undefined {
  return GOAL_THEMES.find((t) => t.id === id);
}

function buildContext(theme: GoalTheme, goalRaw: string): EventSearchContext {
  return {
    searchQueries: theme.searchQueries,
    scoringHint: theme.scoringHint,
    goalRaw,
  };
}

/**
 * Resolve the user's goal into structured event-search context.
 * Priority: goal_raw text (most specific) → quiz slug → phase goal → AI fallback
 */
export function resolveEventSearchContext(
  ambitionType: string | null | undefined,
  pipelinePlan: GoalPlan | null | undefined
): EventSearchContext | null {
  // 1. Best source: the user's own goal text (most specific)
  const raw = pipelinePlan?.goal_raw?.trim();
  if (raw) {
    const theme = matchGoalTheme(raw);
    if (theme) return buildContext(theme, raw);
  }

  // 2. Quiz ambitionType slug → curated theme
  if (ambitionType) {
    const themeId = QUIZ_SLUG_TO_THEME[ambitionType];
    if (themeId) {
      const theme = findThemeById(themeId);
      if (theme) {
        const goalText = raw || ambitionType.replace(/_/g, " ").trim();
        return buildContext(theme, goalText);
      }
    }
    const slug = ambitionType.replace(/_/g, " ").trim();
    const fuzzy = matchGoalTheme(slug);
    if (fuzzy) return buildContext(fuzzy, raw || slug);
  }

  // 3. Unmatched raw goal → AI fallback
  if (raw) {
    return { searchQueries: [], scoringHint: raw.slice(0, 160), goalRaw: raw.slice(0, 160) };
  }

  // 4. Phase goal as last resort
  const phaseGoal = pipelinePlan?.phases?.[0]?.goal?.trim();
  if (phaseGoal) {
    const theme = matchGoalTheme(phaseGoal);
    if (theme) return buildContext(theme, phaseGoal);
    return { searchQueries: [], scoringHint: phaseGoal.slice(0, 160), goalRaw: phaseGoal.slice(0, 160) };
  }

  return null;
}
