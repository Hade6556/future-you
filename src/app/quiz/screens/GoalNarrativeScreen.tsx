"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import CTAButton from "../components/CTAButton";
import { useQuizStore, type GoalArea } from "../store/quizStore";
import { ACCENT, TEXT_HI, TEXT_MID, TEXT_LO } from "@/app/theme";

const PLACEHOLDER_BY_AREA: Record<GoalArea, string> = {
  "Career & Purpose":
    "e.g. Land a senior PM role at a B2B SaaS company by August. Lead a team of 4. Compensation €110k+.",
  "Money & Financial Freedom":
    "e.g. Save €8,000 toward a down payment by cutting subscriptions and adding a €600/mo side income.",
  "Relationships & Connection":
    "e.g. Stop being the friend who flakes — start a weekly call with my brother and rebuild two friendships.",
  "Health & Energy":
    "e.g. Run my first 10K in October. Sleep 7+ hours on weekdays. Drop 6kg without crash dieting.",
  "Mindset & Personal Growth":
    "e.g. Write every morning for 15 min. Quit doomscrolling at night. Finish one book a month.",
};

const MIN_CHARS = 20;

export default function GoalNarrativeScreen({ onNext }: { onNext: () => void }) {
  const goalArea = useQuizStore((s) => s.answers.goalArea);
  const stored = useQuizStore((s) => s.answers.goalNarrative);
  const setGoalNarrative = useQuizStore((s) => s.setGoalNarrative);
  const [value, setValue] = useState(stored);

  const placeholder = goalArea
    ? PLACEHOLDER_BY_AREA[goalArea]
    : "e.g. What does winning look like 90 days from now? Be specific — numbers, names, the actual outcome.";

  const trimmed = value.trim();
  const valid = trimmed.length >= MIN_CHARS;

  function handleNext() {
    setGoalNarrative(trimmed);
    onNext();
  }

  function handleSkip() {
    // Skip — handleFinish falls back to an auto-generated narrative built
    // from the structured answers (goalArea + specificGoals).
    setGoalNarrative("");
    onNext();
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.25 }}
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: 11,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: ACCENT,
          margin: "0 0 14px",
        }}
      >
        ↳ In your words
      </p>

      <h1
        style={{
          fontFamily: "var(--font-barlow-condensed), sans-serif",
          fontWeight: 900,
          fontSize: "clamp(28px, 6.4vw, 36px)",
          color: TEXT_HI,
          margin: "0 0 12px",
          lineHeight: 1.0,
          letterSpacing: "-0.025em",
        }}
      >
        What does{" "}
        <span style={{ fontStyle: "italic", color: ACCENT }}>success</span>{" "}
        look like 90 days from now?
      </h1>
      <p
        style={{
          fontFamily: "var(--font-apercu), sans-serif",
          fontSize: 14.5,
          color: TEXT_MID,
          margin: "0 0 22px",
          lineHeight: 1.5,
        }}
      >
        One paragraph. The more specific you are — numbers, deadlines, the
        actual outcome — the more your plan will feel built for you.
      </p>

      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        autoFocus
        rows={6}
        style={{
          width: "100%",
          minHeight: 160,
          padding: "14px 16px",
          borderRadius: 14,
          border: `1px solid ${valid ? "rgba(94,205,161,0.45)" : "rgba(255,255,255,0.10)"}`,
          background: "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
          color: TEXT_HI,
          fontFamily: "var(--font-apercu), sans-serif",
          fontSize: 15,
          lineHeight: 1.55,
          outline: "none",
          resize: "none",
          letterSpacing: "-0.005em",
          marginBottom: 10,
          transition: "border-color 160ms",
        }}
      />

      <p
        style={{
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: 10,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: TEXT_LO,
          margin: "0 0 22px",
        }}
      >
        {trimmed.length}/{MIN_CHARS} characters min
      </p>

      <CTAButton label="That's the goal →" onClick={handleNext} disabled={!valid} />

      <button
        type="button"
        onClick={handleSkip}
        style={{
          marginTop: 14,
          background: "none",
          border: "none",
          color: TEXT_LO,
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: 11,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          cursor: "pointer",
          alignSelf: "center",
        }}
      >
        Skip · use my goals above
      </button>
    </motion.div>
  );
}
