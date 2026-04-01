"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { QUIZ_SCREENS } from "../data/quiz";
import { usePlanStore } from "../state/planStore";
import {
  SplashStep,
  TwoColCards,
  ListRows,
  InsightCard,
  YesNoPills,
  CommitmentScale,
  WinCelebration,
  MultiSelectStep,
  SliderScaleStep,
  LiveCounterCard,
  ComparisonCard,
  TimelineCard,
} from "../components/quiz/QuestionFormats";
import type { ArchetypeId, AmbitionDomain } from "../types/plan";

const SOCIAL_PROOF_AVATARS = [
  "/mock/people/alex-chen.jpg",
  "/mock/people/sarah-jones.jpg",
  "/mock/people/emma-wilson.jpg",
  "/mock/people/david-kim.jpg",
  "/mock/people/carlos-garcia.jpg",
  "/mock/people/nina-patel.jpg",
];

const RESEARCH_BADGES = [
  { name: "Harvard", logo: "/icons/unis/harvard.png" },
  { name: "Stanford", logo: "/icons/unis/stanford.png" },
  { name: "MIT", logo: "/icons/unis/mit.png" },
  { name: "Oxford", logo: "/icons/unis/oxford.png" },
  { name: "Cambridge", logo: "/icons/unis/cambridge.png" },
];

const INSIGHT_BADGES: Record<string, typeof RESEARCH_BADGES | undefined> = {
  insight_expert: RESEARCH_BADGES,
};

export default function QuizPage() {
  const router = useRouter();
  const store = usePlanStore();
  const [currentScreen, setCurrentScreen] = useState(0);
  const selectedAmbition = useRef<AmbitionDomain>("career");

  const screen = QUIZ_SCREENS[currentScreen];
  const total = QUIZ_SCREENS.length;
  const answers = store.multiSelectAnswers;

  const freshAnswers = () => usePlanStore.getState().multiSelectAnswers;
  const isVisibleNow = (scr: (typeof QUIZ_SCREENS)[number]) =>
    !scr.showWhen || scr.showWhen(freshAnswers());

  const advance = useCallback(() => {
    let next = currentScreen + 1;
    while (next < total && !isVisibleNow(QUIZ_SCREENS[next])) next++;
    if (next >= total) {
      store.completeQuiz("steady" as ArchetypeId, selectedAmbition.current);
      router.push("/signup");
      return;
    }
    setCurrentScreen(next);
  }, [currentScreen, total, router, store]);

  const goBack = useCallback(() => {
    let prev = currentScreen - 1;
    while (prev > 0 && !isVisibleNow(QUIZ_SCREENS[prev])) prev--;
    if (prev < 0) {
      router.back();
      return;
    }
    setCurrentScreen(prev);
  }, [currentScreen, router]);

  const handleSelect = useCallback(
    (screenId: string, value: number) => {
      const scr = QUIZ_SCREENS.find((s) => s.id === screenId);
      const opts = scr?.options ?? [];
      const label = opts[value]?.label ?? "";

      if (screenId === "q_gender") {
        store.setGender(label);
      }
      if (screenId === "q_goal_area") {
        store.setMultiSelectAnswer(screenId, [label]);
        if (label.includes("Career") || label.includes("Money") || label.includes("Learning") || label.includes("Creativity"))
          selectedAmbition.current = "career";
        else if (label.includes("Health"))
          selectedAmbition.current = "athlete";
        else
          selectedAmbition.current = "confidence";
      }
      if (screenId === "q_age") {
        store.setMentalHealthData({ quizAgeGroup: label });
      }
      if (screenId === "q_current_state") {
        store.setMentalHealthData({ quizCurrentState: label });
      }
      if (screenId === "q_time_per_day") {
        store.setQuizContext({ schedule: label });
      }
      if (screenId === "q_sleep_quality") {
        store.setMentalHealthData({ sleepQuality: label });
      }
      if (screenId === "q_self_trust") {
        store.setMultiSelectAnswer(screenId, [label]);
      }

      advance();
    },
    [advance, store],
  );

  const INSIGHT_TYPES = ["insight-card", "live-counter", "comparison-card", "timeline-card"];
  const isSplash = screen?.type === "splash";
  const isInsight = INSIGHT_TYPES.includes(screen?.type ?? "");
  const isWin = screen?.type === "win-celebration";
  const showHeader = !isSplash && !isWin;

  const NON_PROGRESS_TYPES = ["splash", "win-celebration", ...INSIGHT_TYPES];
  const isVisibleForRender = (scr: (typeof QUIZ_SCREENS)[number]) =>
    !scr.showWhen || scr.showWhen(answers);
  const visibleQuestionScreens = QUIZ_SCREENS.filter(
    (s) => !NON_PROGRESS_TYPES.includes(s.type) && isVisibleForRender(s),
  );
  const currentQIdx = visibleQuestionScreens.findIndex((s) => s.id === screen?.id);
  const progressFraction = currentQIdx >= 0 ? (currentQIdx + 1) / visibleQuestionScreens.length : 0;
  const showProgress = !isSplash && !isInsight && !isWin && currentQIdx >= 0;

  const renderStep = () => {
    if (!screen) return null;
    const opts = screen.options ?? [];

    switch (screen.type) {
      case "splash":
        return <SplashStep onContinue={advance} />;

      case "two-col-cards":
        return <TwoColCards options={opts} onSelect={(val) => handleSelect(screen.id, val)} />;

      case "list-rows":
        return <ListRows options={opts} onSelect={(val) => handleSelect(screen.id, val)} />;

      case "insight-card": {
        const screenBadges = INSIGHT_BADGES[screen.id];
        return (
          <InsightCard
            stat={screen.stat}
            headline={screen.headline ?? ""}
            body={screen.body}
            ctaLabel={screen.ctaLabel}
            avatars={SOCIAL_PROOF_AVATARS}
            badges={screenBadges}
            onContinue={advance}
          />
        );
      }

      case "yes-no":
        return <YesNoPills onSelect={(val) => handleSelect(screen.id, val)} />;

      case "commitment-scale":
        return (
          <CommitmentScale
            subtext={screen.subtext}
            onSelect={() => advance()}
          />
        );

      case "multi-select":
        return (
          <MultiSelectStep
            options={opts}
            onSubmit={(indices) => {
              store.setMultiSelectAnswer(screen.id, indices.map((i) => opts[i]?.label ?? ""));
              advance();
            }}
          />
        );

      case "slider-scale":
        return (
          <SliderScaleStep
            labels={screen.scaleLabels ?? ["Poor", "Fair", "Good", "Great"]}
            onSelect={(val) => {
              const scaleLabels = screen.scaleLabels ?? ["Poor", "Fair", "Good", "Great"];
              store.setMultiSelectAnswer(screen.id, [scaleLabels[val]]);
              advance();
            }}
          />
        );

      case "live-counter":
        return (
          <LiveCounterCard
            avatars={SOCIAL_PROOF_AVATARS}
            ctaLabel={screen.ctaLabel}
            onContinue={advance}
          />
        );

      case "comparison-card":
        return (
          <ComparisonCard
            ctaLabel={screen.ctaLabel}
            onContinue={advance}
          />
        );

      case "timeline-card":
        return (
          <TimelineCard
            ctaLabel={screen.ctaLabel}
            onContinue={advance}
          />
        );

      case "win-celebration":
        return <WinCelebration onContinue={advance} />;

      default:
        return null;
    }
  };

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "#060912",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background gradient mesh — warm variant on win/capture screens */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          background: isWin
            ? `
              radial-gradient(ellipse 70% 55% at 50% 20%, rgba(200,255,0,0.10) 0%, transparent 60%),
              radial-gradient(ellipse 60% 50% at 10% 90%, rgba(15,40,110,0.40) 0%, transparent 55%),
              linear-gradient(170deg, #0f1e3a 0%, #060912 55%)
            `
            : `
              radial-gradient(ellipse 80% 55% at 50% -5%, rgba(50,90,220,0.38) 0%, transparent 60%),
              radial-gradient(ellipse 60% 50% at 90% 90%, rgba(15,40,110,0.40) 0%, transparent 55%),
              linear-gradient(170deg, #0d1a3a 0%, #060912 55%)
            `,
          transition: "background 0.9s ease",
          pointerEvents: "none",
        }}
      />
      {/* Subtle grid overlay */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* ── Logo (always shown outside splash) ── */}
        {!isSplash && !isWin && (
          <div
            style={{
              position: "absolute",
              top: "max(3.5rem, env(safe-area-inset-top, 3.5rem))",
              left: 28,
              display: "flex",
              alignItems: "baseline",
              zIndex: 10,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-barlow-condensed), sans-serif",
                fontWeight: 700,
                fontStyle: "italic",
                fontSize: 20,
                color: "rgba(200,255,0,0.85)",
                letterSpacing: "0.02em",
              }}
            >
              behavio
            </span>
          </div>
        )}

        {/* ── Header ── */}
        {showHeader && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding:
                "max(5.5rem, calc(env(safe-area-inset-top, 3.5rem) + 2rem)) 20px 16px",
              gap: 12,
            }}
          >
            <button
              type="button"
              onClick={goBack}
              aria-label="Go back"
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.05)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
                <path
                  d="M7 1L1 7l6 6"
                  stroke="rgba(235,242,255,0.60)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* Progress bar */}
            {showProgress && (
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    height: 3,
                    background: "rgba(255,255,255,0.09)",
                    borderRadius: 2,
                    overflow: "hidden",
                    marginBottom: 7,
                  }}
                >
                  <motion.div
                    animate={{ width: `${progressFraction * 100}%` }}
                    transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                    style={{ height: "100%", background: "#C8FF00", borderRadius: 2 }}
                  />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-barlow-condensed), sans-serif",
                      fontWeight: 400,
                      fontStyle: "italic",
                      fontSize: 12,
                      color: "rgba(120,155,195,0.50)",
                    }}
                  >
                    {screen?.id ? "Building your plan" : ""}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-barlow-condensed), sans-serif",
                      fontWeight: 700,
                      fontSize: 12,
                      color: "#C8FF00",
                    }}
                  >
                    {Math.round(progressFraction * 100)}%
                  </span>
                </div>
              </div>
            )}

            {/* Spacer so back button stays left when no progress bar */}
            {!showProgress && <div style={{ flex: 1 }} />}

            <div style={{ width: 40 }} />
          </div>
        )}

        {/* ── Question heading ── */}
        {showHeader &&
          screen?.question &&
          !["win-celebration", "capture-form", ...INSIGHT_TYPES].includes(screen.type) && (
            <div style={{ padding: "0 20px 20px" }}>
              <h2
                style={{
                  fontFamily: "var(--font-barlow-condensed), sans-serif",
                  fontWeight: 700,
                  fontStyle: "italic",
                  fontSize: 38,
                  lineHeight: 0.97,
                  letterSpacing: "-0.025em",
                  color: "rgba(235,242,255,0.92)",
                  margin: "0 0 6px",
                }}
              >
                {screen.question}
              </h2>
              {screen.subtext && (
                <p
                  style={{
                    fontFamily: "var(--font-body), Georgia, serif",
                    fontWeight: 400,
                    fontSize: 13,
                    color: "rgba(120,155,195,0.50)",
                    lineHeight: 1.55,
                    margin: 0,
                  }}
                >
                  {screen.subtext}
                </p>
              )}
            </div>
          )}

        {/* ── Step content ── */}
        <div style={{ padding: isSplash ? 0 : "0 20px 48px" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentScreen}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
