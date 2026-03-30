"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { usePlanStore } from "../../state/planStore";
import { MascotReactor } from "../../components/mascot/MascotReactor";
import { AMBITION_GOAL_MAP } from "../../types/pipeline";

const AMBITION_LABELS: Record<string, string> = {
  entrepreneur: "business goals",
  athlete: "fitness journey",
  weight_loss: "weight loss plan",
  creative: "creative path",
  student: "learning roadmap",
  wellness: "wellness plan",
  career: "career plan",
  finance: "financial roadmap",
  language: "language journey",
  travel: "travel plan",
  relationships: "relationships plan",
  productivity: "productivity system",
  mindfulness: "mindfulness practice",
  confidence: "confidence journey",
};

const STEP_COUNT = 7;

export default function AnalyzingPage() {
  const router = useRouter();
  const ambitionType = usePlanStore((s) => s.ambitionType);
  const userName = usePlanStore((s) => s.userName);
  const setPipelinePlan = usePlanStore((s) => s.setPipelinePlan);
  const setPipelineStatus = usePlanStore((s) => s.setPipelineStatus);
  const quizTimeline = usePlanStore((s) => s.quizTimeline);
  const quizCommitment = usePlanStore((s) => s.quizCommitment);
  const quizSchedule = usePlanStore((s) => s.quizSchedule);
  const quizObstacles = usePlanStore((s) => s.quizObstacles);
  const quizPrimaryGoal = usePlanStore((s) => s.quizPrimaryGoal);
  const quizCurrentState = usePlanStore((s) => s.quizCurrentState);
  const quizVision = usePlanStore((s) => s.quizVision);
  const quizGender = usePlanStore((s) => s.quizGender);
  const quizAgeGroup = usePlanStore((s) => s.quizAgeGroup);
  const quizDream = usePlanStore((s) => s.quizDream);
  const quizPastAttempts = usePlanStore((s) => s.quizPastAttempts);
  const dogArchetype = usePlanStore((s) => s.dogArchetype);
  const multiSelectAnswers = usePlanStore((s) => s.multiSelectAnswers);
  const moodRating = usePlanStore((s) => s.moodRating);
  const sleepQuality = usePlanStore((s) => s.sleepQuality);
  const energyLevel = usePlanStore((s) => s.energyLevel);
  const stressLevel = usePlanStore((s) => s.stressLevel);
  const planFired = useRef(false);
  const [step, setStep] = useState(0);

  const name = userName || "friend";
  const ambitionLabel = AMBITION_LABELS[ambitionType ?? "wellness"] ?? "goals";

  const lines = [
    `Reading your goals, ${name}...`,
    `Profiling your ${ambitionLabel}...`,
    "Matching your work style to proven patterns...",
    "Calculating your 90-day projection...",
    "Identifying your biggest obstacles...",
    "Preparing your coaching archetype...",
    "Your personalized plan is ready.",
  ];

  // Fire plan generation once — runs in background during the animation
  useEffect(() => {
    if (planFired.current) return;
    planFired.current = true;
    const goal = AMBITION_GOAL_MAP[ambitionType ?? "wellness"] ?? "wellness";

    // Derive the domain-specific goals key (e.g., "q_goals_career" for Career & Ambition)
    const domainKeyMap: Record<string, string> = {
      career: "q_goals_career",
      entrepreneur: "q_goals_career",
      finance: "q_goals_money",
      relationships: "q_goals_relationships",
      weight_loss: "q_goals_health",
      athlete: "q_goals_health",
      wellness: "q_goals_health",
      mindfulness: "q_goals_mindset",
      confidence: "q_goals_mindset",
      student: "q_goals_education",
      productivity: "q_goals_productivity",
    };
    const goalsKey = domainKeyMap[ambitionType ?? ""] ?? "";
    const specificGoals = goalsKey ? (multiSelectAnswers[goalsKey] ?? []) : [];

    // Read dream narrative from sessionStorage (set by intake page)
    let dreamNarrative = quizDream ?? null;
    try {
      if (!dreamNarrative && typeof window !== "undefined") {
        dreamNarrative = sessionStorage.getItem("behavio-pending-narrative");
      }
    } catch { /* SSR guard */ }

    const userContext = {
      // Existing fields
      timeline: quizTimeline ?? undefined,
      commitment: quizCommitment ?? undefined,
      schedule: quizSchedule ?? undefined,
      obstacles: quizObstacles.length > 0 ? quizObstacles : undefined,
      primaryGoal: quizPrimaryGoal ?? undefined,
      currentState: quizCurrentState ?? undefined,
      vision: quizVision ?? undefined,
      gender: quizGender ?? undefined,
      // Quiz signals
      ageGroup: quizAgeGroup ?? undefined,
      specificGoals: specificGoals.length > 0 ? specificGoals : undefined,
      motivations: multiSelectAnswers["q_motivations"]?.length ? multiSelectAnswers["q_motivations"] : undefined,
      badHabits: multiSelectAnswers["q_bad_habits"]?.length ? multiSelectAnswers["q_bad_habits"] : undefined,
      selfTrust: multiSelectAnswers["q_self_trust"]?.[0] ?? undefined,
      problems: multiSelectAnswers["q_problems"]?.length ? multiSelectAnswers["q_problems"] : undefined,
      pastAttempts: quizPastAttempts ?? undefined,
      // Intake signals
      dreamNarrative: dreamNarrative ?? undefined,
      // Identity signals
      archetype: dogArchetype ?? undefined,
      ambitionDomain: ambitionType ?? undefined,
      // Wellbeing signals
      moodRating: moodRating ?? undefined,
      sleepQuality: sleepQuality ?? undefined,
      energyLevel: energyLevel ?? undefined,
      stressLevel: stressLevel != null ? String(stressLevel) : undefined,
      // Domain-specific deep dive answers
      domainAnswers: Object.keys(multiSelectAnswers).length > 0 ? multiSelectAnswers : undefined,
    };
    setPipelineStatus("loading");
    fetch("/api/plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ goal, userContext }),
    })
      .then((r) => r.json())
      .then((plan) => {
        if (plan && !plan.error) {
          setPipelinePlan(plan);
        } else {
          setPipelineStatus("error");
        }
      })
      .catch(() => setPipelineStatus("error"));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const intervals = [0, 1100, 2200, 3400, 4600, 5900, 7200];
    const timers = intervals.map((delay, i) =>
      setTimeout(() => setStep(i), delay),
    );
    const navTimer = setTimeout(() => router.push("/quiz/result"), 8500);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(navTimer);
    };
  }, [router]);

  const isDone = step === lines.length - 1;

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-6">
      <div className="flex flex-col items-center gap-8">
        {/* Mascot with emotion changes */}
        <motion.div
          animate={{ scale: isDone ? [1, 1.08, 1] : 1 }}
          transition={{ duration: 0.5 }}
        >
          <MascotReactor
            emotion={isDone ? "celebrating" : "thinking"}
            size={160}
          />
        </motion.div>

        {/* Animated text line */}
        <div className="h-8 w-full max-w-xs text-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={step}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={`text-center font-display text-base ${isDone ? "font-semibold text-primary" : "text-foreground"}`}
            >
              {lines[step]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Step dots: show which step we're on */}
        <div className="flex items-center gap-1.5" aria-hidden>
          {Array.from({ length: STEP_COUNT }).map((_, i) => (
            <motion.span
              key={i}
              className="rounded-full"
              animate={{
                width: i === step ? 20 : 6,
                backgroundColor: i <= step ? "var(--accent-primary)" : "var(--border)",
              }}
              style={{ height: 6, display: "block" }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            />
          ))}
        </div>

        {/* Progress bar with shimmer effect */}
        <div className="relative h-1.5 w-60 overflow-hidden rounded-full bg-secondary">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary to-accent-glow"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 8, ease: "linear" }}
          />
          {/* Shimmer overlay */}
          <motion.div
            className="absolute inset-y-0 w-16 rounded-full bg-white/30"
            animate={{ x: ["-64px", "256px"] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          />
        </div>

        <p className="font-accent text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Powered by Behavio AI
        </p>
      </div>
    </div>
  );
}
