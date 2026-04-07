import type { AmbitionDomain } from "../types/plan";

export type QuizScreenType =
  | "splash"
  | "two-col-cards"
  | "list-rows"
  | "insight-card"
  | "yes-no"
  | "commitment-scale"
  | "win-celebration"
  | "capture-form"
  | "multi-select"
  | "slider-scale"
  | "live-counter"
  | "comparison-card"
  | "timeline-card";

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
  scaleLabels?: string[];
  autoAdvance?: boolean;
  showWhen?: (answers: Record<string, string[]>) => boolean;
};

/* ── helpers ─────────────────────────────────────────────── */

const goalIs = (...keywords: string[]) =>
  (answers: Record<string, string[]>) => {
    const selected = answers["q_goal_area"]?.[0] ?? "";
    return keywords.some((kw) => selected.includes(kw));
  };

/* ── screens ─────────────────────────────────────────────── */

export const QUIZ_SCREENS: QuizScreen[] = [
  {
    id: "splash",
    type: "splash",
    autoAdvance: false,
  },

  /* ═══ Goal area (5 life domains) ═══ */
  {
    id: "q_goal_area",
    type: "list-rows",
    question: "What do you want to improve?",
    subtext: "Pick the area that matters most right now.",
    options: [
      { label: "Career & Ambition", icon: "💼", scores: { strategist: 1 } },
      { label: "Money & Finances", icon: "💰", scores: { strategist: 1, guardian: 1 } },
      { label: "Relationships & Social", icon: "❤️", scores: { steady: 1, explorer: 1 } },
      { label: "Health & Fitness", icon: "💪", scores: { endurance: 1, guardian: 1 } },
      { label: "Mindset & Confidence", icon: "🧠", scores: { steady: 1, creative: 1 } },
    ],
    autoAdvance: false,
  },

  /* ═══ Dynamic goals — one per domain, only matching one shows ═══ */
  {
    id: "q_goals_career",
    type: "multi-select",
    question: "Set your career goals",
    subtext: "Select all that apply.",
    showWhen: goalIs("Career"),
    options: [
      { label: "Get promoted", icon: "📈", scores: { strategist: 2 } },
      { label: "Start a business", icon: "🚀", scores: { creative: 1, strategist: 1 } },
      { label: "Find my dream job", icon: "🎯", scores: { explorer: 1 } },
      { label: "Build leadership skills", icon: "👔", scores: { steady: 1, guardian: 1 } },
    ],
    autoAdvance: false,
  },
  {
    id: "q_goals_money",
    type: "multi-select",
    question: "Set your financial goals",
    subtext: "Select all that apply.",
    showWhen: goalIs("Money"),
    options: [
      { label: "Earn more income", icon: "💵", scores: { strategist: 2 } },
      { label: "Get out of debt", icon: "🔓", scores: { guardian: 2 } },
      { label: "Start investing", icon: "📊", scores: { strategist: 1, explorer: 1 } },
      { label: "Achieve financial freedom", icon: "🏝️", scores: { endurance: 1, creative: 1 } },
    ],
    autoAdvance: false,
  },
  {
    id: "q_goals_relationships",
    type: "multi-select",
    question: "Set your relationship goals",
    subtext: "Select all that apply.",
    showWhen: goalIs("Relationships"),
    options: [
      { label: "Improve communication", icon: "💬", scores: { steady: 2 } },
      { label: "Build deeper connections", icon: "🤝", scores: { steady: 1, explorer: 1 } },
      { label: "Set better boundaries", icon: "🛡️", scores: { guardian: 2 } },
      { label: "Improve my dating life", icon: "❤️‍🔥", scores: { creative: 1, explorer: 1 } },
    ],
    autoAdvance: false,
  },
  {
    id: "q_goals_health",
    type: "multi-select",
    question: "Set your health goals",
    subtext: "Select all that apply.",
    showWhen: goalIs("Health"),
    options: [
      { label: "Lose weight", icon: "⚖️", scores: { endurance: 2 } },
      { label: "Build muscle & strength", icon: "💪", scores: { endurance: 1, guardian: 1 } },
      { label: "Boost my energy levels", icon: "⚡", scores: { explorer: 1, steady: 1 } },
      { label: "Sleep better", icon: "😴", scores: { guardian: 1, steady: 1 } },
    ],
    autoAdvance: false,
  },
  {
    id: "q_goals_mindset",
    type: "multi-select",
    question: "Set your mindset goals",
    subtext: "Select all that apply.",
    showWhen: goalIs("Mindset"),
    options: [
      { label: "Overcome self-doubt", icon: "🪞", scores: { steady: 2 } },
      { label: "Build unshakable confidence", icon: "🦁", scores: { endurance: 1, guardian: 1 } },
      { label: "Manage anxiety & stress", icon: "🧘", scores: { guardian: 1, steady: 1 } },
      { label: "Develop a growth mindset", icon: "🌱", scores: { explorer: 1, creative: 1 } },
    ],
    autoAdvance: false,
  },

  /* ═══ Universal: demographics ═══ */
  {
    id: "q_gender",
    type: "two-col-cards",
    question: "What is your gender?",
    subtext: "Helps us personalise your plan.",
    options: [
      { label: "Male", icon: "👨", scores: {} },
      { label: "Female", icon: "👩", scores: {} },
    ],
    autoAdvance: false,
  },
  {
    id: "q_age",
    type: "list-rows",
    question: "How old are you?",
    subtext: "Your plan adapts to your life stage.",
    options: [
      { label: "20s", icon: "🧑", scores: { explorer: 1 } },
      { label: "30s", icon: "👨", scores: { strategist: 1 } },
      { label: "40s", icon: "🧔", scores: { guardian: 1 } },
      { label: "50+", icon: "🎖️", scores: { steady: 1 } },
    ],
    autoAdvance: false,
  },

  /* ═══ Universal: problems ═══ */
  {
    id: "q_problems",
    type: "multi-select",
    question: "Which of these is a problem for you?",
    subtext: "Select all that apply.",
    options: [
      { label: "Procrastination", icon: "⏳", scores: { guardian: 1 } },
      { label: "Focus issues", icon: "🧠", scores: { strategist: 1 } },
      { label: "Bad habits", icon: "🔄", scores: { endurance: 1 } },
      { label: "Stress & burnout", icon: "🔥", scores: { steady: 1 } },
    ],
    autoAdvance: false,
  },

  /* ═══ Insight: live counter ═══ */
  {
    id: "insight_right_place",
    type: "live-counter",
    ctaLabel: "I'm ready",
    autoAdvance: false,
  },

  /* ═══ Universal: current state ═══ */
  {
    id: "q_current_state",
    type: "list-rows",
    question: "What best describes your current state?",
    subtext: "Be honest — this shapes your plan.",
    options: [
      { label: "In control & motivated", icon: "✅", scores: { strategist: 1, guardian: 1 } },
      { label: "Confused how to succeed", icon: "🤷", scores: { explorer: 1 } },
      { label: "Worried that I will fail", icon: "😟", scores: { steady: 1 } },
      { label: "On the verge of burnout", icon: "🔥", scores: { endurance: 1 } },
    ],
    autoAdvance: false,
  },

  /* ═══ Insight: expert research ═══ */
  {
    id: "insight_expert",
    type: "insight-card",
    stat: "6 min",
    headline: "Most users finish their first action before this screen fades.",
    body: "**Motivation fades. Systems last.** We break your goal into one tiny action with a clear trigger — so you move even on your worst day.",
    ctaLabel: "Build my system →",
    autoAdvance: false,
  },

  /* ═══ Universal: bad habits ═══ */
  {
    id: "q_bad_habits",
    type: "multi-select",
    question: "Which bad habits do you want to quit?",
    subtext: "Select all that apply.",
    options: [
      { label: "Negative self-talk", icon: "💭", scores: { steady: 1, creative: 1 } },
      { label: "Lack of routine", icon: "🔁", scores: { guardian: 1 } },
      { label: "Too much social media", icon: "📱", scores: { strategist: 1 } },
      { label: "Unhealthy eating", icon: "🍔", scores: { endurance: 1 } },
    ],
    autoAdvance: false,
  },

  /* ═══ Insight: comparison ═══ */
  {
    id: "insight_not_enough",
    type: "comparison-card",
    ctaLabel: "That makes sense",
    autoAdvance: false,
  },

  /* ═══ Universal tail: schedule, commitment ═══ */

  {
    id: "q_time_per_day",
    type: "list-rows",
    question: "How much time per day can you dedicate?",
    subtext: "Even 5 minutes compounds.",
    options: [
      { label: "5 min", icon: "⏱️", scores: { explorer: 1 } },
      { label: "15 min+", icon: "⏰", scores: { endurance: 1, guardian: 1 } },
      { label: "Not sure", icon: "🤷", scores: { steady: 1 } },
    ],
    autoAdvance: false,
  },

  /* ═══ Insight: timeline ═══ */
  {
    id: "insight_save_time",
    type: "timeline-card",
    ctaLabel: "Lock in my plan",
    autoAdvance: false,
  },

  {
    id: "q_commitment",
    type: "commitment-scale",
    question: "Can you commit at least 15 minutes daily for the next 40 days?",
    subtext: "1 = maybe · 4 = absolutely",
    autoAdvance: false,
  },

  {
    id: "win",
    type: "win-celebration",
    autoAdvance: false,
  },
];
