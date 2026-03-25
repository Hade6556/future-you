export type AmbitionDomain =
  | "entrepreneur"
  | "athlete"
  | "weight_loss"
  | "creative"
  | "student"
  | "wellness";

export type Archetype = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  strengths: string[];
  watchOuts: string[];
  bestFor: AmbitionDomain[];
  ritualStyle: string;
  strengthInsight: string;
  watchOutInsight: string;
  thriveInsight: string;
};

export const ARCHETYPES: Archetype[] = [
  {
    id: "steady",
    name: "The Steady Builder",
    tagline: "Steady wins the race",
    description:
      "You're consistent, warm, and show up every single day. You build trust through reliability and lift others while climbing yourself.",
    strengths: ["Consistency", "Team energy", "Long-term thinking"],
    watchOuts: ["Overcommitting", "Neglecting own needs"],
    bestFor: ["entrepreneur", "wellness"],
    ritualStyle: "Steady daily habits with community check-ins",
    strengthInsight: "You don't need a perfect day to keep going. That quiet consistency compounds into results most people never reach.",
    watchOutInsight: "You say yes because you care — but spreading too thin erodes the very consistency that makes you unstoppable.",
    thriveInsight: "Give you a real goal with real stakes — building a business, owning your health — and you become a force.",
  },
  {
    id: "strategist",
    name: "The Laser Strategist",
    tagline: "Laser focus, maximum output",
    description:
      "You thrive on intensity and precision. Give you a goal and you'll engineer the fastest path there — no distractions.",
    strengths: ["Deep focus", "Strategic thinking", "High output"],
    watchOuts: ["Burnout", "Perfectionism"],
    bestFor: ["entrepreneur", "student"],
    ritualStyle: "Structured sprints with recovery blocks",
    strengthInsight: "You can lock in and outwork almost anyone when the mission is clear. That depth of focus is rare.",
    watchOutInsight: "You push until the engine overheats. Rest isn't weakness — it's the thing that keeps you sharp.",
    thriveInsight: "Complex problems with no obvious answer. Systems, strategy, and decisions that actually matter.",
  },
  {
    id: "endurance",
    name: "The Endurance Engine",
    tagline: "Built for the long haul",
    description:
      "You were made for endurance. You don't sprint — you sustain. Whether it's a marathon or a business, you outlast everyone.",
    strengths: ["Endurance", "Resilience", "Discipline"],
    watchOuts: ["Ignoring rest", "Going solo too long"],
    bestFor: ["athlete", "weight_loss"],
    ritualStyle: "Progressive overload with mindful rest days",
    strengthInsight: "Where others quit, you grind. Your capacity to absorb difficulty and keep moving is your greatest asset.",
    watchOutInsight: "You can endure almost anything — except asking for help. Don't let pride rob you of momentum.",
    thriveInsight: "Physical challenges and long-game goals. Anything that rewards the person who simply refuses to stop.",
  },
  {
    id: "creative",
    name: "The Creative Spark",
    tagline: "Smart, stylish, surprising",
    description:
      "You approach every challenge with creativity and flair. You see solutions others miss and make the journey look effortless.",
    strengths: ["Creativity", "Adaptability", "Problem-solving"],
    watchOuts: ["Shiny object syndrome", "Overthinking"],
    bestFor: ["creative", "entrepreneur"],
    ritualStyle: "Flexible blocks with creative exploration time",
    strengthInsight: "You see angles others miss entirely. That creative edge turns ordinary problems into real breakthroughs.",
    watchOutInsight: "A dozen exciting ideas can pull you in a dozen directions at once. Pick one and go deep.",
    thriveInsight: "Original work, free experimentation, and any space where trying something new is the point.",
  },
  {
    id: "guardian",
    name: "The Guardian",
    tagline: "Protect what matters, build what lasts",
    description:
      "You're driven by purpose and protection. You build systems that protect your health, family, and future — no shortcuts.",
    strengths: ["Discipline", "Loyalty", "Structure"],
    watchOuts: ["Rigidity", "Control"],
    bestFor: ["weight_loss", "wellness", "athlete"],
    ritualStyle: "Strict routine with accountability partners",
    strengthInsight: "Structure is your superpower. When others crumble under pressure, your discipline keeps you moving forward.",
    watchOutInsight: "Rigid systems protect you — until they trap you. Build in flexibility before life forces it on you.",
    thriveInsight: "High-stakes health and physical performance. You flourish when the rules are clear and the mission is real.",
  },
  {
    id: "explorer",
    name: "The Explorer",
    tagline: "Every day is an adventure",
    description:
      "You bring enthusiasm and joy to everything you do. You learn fast, bounce back faster, and make growth feel like play.",
    strengths: ["Enthusiasm", "Quick learning", "Optimism"],
    watchOuts: ["Scattered energy", "Avoiding hard things"],
    bestFor: ["student", "creative", "wellness"],
    ritualStyle: "Gamified challenges with variety and rewards",
    strengthInsight: "Your enthusiasm is contagious and your learning curve is steep in the best way. You pick things up fast.",
    watchOutInsight: "The next exciting thing can steal your focus just before the current thing pays off. Stay the course.",
    thriveInsight: "New skills, creative adventures, and any environment that rewards curiosity and growth.",
  },
];

export const AMBITION_DOMAINS: { id: AmbitionDomain; label: string }[] = [
  { id: "entrepreneur", label: "Build a business" },
  { id: "athlete", label: "Become an athlete" },
  { id: "weight_loss", label: "Lose weight & get healthy" },
  { id: "creative", label: "Create something amazing" },
  { id: "student", label: "Ace my studies" },
  { id: "wellness", label: "Find balance & peace" },
];

export type QuizQuestion = {
  id: string;
  question: string;
  options: { label: string; scores: Record<string, number> }[];
};

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    question: "When you face a big challenge, you tend to...",
    options: [
      { label: "Make a plan and follow it step by step", scores: { strategist: 2, guardian: 1 } },
      { label: "Rally people around me for support", scores: { steady: 2, explorer: 1 } },
      { label: "Push through on pure willpower", scores: { endurance: 2, guardian: 1 } },
      { label: "Find a creative workaround", scores: { creative: 2, explorer: 1 } },
    ],
  },
  {
    id: "q2",
    question: "Your ideal morning routine looks like...",
    options: [
      { label: "Same thing, same time, every day", scores: { guardian: 2, endurance: 1 } },
      { label: "A mix of movement, journaling, and coffee", scores: { steady: 2, explorer: 1 } },
      { label: "Whatever feels right — I go with the flow", scores: { creative: 2, explorer: 1 } },
      { label: "Hard workout first, then deep work", scores: { endurance: 2, strategist: 1 } },
    ],
  },
  {
    id: "q3",
    question: "People say your superpower is...",
    options: [
      { label: "Never giving up", scores: { endurance: 2, guardian: 1 } },
      { label: "Seeing the big picture", scores: { strategist: 2, creative: 1 } },
      { label: "Making everyone feel included", scores: { steady: 2, explorer: 1 } },
      { label: "Turning chaos into something beautiful", scores: { creative: 2, strategist: 1 } },
    ],
  },
  {
    id: "q4",
    question: "When things don't go to plan, you...",
    options: [
      { label: "Adjust and keep going", scores: { endurance: 2, steady: 1 } },
      { label: "Analyze what went wrong", scores: { strategist: 2, guardian: 1 } },
      { label: "Try something completely different", scores: { creative: 2, explorer: 1 } },
      { label: "Lean on my support system", scores: { steady: 2, guardian: 1 } },
    ],
  },
  {
    id: "q5",
    question: "Your dream life looks like...",
    options: [
      { label: "Running my own empire", scores: { strategist: 2, guardian: 1 } },
      { label: "Being fit, strong, and full of energy", scores: { endurance: 2, guardian: 1 } },
      { label: "Creating art, content, or experiences", scores: { creative: 2, explorer: 1 } },
      { label: "Being present, balanced, and at peace", scores: { steady: 2, explorer: 1 } },
    ],
  },
];

export function scoreQuiz(
  answers: number[]
): Archetype {
  const scores: Record<string, number> = {};
  answers.forEach((choiceIdx, qIdx) => {
    const q = QUIZ_QUESTIONS[qIdx];
    if (!q) return;
    const option = q.options[choiceIdx];
    if (!option) return;
    for (const [archId, pts] of Object.entries(option.scores)) {
      scores[archId] = (scores[archId] ?? 0) + pts;
    }
  });

  let bestId = ARCHETYPES[0].id;
  let bestScore = -1;
  for (const [id, score] of Object.entries(scores)) {
    if (score > bestScore) {
      bestScore = score;
      bestId = id;
    }
  }
  return ARCHETYPES.find((a) => a.id === bestId) ?? ARCHETYPES[0];
}

export function scoreQuizFromMap(
  scoreMap: Record<string, number>,
): Archetype {
  let bestId = ARCHETYPES[0].id;
  let bestScore = -1;
  for (const [id, score] of Object.entries(scoreMap)) {
    if (score > bestScore) {
      bestScore = score;
      bestId = id;
    }
  }
  return ARCHETYPES.find((a) => a.id === bestId) ?? ARCHETYPES[0];
}
