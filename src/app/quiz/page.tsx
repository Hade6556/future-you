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

import SplashScreen from "./screens/SplashScreen";
import GoalAreaScreen from "./screens/GoalAreaScreen";
import SpecificGoalsScreen from "./screens/SpecificGoalsScreen";
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

const SCREEN_NAMES = [
  "splash",
  "goal_area",
  "specific_goals",
  "gender",
  "age",
  "problems",
  "empathy",
  "current_state",
  "social_proof",
  "insight_research",
  "bad_habits",
  "past_attempts",
  "insight_why_failed",
  "problem_breakdown",
  "time_per_day",
  "timeline_insight",
  "email_capture",
  "archetype_reveal",
  "win_celebration",
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
    // After Problems (step 5): show Empathy only if burnout/stress selected
    if (step === 5) {
      const showEmpathy =
        problems.includes("Burnout") || problems.includes("Chronic stress");
      setStep(showEmpathy ? 6 : 7);
      return;
    }
    setStep(step + 1);
  }, [step, setStep, problems]);

  const back = useCallback(() => {
    if (step === 0) return;
    if (step === 7) {
      const showEmpathy =
        problems.includes("Burnout") || problems.includes("Chronic stress");
      setStep(showEmpathy ? 6 : 5);
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

    // Build a narrative from quiz answers for plan generation
    const goals = answers.specificGoals.join(", ");
    const narrative = goals
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

  // Browser back button handling + exit intent on splash
  useEffect(() => {
    function onPopState() {
      if (step === 0) {
        if (!confirm("Are you sure? Your plan is almost ready.")) {
          window.history.pushState(null, "", window.location.href);
        }
      } else {
        back();
      }
    }
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [step, back]);

  const showProgress = step > 0 && step < 18;

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
            {step === 0 && <SplashScreen key="splash" onNext={next} />}
            {step === 1 && <GoalAreaScreen key="goal" onNext={next} />}
            {step === 2 && <SpecificGoalsScreen key="specific" onNext={next} />}
            {step === 3 && <GenderScreen key="gender" onNext={next} />}
            {step === 4 && <AgeScreen key="age" onNext={next} />}
            {step === 5 && <ProblemsScreen key="problems" onNext={next} />}
            {step === 6 && <EmpathyScreen key="empathy" onNext={next} />}
            {step === 7 && <CurrentStateScreen key="state" onNext={next} />}
            {step === 8 && <SocialProofScreen key="social" onNext={next} />}
            {step === 9 && <InsightResearchScreen key="research" onNext={next} />}
            {step === 10 && <BadHabitsScreen key="habits" onNext={next} />}
            {step === 11 && <PastAttemptsScreen key="past" onNext={next} />}
            {step === 12 && <InsightWhyFailedScreen key="whyfailed" onNext={next} />}
            {step === 13 && <ProblemBreakdownScreen key="breakdown" onNext={next} />}
            {step === 14 && <TimePerDayScreen key="time" onNext={next} />}
            {step === 15 && <TimelineInsightScreen key="timeline" onNext={next} />}
            {step === 16 && <EmailCaptureScreen key="email" onNext={next} />}
            {step === 17 && <ArchetypeRevealScreen key="archetype" onNext={next} />}
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
