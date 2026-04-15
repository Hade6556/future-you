"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import CTAButton from "../components/CTAButton";
import { useQuizStore } from "../store/quizStore";
import { trackEvent } from "../utils/analytics";
import { ACCENT, TEXT_HI, TEXT_MID, TEXT_LO, accentRgba } from "@/app/theme";

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

export default function WinCelebrationScreen({ onFinish }: { onFinish: () => void }) {
  const answers = useQuizStore((s) => s.answers);
  const [showCTA, setShowCTA] = useState(false);

  useEffect(() => {
    trackEvent("quiz_completed");
    const timer = setTimeout(() => setShowCTA(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const confettiDots = Array.from({ length: 12 }, (_, i) => ({
    delay: Math.random() * 0.8,
    x: (Math.random() - 0.5) * 200,
  }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
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

      <h1
        style={{
          fontFamily: "var(--font-barlow-condensed), sans-serif",
          fontWeight: 800,
          fontStyle: "italic",
          fontSize: 28,
          color: TEXT_HI,
          margin: "0 0 8px",
          lineHeight: 1.2,
        }}
      >
        Your 90-day plan is being built.
      </h1>

      <p
        style={{
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: 11,
          color: TEXT_LO,
          margin: "0 0 28px",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        {answers.archetype} &middot; {answers.goalArea} focus &middot;{" "}
        {answers.dailyTime?.split(" —")[0] ?? "15 min"} daily
      </p>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          marginBottom: 32,
          padding: "20px 18px",
          borderRadius: 16,
          background: "rgba(255,255,255,0.06)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.12)",
          fontFamily: "var(--font-apercu), sans-serif",
          fontSize: 14,
          color: TEXT_MID,
        }}
      >
        <span>18 questions answered</span>
        <span>{answers.specificGoals.length} goals identified</span>
        <span>{answers.archetype} coaching style activated</span>
      </div>

      {!showCTA && (
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{
            fontFamily: "var(--font-apercu), sans-serif",
            fontSize: 14,
            color: ACCENT,
          }}
        >
          ⚙️ Generating your personalised plan...
        </motion.div>
      )}

      {showCTA && (
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
