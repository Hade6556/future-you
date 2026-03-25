import { createHash } from "crypto";
import type { PipelineExpert } from "@/app/types/pipeline";

type ExpertRaw = Omit<PipelineExpert, "resource_id">;

const CURATED: Record<string, ExpertRaw[]> = {
  fitness_weight_loss: [
    {
      name: "Jeff Nippard",
      role: "Strength & Hypertrophy Coach",
      specialty: "Evidence-based training and fat loss",
      bio_snippet: "Natural bodybuilder and science communicator. Publishes peer-reviewed-backed programming.",
      url: "https://jeffnippard.com",
      verified: true,
      tags: ["strength", "fat loss", "evidence-based"],
    },
    {
      name: "Layne Norton (BioLayne)",
      role: "Registered Dietitian & Powerlifter",
      specialty: "Flexible dieting, fat loss without restriction",
      bio_snippet: "PhD in nutritional sciences. Pioneer of IIFYM (flexible dieting). Backed by published research.",
      url: "https://biolayne.com",
      verified: true,
      tags: ["nutrition", "fat loss", "powerlifting"],
    },
    {
      name: "MyFitnessPal",
      role: "Calorie & Macro Tracking App",
      specialty: "Food logging, calorie counting",
      bio_snippet: "The most widely-used free food logging app. Integrates with wearables and most fitness platforms.",
      url: "https://myfitnesspal.com",
      verified: true,
      tags: ["nutrition", "tracking", "app"],
    },
    {
      name: "StrongLifts 5x5",
      role: "Beginner Strength Program",
      specialty: "Compound barbell training for beginners",
      bio_snippet: "Free 3x/week beginner program. Simple, effective, and well-documented.",
      url: "https://stronglifts.com",
      verified: true,
      tags: ["strength", "beginner", "barbell"],
    },
  ],
  real_estate_house_purchase: [
    {
      name: "BiggerPockets",
      role: "Real Estate Education Platform & Community",
      specialty: "First-time buyers, investment properties",
      bio_snippet: "Largest real estate investor community. Free podcasts, forums, calculators, and beginner guides.",
      url: "https://biggerpockets.com",
      verified: true,
      tags: ["real estate", "community", "education"],
    },
    {
      name: "HUD Housing Counselors",
      role: "HUD-Approved Free Counseling",
      specialty: "First-time buyer guidance, foreclosure prevention",
      bio_snippet: "HUD-approved non-profit counselors offer free or low-cost home buying guidance.",
      url: "https://www.hud.gov/findacounselor",
      verified: true,
      tags: ["first-time buyer", "free", "government"],
    },
    {
      name: "Consumer Financial Protection Bureau (CFPB)",
      role: "Mortgage Education Resource",
      specialty: "Understanding mortgages, comparing loan offers",
      bio_snippet: "Government resource with plain-English mortgage guides, loan comparison tools, and complaint filing.",
      url: "https://www.consumerfinance.gov/owning-a-home/",
      verified: true,
      tags: ["mortgage", "government", "education"],
    },
    {
      name: "Redfin",
      role: "Real Estate Marketplace & Buyer's Agent",
      specialty: "Discounted commission rebates to buyers in many markets",
      bio_snippet: "Tech-forward brokerage with market data, neighborhood insights, and lower commission structures.",
      url: "https://redfin.com",
      verified: true,
      tags: ["marketplace", "agent", "data"],
    },
  ],
  entrepreneurship: [
    {
      name: "Y Combinator Startup School",
      role: "Free Startup Accelerator Program",
      specialty: "Early-stage startups: ideation through launch",
      bio_snippet: "Free 10-week online program from the world's top accelerator.",
      url: "https://www.startupschool.org",
      verified: true,
      tags: ["accelerator", "free", "curriculum"],
    },
    {
      name: "Indie Hackers",
      role: "Bootstrapped Founder Community",
      specialty: "Revenue-transparent case studies, founder interviews",
      bio_snippet: "Community of founders building profitable businesses without VC. Real revenue numbers, real stories.",
      url: "https://indiehackers.com",
      verified: true,
      tags: ["bootstrapping", "community", "saas"],
    },
    {
      name: "The Mom Test (Rob Fitzpatrick)",
      role: "Book / Customer Interview Framework",
      specialty: "How to talk to customers without getting lied to",
      bio_snippet: "Essential reading before building anything. Teaches founders how to ask questions that reveal truth.",
      url: "https://momtestbook.com",
      verified: true,
      tags: ["customer development", "book", "validation"],
    },
    {
      name: "Founders Network",
      role: "Peer Mentorship Network for Tech Founders",
      specialty: "Founder-to-founder mentorship, warm intros, executive peer groups",
      bio_snippet: "Vetted community of 600+ tech startup founders. Monthly events, mentorship matching, and investor access.",
      url: "https://foundersnetwork.com",
      verified: true,
      tags: ["network", "mentorship", "community"],
    },
  ],
  athletics: [
    {
      name: "TrainingPeaks",
      role: "Endurance Training Platform",
      specialty: "Structured training plans, coach marketplace, performance tracking",
      bio_snippet: "Used by Olympic athletes and age-groupers alike. Find vetted coaches and follow science-based plans.",
      url: "https://trainingpeaks.com",
      verified: true,
      tags: ["training platform", "endurance", "coaching"],
    },
    {
      name: "NSCA (National Strength & Conditioning Association)",
      role: "Certified Coach Directory",
      specialty: "Strength and conditioning for sport-specific performance",
      bio_snippet: "Find an NSCA-certified strength and conditioning specialist in your area. Gold standard certification.",
      url: "https://www.nsca.com/find-a-professional/",
      verified: true,
      tags: ["strength", "conditioning", "certification"],
    },
    {
      name: "Peter Attia (Drive Podcast)",
      role: "Longevity & Performance Medicine",
      specialty: "Zone 2 training, VO2 max, athletic longevity",
      bio_snippet: "Physician focused on the science of athletic performance and healthspan.",
      url: "https://peterattiamd.com",
      verified: true,
      tags: ["physiology", "longevity", "zone 2"],
    },
    {
      name: "Strava",
      role: "Social Fitness App & Segment Platform",
      specialty: "GPS tracking, segment challenges, community",
      bio_snippet: "Track every workout, compete on local segments, and find training groups. Used by 100M+ athletes globally.",
      url: "https://strava.com",
      verified: true,
      tags: ["tracking", "community", "gps"],
    },
  ],
};

function makeId(name: string, url: string): string {
  return createHash("sha256")
    .update(name + url)
    .digest("hex")
    .slice(0, 16);
}

export function getCuratedExperts(goalKey: string): PipelineExpert[] {
  const list = CURATED[goalKey] ?? [];
  return list.map((e) => ({
    ...e,
    resource_id: makeId(e.name, e.url),
  }));
}
