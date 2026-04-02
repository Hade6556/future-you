"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { usePlanStore } from "../../state/planStore";
import { AMBITION_GOAL_MAP } from "../../types/pipeline";

const LIME = "#C8FF00";
const TEXT_HI = "rgba(235,242,255,0.95)";
const TEXT_MID = "rgba(120,155,195,0.75)";
const TEXT_LO = "rgba(120,155,195,0.40)";

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

  useEffect(() => {
    if (planFired.current) return;
    planFired.current = true;
    const goal = AMBITION_GOAL_MAP[ambitionType ?? "wellness"] ?? "wellness";

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

    let dreamNarrative = quizDream ?? null;
    try {
      if (!dreamNarrative && typeof window !== "undefined") {
        dreamNarrative = sessionStorage.getItem("behavio-pending-narrative");
      }
    } catch { /* SSR guard */ }

    const userContext = {
      timeline: quizTimeline ?? undefined,
      commitment: quizCommitment ?? undefined,
      schedule: quizSchedule ?? undefined,
      obstacles: quizObstacles.length > 0 ? quizObstacles : undefined,
      primaryGoal: quizPrimaryGoal ?? undefined,
      currentState: quizCurrentState ?? undefined,
      vision: quizVision ?? undefined,
      gender: quizGender ?? undefined,
      ageGroup: quizAgeGroup ?? undefined,
      specificGoals: specificGoals.length > 0 ? specificGoals : undefined,
      motivations: multiSelectAnswers["q_motivations"]?.length ? multiSelectAnswers["q_motivations"] : undefined,
      badHabits: multiSelectAnswers["q_bad_habits"]?.length ? multiSelectAnswers["q_bad_habits"] : undefined,
      selfTrust: multiSelectAnswers["q_self_trust"]?.[0] ?? undefined,
      problems: multiSelectAnswers["q_problems"]?.length ? multiSelectAnswers["q_problems"] : undefined,
      pastAttempts: quizPastAttempts ?? undefined,
      dreamNarrative: dreamNarrative ?? undefined,
      archetype: dogArchetype ?? undefined,
      ambitionDomain: ambitionType ?? undefined,
      moodRating: moodRating ?? undefined,
      sleepQuality: sleepQuality ?? undefined,
      energyLevel: energyLevel ?? undefined,
      stressLevel: stressLevel != null ? String(stressLevel) : undefined,
      domainAnswers: Object.keys(multiSelectAnswers).length > 0 ? multiSelectAnswers : undefined,
    };
    setPipelineStatus("loading");
    fetch("/api/plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ goal, userContext }),
    })
      .then((r) => {
        if (!r.ok) throw new Error(`Pipeline returned ${r.status}`);
        return r.json();
      })
      .then((plan) => {
        if (plan && !plan.error) {
          setPipelinePlan(plan);
        } else {
          setPipelineStatus("error");
        }
      })
      .catch((err) => {
        console.error("[quiz/analyzing] Plan generation failed:", err);
        setPipelineStatus("error");
      });
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
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 24px",
        background: "#060912",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background mesh */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          background:
            "radial-gradient(ellipse 70% 55% at 50% 20%, rgba(200,255,0,0.06) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 10% 90%, rgba(15,40,110,0.40) 0%, transparent 55%), linear-gradient(170deg, #0f1e3a 0%, #060912 55%)",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 360 }}>
        {/* Pulsing concentric rings */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 40 }}>
          <div style={{ position: "relative", width: 120, height: 120 }}>
            {/* Outer breathing ring */}
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.3, 0.15] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              style={{
                position: "absolute",
                inset: -16,
                borderRadius: "50%",
                border: "1px solid rgba(200,255,0,0.15)",
              }}
            />
            {/* Middle ring */}
            <motion.div
              animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
              style={{
                position: "absolute",
                inset: -6,
                borderRadius: "50%",
                border: "1px solid rgba(200,255,0,0.20)",
              }}
            />
            {/* Core orb */}
            <motion.div
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              style={{
                width: 120,
                height: 120,
                borderRadius: "50%",
                background: "radial-gradient(circle at 40% 35%, rgba(200,255,0,0.20), rgba(200,255,0,0.04) 70%)",
                border: "1px solid rgba(200,255,0,0.18)",
                boxShadow: "0 0 60px rgba(200,255,0,0.10), inset 0 0 30px rgba(200,255,0,0.05)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Inner spinner */}
              <AnimatePresence mode="wait">
                {isDone ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 18 }}
                  >
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                      <circle cx="20" cy="20" r="20" fill={LIME} />
                      <path d="M12 20.5l5.5 5.5L28 15" stroke="#060912" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </motion.div>
                ) : (
                  <motion.div
                    key="spinner"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      border: "2px solid rgba(200,255,0,0.12)",
                      borderTopColor: LIME,
                    }}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>

        {/* Animated text line */}
        <div style={{ textAlign: "center", marginBottom: 32, minHeight: 56 }}>
          <AnimatePresence mode="wait">
            <motion.p
              key={step}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              style={{
                fontFamily: "var(--font-apercu), sans-serif",
                fontSize: 16,
                fontWeight: isDone ? 600 : 500,
                color: isDone ? LIME : TEXT_HI,
                margin: 0,
                lineHeight: 1.4,
              }}
            >
              {lines[step]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Step dots */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            marginBottom: 24,
          }}
        >
          {Array.from({ length: STEP_COUNT }).map((_, i) => (
            <motion.span
              key={i}
              animate={{
                width: i === step ? 22 : 6,
                background: i <= step ? LIME : "rgba(255,255,255,0.10)",
              }}
              style={{
                height: 6,
                display: "block",
                borderRadius: 999,
              }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            />
          ))}
        </div>

        {/* Progress bar */}
        <div
          style={{
            height: 5,
            width: "100%",
            borderRadius: 999,
            background: "rgba(255,255,255,0.06)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <motion.div
            style={{
              position: "absolute",
              inset: 0,
              right: "auto",
              borderRadius: 999,
              background: `linear-gradient(90deg, ${LIME}, rgba(200,255,0,0.6))`,
            }}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 8, ease: "linear" }}
          />
          {/* Shimmer */}
          <motion.div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              width: 48,
              borderRadius: 999,
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
            }}
            animate={{ x: ["-48px", "400px"] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          />
        </div>

        {/* Powered by */}
        <p
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: 9,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: TEXT_LO,
            textAlign: "center",
            marginTop: 16,
          }}
        >
          Powered by Behavio AI
        </p>
      </div>
    </div>
  );
}
