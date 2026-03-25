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
  CaptureForm,
} from "../components/quiz/QuestionFormats";
import type { ArchetypeId, AmbitionDomain } from "../types/plan";

export default function QuizPage() {
  const router = useRouter();
  const store = usePlanStore();
  const [currentScreen, setCurrentScreen] = useState(0);
  const selectedAmbition = useRef<AmbitionDomain>("career");

  const screen = QUIZ_SCREENS[currentScreen];
  const total = QUIZ_SCREENS.length;

  const advance = useCallback(() => {
    if (currentScreen >= total - 1) {
      router.push("/quiz/result");
      return;
    }
    setCurrentScreen((n) => n + 1);
  }, [currentScreen, total, router]);

  const goBack = useCallback(() => {
    if (currentScreen === 0) {
      router.back();
      return;
    }
    setCurrentScreen((n) => n - 1);
  }, [currentScreen, router]);

  const handleSelect = useCallback(
    (screenId: string, value: number) => {
      const scr = QUIZ_SCREENS.find((s) => s.id === screenId);
      const opts = scr?.options ?? [];

      if (screenId === "q_gender") {
        store.setGender(opts[value]?.label ?? "");
      }
      if (screenId === "q_field" && opts[value]?.ambition) {
        selectedAmbition.current = opts[value].ambition as AmbitionDomain;
      }

      advance();
    },
    [advance, store],
  );

  const handleCapture = useCallback(
    (name: string, email: string) => {
      store.setUserName(name);
      store.setEmail(email);
      store.completeQuiz("steady" as ArchetypeId, selectedAmbition.current);
      advance();
    },
    [advance, store],
  );

  const isSplash = screen?.type === "splash";
  const isInsight = screen?.type === "insight-card";
  const isWin = screen?.type === "win-celebration";
  const showHeader = !isSplash && !isWin;

  // Progress: count only non-splash, non-insight, non-win screens
  const questionScreens = QUIZ_SCREENS.filter(
    (s) => !["splash", "insight-card", "win-celebration"].includes(s.type),
  );
  const currentQIdx = questionScreens.findIndex((s) => s.id === screen?.id);
  const progressFraction = currentQIdx >= 0 ? (currentQIdx + 1) / questionScreens.length : 0;
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

      case "insight-card":
        return (
          <InsightCard
            stat={screen.stat}
            headline={screen.headline ?? ""}
            body={screen.body}
            ctaLabel={screen.ctaLabel}
            onContinue={advance}
          />
        );

      case "yes-no":
        return <YesNoPills onSelect={(val) => handleSelect(screen.id, val)} />;

      case "commitment-scale":
        return (
          <CommitmentScale
            subtext={screen.subtext}
            onSelect={() => advance()}
          />
        );

      case "win-celebration":
        return <WinCelebration onContinue={advance} />;

      case "capture-form":
        return <CaptureForm onSubmit={handleCapture} />;

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
          background: isWin || screen?.type === "capture-form"
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
        {!isSplash && (
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
                fontFamily: "var(--font-libre-baskerville), serif",
                fontWeight: 400,
                fontStyle: "italic",
                fontSize: 21,
                color: "rgba(235,242,255,0.92)",
              }}
            >
              Future
            </span>
            <span
              style={{
                fontFamily: "var(--font-cormorant), serif",
                fontWeight: 600,
                fontStyle: "italic",
                fontSize: 31,
                lineHeight: 0.82,
                color: "#C8FF00",
                letterSpacing: "-0.01em",
              }}
            >
              YOU
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
          !["win-celebration", "capture-form"].includes(screen.type) && (
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
                    fontFamily: "var(--font-barlow), sans-serif",
                    fontWeight: 300,
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

        {/* ── Capture heading (special layout for form) ── */}
        {screen?.type === "capture-form" && (
          <div style={{ padding: "0 20px 16px" }}>
            <h2
              style={{
                fontFamily: "var(--font-barlow-condensed), sans-serif",
                fontWeight: 700,
                fontStyle: "italic",
                fontSize: 40,
                lineHeight: 0.97,
                letterSpacing: "-0.025em",
                color: "rgba(235,242,255,0.92)",
                margin: "0 0 10px",
              }}
            >
              Where should we<br />send your{" "}
              <em style={{ fontStyle: "normal", color: "#C8FF00" }}>plan?</em>
            </h2>
            <p
              style={{
                fontFamily: "var(--font-barlow), sans-serif",
                fontWeight: 300,
                fontSize: 14,
                color: "rgba(120,155,195,0.50)",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              Your personalised plan is built. We just need to know who to send it to.
            </p>
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
