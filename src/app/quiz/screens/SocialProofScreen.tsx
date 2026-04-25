"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import CTAButton from "../components/CTAButton";
import { useQuizStore } from "../store/quizStore";
import { ACCENT, TEXT_HI, TEXT_MID, TEXT_LO, accentRgba } from "@/app/theme";

const COUNTUP_TARGET = 4219;
const COUNTUP_DURATION_MS = 1500;
const TICK_MS = 12_000;
const WEEKLY_PEER_BASE = 847;

export default function SocialProofScreen({ onNext }: { onNext: () => void }) {
  const goalArea = useQuizStore((s) => s.answers.goalArea);
  const [count, setCount] = useState(0);
  const [weeklyPeers, setWeeklyPeers] = useState(WEEKLY_PEER_BASE);
  const tickStarted = useRef(false);

  // Initial count-up animation
  useEffect(() => {
    const steps = 40;
    const increment = COUNTUP_TARGET / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= COUNTUP_TARGET) {
        setCount(COUNTUP_TARGET);
        clearInterval(interval);
      } else {
        setCount(Math.round(current));
      }
    }, COUNTUP_DURATION_MS / steps);
    return () => clearInterval(interval);
  }, []);

  // Live ticking — starts after count-up finishes, +1 every TICK_MS
  useEffect(() => {
    const startId = setTimeout(() => {
      tickStarted.current = true;
      const id = setInterval(() => {
        setCount((c) => c + 1);
        // Occasionally bump the weekly peer count too, for natural drift
        if (Math.random() < 0.35) {
          setWeeklyPeers((w) => w + 1);
        }
      }, TICK_MS);
      return () => clearInterval(id);
    }, COUNTUP_DURATION_MS + 200);
    return () => clearTimeout(startId);
  }, []);

  useEffect(() => {
    const timer = setTimeout(onNext, 4000);
    return () => clearTimeout(timer);
  }, [onNext]);

  const goalLabel = goalArea ?? "your goal";

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
      <p
        style={{
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: 11,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: ACCENT,
          margin: "0 0 14px",
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <span
          aria-hidden
          style={{
            position: "relative",
            display: "inline-flex",
            width: 6,
            height: 6,
          }}
        >
          <span
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              background: ACCENT,
              animation: "spDot 1.6s ease-out infinite",
              opacity: 0.55,
            }}
          />
          <span
            style={{
              position: "relative",
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: ACCENT,
            }}
          />
        </span>
        Right now · Live
      </p>
      <style>{`
        @keyframes spDot {
          0%   { transform: scale(1);   opacity: 0.55; }
          70%  { transform: scale(2.6); opacity: 0;    }
          100% { transform: scale(2.6); opacity: 0;    }
        }
      `}</style>

      <h2
        style={{
          fontFamily: "var(--font-barlow-condensed), sans-serif",
          fontWeight: 900,
          fontSize: "clamp(28px, 6.4vw, 36px)",
          color: TEXT_HI,
          margin: "0 0 28px",
          lineHeight: 1.0,
          letterSpacing: "-0.025em",
        }}
      >
        <span style={{ color: ACCENT, fontStyle: "italic" }}>{weeklyPeers}</span>{" "}
        people picked {goalLabel} this{" "}
        <span style={{ fontStyle: "italic", color: ACCENT }}>week.</span>
      </h2>

      <div
        style={{
          padding: "22px 20px",
          borderRadius: 18,
          background: "linear-gradient(180deg, rgba(255,255,255,0.045), rgba(255,255,255,0.01))",
          border: "1px solid rgba(255,255,255,0.08)",
          marginBottom: 24,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(60% 60% at 0% 0%, ${accentRgba(0.08)}, transparent 70%)`,
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative" }}>
          <div
            style={{
              fontFamily: "var(--font-barlow-condensed), sans-serif",
              fontWeight: 900,
              fontStyle: "italic",
              fontSize: "clamp(40px, 9vw, 52px)",
              color: ACCENT,
              lineHeight: 1,
              letterSpacing: "-0.025em",
              fontVariantNumeric: "tabular-nums",
              marginBottom: 8,
            }}
          >
            {count.toLocaleString()}
          </div>
          <p
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 10.5,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: TEXT_MID,
              margin: 0,
              lineHeight: 1.4,
            }}
          >
            building their 90-day plan right now
          </p>
        </div>
      </div>

      <p
        style={{
          fontFamily: "var(--font-apercu), sans-serif",
          fontSize: 13.5,
          color: TEXT_LO,
          margin: "0 0 32px",
          lineHeight: 1.5,
        }}
      >
        Most people who reach this screen{" "}
        <span style={{ color: TEXT_MID, fontWeight: 600 }}>finish</span>. Your
        archetype reveal is the next step.
      </p>

      <CTAButton label="I'm in →" onClick={onNext} />
    </motion.div>
  );
}
