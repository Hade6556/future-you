"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const LIME = "#C8FF00";
const TEXT_HI = "rgba(235,242,255,0.92)";
const TEXT_LO = "rgba(120,155,195,0.50)";
const NAVY = "#060912";

type Props = {
  currentDay: number;
  tasksCompleted: number;
  totalTasks: number;
  isPremium: boolean;
};

export function Week1WinCard({ currentDay, tasksCompleted, totalTasks, isPremium }: Props) {
  // Only show between day 7 and day 14 for non-premium users
  if (isPremium || currentDay < 7 || currentDay > 14) return null;

  const pct = totalTasks > 0 ? Math.round((tasksCompleted / totalTasks) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      style={{
        position: "relative",
        background: "rgba(200,255,0,0.04)",
        border: "1px solid rgba(200,255,0,0.18)",
        borderRadius: 20,
        padding: "24px 20px",
        overflow: "hidden",
      }}
    >
      {/* Top glow line */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background: "linear-gradient(90deg, transparent, rgba(200,255,0,0.35), transparent)",
        }}
      />

      {/* Week 1 complete badge */}
      <div
        style={{
          display: "inline-block",
          background: "rgba(200,255,0,0.10)",
          border: "1px solid rgba(200,255,0,0.22)",
          borderRadius: 100,
          padding: "5px 14px",
          fontFamily: "var(--font-barlow-condensed), sans-serif",
          fontWeight: 700,
          fontSize: 13,
          textTransform: "uppercase",
          letterSpacing: "0.15em",
          color: LIME,
          marginBottom: 14,
        }}
      >
        Week 1 complete
      </div>

      <h3
        style={{
          fontFamily: "var(--font-barlow-condensed), sans-serif",
          fontWeight: 900,
          fontStyle: "italic",
          fontSize: 24,
          lineHeight: 1.15,
          color: TEXT_HI,
          margin: 0,
          marginBottom: 8,
        }}
      >
        {pct >= 70
          ? "You're ahead of 82% of people."
          : pct >= 40
            ? "You showed up. That's more than most."
            : "7 days in. The system is working."}
      </h3>

      {/* Stats row */}
      <div
        style={{
          display: "flex",
          gap: 20,
          marginBottom: 16,
        }}
      >
        <div>
          <p
            style={{
              fontFamily: "var(--font-barlow-condensed), sans-serif",
              fontWeight: 800,
              fontSize: 28,
              color: LIME,
              margin: 0,
              lineHeight: 1,
            }}
          >
            {tasksCompleted}
          </p>
          <p
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 12,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: TEXT_LO,
              margin: 0,
              marginTop: 2,
            }}
          >
            tasks done
          </p>
        </div>
        <div>
          <p
            style={{
              fontFamily: "var(--font-barlow-condensed), sans-serif",
              fontWeight: 800,
              fontSize: 28,
              color: LIME,
              margin: 0,
              lineHeight: 1,
            }}
          >
            {currentDay}
          </p>
          <p
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 12,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: TEXT_LO,
              margin: 0,
              marginTop: 2,
            }}
          >
            days active
          </p>
        </div>
        <div>
          <p
            style={{
              fontFamily: "var(--font-barlow-condensed), sans-serif",
              fontWeight: 800,
              fontSize: 28,
              color: LIME,
              margin: 0,
              lineHeight: 1,
            }}
          >
            {pct}%
          </p>
          <p
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 12,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: TEXT_LO,
              margin: 0,
              marginTop: 2,
            }}
          >
            completion
          </p>
        </div>
      </div>

      {/* Unlock CTA */}
      <p
        style={{
          fontFamily: "var(--font-body), Georgia, serif",
          fontSize: 13,
          color: TEXT_LO,
          margin: 0,
          marginBottom: 14,
          lineHeight: 1.5,
        }}
      >
        Phase 2 is ready. Unlock your next 11 weeks.
      </p>

      <Link
        href="/paywall"
        style={{
          display: "block",
          width: "100%",
          background: LIME,
          color: NAVY,
          fontFamily: "var(--font-barlow-condensed), sans-serif",
          fontWeight: 800,
          fontSize: 14,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          borderRadius: 100,
          padding: "16px 24px",
          border: "none",
          textAlign: "center",
          textDecoration: "none",
          boxShadow: "0 6px 24px rgba(200,255,0,0.20)",
        }}
      >
        Unlock full plan
      </Link>
    </motion.div>
  );
}
