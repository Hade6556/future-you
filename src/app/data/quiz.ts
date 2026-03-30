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

  /* ═══ Goal area (6 life domains) ═══ */
  {
    id: "q_goal_area",
    type: "list-rows",
    question: "What do you want to improve?",
    subtext: "Pick the area that matters most right now.",
    options: [
      { label: "Career & Ambition", icon: "💼", scores: {} },
      { label: "Money & Finances", icon: "💰", scores: {} },
      { label: "Relationships & Social", icon: "❤️", scores: {} },
      { label: "Health & Fitness", icon: "💪", scores: {} },
      { label: "Mindset & Confidence", icon: "🧠", scores: {} },
      { label: "Learning & Education", icon: "📚", scores: {} },
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
      { label: "Get promoted", icon: "📈", scores: {} },
      { label: "Start a business", icon: "🚀", scores: {} },
      { label: "Find my dream job", icon: "🎯", scores: {} },
      { label: "Build leadership skills", icon: "👔", scores: {} },
      { label: "Improve work-life balance", icon: "⚖️", scores: {} },
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
      { label: "Earn more income", icon: "💵", scores: {} },
      { label: "Get out of debt", icon: "🔓", scores: {} },
      { label: "Start investing", icon: "📊", scores: {} },
      { label: "Build an emergency fund", icon: "🏦", scores: {} },
      { label: "Achieve financial freedom", icon: "🏝️", scores: {} },
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
      { label: "Improve communication", icon: "💬", scores: {} },
      { label: "Build deeper connections", icon: "🤝", scores: {} },
      { label: "Overcome loneliness", icon: "🌅", scores: {} },
      { label: "Set better boundaries", icon: "🛡️", scores: {} },
      { label: "Improve my dating life", icon: "❤️‍🔥", scores: {} },
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
      { label: "Lose weight", icon: "⚖️", scores: {} },
      { label: "Build muscle & strength", icon: "💪", scores: {} },
      { label: "Improve my nutrition", icon: "🥗", scores: {} },
      { label: "Boost my energy levels", icon: "⚡", scores: {} },
      { label: "Sleep better", icon: "😴", scores: {} },
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
      { label: "Overcome self-doubt", icon: "🪞", scores: {} },
      { label: "Build unshakable confidence", icon: "🦁", scores: {} },
      { label: "Manage anxiety & stress", icon: "🧘", scores: {} },
      { label: "Develop a growth mindset", icon: "🌱", scores: {} },
      { label: "Improve emotional resilience", icon: "🛡️", scores: {} },
    ],
    autoAdvance: false,
  },
  {
    id: "q_goals_education",
    type: "multi-select",
    question: "Set your learning goals",
    subtext: "Select all that apply.",
    showWhen: goalIs("Learning"),
    options: [
      { label: "Learn faster & retain more", icon: "🧠", scores: {} },
      { label: "Pass important exams", icon: "🎓", scores: {} },
      { label: "Build new skills", icon: "🛠️", scores: {} },
      { label: "Read more consistently", icon: "📖", scores: {} },
      { label: "Master a subject", icon: "🏆", scores: {} },
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
      { label: "20s", icon: "🧑", scores: {} },
      { label: "30s", icon: "👨", scores: {} },
      { label: "40s", icon: "🧔", scores: {} },
      { label: "50s", icon: "👴", scores: {} },
      { label: "60+", icon: "🎖️", scores: {} },
    ],
    autoAdvance: false,
  },

  /* ═══ Universal: problems (expanded) ═══ */
  {
    id: "q_problems",
    type: "multi-select",
    question: "Which of the following is currently a problem for you?",
    subtext: "Select all that apply.",
    options: [
      { label: "Procrastination", icon: "⏳", scores: {} },
      { label: "ADHD / Focus issues", icon: "🧠", scores: {} },
      { label: "Bad habits", icon: "🔄", scores: {} },
      { label: "Poor sleep", icon: "😴", scores: {} },
      { label: "Stress & burnout", icon: "🔥", scores: {} },
      { label: "Financial stress", icon: "💸", scores: {} },
      { label: "Lack of direction", icon: "🧭", scores: {} },
      { label: "Low self-esteem", icon: "🪞", scores: {} },
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

  /* ═══ Universal: motivations & state ═══ */
  {
    id: "q_motivations",
    type: "multi-select",
    question: "What motivates you to improve yourself?",
    subtext: "Select all that apply.",
    options: [
      { label: "Accomplish my goals", icon: "🎯", scores: {} },
      { label: "Be there for my family", icon: "👨‍👩‍👧", scores: {} },
      { label: "Reach my true potential", icon: "⭐", scores: {} },
      { label: "Make more money", icon: "💰", scores: {} },
      { label: "Improve health & live longer", icon: "❤️", scores: {} },
      { label: "Feel better about myself", icon: "🪞", scores: {} },
    ],
    autoAdvance: false,
  },
  {
    id: "q_current_state",
    type: "list-rows",
    question: "What best describes your current state?",
    subtext: "Be honest — this shapes your plan.",
    options: [
      { label: "In control & motivated", icon: "✅", scores: {} },
      { label: "Confused how to succeed", icon: "🤷", scores: {} },
      { label: "Afraid to leave my comfort zone", icon: "😰", scores: {} },
      { label: "Worried that I will fail", icon: "😟", scores: {} },
      { label: "On the verge of burnout", icon: "🔥", scores: {} },
      { label: "Other", icon: "💬", scores: {} },
    ],
    autoAdvance: false,
  },

  /* ═══ Insight: expert research ═══ */
  {
    id: "insight_expert",
    type: "insight-card",
    stat: "PhD",
    headline: "level research backs every plan we build.",
    body: "By addressing your emotional motivation we can eradicate procrastination & supercharge your performance.",
    ctaLabel: "Continue",
    autoAdvance: false,
  },

  /* ═══ Universal: habits & past actions ═══ */
  {
    id: "q_bad_habits",
    type: "multi-select",
    question: "Which bad habits do you want to quit?",
    subtext: "Select all that apply.",
    options: [
      { label: "Eating sugary foods", icon: "🍬", scores: {} },
      { label: "Negative self-talk", icon: "💭", scores: {} },
      { label: "Poor sleep", icon: "😴", scores: {} },
      { label: "Over eating", icon: "🍔", scores: {} },
      { label: "Drinking", icon: "🍺", scores: {} },
      { label: "Too much social media", icon: "📱", scores: {} },
    ],
    autoAdvance: false,
  },
  {
    id: "q_past_actions",
    type: "multi-select",
    question: "What have you done in the past to improve yourself?",
    subtext: "Select all that apply.",
    options: [
      { label: "Read self-improvement books", icon: "📚", scores: {} },
      { label: "Took Courses", icon: "🎓", scores: {} },
      { label: "Hired coaches", icon: "🏋️", scores: {} },
      { label: "Went to retreats", icon: "🏔️", scores: {} },
      { label: "Watched YouTube videos", icon: "▶️", scores: {} },
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

  /* ═══ Universal: self-trust ═══ */
  {
    id: "q_self_trust",
    type: "list-rows",
    question: "How much do you trust yourself to accomplish what you have planned?",
    subtext: "There's no wrong answer.",
    options: [
      { label: "Very much", icon: "💪", scores: {} },
      { label: "Somewhat", icon: "🤔", scores: {} },
      { label: "Not at all", icon: "😔", scores: {} },
    ],
    autoAdvance: false,
  },

  /* ═══════════════════════════════════════════════════════════
     Domain-specific deep-dive (conditional)
     Only the screens matching the user's goal area appear.
     ═══════════════════════════════════════════════════════════ */

  {
    id: "q_career_areas",
    type: "multi-select",
    question: "Which career areas do you want to focus on?",
    subtext: "Select all that apply.",
    showWhen: goalIs("Career"),
    options: [
      { label: "Leadership", icon: "👔", scores: {} },
      { label: "Networking", icon: "🤝", scores: {} },
      { label: "Job search & interviews", icon: "🔍", scores: {} },
      { label: "Side hustle", icon: "🚀", scores: {} },
      { label: "Work-life balance", icon: "⚖️", scores: {} },
    ],
    autoAdvance: false,
  },
  {
    id: "q_money_areas",
    type: "multi-select",
    question: "Which financial areas do you want to improve?",
    subtext: "Select all that apply.",
    showWhen: goalIs("Money"),
    options: [
      { label: "Budgeting & saving", icon: "💳", scores: {} },
      { label: "Investing", icon: "📈", scores: {} },
      { label: "Debt management", icon: "🔓", scores: {} },
      { label: "Income growth", icon: "💵", scores: {} },
      { label: "Financial literacy", icon: "📚", scores: {} },
    ],
    autoAdvance: false,
  },
  {
    id: "q_relationship_areas",
    type: "multi-select",
    question: "Which relationship areas matter most?",
    subtext: "Select all that apply.",
    showWhen: goalIs("Relationships"),
    options: [
      { label: "Communication", icon: "💬", scores: {} },
      { label: "Trust & vulnerability", icon: "🤲", scores: {} },
      { label: "Setting boundaries", icon: "🛡️", scores: {} },
      { label: "Dating & attraction", icon: "❤️‍🔥", scores: {} },
      { label: "Family dynamics", icon: "👨‍👩‍👧‍👦", scores: {} },
    ],
    autoAdvance: false,
  },
  {
    id: "q_education_areas",
    type: "multi-select",
    question: "Which learning areas do you want to improve?",
    subtext: "Select all that apply.",
    showWhen: goalIs("Learning"),
    options: [
      { label: "Study habits", icon: "📖", scores: {} },
      { label: "Memory & retention", icon: "🧠", scores: {} },
      { label: "Exam preparation", icon: "🎓", scores: {} },
      { label: "Skill acquisition", icon: "🛠️", scores: {} },
      { label: "Time management", icon: "⏰", scores: {} },
    ],
    autoAdvance: false,
  },

  /* Shared domain screens — shown for multiple goal areas */
  {
    id: "q_productivity_areas",
    type: "multi-select",
    question: "What productivity areas would you like to improve?",
    subtext: "Select all that apply.",
    showWhen: goalIs("Career", "Learning"),
    options: [
      { label: "Focus", icon: "🎯", scores: {} },
      { label: "Creativity", icon: "🎨", scores: {} },
      { label: "Memory", icon: "🧠", scores: {} },
      { label: "Productivity", icon: "⚡", scores: {} },
      { label: "Mental Sharpness", icon: "💡", scores: {} },
    ],
    autoAdvance: false,
  },
  {
    id: "q_focus_ability",
    type: "slider-scale",
    question: "How is your ability to focus on important tasks for an extended period?",
    scaleLabels: ["Poor", "Fair", "Good", "Great"],
    showWhen: goalIs("Career", "Learning"),
    autoAdvance: false,
  },
  {
    id: "q_health_areas",
    type: "multi-select",
    question: "What health areas would you like to focus on?",
    subtext: "Select all that apply.",
    showWhen: goalIs("Health"),
    options: [
      { label: "Longevity", icon: "🧬", scores: {} },
      { label: "Sleep", icon: "😴", scores: {} },
      { label: "Digestion", icon: "🥗", scores: {} },
      { label: "Immunity", icon: "🛡️", scores: {} },
      { label: "Fitness", icon: "💪", scores: {} },
      { label: "Energy", icon: "⚡", scores: {} },
    ],
    autoAdvance: false,
  },
  {
    id: "q_fitness_level",
    type: "slider-scale",
    question: "Please rate your level of fitness",
    scaleLabels: ["Poor", "Fair", "Good", "Great"],
    showWhen: goalIs("Health"),
    autoAdvance: false,
  },
  {
    id: "q_sleep_quality",
    type: "list-rows",
    question: "How is your sleep quality?",
    subtext: "Sleep affects everything.",
    showWhen: goalIs("Health", "Mindset"),
    options: [
      { label: "Great", icon: "😊", scores: {} },
      { label: "Could be better", icon: "😐", scores: {} },
      { label: "Terrible", icon: "😩", scores: {} },
    ],
    autoAdvance: false,
  },
  {
    id: "q_mindset_areas",
    type: "multi-select",
    question: "What mindset areas do you want to improve?",
    subtext: "Select all that apply.",
    showWhen: goalIs("Mindset"),
    options: [
      { label: "Confidence", icon: "💪", scores: {} },
      { label: "Motivation", icon: "🔥", scores: {} },
      { label: "Stress management", icon: "🧘", scores: {} },
      { label: "Mood", icon: "😊", scores: {} },
    ],
    autoAdvance: false,
  },
  {
    id: "q_morning_routine",
    type: "yes-no",
    question: "Do you have a morning routine?",
    subtext: "Small habits compound into big results.",
    showWhen: goalIs("Career", "Mindset", "Health"),
    autoAdvance: false,
  },

  /* ═══════════════════════════════════════════════════════════
     Universal tail: schedule, commitment, capture
     ═══════════════════════════════════════════════════════════ */

  {
    id: "q_schedule_days",
    type: "multi-select",
    question: "What days do you want to dedicate to self improvement?",
    subtext: "Select all that apply.",
    options: [
      { label: "Monday", scores: {} },
      { label: "Tuesday", scores: {} },
      { label: "Wednesday", scores: {} },
      { label: "Thursday", scores: {} },
      { label: "Friday", scores: {} },
      { label: "Saturday", scores: {} },
      { label: "Sunday", scores: {} },
    ],
    autoAdvance: false,
  },
  {
    id: "q_time_per_day",
    type: "list-rows",
    question: "How much time per day can you dedicate?",
    subtext: "Even 5 minutes compounds.",
    options: [
      { label: "5 min", icon: "⏱️", scores: {} },
      { label: "15 min+", icon: "⏰", scores: {} },
      { label: "Not sure", icon: "🤷", scores: {} },
    ],
    autoAdvance: false,
  },

  /* ═══ Insight: timeline ═══ */
  {
    id: "insight_save_time",
    type: "timeline-card",
    ctaLabel: "Continue",
    autoAdvance: false,
  },

  {
    id: "q_commitment",
    type: "commitment-scale",
    question: "Can you commit at least 15 minutes daily for the next 40 days?",
    subtext: "1 = maybe · 5 = absolutely",
    autoAdvance: false,
  },

  {
    id: "win",
    type: "win-celebration",
    autoAdvance: false,
  },

  {
    id: "capture",
    type: "capture-form",
    question: "Where should we send your plan?",
    autoAdvance: false,
  },
];
