export const BRAND = {
  name: "Future Me",
  tagline: "Your AI life coach for any ambition",
  description:
    "Future Me is your personal AI life coach. Whether you want to start a business, get fit, lose weight, or master any skill — Future Me builds the plan that fits your personality.",
  cta: {
    quizHook: "Discover your coaching archetype",
    startQuiz: "Take the quiz",
    seeResult: "See my archetype",
    getStarted: "Get started",
    continuePlan: "Continue my plan",
  },
  voice: {
    greeting: (name: string) => `Hey ${name}, let's make today count`,
    momentum: "Future Me is proud of you.",
    noArchetype: "Take the quiz to discover your coaching style.",
    planEmpty: "Let's build your roadmap. Your coach is ready when you are.",
    dailyIntro: "Your coach has today's mission ready.",
  },
  ambitionPromise:
    "Entrepreneur. Athlete. Weight loss. Creative. Student. Whatever your ambition — Future Me has a plan for that.",
} as const;
