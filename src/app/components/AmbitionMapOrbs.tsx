"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import type { AmbitionCategory } from "../state/planStore";
import { ACCENT as LIME, TEXT_HI, TEXT_MID, TEXT_LO, GLASS, GLASS_BORDER } from "@/app/theme";

const FONT_HEADING: React.CSSProperties = {
  fontFamily: "var(--font-barlow-condensed), sans-serif",
  fontWeight: 900,
  fontStyle: "italic",
};
const FONT_BODY: React.CSSProperties = {
  fontFamily: "var(--font-apercu), sans-serif",
};
const FONT_MONO: React.CSSProperties = {
  fontFamily: "var(--font-jetbrains-mono), monospace",
};

export const ORB_PALETTE = [
  { bg: "linear-gradient(135deg, #fca5a5, #ef4444)", glow: "rgba(239,68,68,0.4)", dot: "#ef4444", stroke: "#ef4444", track: "rgba(239,68,68,0.12)" },
  { bg: "linear-gradient(135deg, #bbf7d0, #22c55e)", glow: "rgba(34,197,94,0.4)", dot: "#22c55e", stroke: "#22c55e", track: "rgba(34,197,94,0.12)" },
  { bg: "linear-gradient(135deg, rgba(139,92,246,0.5), #3b82f6)", glow: "rgba(59,130,246,0.4)", dot: "#3b82f6", stroke: "#3b82f6", track: "rgba(59,130,246,0.12)" },
  { bg: "linear-gradient(135deg, #fde68a, #f59e0b)", glow: "rgba(245,158,11,0.4)", dot: "#f59e0b", stroke: "#f59e0b", track: "rgba(245,158,11,0.12)" },
  { bg: "linear-gradient(135deg, #bae6fd, #0ea5e9)", glow: "rgba(14,165,233,0.4)", dot: "#0ea5e9", stroke: "#0ea5e9", track: "rgba(14,165,233,0.12)" },
  { bg: "linear-gradient(135deg, #fbcfe8, #ec4899)", glow: "rgba(236,72,153,0.4)", dot: "#ec4899", stroke: "#ec4899", track: "rgba(236,72,153,0.12)" },
  { bg: "linear-gradient(135deg, #ddd6fe, #8b5cf6)", glow: "rgba(139,92,246,0.4)", dot: "#8b5cf6", stroke: "#8b5cf6", track: "rgba(139,92,246,0.12)" },
  { bg: "linear-gradient(135deg, #fed7aa, #f97316)", glow: "rgba(249,115,22,0.4)", dot: "#f97316", stroke: "#f97316", track: "rgba(249,115,22,0.12)" },
];

const SVG_SIZE = 240;
const CENTER = SVG_SIZE / 2;
const STROKE_WIDTH = 10;
const RING_GAP = 18;
const OUTERMOST_R = 108;
const MIN_ARC_PCT = 8;

type Props = { categories: AmbitionCategory[] };

function ringRadius(index: number) {
  return OUTERMOST_R - index * RING_GAP;
}

export default function AmbitionMapOrbs({ categories }: Props) {
  const sorted = useMemo(
    () => [...categories].sort((a, b) => b.pct - a.pct),
    [categories],
  );

  const cardStyle: React.CSSProperties = {
    background: GLASS,
    border: "1px solid " + GLASS_BORDER,
    borderRadius: 20,
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
  };

  /* ─── Empty state ─── */
  if (categories.length === 0) {
    return (
      <div
        style={{
          ...cardStyle,
          padding: "48px 24px",
          boxShadow: "0 8px 28px rgba(0,0,0,0.35)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
        }}
      >
        <svg width={160} height={160} viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}>
          {[0, 1, 2].map((i) => {
            const r = ringRadius(i);
            const circ = 2 * Math.PI * r;
            return (
              <circle
                key={i}
                cx={CENTER}
                cy={CENTER}
                r={r}
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth={STROKE_WIDTH}
                strokeDasharray={circ}
                strokeDashoffset={circ * 0.35}
                strokeLinecap="round"
                transform={`rotate(-90 ${CENTER} ${CENTER})`}
                style={{ opacity: 0.5 - i * 0.12 }}
              />
            );
          })}
        </svg>
        <p
          style={{
            ...FONT_BODY,
            fontSize: 13,
            color: TEXT_LO,
            textAlign: "center",
            margin: 0,
          }}
        >
          Record a brain dump to populate your map
        </p>
      </div>
    );
  }

  const dominant = sorted[0];
  const maxRings = Math.min(sorted.length, Math.floor((OUTERMOST_R - 20) / RING_GAP) + 1);
  const visible = sorted.slice(0, maxRings);

  /* ─── Single-category hero state ─── */
  if (sorted.length === 1) {
    const r = OUTERMOST_R;
    const circ = 2 * Math.PI * r;
    const pct = Math.max(dominant.pct, MIN_ARC_PCT);
    const offset = circ * (1 - pct / 100);
    const palette = ORB_PALETTE[0];

    return (
      <div
        style={{
          ...cardStyle,
          padding: "28px 20px",
          boxShadow: "0 8px 28px rgba(0,0,0,0.35)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div style={{ position: "relative", width: "100%", maxWidth: 220, aspectRatio: "1/1" }}>
          <svg width="100%" viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`} style={{ display: "block" }}>
            <defs>
              <filter id="hero-glow">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {/* Outer track */}
            <circle
              cx={CENTER}
              cy={CENTER}
              r={r}
              fill="none"
              stroke={palette.track}
              strokeWidth={STROKE_WIDTH + 2}
              strokeLinecap="round"
            />
            {/* Inner ghost tracks */}
            {[1, 2].map((gi) => (
              <circle
                key={gi}
                cx={CENTER}
                cy={CENTER}
                r={ringRadius(gi)}
                fill="none"
                stroke="rgba(255,255,255,0.04)"
                strokeWidth={STROKE_WIDTH}
                strokeLinecap="round"
              />
            ))}
            {/* Filled arc */}
            <motion.circle
              cx={CENTER}
              cy={CENTER}
              r={r}
              fill="none"
              stroke={palette.stroke}
              strokeWidth={STROKE_WIDTH + 2}
              strokeLinecap="round"
              strokeDasharray={circ}
              initial={{ strokeDashoffset: circ }}
              animate={{ strokeDashoffset: offset }}
              transition={{ delay: 0.2, duration: 1, ease: "easeOut" }}
              transform={`rotate(-90 ${CENTER} ${CENTER})`}
              filter="url(#hero-glow)"
            />
          </svg>
          {/* Center text */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.35, ease: "easeOut" }}
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            <span style={{ ...FONT_HEADING, fontSize: 44, lineHeight: 1, color: TEXT_HI }}>
              {dominant.pct}%
            </span>
            <span style={{ ...FONT_BODY, fontSize: 13, fontWeight: 500, color: TEXT_MID, marginTop: 4 }}>
              {dominant.label}
            </span>
          </motion.div>
        </div>
        <p style={{ ...FONT_BODY, fontSize: 12, color: TEXT_LO, textAlign: "center", margin: 0 }}>
          Record more reflections to uncover new focus areas
        </p>
      </div>
    );
  }

  /* ─── Multi-category radial chart ─── */
  return (
    <>
      <div
        style={{
          ...cardStyle,
          padding: "28px 20px",
          boxShadow: "0 8px 28px rgba(0,0,0,0.35)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0,
        }}
      >
        <div style={{ position: "relative", width: "100%", maxWidth: 240 }}>
          <svg width="100%" viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`} style={{ display: "block" }}>
            <defs>
              <filter id="ring-glow-0" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {visible.map((cat, i) => {
              const r = ringRadius(i);
              const circ = 2 * Math.PI * r;
              const clampedPct = Math.max(cat.pct, MIN_ARC_PCT);
              const offset = circ * (1 - clampedPct / 100);
              const palette = ORB_PALETTE[i % ORB_PALETTE.length];

              return (
                <g key={cat.label}>
                  {/* Track ring */}
                  <circle
                    cx={CENTER}
                    cy={CENTER}
                    r={r}
                    fill="none"
                    stroke={palette.track}
                    strokeWidth={STROKE_WIDTH}
                    strokeLinecap="round"
                  />
                  {/* Animated arc */}
                  <motion.circle
                    cx={CENTER}
                    cy={CENTER}
                    r={r}
                    fill="none"
                    stroke={palette.stroke}
                    strokeWidth={STROKE_WIDTH}
                    strokeLinecap="round"
                    strokeDasharray={circ}
                    initial={{ strokeDashoffset: circ }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{
                      delay: 0.15 + i * 0.15,
                      duration: 0.8,
                      ease: "easeOut",
                    }}
                    transform={`rotate(-90 ${CENTER} ${CENTER})`}
                    filter={i === 0 ? "url(#ring-glow-0)" : undefined}
                  />
                </g>
              );
            })}
          </svg>

          {/* Center — dominant stat */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.35, ease: "easeOut" }}
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            <span style={{ ...FONT_HEADING, fontSize: 38, lineHeight: 1, color: TEXT_HI }}>
              {dominant.pct}%
            </span>
            <span style={{ ...FONT_BODY, fontSize: 12, fontWeight: 500, color: TEXT_MID, marginTop: 2 }}>
              {dominant.shortLabel}
            </span>
          </motion.div>

          {/* Pulsing glow behind the outermost ring for emphasis */}
          <motion.div
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.35, 0] }}
            transition={{ delay: 1, duration: 2.5, repeat: Infinity, repeatDelay: 3 }}
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${ORB_PALETTE[0].glow} 0%, transparent 65%)`,
              pointerEvents: "none",
            }}
          />
        </div>
      </div>

      {/* ─── Legend — ranked rows with mini bars + delta chips ─── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 6 }}>
        {sorted.map((cat, i) => {
          const palette = ORB_PALETTE[i % ORB_PALETTE.length];
          const delta = cat.pct - cat.prevPct;
          const deltaLabel = delta > 0 ? `+${delta}` : delta < 0 ? `${delta}` : "—";
          const deltaColor = delta > 0 ? LIME : delta < 0 ? "#FF6B6B" : TEXT_LO;

          return (
            <motion.div
              key={cat.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.08, duration: 0.25 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "5px 0",
              }}
            >
              {/* Color dot */}
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: palette.stroke,
                  flexShrink: 0,
                  boxShadow: `0 0 6px ${palette.glow}`,
                }}
              />

              {/* Label */}
              <span
                style={{
                  ...FONT_BODY,
                  fontSize: 13,
                  fontWeight: 500,
                  color: TEXT_HI,
                  flex: 1,
                  minWidth: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {cat.label}
              </span>

              {/* Mini progress bar */}
              <div
                style={{
                  width: 52,
                  height: 4,
                  borderRadius: 2,
                  background: palette.track,
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(cat.pct, 5)}%` }}
                  transition={{ delay: 0.6 + i * 0.08, duration: 0.5, ease: "easeOut" }}
                  style={{
                    height: "100%",
                    borderRadius: 2,
                    background: palette.stroke,
                  }}
                />
              </div>

              {/* Percentage */}
              <span
                style={{
                  ...FONT_MONO,
                  fontSize: 13,
                  fontWeight: 600,
                  color: TEXT_HI,
                  minWidth: 30,
                  textAlign: "right",
                }}
              >
                {cat.pct}%
              </span>

              {/* Delta chip */}
              <span
                style={{
                  ...FONT_MONO,
                  fontSize: 12,
                  fontWeight: 600,
                  color: deltaColor,
                  background:
                    delta !== 0
                      ? delta > 0
                        ? "rgba(94,205,161,0.10)"
                        : "rgba(255,107,107,0.10)"
                      : "transparent",
                  borderRadius: 4,
                  padding: delta !== 0 ? "2px 5px" : "2px 0",
                  minWidth: 26,
                  textAlign: "center",
                }}
              >
                {deltaLabel}
              </span>
            </motion.div>
          );
        })}
      </div>
    </>
  );
}
