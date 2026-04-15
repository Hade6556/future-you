"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import CTAButton from "../components/CTAButton";
import { useQuizStore } from "../store/quizStore";
import { ACCENT, TEXT_HI, TEXT_MID, TEXT_LO } from "@/app/theme";

export default function SocialProofScreen({ onNext }: { onNext: () => void }) {
  const goalArea = useQuizStore((s) => s.answers.goalArea);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const target = 4219;
    const duration = 1500;
    const steps = 40;
    const increment = target / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(interval);
      } else {
        setCount(Math.round(current));
      }
    }, duration / steps);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setTimeout(onNext, 4000);
    return () => clearTimeout(timer);
  }, [onNext]);

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
        justifyContent: "center",
      }}
    >
      <h2
        style={{
          fontFamily: "var(--font-apercu), sans-serif",
          fontWeight: 600,
          fontSize: 24,
          color: TEXT_HI,
          margin: "0 0 24px",
          letterSpacing: "-0.01em",
        }}
      >
        🤝 You&apos;re not alone in this.
      </h2>

      <div
        style={{
          padding: "24px 20px",
          borderRadius: 18,
          background: "rgba(255,255,255,0.06)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.12)",
          marginBottom: 24,
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-barlow-condensed), sans-serif",
            fontWeight: 800,
            fontSize: 42,
            color: ACCENT,
            marginBottom: 6,
          }}
        >
          {count.toLocaleString()}
        </div>
        <p
          style={{
            fontFamily: "var(--font-apercu), sans-serif",
            fontSize: 15,
            color: TEXT_MID,
            margin: "0 0 16px",
          }}
        >
          people are building their 90-day Behavio plan right now
        </p>

        <p
          style={{
            fontFamily: "var(--font-apercu), sans-serif",
            fontSize: 14,
            color: TEXT_MID,
            margin: 0,
          }}
        >
          <span style={{ fontWeight: 600, color: ACCENT }}>847</span> people
          focused on {goalArea ?? "your goal"} started this week
        </p>
      </div>

      <p
        style={{
          fontFamily: "var(--font-apercu), sans-serif",
          fontSize: 13,
          color: TEXT_LO,
          margin: "0 0 32px",
          lineHeight: 1.5,
        }}
      >
        3 in 5 people with your profile are Laser Strategists or Steady
        Builders — find out yours next.
      </p>

      <CTAButton label="Keep building my plan →" onClick={onNext} />
    </motion.div>
  );
}
