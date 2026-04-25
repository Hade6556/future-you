"use client";

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { useQuizStore } from "./store/quizStore";
import { usePlanStore } from "../state/planStore";
import { trackScreenViewed } from "./utils/analytics";
import ProgressBar from "./components/ProgressBar";
import type { AmbitionDomain, ArchetypeId } from "../types/plan";
import { inferMarketingIntentFromQuizGoalArea } from "../types/marketingIntent";

const GOAL_AREA_TO_AMBITION: Record<string, AmbitionDomain> = {
  "Career & Purpose": "career",
  "Money & Financial Freedom": "finance",
  "Relationships & Connection": "relationships",
  "Health & Energy": "athlete",
  "Mindset & Personal Growth": "confidence",
};

const ARCHETYPE_TO_ID: Record<string, ArchetypeId> = {
  "Steady Builder": "steady",
  "Laser Strategist": "strategist",
  "Endurance Engine": "endurance",
  "Creative Spark": "creative",
  "Guardian": "guardian",
  "Explorer": "explorer",
};

import GoalAreaScreen from "./screens/GoalAreaScreen";
import SpecificGoalsScreen from "./screens/SpecificGoalsScreen";
import GoalNarrativeScreen from "./screens/GoalNarrativeScreen";
import GenderScreen from "./screens/GenderScreen";
import AgeScreen from "./screens/AgeScreen";
import ProblemsScreen from "./screens/ProblemsScreen";
import EmpathyScreen from "./screens/EmpathyScreen";
import CurrentStateScreen from "./screens/CurrentStateScreen";
import SocialProofScreen from "./screens/SocialProofScreen";
import InsightResearchScreen from "./screens/InsightResearchScreen";
import BadHabitsScreen from "./screens/BadHabitsScreen";
import PastAttemptsScreen from "./screens/PastAttemptsScreen";
import InsightWhyFailedScreen from "./screens/InsightWhyFailedScreen";
import ProblemBreakdownScreen from "./screens/ProblemBreakdownScreen";
import TimePerDayScreen from "./screens/TimePerDayScreen";
import TimelineInsightScreen from "./screens/TimelineInsightScreen";
import EmailCaptureScreen from "./screens/EmailCaptureScreen";
import ArchetypeRevealScreen from "./screens/ArchetypeRevealScreen";
import WinCelebrationScreen from "./screens/WinCelebrationScreen";

// Yes-ladder funnel: zero-friction taps first (gender, age), then framing,
// then escalating pain questions after the user is committed.
const SCREEN_NAMES = [
  "gender",            // 0  — one tap
  "age",               // 1  — one tap
  "goal_area",         // 2  — direction
  "specific_goals",    // 3  — concrete goals
  "goal_narrative",    // 4  — free-text goal in their words (powers AI plan)
  "social_proof",      // 5  — first reward (uses goal_area only)
  "current_state",     // 6  — light self-assessment
  "insight_research",  // 7  — authority pause
  "problems",          // 8  — escalating pain begins
  "empathy",           // 9  — conditional: only if burnout/stress
  "bad_habits",        // 10
  "past_attempts",     // 11
  "insight_why_failed",// 12 — validation insight
  "problem_breakdown", // 13 — diagnostic
  "time_per_day",      // 14 — commitment ask (after they've invested)
  "timeline_insight",  // 15 — 69 days lost / 127 reclaimed
  "email_capture",     // 16
  "archetype_reveal",  // 17 — climax
  "win_celebration",   // 18
];

export default function QuizPage() {
  const router = useRouter();
  const step = useQuizStore((s) => s.step);
  const setStep = useQuizStore((s) => s.setStep);
  const problems = useQuizStore((s) => s.answers.problems);

  useEffect(() => {
    if (SCREEN_NAMES[step]) {
      trackScreenViewed(SCREEN_NAMES[step]);
    }
  }, [step]);

  const next = useCallback(() => {
    // After Problems (step 8): show Empathy (step 9) only if burnout/stress
    // selected; otherwise skip straight to BadHabits (step 10).
    if (step === 8) {
      const showEmpathy =
        problems.includes("Burnout") || problems.includes("Chronic stress");
      setStep(showEmpathy ? 9 : 10);
      return;
    }
    setStep(step + 1);
  }, [step, setStep, problems]);

  const back = useCallback(() => {
    if (step === 0) return;
    // Going back from BadHabits (step 10): skip over Empathy if it wasn't shown
    if (step === 10) {
      const showEmpathy =
        problems.includes("Burnout") || problems.includes("Chronic stress");
      setStep(showEmpathy ? 9 : 8);
      return;
    }
    setStep(step - 1);
  }, [step, setStep, problems]);

  function handleFinish() {
    const answers = useQuizStore.getState().answers;
    const store = usePlanStore.getState();

    // Map quiz data → plan store so we can skip the onboarding funnel
    const ambition = GOAL_AREA_TO_AMBITION[answers.goalArea ?? ""] ?? "confidence";
    const archetype = ARCHETYPE_TO_ID[answers.archetype ?? ""] ?? "steady";

    // Prefer the user's free-text narrative (from GoalNarrativeScreen) — it's
    // in their own voice and gives the AI plan far better personalization.
    // Fall back to a synthesized narrative when they skipped that step.
    const typedNarrative = answers.goalNarrative?.trim() ?? "";
    const goals = answers.specificGoals.join(", ");
    const narrative =
      typedNarrative.length >= 20
        ? typedNarrative
        : goals
          ? `My goal area is ${answers.goalArea}. Specifically, I want to: ${goals}.`
          : `I want to focus on ${answers.goalArea ?? "personal growth"}.`;

    if (answers.email) store.setEmail(answers.email);
    const fromUrl = store.marketingIntent;
    store.setMarketingIntent(
      fromUrl ?? inferMarketingIntentFromQuizGoalArea(answers.goalArea ?? undefined),
    );
    store.completeQuiz(archetype, ambition);
    store.completeOnboarding();
    store.setPendingNarrative(narrative);
    try {
      sessionStorage.setItem("behavio-pending-narrative", narrative);
    } catch { /* ignore */ }

    router.push("/generating");
  }

  // Browser back button: on step 0 the user falls through to the landing page;
  // on later steps we step back through the quiz instead of leaving the page.
  useEffect(() => {
    function onPopState() {
      if (step === 0) return; // let the browser navigate back to /
      back();
    }
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [step, back]);

  const showProgress = step >= 0 && step < 18;

  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        background: "#060912",
      }}
    >
      {/* Background gradient mesh — matches main app */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          background: `
            radial-gradient(ellipse 70% 50% at 20% 10%, rgba(40,80,200,0.30) 0%, transparent 60%),
            radial-gradient(ellipse 60% 60% at 85% 80%, rgba(15,40,100,0.50) 0%, transparent 60%),
            linear-gradient(160deg, #0f2040 0%, #090f1a 50%, #060912 100%)
          `,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          maxWidth: 420,
          width: "100%",
          margin: "0 auto",
          padding:
            "max(2.5rem, calc(env(safe-area-inset-top, 0px) + 1.5rem)) 24px 24px",
        }}
      >
        {showProgress && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 28,
            }}
          >
            <button
              type="button"
              onClick={back}
              aria-label="Back"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.10)",
                borderRadius: 10,
                color: "rgba(160,180,210,0.75)",
                fontSize: 16,
                cursor: "pointer",
                padding: "6px 10px",
                lineHeight: 1,
                backdropFilter: "blur(8px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.15s",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div style={{ flex: 1 }}>
              <ProgressBar step={step} />
            </div>
          </div>
        )}

        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <AnimatePresence mode="wait">
            {step === 0  && <GenderScreen          key="gender"     onNext={next} />}
            {step === 1  && <AgeScreen             key="age"        onNext={next} />}
            {step === 2  && <GoalAreaScreen        key="goal"       onNext={next} />}
            {step === 3  && <SpecificGoalsScreen   key="specific"   onNext={next} />}
            {step === 4  && <GoalNarrativeScreen   key="narrative"  onNext={next} />}
            {step === 5  && <SocialProofScreen     key="social"     onNext={next} />}
            {step === 6  && <CurrentStateScreen    key="state"      onNext={next} />}
            {step === 7  && <InsightResearchScreen key="research"   onNext={next} />}
            {step === 8  && <ProblemsScreen        key="problems"   onNext={next} />}
            {step === 9  && <EmpathyScreen         key="empathy"    onNext={next} />}
            {step === 10 && <BadHabitsScreen       key="habits"     onNext={next} />}
            {step === 11 && <PastAttemptsScreen    key="past"       onNext={next} />}
            {step === 12 && <InsightWhyFailedScreen key="whyfailed" onNext={next} />}
            {step === 13 && <ProblemBreakdownScreen key="breakdown" onNext={next} />}
            {step === 14 && <TimePerDayScreen      key="time"       onNext={next} />}
            {step === 15 && <TimelineInsightScreen key="timeline"   onNext={next} />}
            {step === 16 && <EmailCaptureScreen    key="email"      onNext={next} />}
            {step === 17 && <ArchetypeRevealScreen key="archetype"  onNext={next} />}
            {step === 18 && (
              <WinCelebrationScreen key="win" onFinish={handleFinish} />
            )}
          </AnimatePresence>
        </div>

        <div
          style={{ height: "max(16px, env(safe-area-inset-bottom, 16px))" }}
        />
      </div>
    </div>
  );
}
