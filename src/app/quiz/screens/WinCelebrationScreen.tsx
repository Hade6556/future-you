"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import CTAButton from "../components/CTAButton";
import { useQuizStore } from "../store/quizStore";
import { trackEvent } from "../utils/analytics";
import { ACCENT, TEXT_HI, TEXT_MID, TEXT_LO } from "@/app/theme";

function ConfettiDot({ delay, x }: { delay: number; x: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, x }}
      animate={{ opacity: [0, 1, 1, 0], y: [0, 60, 120, 200] }}
      transition={{ duration: 2, delay, ease: "easeOut" }}
      style={{
        position: "absolute",
        top: 0,
        left: `${50 + x / 3}%`,
        width: 6,
        height: 6,
        borderRadius: 3,
        background: ACCENT,
      }}
    />
  );
}

function MetaStat({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        flex: 1,
        minWidth: 0,
        padding: "10px 4px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: 9.5,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: TEXT_LO,
          marginBottom: 6,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: "var(--font-barlow-condensed), sans-serif",
          fontWeight: 900,
          fontStyle: "italic",
          fontSize: 16,
          color: TEXT_HI,
          letterSpacing: "-0.005em",
          lineHeight: 1.05,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {value}
      </div>
    </div>
  );
}

export default function WinCelebrationScreen({ onFinish }: { onFinish: () => void }) {
  const answers = useQuizStore((s) => s.answers);
  const [showCTA, setShowCTA] = useState(false);

  useEffect(() => {
    trackEvent("quiz_completed");
    const timer = setTimeout(() => setShowCTA(true), 1800);
    return () => clearTimeout(timer);
  }, []);

  const confettiDots = Array.from({ length: 12 }, () => ({
    delay: Math.random() * 0.8,
    x: (Math.random() - 0.5) * 200,
  }));

  const goalCount = answers.specificGoals.length;
  const goalLabel = `${goalCount} goal${goalCount === 1 ? "" : "s"} identified`;
  const dailyTime = answers.dailyTime?.split(" —")[0] ?? "< 5 min";

  const checklist = [
    { label: "18 questions synthesized" },
    { label: goalLabel },
    { label: `${answers.archetype} coaching style activated` },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Confetti */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {confettiDots.map((dot, i) => (
          <ConfettiDot key={i} delay={dot.delay} x={dot.x} />
        ))}
      </div>

      <p
        style={{
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: 11,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: ACCENT,
          margin: "0 0 14px",
          textAlign: "center",
        }}
      >
        ↳ Synthesis complete
      </p>

      <h1
        style={{
          fontFamily: "var(--font-barlow-condensed), sans-serif",
          fontWeight: 900,
          fontSize: "clamp(34px, 7.6vw, 48px)",
          color: TEXT_HI,
          margin: "0 0 26px",
          lineHeight: 0.95,
          letterSpacing: "-0.025em",
          textAlign: "center",
        }}
      >
        Your plan is{" "}
        <span style={{ fontStyle: "italic", color: ACCENT }}>ready.</span>
      </h1>

      {/* 3-stat passport row */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        style={{
          display: "flex",
          alignItems: "stretch",
          marginBottom: 22,
          padding: "4px 0",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <MetaStat label="Archetype" value={answers.archetype ?? "—"} />
        <div style={{ width: 1, background: "rgba(255,255,255,0.06)" }} aria-hidden />
        <MetaStat label="Focus" value={answers.goalArea ?? "—"} />
        <div style={{ width: 1, background: "rgba(255,255,255,0.06)" }} aria-hidden />
        <MetaStat label="Daily" value={dailyTime} />
      </motion.div>

      {/* Completion checklist */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18, duration: 0.4 }}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          marginBottom: 22,
          padding: "16px 18px",
          borderRadius: 16,
          background: "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.005))",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        {checklist.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.12, duration: 0.3 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.36 + i * 0.12, type: "spring", stiffness: 400, damping: 22 }}
              style={{
                flexShrink: 0,
                width: 18,
                height: 18,
                borderRadius: "50%",
                background: ACCENT,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: 9,
                fontWeight: 900,
                color: "#060912",
                lineHeight: 1,
              }}
            >
              ✓
            </motion.span>
            <span
              style={{
                fontFamily: "var(--font-apercu), sans-serif",
                fontSize: 14,
                color: TEXT_HI,
                letterSpacing: "-0.005em",
                lineHeight: 1.4,
              }}
            >
              {item.label}
            </span>
          </motion.div>
        ))}
      </motion.div>

      <p
        style={{
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: 10.5,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: TEXT_MID,
          margin: "0 0 20px",
          textAlign: "center",
        }}
      >
        ↳ Phase 1 unlocks first · Days 1–14
      </p>

      {!showCTA ? (
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: 11,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: ACCENT,
            textAlign: "center",
            paddingBlock: 12,
          }}
        >
          ⌁ Compiling your plan…
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ width: "100%" }}
        >
          <CTAButton label="See my plan →" onClick={onFinish} />
        </motion.div>
      )}
    </motion.div>
  );
}
