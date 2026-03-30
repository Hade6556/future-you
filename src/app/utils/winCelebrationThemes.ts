/**
 * Derives the three life-area themes for the quiz win-celebration screen
 * from `multiSelectAnswers` (q_goal_area, q_problems, plus fallbacks).
 */

export type DomainKey = "career" | "money" | "relationships" | "health" | "mindset" | "learning";

export type WinCelebrationThemeLine = {
  key: DomainKey;
  shortLabel: string;
  emoji: string;
  color: string;
  points: number[];
};

/** Rank 1–3 curve shapes (same as legacy Money / Relationships / Success lines). */
const RANK_POINTS: readonly [readonly number[], readonly number[], readonly number[]] = [
  [0.18, 0.32, 0.55, 0.78, 0.95],
  [0.22, 0.33, 0.48, 0.65, 0.82],
  [0.25, 0.3, 0.42, 0.58, 0.72],
];

/** Primary = top line (lime); ranks 2–3 match previous chart hierarchy. */
const LINE_COLORS = ["#C8FF00", "#2DD4C0", "#5B8DEF"] as const;

const DOMAIN_META: Record<
  DomainKey,
  { shortLabel: string; emoji: string }
> = {
  career: { shortLabel: "Career", emoji: "💼" },
  money: { shortLabel: "Money", emoji: "💰" },
  relationships: { shortLabel: "Relationships", emoji: "❤️" },
  health: { shortLabel: "Health", emoji: "💪" },
  mindset: { shortLabel: "Mindset", emoji: "🧠" },
  learning: { shortLabel: "Learning", emoji: "📚" },
};

/** Order used to fill remaining slots when problems + primary yield fewer than 3 domains. */
const FILL_ORDER: DomainKey[] = [
  "relationships",
  "health",
  "money",
  "mindset",
  "career",
  "learning",
];

export const WIN_CELEBRATION_BASELINE = {
  label: "Without program",
  color: "#FF5555",
  emoji: "",
  points: [0.25, 0.27, 0.24, 0.22, 0.2] as const,
};

function goalAreaLabelToDomain(label: string): DomainKey | null {
  if (label.includes("Career")) return "career";
  if (label.includes("Money")) return "money";
  if (label.includes("Relationships")) return "relationships";
  if (label.includes("Health")) return "health";
  if (label.includes("Mindset")) return "mindset";
  if (label.includes("Learning")) return "learning";
  return null;
}

function problemLabelToDomain(problem: string): DomainKey | null {
  const p = problem.trim();
  if (p.includes("Financial stress")) return "money";
  if (p.includes("Poor sleep")) return "health";
  if (p.includes("Lack of direction")) return "career";
  if (
    p.includes("ADHD") ||
    p.includes("Bad habits") ||
    p.includes("Stress & burnout") ||
    p.includes("Low self-esteem") ||
    p.includes("Procrastination")
  ) {
    return "mindset";
  }
  return null;
}

export function buildWinCelebrationLines(answers: Record<string, string[]>): {
  themes: WinCelebrationThemeLine[];
  headlinePartsLower: string[];
} {
  const goalLabel = answers["q_goal_area"]?.[0] ?? "";
  const primary: DomainKey = goalAreaLabelToDomain(goalLabel) ?? "career";

  const ordered: DomainKey[] = [];
  const pushUnique = (d: DomainKey) => {
    if (!ordered.includes(d)) ordered.push(d);
  };

  pushUnique(primary);

  for (const prob of answers["q_problems"] ?? []) {
    const m = problemLabelToDomain(prob);
    if (m) pushUnique(m);
    if (ordered.length >= 3) break;
  }

  for (const key of FILL_ORDER) {
    if (ordered.length >= 3) break;
    pushUnique(key);
  }

  while (ordered.length < 3) {
    for (const k of FILL_ORDER) {
      pushUnique(k);
      if (ordered.length >= 3) break;
    }
  }

  const three = ordered.slice(0, 3).map((key, i) => ({
    key,
    shortLabel: DOMAIN_META[key].shortLabel,
    emoji: DOMAIN_META[key].emoji,
    color: LINE_COLORS[i],
    points: [...RANK_POINTS[i]],
  }));

  return {
    themes: three,
    headlinePartsLower: three.map((t) => t.shortLabel.toLowerCase()),
  };
}
