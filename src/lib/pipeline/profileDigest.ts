import type { UserContext } from "@/app/types/pipeline";

const ARCHETYPE_LABELS: Record<string, string> = {
  steady: "Steady Builder (consistency, team energy, long-term thinking)",
  strategist: "Laser Strategist (deep focus, precision, metrics-driven)",
  endurance: "Endurance Engine (resilience, discipline, sustainable grind)",
  creative: "Creative Spark (experiments > rigid plans, adaptable)",
  guardian: "Guardian (structure, loyalty, protection-oriented)",
  explorer: "Explorer (enthusiasm, curiosity, joy in growth)",
};

const ARCHETYPE_COACHING_VOICE: Record<string, string> = {
  steady: "Warm and grounding. Use 'we' language. Frame steps as building blocks.",
  strategist: "Direct and precise. Lead with the outcome. Include metrics in every step.",
  endurance: "Gritty and resilient. Remind them this is where others quit. Honour the grind.",
  creative: "Energetic and playful. Frame steps as experiments, not obligations. Celebrate novelty.",
  guardian: "Structured and dependable. Focus on protecting progress. Clear checklists.",
  explorer: "Adventurous and curious. Frame steps as discoveries. Emphasise joy in the process.",
};

type CoachingFlag = { signal: string; instruction: string };

function deriveCoachingFlags(ctx: UserContext): CoachingFlag[] {
  const flags: CoachingFlag[] = [];

  // Obstacle-based flags
  const obstacles = [...(ctx.obstacles ?? []), ...(ctx.problems ?? [])];
  const obstacleSet = new Set(obstacles.map((o) => o.toLowerCase()));

  if (obstacleSet.has("adhd") || obstacleSet.has("procrastination")) {
    flags.push({
      signal: "ADHD / Procrastination",
      instruction:
        "Use shorter steps (max 1 week each), frequent milestones for dopamine hits, and break big tasks into micro-actions. Avoid open-ended 'figure it out' steps.",
    });
  }

  if (obstacleSet.has("stress") || obstacleSet.has("burnout")) {
    flags.push({
      signal: "Stress / Burnout",
      instruction:
        "Phase 1 MUST start gentle with recovery and foundation-building. Include breathing room between steps. No high-pressure deadlines early.",
    });
  }

  if (obstacleSet.has("financial stress")) {
    flags.push({
      signal: "Financial stress",
      instruction:
        "Suggest only free or low-cost resources. Avoid steps that require significant financial investment.",
    });
  }

  if (obstacleSet.has("lack of direction")) {
    flags.push({
      signal: "Lack of direction",
      instruction:
        "Phase 1 should be entirely about clarity and self-discovery before any execution steps.",
    });
  }

  if (obstacleSet.has("low self-esteem")) {
    flags.push({
      signal: "Low self-esteem",
      instruction:
        "Front-load quick wins that build evidence of capability. Include reflection steps that highlight progress.",
    });
  }

  // Self-trust
  if (ctx.selfTrust?.toLowerCase().includes("not at all")) {
    flags.push({
      signal: "Very low self-trust",
      instruction:
        "Build confidence with small validation checkpoints before any big asks. Each milestone should feel achievable within days, not weeks.",
    });
  } else if (ctx.selfTrust?.toLowerCase().includes("somewhat")) {
    flags.push({
      signal: "Moderate self-trust",
      instruction:
        "Balance stretch goals with safety nets. Include periodic reflection to reinforce evidence of progress.",
    });
  }

  // Current state
  if (ctx.currentState?.toLowerCase().includes("burnout")) {
    flags.push({
      signal: "Currently in burnout",
      instruction:
        "Start with a wellbeing recovery phase before any goal-driven work. First 2 weeks should focus on energy restoration.",
    });
  }
  if (ctx.currentState?.toLowerCase().includes("afraid") || ctx.currentState?.toLowerCase().includes("failure")) {
    flags.push({
      signal: "Fear of failure",
      instruction:
        "Front-load small wins and delay intimidating steps. Frame milestones as experiments ('test if X works') rather than pass/fail outcomes.",
    });
  }

  // Past attempts
  const pastAttempts = (ctx.pastAttempts ?? "").toLowerCase();
  const pastList = ctx.domainAnswers?.["q_past_actions"] ?? [];
  const pastSet = new Set([pastAttempts, ...pastList.map((p) => p.toLowerCase())]);

  if (pastSet.has("books") || pastSet.has("courses") || pastSet.has("youtube")) {
    flags.push({
      signal: "Past attempts were passive (books, courses, YouTube)",
      instruction:
        "Every single step must be ACTION-BASED. No 'read about X' or 'watch a video on Y'. Instead: 'Do X', 'Build Y', 'Talk to Z'.",
    });
  }

  // Bad habits
  if (ctx.badHabits?.some((h) => h.toLowerCase().includes("negative self-talk"))) {
    flags.push({
      signal: "Negative self-talk habit",
      instruction:
        "Use affirming language in step descriptions. Include a daily mindset or journaling micro-step in Phase 1.",
    });
  }
  if (ctx.badHabits?.some((h) => h.toLowerCase().includes("social media"))) {
    flags.push({
      signal: "Excessive social media use",
      instruction:
        "Include a digital detox or screen-time boundary step early. Avoid any steps that rely heavily on social media unless the goal requires it.",
    });
  }

  // Wellbeing signals
  const lowMood = ctx.moodRating != null && ctx.moodRating <= 3;
  const poorSleep = ctx.sleepQuality?.toLowerCase().includes("poor") || ctx.sleepQuality?.toLowerCase().includes("bad");
  const highStress = ctx.stressLevel?.toLowerCase().includes("high") || ctx.stressLevel?.toLowerCase().includes("very");

  if (lowMood || poorSleep || highStress) {
    const parts = [lowMood && "low mood", poorSleep && "poor sleep", highStress && "high stress"].filter(Boolean);
    flags.push({
      signal: `Wellbeing concern: ${parts.join(", ")}`,
      instruction:
        "Phase 1 must include a wellbeing foundation step (sleep hygiene, stress management, or mood support) before goal-specific work.",
    });
  }

  // Archetype voice
  if (ctx.archetype && ARCHETYPE_COACHING_VOICE[ctx.archetype]) {
    flags.push({
      signal: `Archetype: ${ARCHETYPE_LABELS[ctx.archetype] ?? ctx.archetype}`,
      instruction: `Voice & framing: ${ARCHETYPE_COACHING_VOICE[ctx.archetype]}`,
    });
  }

  // Age-appropriate pacing
  if (ctx.ageGroup?.includes("50") || ctx.ageGroup?.includes("60")) {
    flags.push({
      signal: `Age group: ${ctx.ageGroup}`,
      instruction:
        "Respect lived experience — avoid patronising language. Pace appropriately. Leverage existing networks and wisdom as assets.",
    });
  }

  // Motivations
  if (ctx.motivations?.some((m) => m.toLowerCase().includes("family"))) {
    flags.push({
      signal: "Motivated by family",
      instruction:
        "Connect milestones back to family impact. Use 'for your family' framing where natural.",
    });
  }

  return flags;
}

export function buildUserProfileDigest(ctx: UserContext): string {
  const lines: string[] = [];

  lines.push("## User Profile");

  // Demographics
  const demoParts = [ctx.gender, ctx.ageGroup].filter(Boolean);
  if (demoParts.length) lines.push(`- Demographics: ${demoParts.join(", ")}`);

  // Dream / Vision
  if (ctx.dreamNarrative) {
    lines.push(`- Dream: "${ctx.dreamNarrative}"`);
  }
  if (ctx.vision) {
    lines.push(`- Vision: "${ctx.vision}"`);
  }

  // Goals
  if (ctx.primaryGoal) lines.push(`- Primary Goal: ${ctx.primaryGoal}`);
  if (ctx.specificGoals?.length) {
    lines.push(`- Specific Goals: ${ctx.specificGoals.join(", ")}`);
  }
  if (ctx.ambitionDomain) lines.push(`- Domain: ${ctx.ambitionDomain}`);

  // Archetype
  if (ctx.archetype) {
    lines.push(`- Archetype: ${ARCHETYPE_LABELS[ctx.archetype] ?? ctx.archetype}`);
  }

  // Intake AI extractions
  if (ctx.values?.length) lines.push(`- Core Values: ${ctx.values.join(", ")}`);
  if (ctx.roles?.length) lines.push(`- Life Roles: ${ctx.roles.join(", ")}`);
  if (ctx.intakePaths?.length) {
    const pathSummary = ctx.intakePaths.map((p) => `${p.name} (${p.timeHorizon})`).join("; ");
    lines.push(`- Suggested Paths: ${pathSummary}`);
  }

  // Motivations & State
  if (ctx.motivations?.length) lines.push(`- Motivations: ${ctx.motivations.join(", ")}`);
  if (ctx.currentState) lines.push(`- Current State: ${ctx.currentState}`);

  // Obstacles & Problems
  const allObstacles = [...(ctx.obstacles ?? []), ...(ctx.problems ?? [])];
  if (allObstacles.length) {
    lines.push(`- Obstacles: ${[...new Set(allObstacles)].join(", ")}`);
  }

  // Self-trust
  if (ctx.selfTrust) lines.push(`- Self-Trust: ${ctx.selfTrust}`);

  // Bad habits
  if (ctx.badHabits?.length) lines.push(`- Bad Habits to Quit: ${ctx.badHabits.join(", ")}`);

  // Past attempts
  const pastActions = ctx.domainAnswers?.["q_past_actions"] ?? [];
  if (ctx.pastAttempts || pastActions.length) {
    const past = pastActions.length ? pastActions.join(", ") : ctx.pastAttempts;
    lines.push(`- Past Self-Improvement Attempts: ${past}`);
  }

  // Wellbeing
  const wellbeingParts = [
    ctx.energyLevel && `Energy: ${ctx.energyLevel}`,
    ctx.sleepQuality && `Sleep: ${ctx.sleepQuality}`,
    ctx.stressLevel && `Stress: ${ctx.stressLevel}`,
    ctx.moodRating != null && `Mood: ${ctx.moodRating}/10`,
  ].filter(Boolean);
  if (wellbeingParts.length) lines.push(`- Wellbeing: ${wellbeingParts.join(" | ")}`);

  // Schedule & Commitment
  if (ctx.schedule) lines.push(`- Available Days: ${ctx.schedule}`);
  if (ctx.timeline) lines.push(`- Timeline: ${ctx.timeline}`);
  if (ctx.commitment) lines.push(`- Commitment Level: ${ctx.commitment}`);

  // Domain-specific answers (filtered to meaningful ones)
  if (ctx.domainAnswers) {
    const domainKeys = Object.keys(ctx.domainAnswers).filter(
      (k) =>
        k.startsWith("q_deep_") ||
        k.includes("fitness") ||
        k.includes("sleep") ||
        k.includes("morning") ||
        k.includes("mindset") ||
        k.includes("career_areas") ||
        k.includes("money_areas") ||
        k.includes("relationship_areas") ||
        k.includes("education_areas") ||
        k.includes("productivity_areas") ||
        k.includes("health_areas"),
    );
    for (const key of domainKeys) {
      const vals = ctx.domainAnswers[key];
      if (vals?.length) {
        const label = key.replace(/^q_/, "").replace(/_/g, " ");
        lines.push(`- ${label}: ${vals.join(", ")}`);
      }
    }
  }

  // Coaching flags
  const flags = deriveCoachingFlags(ctx);
  if (flags.length) {
    lines.push("");
    lines.push("## Coaching Flags (MUST follow these)");
    for (const flag of flags) {
      lines.push(`- [${flag.signal}] → ${flag.instruction}`);
    }
  }

  return lines.join("\n");
}
