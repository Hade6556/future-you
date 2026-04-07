"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePlanStore } from "../../state/planStore";
import { ARCHETYPES } from "../../data/archetypes";

const RADIUS = 80;
const STROKE_WIDTH = 14;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const CENTER = 100;
const SVG_SIZE = 220;

function getScoreMessage(score: number): string {
  if (score >= 90) return "Almost there. Don't stop now.";
  if (score >= 70) return "Strong progress. Keep pushing.";
  if (score >= 50) return "Past halfway. Momentum is real.";
  if (score >= 30) return "Building real traction.";
  if (score >= 10) return "Every day compounds.";
  return "Day one is where it begins.";
}

function getArcColor(score: number): string {
  if (score >= 70) return "#4CAF7D"; // Positive green
  if (score >= 40) return "#F5A623"; // Amber
  return "#2DD4C0";                  // Teal
}

export function FutureScoreRing() {
  const futureScore = usePlanStore((s) => s.futureScore);
  const archetype = usePlanStore((s) => s.dogArchetype);
  const arch = archetype ? ARCHETYPES.find((a) => a.id === archetype) : null;

  const [displayScore, setDisplayScore] = useState(0);
  const [taglineIdx, setTaglineIdx] = useState(0);

  const taglines = [
    getScoreMessage(futureScore),
    "Your future self is watching.",
    arch?.tagline ?? "One day at a time.",
    "Progress, not perfection.",
  ];

  // Animate score count-up on mount
  useEffect(() => {
    if (futureScore === 0) return;
    const duration = 1100;
    const start = Date.now();
    const to = futureScore;

    const tick = () => {
      const elapsed = Date.now() - start;
      const t = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayScore(Math.round(to * eased));
      if (t < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [futureScore]);

  // Rotate taglines every 4s
  useEffect(() => {
    const id = setInterval(() => setTaglineIdx((i) => (i + 1) % taglines.length), 4000);
    return () => clearInterval(id);
  }, [taglines.length]);

  const dashOffset = CIRCUMFERENCE * (1 - Math.min(futureScore, 100) / 100);
  const arcColor = getArcColor(futureScore);

  return (
    <div className="mx-4 flex flex-col items-center gap-1">
      {/* Label */}
      <p
        className="text-[13px] font-bold uppercase tracking-[0.22em]"
        style={{ color: "var(--text-muted)" }}
      >
        Behavio Score
      </p>

      {/* Ring */}
      <div className="animate-ring-breathe relative flex items-center justify-center">
        <svg
          width={SVG_SIZE}
          height={SVG_SIZE}
          viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
          aria-label={`Behavio score: ${Math.round(futureScore)} out of 100`}
          role="img"
        >
          {/* Background track */}
          <circle
            cx={CENTER + 10}
            cy={CENTER + 10}
            r={RADIUS}
            fill="none"
            stroke="var(--badge-bg)"
            strokeWidth={STROKE_WIDTH}
          />
          {/* Glow layer behind fill */}
          <motion.circle
            cx={CENTER + 10}
            cy={CENTER + 10}
            r={RADIUS}
            fill="none"
            stroke={arcColor}
            strokeWidth={STROKE_WIDTH + 4}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            initial={{ strokeDashoffset: CIRCUMFERENCE }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 1.3, ease: [0.34, 1.56, 0.64, 1] }}
            transform={`rotate(-90 ${CENTER + 10} ${CENTER + 10})`}
            opacity={0.18}
          />
          {/* Main fill arc */}
          <motion.circle
            cx={CENTER + 10}
            cy={CENTER + 10}
            r={RADIUS}
            fill="none"
            stroke={arcColor}
            strokeWidth={STROKE_WIDTH}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            initial={{ strokeDashoffset: CIRCUMFERENCE }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 1.3, ease: [0.34, 1.56, 0.64, 1] }}
            transform={`rotate(-90 ${CENTER + 10} ${CENTER + 10})`}
          />
        </svg>

        {/* Center overlay — score number */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="font-black leading-none tracking-tight tabular-nums"
            style={{
              fontSize: "64px",
              color: "var(--text-primary)",
              fontFamily: "var(--font-urbanist), sans-serif",
            }}
          >
            {displayScore}
          </motion.span>
          <span
            className="text-[13px] font-semibold"
            style={{ color: "var(--text-muted)" }}
          >
            / 100
          </span>
        </div>
      </div>

      {/* Cycling subtitle */}
      <div className="h-5 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.p
            key={taglineIdx}
            className="text-center text-[13px]"
            style={{ color: "var(--text-secondary)" }}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
          >
            {taglines[taglineIdx]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
