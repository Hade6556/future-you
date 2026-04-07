"use client";

import { motion } from "framer-motion";

const TEXT_HI = "rgba(235,242,255,0.95)";
const TEXT_MID = "rgba(120,155,195,0.75)";
const LIME = "#C8FF00";
const FONT_HEADING = "var(--font-barlow-condensed), sans-serif";
const FONT_BODY = "var(--font-apercu), sans-serif";
const FONT_MONO = "var(--font-jetbrains-mono), monospace";

type Props = {
  day: number;
  totalDays: number;
  phaseName: string | null;
  stepTitle: string | null;
  dayMessage: string | null;
  adaptationNote: string | null;
};

export default function DayContextBanner({
  day,
  totalDays,
  phaseName,
  stepTitle,
  dayMessage,
  adaptationNote,
}: Props) {
  const progressPct = totalDays > 0 ? Math.min(100, Math.round((day / totalDays) * 100)) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: "rgba(200,255,0,0.04)",
        border: "1px solid rgba(200,255,0,0.12)",
        borderRadius: 18,
        padding: "16px 16px 14px",
      }}
    >
      {/* Top row: Day counter + progress */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <span
          style={{
            fontFamily: FONT_MONO,
            fontSize: 13,
            fontWeight: 500,
            color: LIME,
            letterSpacing: "0.06em",
            textTransform: "uppercase" as const,
          }}
        >
          Day {day} of {totalDays}
        </span>
        <span
          style={{
            fontFamily: FONT_MONO,
            fontSize: 13,
            fontWeight: 500,
            color: TEXT_MID,
          }}
        >
          {progressPct}%
        </span>
      </div>

      {/* Mini progress bar */}
      <div
        style={{
          height: 4,
          width: "100%",
          borderRadius: 999,
          overflow: "hidden",
          background: "rgba(255,255,255,0.06)",
          marginTop: 8,
        }}
      >
        <motion.div
          style={{
            height: "100%",
            borderRadius: 999,
            background: LIME,
          }}
          initial={false}
          animate={{ width: `${progressPct}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      {/* Phase + Step */}
      {(phaseName || stepTitle) && (
        <p
          style={{
            fontFamily: FONT_BODY,
            fontSize: 13,
            color: TEXT_HI,
            marginTop: 10,
            lineHeight: 1.5,
          }}
        >
          {phaseName && (
            <span style={{ fontWeight: 600 }}>{phaseName}</span>
          )}
          {phaseName && stepTitle && " \u2022 "}
          {stepTitle && (
            <span style={{ color: TEXT_MID }}>{stepTitle}</span>
          )}
        </p>
      )}

      {/* Day message */}
      {dayMessage && (
        <p
          style={{
            fontFamily: FONT_BODY,
            fontSize: 14,
            color: TEXT_HI,
            marginTop: 8,
            lineHeight: 1.55,
            fontStyle: "italic",
          }}
        >
          &ldquo;{dayMessage}&rdquo;
        </p>
      )}

      {/* Adaptation note */}
      {adaptationNote && (
        <p
          style={{
            fontFamily: FONT_MONO,
            fontSize: 13,
            color: "rgba(200,255,0,0.7)",
            marginTop: 8,
            padding: "6px 10px",
            background: "rgba(200,255,0,0.06)",
            borderRadius: 8,
            display: "inline-block",
          }}
        >
          {adaptationNote}
        </p>
      )}
    </motion.div>
  );
}
