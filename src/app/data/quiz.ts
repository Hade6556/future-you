import type { AmbitionDomain } from "../types/plan";

export type QuizScreenType =
  | "splash"
  | "two-col-cards"
  | "list-rows"
  | "insight-card"
  | "yes-no"
  | "commitment-scale"
  | "win-celebration"
  | "capture-form";

export type QuizOption = {
  label: string;
  icon?: string;
  ambition?: AmbitionDomain;
  scores: Record<string, number>;
};

export type QuizScreen = {
  id: string;
  type: QuizScreenType;
  question?: string;
  subtext?: string;
  options?: QuizOption[];
  headline?: string;
  body?: string;
  stat?: string;
  ctaLabel?: string;
  autoAdvance?: boolean;
};

export const QUIZ_SCREENS: QuizScreen[] = [
  // Step 0: Splash — warm first impression
  {
    id: "splash",
    type: "splash",
    autoAdvance: false,
  },

  // Step 1: Gender — 2-col cards, zero cognitive load, first micro-commitment
  {
    id: "q_gender",
    type: "two-col-cards",
    question: "I am a...",
    subtext: "Helps us tailor everything to you.",
    options: [
      { label: "Man", icon: "👨", scores: {} },
      { label: "Woman", icon: "👩", scores: {} },
    ],
    autoAdvance: false,
  },

  // Step 2: Field — list rows, personalisation hook
  {
    id: "q_field",
    type: "list-rows",
    question: "I work in...",
    subtext: "We focus your plan on what actually matters in your world.",
    options: [
      { label: "Tech & Product", icon: "💻", ambition: "career" as AmbitionDomain, scores: {} },
      { label: "Business & Sales", icon: "📊", ambition: "entrepreneur" as AmbitionDomain, scores: {} },
      { label: "Creative & Marketing", icon: "🎨", ambition: "confidence" as AmbitionDomain, scores: {} },
      { label: "Finance & Wealth", icon: "💰", ambition: "finance" as AmbitionDomain, scores: {} },
      { label: "Health & Fitness", icon: "💪", ambition: "athlete" as AmbitionDomain, scores: {} },
      { label: "Something else", icon: "✨", ambition: "relationships" as AmbitionDomain, scores: {} },
    ],
    autoAdvance: false,
  },

  // Step 3: Feeling — emotional identification, most important question
  {
    id: "q_feeling",
    type: "list-rows",
    question: "Honestly, I feel...",
    subtext: "No wrong answer. This shapes your entire plan.",
    options: [
      { label: "Stuck", icon: "🧱", scores: {} },
      { label: "Undervalued", icon: "🔇", scores: {} },
      { label: "Ready", icon: "⚡", scores: {} },
      { label: "Burned out", icon: "🔥", scores: {} },
    ],
    autoAdvance: false,
  },

  // Step S1: Insight card — belief seed
  {
    id: "insight_1",
    type: "insight-card",
    stat: "87%",
    headline: "of driven professionals hit their milestone within 90 days — with the right system.",
    body: "The gap between where you are and where you want to be isn't a willpower problem. It's a system problem.",
    ctaLabel: "That's me — keep going",
    autoAdvance: false,
  },

  // Step 4: Goal — dream seeding
  {
    id: "q_goal",
    type: "list-rows",
    question: "My biggest win would be...",
    subtext: "The thing you actually want. Not what sounds reasonable.",
    options: [
      { label: "Promotion to VP or Director", icon: "🎯", scores: {} },
      { label: "Starting my own business", icon: "🚀", scores: {} },
      { label: "Earning significantly more", icon: "💰", scores: {} },
      { label: "Being known in my field", icon: "🌟", scores: {} },
    ],
    autoAdvance: false,
  },

  // Step 5: History — Yes/No pills, format switch, pre-handles objections
  {
    id: "q_history",
    type: "yes-no",
    question: "Have you tried working on this before?",
    subtext: "Most people have. There's no wrong answer.",
    autoAdvance: false,
  },

  // Step S2: Insight card — objection handler
  {
    id: "insight_2",
    type: "insight-card",
    stat: "3×",
    headline: "more likely to close the gap with a structured daily plan.",
    body: "Most systems fail because they're generic. Yours is built from your real trajectory — not a template.",
    ctaLabel: "Build my system",
    autoAdvance: false,
  },

  // Step 6: Timeline — urgency
  {
    id: "q_timeline",
    type: "list-rows",
    question: "When do you need this?",
    subtext: "Pick the honest answer, not the optimistic one.",
    options: [
      { label: "6 months", icon: "🔥", scores: {} },
      { label: "12 months", icon: "📍", scores: {} },
      { label: "2 years", icon: "🗓", scores: {} },
      { label: "As fast as possible", icon: "⚡", scores: {} },
    ],
    autoAdvance: false,
  },

  // Step 7: Commitment — final escalation, format switch
  {
    id: "q_commitment",
    type: "commitment-scale",
    question: "How committed are you to making this change?",
    subtext: "1 = curious · 5 = all in",
    autoAdvance: false,
  },

  // Step WIN: Celebration — confetti + "Top 12%" dopamine peak
  {
    id: "win",
    type: "win-celebration",
    autoAdvance: false,
  },

  // Step 8: Capture — name + email, "Where should we send your plan?"
  {
    id: "capture",
    type: "capture-form",
    question: "Where should we send your plan?",
    autoAdvance: false,
  },
];
