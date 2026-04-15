import type { Archetype, QuizAnswers } from "../store/quizStore";

export const ARCHETYPE_DESCRIPTIONS: Record<
  Archetype,
  { emoji: string; description: string; traits: string[] }
> = {
  "Steady Builder": {
    emoji: "🧱",
    description:
      "You build through consistency, not intensity. Your superpower is showing up when others quit. Your biggest challenge: staying motivated when progress feels invisible.",
    traits: ["🔁 Consistent", "🤝 Reliable", "🧘 Patient"],
  },
  "Laser Strategist": {
    emoji: "🎯",
    description:
      "You think in systems and move with precision. When you have a clear path, nothing stops you. Your biggest challenge: getting started when the plan feels incomplete.",
    traits: ["🧠 Strategic", "🎯 Precise", "⚙️ Systems-driven"],
  },
  "Endurance Engine": {
    emoji: "🏔️",
    description:
      "You're built for the long game. You push through when others stop. Your biggest challenge: recovery — you burn hot and crash hard.",
    traits: ["💎 Resilient", "🔥 Driven", "⚡ Relentless"],
  },
  "Creative Spark": {
    emoji: "✨",
    description:
      "You generate ideas others can't imagine. Your energy is electric when you're inspired. Your biggest challenge: finishing what you start.",
    traits: ["🔮 Visionary", "💡 Inventive", "⚡ Energetic"],
  },
  Guardian: {
    emoji: "🛡️",
    description:
      "You show up for everyone except yourself. Your empathy is your greatest strength. Your biggest challenge: putting your own growth first without guilt.",
    traits: ["💚 Empathetic", "🤲 Selfless", "🌿 Nurturing"],
  },
  Explorer: {
    emoji: "🧭",
    description:
      "You grow by experiencing everything. Routine feels like a cage. Your biggest challenge: going deep instead of wide.",
    traits: ["🔍 Curious", "🌊 Adaptable", "🦁 Bold"],
  },
};

export function calculateArchetype(answers: QuizAnswers): Archetype {
  const {
    goalArea,
    dailyTime,
    currentState,
    problems,
    badHabits,
    specificGoals,
    ageRange,
  } = answers;

  // Guardian: Relationships + burnout/stress
  if (
    goalArea === "Relationships & Connection" &&
    (problems.includes("Burnout") || problems.includes("Chronic stress"))
  ) {
    return "Guardian";
  }

  // Creative Spark: Career + entrepreneurial goals
  if (
    goalArea === "Career & Purpose" &&
    (specificGoals.includes("Start something of my own") ||
      specificGoals.includes("Find meaningful work"))
  ) {
    return "Creative Spark";
  }

  // Endurance Engine: Health + fitness/sleep habits
  if (
    goalArea === "Health & Energy" &&
    (badHabits.includes("Skipping workouts") ||
      badHabits.includes("Poor sleep"))
  ) {
    return "Endurance Engine";
  }

  // Laser Strategist: Career/Money + focus/direction problems
  if (
    (goalArea === "Career & Purpose" ||
      goalArea === "Money & Financial Freedom") &&
    (problems.includes("Lack of focus") ||
      problems.includes("No clear direction"))
  ) {
    return "Laser Strategist";
  }

  // Explorer: young or scattered
  if (
    ageRange === "18–24 — Still figuring it all out" ||
    currentState === "Ready but scattered — motivated but no clear system"
  ) {
    return "Explorer";
  }

  // Steady Builder: Health/Mindset + low time + stuck/aware
  if (
    (goalArea === "Health & Energy" ||
      goalArea === "Mindset & Personal Growth") &&
    dailyTime === "5 min — I'm super busy but committed" &&
    (currentState ===
      "Stuck and frustrated — I've tried before and it didn't stick" ||
      currentState ===
        "Aware but paralysed — I know what to do, I just can't start")
  ) {
    return "Steady Builder";
  }

  // Default fallback — score-based
  const scores: Record<Archetype, number> = {
    "Steady Builder": 0,
    "Laser Strategist": 0,
    "Endurance Engine": 0,
    "Creative Spark": 0,
    Guardian: 0,
    Explorer: 0,
  };

  if (
    goalArea === "Health & Energy" ||
    goalArea === "Mindset & Personal Growth"
  )
    scores["Steady Builder"] += 2;
  if (
    goalArea === "Career & Purpose" ||
    goalArea === "Money & Financial Freedom"
  )
    scores["Laser Strategist"] += 2;
  if (goalArea === "Health & Energy") scores["Endurance Engine"] += 1;
  if (goalArea === "Relationships & Connection") scores["Guardian"] += 2;

  if (problems.includes("Procrastination")) scores["Steady Builder"] += 1;
  if (problems.includes("Lack of focus")) scores["Laser Strategist"] += 1;
  if (problems.includes("Low energy")) scores["Endurance Engine"] += 1;
  if (problems.includes("Burnout") || problems.includes("Chronic stress"))
    scores["Guardian"] += 1;
  if (problems.includes("No clear direction")) scores["Explorer"] += 1;
  if (problems.includes("Fear of failure")) scores["Creative Spark"] += 1;

  let best: Archetype = "Steady Builder";
  let bestScore = 0;
  for (const [k, v] of Object.entries(scores)) {
    if (v > bestScore) {
      bestScore = v;
      best = k as Archetype;
    }
  }
  return best;
}
