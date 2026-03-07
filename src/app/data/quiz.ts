import type { AmbitionDomain } from "../types/plan";

export type QuizScreenType =
  | "binary"
  | "tile-select"
  | "multi-select"
  | "scale"
  | "emoji-grid"
  | "name-input"
  | "email-input"
  | "insight-card";

export type QuizOption = {
  label: string;
  emoji?: string;
  scores: Record<string, number>;
  ambition?: AmbitionDomain;
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
  mascotEmotion?: "default" | "thinking" | "excited" | "pointing";
  autoAdvance?: boolean;
};

export const QUIZ_SCREENS: QuizScreen[] = [
  // Screen 1 — binary (micro-commitment #1)
  {
    id: "s1_commitment",
    type: "binary",
    question:
      "Have you ever felt like you know what you want, but can't figure out how to actually get there?",
    options: [
      { label: "Yes, all the time", emoji: "🙋", scores: {} },
      { label: "Sometimes", scores: {} },
    ],
    autoAdvance: true,
  },
  // Screen 2 — tile-select (gender, non-invasive)
  {
    id: "s2_gender",
    type: "tile-select",
    question: "What best describes you?",
    options: [
      { label: "Man", emoji: "👨", scores: {} },
      { label: "Woman", emoji: "👩", scores: {} },
      { label: "Prefer not to say", emoji: "🤝", scores: {} },
    ],
    autoAdvance: true,
  },
  // Screen 3 — tile-select (primary ambition, 2x2)
  {
    id: "s3_ambition",
    type: "tile-select",
    question: "What's the ONE thing you most want to change in the next 90 days?",
    options: [
      { label: "Build a business", emoji: "🚀", scores: { strategist: 1 }, ambition: "entrepreneur" },
      { label: "Transform my body", emoji: "💪", scores: { endurance: 1, guardian: 1 }, ambition: "athlete" },
      { label: "Master my mind", emoji: "🧠", scores: { steady: 1, guardian: 1 }, ambition: "wellness" },
      { label: "Create something big", emoji: "🎨", scores: { creative: 1, explorer: 1 }, ambition: "creative" },
    ],
    autoAdvance: true,
  },
  // Screen 4 — INSIGHT CARD 1
  {
    id: "s4_insight1",
    type: "insight-card",
    stat: "3x",
    headline: "People who identify their #1 focus are 3x more likely to follow through",
    body: "Trying to change everything at once is the #1 reason people quit. Future Me builds one focused plan around what matters most to you right now.",
    mascotEmotion: "thinking",
  },
  // Screen 5 — scale (consistency baseline)
  {
    id: "s5_consistency",
    type: "scale",
    question: "How consistent are you with healthy habits right now?",
    subtext: "Be honest — there's no wrong answer",
    options: [
      { label: "Just starting", scores: { steady: 2, guardian: 1 } },
      { label: "", scores: { steady: 1, explorer: 1 } },
      { label: "", scores: {} },
      { label: "", scores: { strategist: 1, endurance: 1 } },
      { label: "Very consistent", scores: { strategist: 2, endurance: 2 } },
    ],
    autoAdvance: false,
  },
  // Screen 6 — multi-select (objection pre-handling)
  {
    id: "s6_blockers",
    type: "multi-select",
    question: "What usually gets in the way of your progress?",
    subtext: "Select all that apply",
    options: [
      { label: "No time", emoji: "⏰", scores: { strategist: 1 } },
      { label: "No clear plan", emoji: "📋", scores: { guardian: 1, strategist: 1 } },
      { label: "No accountability", emoji: "🤝", scores: { steady: 1, guardian: 1 } },
    ],
    autoAdvance: false,
  },
  // Screen 7 — binary (micro-commitment #2)
  {
    id: "s7_steam",
    type: "binary",
    question:
      "Have you ever started something really motivated... only to lose steam a few weeks later?",
    options: [
      { label: "Yes, it happens every time", scores: {} },
      { label: "Yeah, sometimes", scores: {} },
    ],
    autoAdvance: true,
  },
  // Screen 8 — INSIGHT CARD 2
  {
    id: "s8_insight2",
    type: "insight-card",
    stat: "89%",
    headline: "That's not a willpower problem — it's a system problem",
    body: "Generic plans fail because they ignore who YOU are. Future Me builds a plan around your personality type, your energy, and your specific goal. That's why it works when everything else hasn't.",
    mascotEmotion: "pointing",
  },
  // Screen 9 — tile-select (energy pattern)
  {
    id: "s9_energy",
    type: "tile-select",
    question: "When do you have the most energy?",
    options: [
      { label: "Morning", emoji: "🌅", scores: { endurance: 2, guardian: 1 } },
      { label: "Afternoon", emoji: "☀️", scores: { strategist: 1, steady: 1 } },
      { label: "Evening", emoji: "🌙", scores: { creative: 2 } },
      { label: "It varies", emoji: "🌀", scores: { explorer: 2, creative: 1 } },
    ],
    autoAdvance: true,
  },
  // Screen 10 — binary (personality split)
  {
    id: "s10_style",
    type: "binary",
    question: "Which one sounds more like you?",
    options: [
      { label: "I need structure and clear steps", scores: { strategist: 2, guardian: 2 } },
      { label: "I need flexibility and space to adapt", scores: { creative: 2, explorer: 2 } },
    ],
    autoAdvance: true,
  },
  // Screen 11 — binary (micro-commitment #3 — purchase commitment)
  {
    id: "s11_tenmin",
    type: "binary",
    question:
      "If you knew it would actually work — would you spend 10 minutes a day on your future self?",
    options: [
      { label: "Yes, 100%", emoji: "💯", scores: {} },
      { label: "I'd try it", scores: {} },
    ],
    autoAdvance: true,
  },
  // Screen 12 — INSIGHT CARD 3
  {
    id: "s12_insight3",
    type: "insight-card",
    headline: "Most apps give you the same plan as everyone else. Future Me doesn't.",
    body: "Your coaching style is as unique as your fingerprint. In 2 more steps, we'll match you with the exact approach that fits how YOUR brain works.",
    mascotEmotion: "excited",
  },
  // Screen 13 — emoji-grid (desired feeling)
  {
    id: "s13_feeling",
    type: "emoji-grid",
    question: "Which feeling do you most want to wake up with every morning?",
    options: [
      { label: "Strong", emoji: "💪", scores: { endurance: 2, guardian: 1 } },
      { label: "Energised", emoji: "⚡", scores: { explorer: 2, endurance: 1 } },
      { label: "Calm", emoji: "🧘", scores: { steady: 2, guardian: 1 } },
      { label: "Focused", emoji: "🔥", scores: { strategist: 2 } },
      { label: "Confident", emoji: "😎", scores: { guardian: 1, strategist: 1, endurance: 1 } },
      { label: "Creative", emoji: "✨", scores: { creative: 2, explorer: 1 } },
    ],
    autoAdvance: true,
  },
  // Screen 14 — name-input
  {
    id: "s14_name",
    type: "name-input",
    question: "What's your first name?",
    subtext: "So Future Me knows what to call you",
    autoAdvance: false,
  },
  // Screen 15 — email-input
  {
    id: "s15_email",
    type: "email-input",
    question: "{name}, where should we send your personalized Future Me plan?",
    subtext: "We'll email you your custom coaching roadmap. No spam, ever.",
    autoAdvance: false,
  },
];
