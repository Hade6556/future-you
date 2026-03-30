export const domainQuotes: Record<string, { quote: string; author: string }[]> = {
  entrepreneur: [
    { quote: "Your time is limited, don\u2019t waste it living someone else\u2019s life.", author: "Steve Jobs" },
    { quote: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
    { quote: "I never dreamed about success. I worked for it.", author: "Est\u00e9e Lauder" },
  ],
  athlete: [
    { quote: "Champions keep playing until they get it right.", author: "Billie Jean King" },
    { quote: "It\u2019s not whether you get knocked down, it\u2019s whether you get up.", author: "Vince Lombardi" },
    { quote: "Hard work beats talent when talent doesn\u2019t work hard.", author: "Tim Notke" },
  ],
  weight_loss: [
    { quote: "Take care of your body. It\u2019s the only place you have to live.", author: "Jim Rohn" },
    { quote: "The pain you feel today will be the strength you feel tomorrow.", author: "Arnold Schwarzenegger" },
    { quote: "You don\u2019t have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  ],
  creative: [
    { quote: "Creativity is intelligence having fun.", author: "Albert Einstein" },
    { quote: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { quote: "Every artist was first an amateur.", author: "Ralph Waldo Emerson" },
  ],
  student: [
    { quote: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
    { quote: "The beautiful thing about learning is nobody can take it away from you.", author: "B.B. King" },
    { quote: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
  ],
  wellness: [
    { quote: "To keep the body in good health is a duty \u2014 otherwise we shall not be able to keep our mind strong and clear.", author: "Buddha" },
    { quote: "Health is not valued till sickness comes.", author: "Thomas Fuller" },
    { quote: "Almost everything will work again if you unplug it for a few minutes \u2014 including you.", author: "Anne Lamott" },
  ],
  career: [
    { quote: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { quote: "Choose a job you love and you will never have to work a day in your life.", author: "Confucius" },
    { quote: "Opportunities don\u2019t happen. You create them.", author: "Chris Grosser" },
  ],
  finance: [
    { quote: "The stock market is a device for transferring money from the impatient to the patient.", author: "Warren Buffett" },
    { quote: "It\u2019s not how much money you make, but how much money you keep.", author: "Robert Kiyosaki" },
    { quote: "Wealth is not about having a lot of money; it\u2019s about having a lot of options.", author: "Chris Rock" },
  ],
  language: [
    { quote: "To have another language is to possess a second soul.", author: "Charlemagne" },
    { quote: "The limits of my language mean the limits of my world.", author: "Ludwig Wittgenstein" },
    { quote: "Language is the road map of a culture.", author: "Rita Mae Brown" },
  ],
  travel: [
    { quote: "The world is a book, and those who do not travel read only one page.", author: "Saint Augustine" },
    { quote: "Not all those who wander are lost.", author: "J.R.R. Tolkien" },
    { quote: "Travel is the only thing you buy that makes you richer.", author: "Anonymous" },
  ],
  relationships: [
    { quote: "The quality of your life is the quality of your relationships.", author: "Tony Robbins" },
    { quote: "You are the average of the five people you spend the most time with.", author: "Jim Rohn" },
    { quote: "In the end, the love you take is equal to the love you make.", author: "Paul McCartney" },
  ],
  productivity: [
    { quote: "It\u2019s not about having time. It\u2019s about making time.", author: "Unknown" },
    { quote: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
    { quote: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
  ],
  mindfulness: [
    { quote: "The present moment is the only moment available to us, and it is the door to all moments.", author: "Thich Nhat Hanh" },
    { quote: "You can\u2019t stop the waves, but you can learn to surf.", author: "Jon Kabat-Zinn" },
    { quote: "Peace comes from within. Do not seek it without.", author: "Buddha" },
  ],
  confidence: [
    { quote: "Believe you can and you\u2019re halfway there.", author: "Theodore Roosevelt" },
    { quote: "You gain strength, courage and confidence by every experience in which you really stop to look fear in the face.", author: "Eleanor Roosevelt" },
    { quote: "No one can make you feel inferior without your consent.", author: "Eleanor Roosevelt" },
  ],
};

export const BRAND = {
  name: "Behavio",
  tagline: "Your AI life coach for any ambition",
  description:
    "Behavio is your personal AI life coach. Whether you want to start a business, get fit, lose weight, or master any skill — Behavio builds the plan that fits your personality.",
  cta: {
    quizHook: "Discover your coaching archetype",
    startQuiz: "Take the quiz",
    seeResult: "See my archetype",
    getStarted: "Get started",
    continuePlan: "Continue my plan",
    buildPlan: "Build my personalized plan",
    unlockForecast: "Unlock my full forecast",
    getFullAccess: "Start Free Now",
    continueForFree: "Start Free Now",
  },
  voice: {
    greeting: (name: string, hour?: number) => {
      const h = hour ?? new Date().getHours();
      if (h < 12) return `Morning, ${name}. Behavio showed up. Will you?`;
      if (h < 17) return `Still time to make today count, ${name}.`;
      return `End the day strong, ${name}. One thing left.`;
    },
    greetingStreak: (name: string, streak: number) => {
      if (streak === 0) return `Reset isn't failure. Behavio already moved on.`;
      if (streak >= 30) return `${name}, ${streak} days. Behavio is no longer surprised.`;
      if (streak >= 7) return `${name}, ${streak} days. Behavio is starting to believe.`;
      return `Hey ${name}, let's make today count. 🔥 Day ${streak}`;
    },
    momentum: "Behavio is proud of you.",
    noArchetype: "Take the quiz to discover your coaching style.",
    planEmpty: "Your roadmap is waiting. Takes 2 minutes to generate.",
    dailyIntro: "Your coach has today's mission ready.",
    chatEmpty: "Ask me anything. Behavio has no judgment, only questions.",
    streakBroken: "Reset isn't failure. Behavio already moved on.",
    dayOne: "Day 1 is just a day that hasn't started yet.",
  },
  hook: {
    headlines: [
      "Behavio already has a plan. Do you?",
      "Your AI coach has been waiting.",
      "The gap between you and who you want to be? Let\u2019s measure it.",
    ],
    primary: "Behavio already has a plan. Do you?",
    subtext: "43,000 people already know their archetype. You don\u2019t \u2014 yet.",
    trust: "Quick \u00b7 Private \u00b7 Free",
  },
  quiz: {
    intro: "Quick questions. Honest answers. Your AI coach will figure out the rest.",
    ctaText: "That\u2019s it \u2192",
    emailCta: "Send my results \u2192",
    timelinePrompt: "Behavio sets deadlines and keeps them. What\u2019s yours?",
  },
  archetypeReveal: {
    preText: "You\u2019re a\u2026",
    socialProof: (archetypeId: string): string => {
      const counts: Record<string, string> = {
        strategist: "43,219",
        steady: "38,104",
        endurance: "29,887",
        creative: "31,442",
        guardian: "22,653",
        explorer: "19,971",
      };
      return `${counts[archetypeId] ?? "12,000"}+ people with your archetype are running their 90-day plan.`;
    },
    cta: "Build my plan \u2192",
  },
  archetypeTaglines: {
    strategist: "You see ten moves ahead while everyone else sees one.",
    steady: "You don\u2019t burn bright and fade. You build and last.",
    endurance: "Pain is just data. You process it better than most.",
    creative: "Your best ideas haven\u2019t happened yet. Let\u2019s create conditions for them.",
    guardian: "You protect what matters. Now build something worth protecting.",
    explorer: "Rules were made for people who haven\u2019t found their path yet.",
  } as Record<string, string>,
  archetypeCoachOpeners: {
    strategist: "You\u2019ve got a plan. Let\u2019s make sure it\u2019s the right one. What\u2019s your biggest obstacle this week?",
    steady: "Consistency is your superpower. What\u2019s one thing you want to lock in this week?",
    endurance: "You\u2019re built for the long haul. What\u2019s the hardest part of the current stretch?",
    creative: "No two paths look the same for you \u2014 that\u2019s the point. What\u2019s alive for you right now?",
    guardian: "You protect what matters. What needs protecting most this week?",
    explorer: "No two paths look the same. Tell me where you want to go \u2014 I\u2019ll figure out how to get you there.",
  } as Record<string, string>,
  trajectory: {
    headline: "Your 90-day forecast",
    lockedLabel: "UNLOCKED WITH PRO",
    lockedHook: "Behavio already knows what happens in week 8.",
    freeDays: "3 days free",
  },
  paywall: {
    step1: {
      subtext: "Behavio built this. Now it needs you.",
      cta: "See what\u2019s included",
    },
    step2: {
      headline: "What unlocks today",
      features: [
        "Your full 90-day roadmap",
        "Daily AI coaching",
        "Smart scheduling (auto-added to your calendar)",
        "Weekly Behavio check-ins",
      ],
      socialCount: "43,219 people found their path.",
      quote: "\u201cChanged how I think about goals\u201d",
      reviewer: "Maya R.",
      cta: "Start my journey today",
    },
    step3: {
      headline: "Start free today",
      socialCount: "Join 43,219+ who found their path",
      priceNote: "3 days free, then \u20ac44/year \u00b7 cancel anytime",
      trust: ["No charge today", "Cancel anytime", "Instant access"],
    },
  },
  dashboard: {
    agenticCard: {
      label: "BEHAVIO SCHEDULED",
      calSynced: "Synced to Google Cal \u2713",
      chatEntry: "Ask Behavio anything \u2192",
    },
    agenticMessages: [
      "Behavio already blocked tomorrow 9am for deep work.",
      "Your Friday review is on the calendar. No excuses.",
      "AI adjusted your plan based on this week\u2019s progress.",
    ],
  },
  notifications: {
    morning: "Behavio is already up. You?",
    streakAtRisk: (days: number) => `${days}-day streak. Don\u2019t let tonight be the reset.`,
    milestone: (days: number) => `Day ${days}. Behavio is not surprised. Are you?`,
    reEngagement: "Behavio left you a note. Open it?",
  },
  emptyStates: {
    noStreak: "Day 1 is just a day that hasn\u2019t started yet.",
    noChat: "Ask me anything. Behavio has no judgment, only questions.",
    noPlan: "Your roadmap is waiting. Takes 2 minutes to generate.",
    noPlanLong: "Let\u2019s build your roadmap. Your coach is ready when you are.",
  },
  ambitionPromise:
    "Entrepreneur. Athlete. Weight loss. Creative. Student. Whatever your ambition \u2014 Behavio has a plan for that.",
} as const;
