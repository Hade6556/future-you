import goalsData from "@/data/goals.json";

export type GoalConfig = {
  display_name: string;
  category: string;
  aliases: string[];
  keywords: string[];
  search_queries: Record<string, string | null>;
  plan_template: string;
  expert_tags: string[];
};

type GoalsJson = {
  goals: Record<string, GoalConfig>;
};

const goals = (goalsData as GoalsJson).goals;

// Build alias → goal_key lookup (lowercase)
const aliasMap = new Map<string, string>();
for (const [key, config] of Object.entries(goals)) {
  for (const alias of config.aliases) {
    aliasMap.set(alias.toLowerCase(), key);
  }
}

function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

function similarity(a: string, b: string): number {
  const dist = levenshtein(a, b);
  return 1 - dist / Math.max(a.length, b.length);
}

export function parseGoal(input: string): { goalKey: string; goalConfig: GoalConfig } {
  const lower = input.toLowerCase().trim();

  // 1. Exact alias match
  if (aliasMap.has(lower)) {
    const key = aliasMap.get(lower)!;
    return { goalKey: key, goalConfig: goals[key] };
  }

  // 2. Substring match (input contains alias or alias contains input, min 8 chars)
  if (lower.length >= 8) {
    for (const [alias, key] of aliasMap) {
      if (lower.includes(alias) || alias.includes(lower)) {
        return { goalKey: key, goalConfig: goals[key] };
      }
    }
  }

  // 3. Fuzzy match at 0.70 similarity cutoff
  let bestKey = "";
  let bestScore = 0;
  for (const [alias, key] of aliasMap) {
    const score = similarity(lower, alias);
    if (score > bestScore) {
      bestScore = score;
      bestKey = key;
    }
  }

  if (bestScore >= 0.7) {
    return { goalKey: bestKey, goalConfig: goals[bestKey] };
  }

  const supported = Object.values(goals).map((g) => g.display_name).join(", ");
  throw new Error(
    `Could not match goal "${input}" to a supported goal. Supported: ${supported}`
  );
}
