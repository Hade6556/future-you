export type GoalTheme = {
  id: string;
  aliases: string[];
  /** Short 1-2 word queries that Google Events indexes globally (location is appended by the fetcher). */
  searchQueries: string[];
  scoringHint: string;
};

/**
 * Curated database of common life-goal themes with event search queries
 * optimised for Google Events / SerpAPI.
 *
 * IMPORTANT: searchQueries must be SHORT (1-2 words). Google Events works
 * like a search engine — "fitness" returns gym classes and boot camps,
 * but "fitness bootcamp weight loss challenge" returns nothing in small cities.
 * The location is appended automatically by the fetcher.
 */
export const GOAL_THEMES: GoalTheme[] = [
  // ── Fitness ───────────────────────────────────────────────────────────────
  {
    id: "weight_loss",
    aliases: [
      "lose weight", "weight loss", "slim down", "fat loss", "get lean",
      "burn fat", "diet", "get skinny", "shed pounds", "cut weight",
    ],
    searchQueries: ["fitness", "running", "yoga", "training"],
    scoringHint: "wants to lose weight and get fit — only events they can PARTICIPATE in (classes, races, training). Exclude spectator sports games",
  },
  {
    id: "muscle_building",
    aliases: [
      "build muscle", "gain muscle", "bulk up", "get strong", "strength training",
      "bodybuilding", "powerlifting", "get jacked", "get buff",
    ],
    searchQueries: ["fitness", "crossfit", "training", "gym"],
    scoringHint: "wants to build muscle and get stronger — only events they can PARTICIPATE in (classes, competitions to enter). Exclude spectator sports",
  },
  {
    id: "running",
    aliases: [
      "run a marathon", "start running", "5k", "10k", "half marathon",
      "marathon", "trail running", "jogging", "couch to 5k",
    ],
    searchQueries: ["marathon", "running", "triathlon", "race"],
    scoringHint: "wants to run races — only races and runs they can REGISTER for and participate in. Exclude spectator events",
  },
  {
    id: "yoga",
    aliases: [
      "yoga", "flexibility", "stretching", "pilates", "barre",
    ],
    searchQueries: ["yoga", "pilates", "stretching", "retreat"],
    scoringHint: "wants to practice yoga or pilates — only classes and retreats they can attend and participate in",
  },
  {
    id: "sports",
    aliases: [
      "play sports", "join a team", "basketball", "football", "soccer",
      "tennis", "swimming", "martial arts", "boxing", "mma", "kickboxing",
      "crossfit",
    ],
    searchQueries: ["training", "marathon", "triathlon", "fitness"],
    scoringHint: "wants to actively play sports and train — only classes, lessons, races, and amateur tournaments they can JOIN. Exclude professional spectator games (e.g. Team A vs Team B)",
  },

  // ── Career ────────────────────────────────────────────────────────────────
  {
    id: "job_search",
    aliases: [
      "find a job", "get hired", "job search", "new job", "career change",
      "switch careers", "get employed", "land a job",
    ],
    searchQueries: ["job fair", "career", "hiring", "recruitment"],
    scoringHint: "wants to find a new job or switch careers",
  },
  {
    id: "leadership",
    aliases: [
      "leadership", "become a manager", "management skills", "lead a team",
      "executive", "c-suite",
    ],
    searchQueries: ["leadership", "management", "conference", "seminar"],
    scoringHint: "wants to develop leadership and management skills",
  },
  {
    id: "freelancing",
    aliases: [
      "freelance", "freelancing", "self-employed", "independent contractor",
      "consulting", "become a consultant",
    ],
    searchQueries: ["freelancer", "coworking", "networking", "workshop"],
    scoringHint: "wants to succeed as a freelancer or independent consultant",
  },

  // ── Business ──────────────────────────────────────────────────────────────
  {
    id: "entrepreneurship",
    aliases: [
      "start a business", "entrepreneur", "startup", "launch a company",
      "build a business", "own a business", "founder",
    ],
    searchQueries: ["startup meetup", "entrepreneur networking", "business pitch", "startup workshop"],
    scoringHint: "wants to start or grow a business, launch a startup — ONLY business/startup/entrepreneurship events",
  },
  {
    id: "side_hustle",
    aliases: [
      "side hustle", "extra income", "passive income", "make more money",
      "earn more", "side business", "make money", "increase income",
      "financial freedom", "get rich",
    ],
    searchQueries: ["business networking", "entrepreneur meetup", "startup event", "business workshop"],
    scoringHint: "wants to earn more money through business — ONLY business, networking, startup, or entrepreneurship events",
  },
  {
    id: "investing",
    aliases: [
      "invest", "investing", "stock market", "real estate investing",
      "crypto", "financial literacy", "build wealth", "financial security",
      "portfolio", "trading",
    ],
    searchQueries: ["investing workshop", "finance meetup", "business networking", "fintech"],
    scoringHint: "wants to learn investing and build wealth — ONLY finance, investing, or business events",
  },
  {
    id: "real_estate",
    aliases: [
      "real estate", "buy property", "rental property", "house flipping",
      "real estate agent", "property investment",
    ],
    searchQueries: ["real estate", "property", "investing", "business"],
    scoringHint: "wants to invest in or work in real estate",
  },

  // ── Creative ──────────────────────────────────────────────────────────────
  {
    id: "art",
    aliases: [
      "art", "painting", "drawing", "sculpture", "illustration",
      "become an artist", "visual art",
    ],
    searchQueries: ["art", "painting", "exhibition", "gallery"],
    scoringHint: "wants to create visual art, improve drawing or painting skills",
  },
  {
    id: "music",
    aliases: [
      "play music", "learn guitar", "learn piano", "music production",
      "songwriting", "become a musician", "make beats", "djing",
    ],
    searchQueries: ["music", "concert", "open mic", "workshop"],
    scoringHint: "wants to play music, produce songs, or perform",
  },
  {
    id: "writing",
    aliases: [
      "write a book", "writing", "author", "creative writing", "blogging",
      "copywriting", "journalism", "novelist", "screenwriting",
    ],
    searchQueries: ["writing", "book", "author", "literary"],
    scoringHint: "wants to write professionally or creatively",
  },
  {
    id: "photography",
    aliases: [
      "photography", "photo", "camera", "portrait", "landscape photography",
      "videography", "filmmaking", "cinematography",
    ],
    searchQueries: ["photography", "film", "camera", "creative"],
    scoringHint: "wants to improve photography or filmmaking skills",
  },

  // ── Education ─────────────────────────────────────────────────────────────
  {
    id: "coding",
    aliases: [
      "learn to code", "programming", "software development", "web development",
      "coding", "learn python", "learn javascript", "app development",
      "data science", "machine learning", "ai",
    ],
    searchQueries: ["hackathon", "tech", "coding", "programming"],
    scoringHint: "wants to learn programming, software development, or data science",
  },
  {
    id: "language_learning",
    aliases: [
      "learn a language", "learn english", "learn spanish", "learn french",
      "learn german", "learn japanese", "learn chinese", "language exchange",
      "bilingual", "polyglot",
    ],
    searchQueries: ["language", "exchange", "culture", "class"],
    scoringHint: "wants to learn a new language or improve language skills",
  },
  {
    id: "public_speaking",
    aliases: [
      "public speaking", "presentation skills", "toastmasters", "stage fright",
      "become a speaker", "ted talk", "communication skills",
    ],
    searchQueries: ["toastmasters", "speaking", "presentation", "conference"],
    scoringHint: "wants to improve public speaking and presentation skills",
  },

  // ── Wellness ──────────────────────────────────────────────────────────────
  {
    id: "mental_health",
    aliases: [
      "mental health", "therapy", "anxiety", "depression", "stress",
      "burnout", "self-care", "emotional health",
    ],
    searchQueries: ["wellness", "meditation", "therapy", "retreat"],
    scoringHint: "wants to improve mental health, reduce stress and anxiety",
  },
  {
    id: "meditation",
    aliases: [
      "meditation", "mindfulness", "zen", "breathwork", "inner peace",
      "spiritual growth", "mindful",
    ],
    searchQueries: ["meditation", "yoga", "retreat", "mindfulness"],
    scoringHint: "wants to practice meditation and mindfulness",
  },
  {
    id: "nutrition",
    aliases: [
      "eat healthy", "nutrition", "meal prep", "clean eating", "vegan",
      "vegetarian", "healthy eating", "stop eating junk",
    ],
    searchQueries: ["cooking class", "nutrition", "food", "vegan"],
    scoringHint: "wants to improve nutrition and eat healthier",
  },
  {
    id: "sleep",
    aliases: [
      "sleep better", "insomnia", "sleep quality", "fix sleep schedule",
      "sleep hygiene",
    ],
    searchQueries: ["wellness", "health", "retreat", "meditation"],
    scoringHint: "wants to improve sleep quality and establish healthy sleep habits",
  },

  // ── Social ────────────────────────────────────────────────────────────────
  {
    id: "dating",
    aliases: [
      "dating", "find love", "relationship", "meet people", "find a partner",
      "get a girlfriend", "get a boyfriend", "love life",
    ],
    searchQueries: ["singles", "social", "speed dating", "mixer"],
    scoringHint: "wants to improve dating life and find a romantic partner",
  },
  {
    id: "networking",
    aliases: [
      "networking", "meet professionals", "build connections", "grow my network",
      "professional network",
    ],
    searchQueries: ["networking", "business", "meetup", "mixer"],
    scoringHint: "wants to expand professional network and build connections",
  },
  {
    id: "parenting",
    aliases: [
      "parenting", "be a better parent", "raise kids", "new parent",
      "family", "fatherhood", "motherhood",
    ],
    searchQueries: ["family", "parenting", "kids", "children"],
    scoringHint: "wants to become a better parent and improve family life",
  },
  {
    id: "confidence",
    aliases: [
      "confidence", "self-esteem", "self-confidence", "assertiveness",
      "overcome shyness", "be more confident", "social anxiety",
    ],
    searchQueries: ["workshop", "seminar", "personal development", "speaking"],
    scoringHint: "wants to build self-confidence and overcome social anxiety",
  },

  // ── Lifestyle ─────────────────────────────────────────────────────────────
  {
    id: "travel",
    aliases: [
      "travel", "see the world", "backpacking", "digital nomad",
      "travel more", "explore the world", "live abroad",
    ],
    searchQueries: ["travel", "adventure", "backpacking", "nomad"],
    scoringHint: "wants to travel more, explore the world, or live as a digital nomad",
  },
  {
    id: "cooking",
    aliases: [
      "cooking", "learn to cook", "chef", "baking", "culinary",
      "improve cooking",
    ],
    searchQueries: ["cooking", "culinary", "food", "baking"],
    scoringHint: "wants to learn cooking or improve culinary skills",
  },
  {
    id: "sustainability",
    aliases: [
      "sustainability", "environment", "eco-friendly", "zero waste",
      "climate", "green living", "reduce carbon",
    ],
    searchQueries: ["sustainability", "climate", "green", "environment"],
    scoringHint: "wants to live more sustainably and reduce environmental impact",
  },
  {
    id: "productivity",
    aliases: [
      "productivity", "time management", "get organized", "stop procrastinating",
      "be more productive", "focus", "discipline", "habits",
      "build good habits", "morning routine",
    ],
    searchQueries: ["productivity", "workshop", "seminar", "class"],
    scoringHint: "wants to improve productivity, time management, and daily habits",
  },
];

/**
 * Match a goal string against the theme database.
 * Returns the best match (longest alias hit) or null.
 */
export function matchGoalTheme(goalString: string): GoalTheme | null {
  const lower = goalString.toLowerCase();
  let bestMatch: GoalTheme | null = null;
  let bestLen = 0;

  for (const theme of GOAL_THEMES) {
    for (const alias of theme.aliases) {
      if (lower.includes(alias) && alias.length > bestLen) {
        bestMatch = theme;
        bestLen = alias.length;
      }
    }
  }

  return bestMatch;
}
