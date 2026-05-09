"use client";

import { ACCENT, NAVY_PANEL, TEXT_HI, TEXT_MID, TEXT_LO, accentRgba } from "@/app/theme";

/**
 * The follow-through curve from the winning ad creative.
 * Five stages annotate the descent from "MOTIVATED" → "STARTING OVER";
 * a single curve plots typical days-shown-up over a 90-day window.
 *
 * Designed to feel like a primary-source research chart, not a marketing
 * graphic — light gridlines, sober axis labels, JetBrains Mono stage
 * labels in stage-band colors.
 */

interface FollowThroughCurveProps {
  /** Width hint — the SVG itself scales to container. */
  size?: "compact" | "full";
}

// Five stage bands, evenly distributed across the x-axis.
// Colors graduate from sage-mint (motivated) to amber/red (giving up).
const STAGES = [
  { label: "Motivated",     color: "#5ECDAA", x0: 0,    x1: 0.18 },
  { label: "Still trying",  color: "#A6D98C", x0: 0.18, x1: 0.36 },
  { label: "Missing days",  color: "#E8C76B", x0: 0.36, x1: 0.55 },
  { label: "Stopped",       color: "#E89A5C", x0: 0.55, x1: 0.78 },
  { label: "Starting over", color: "#D9624C", x0: 0.78, x1: 1.0  },
];

// X tick days
const X_TICKS = [
  { label: "Day 1",  pos: 0.0  },
  { label: "Day 7",  pos: 0.10 },
  { label: "Day 14", pos: 0.18 },
  { label: "Day 30", pos: 0.36 },
  { label: "Day 60", pos: 0.7  },
  { label: "Day 90", pos: 1.0  },
];

// Curve shape — same dramatic plunge as the ad creative.
// Y is days-shown-up, normalized 0-1 (1 = 100, 0 = 0).
// Sample points (x normalized 0-1, y normalized 0-1).
const CURVE_POINTS: [number, number][] = [
  [0.00, 0.95],
  [0.06, 0.92],
  [0.12, 0.85],
  [0.18, 0.72],
  [0.26, 0.55],
  [0.36, 0.40],
  [0.46, 0.30],
  [0.55, 0.22],
  [0.65, 0.18],
  [0.78, 0.16],
  [0.88, 0.18],
  [0.95, 0.22],
  [1.00, 0.25],
];

export default function FollowThroughCurve({ size = "full" }: FollowThroughCurveProps) {
  const padX = 14;
  const padTop = 30;
  const padBottom = 36;
  const W = 100; // viewBox width units (responsive)
  const H = size === "compact" ? 56 : 64;

  const innerW = W - padX * 2;
  const innerH = H - padTop - padBottom;

  // Convert curve points to SVG path
  const pathD = CURVE_POINTS.map(([x, y], i) => {
    const px = padX + x * innerW;
    const py = padTop + (1 - y) * innerH;
    return `${i === 0 ? "M" : "L"} ${px.toFixed(2)} ${py.toFixed(2)}`;
  }).join(" ");

  return (
    <div
      role="img"
      aria-label="The follow-through curve: most people start motivated and gradually stop showing up by day 30"
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 520,
        background: NAVY_PANEL,
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 22,
        padding: "20px 22px 22px",
        boxShadow: `0 30px 60px -30px ${accentRgba(0.18)}, 0 1px 0 rgba(255,255,255,0.04) inset`,
        fontFamily: "var(--font-apercu), sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <p
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: 10,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: ACCENT,
            margin: "0 0 6px",
            fontWeight: 600,
          }}
        >
          ↳ The follow-through curve
        </p>
        <h3
          style={{
            fontFamily: "var(--font-barlow-condensed), sans-serif",
            fontWeight: 900,
            fontSize: "clamp(18px, 3.4vw, 22px)",
            color: TEXT_HI,
            margin: 0,
            lineHeight: 1.1,
            letterSpacing: "-0.015em",
          }}
        >
          Days you actually showed up{" "}
          <span style={{ color: TEXT_MID, fontWeight: 500, fontStyle: "italic" }}>
            — vs. the 90 you said you would.
          </span>
        </h3>
      </div>

      {/* Chart */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        width="100%"
        style={{ display: "block", height: "auto", aspectRatio: `${W} / ${H}` }}
      >
        {/* Stage bands */}
        {STAGES.map((s) => {
          const x = padX + s.x0 * innerW;
          const w = (s.x1 - s.x0) * innerW;
          return (
            <rect
              key={s.label}
              x={x}
              y={padTop}
              width={w}
              height={innerH}
              fill={s.color}
              opacity={0.10}
            />
          );
        })}

        {/* Stage band borders (subtle vertical separators) */}
        {STAGES.slice(1).map((s) => {
          const x = padX + s.x0 * innerW;
          return (
            <line
              key={`sep-${s.label}`}
              x1={x}
              y1={padTop}
              x2={x}
              y2={padTop + innerH}
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="0.15"
            />
          );
        })}

        {/* Horizontal gridlines (25 / 50 / 75 / 100) */}
        {[0, 0.25, 0.5, 0.75, 1].map((g) => {
          const y = padTop + (1 - g) * innerH;
          return (
            <g key={`grid-${g}`}>
              <line
                x1={padX}
                y1={y}
                x2={W - padX}
                y2={y}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="0.1"
                strokeDasharray="0.6 0.6"
              />
              <text
                x={padX - 2}
                y={y + 1.2}
                fontSize="2.2"
                fontFamily="var(--font-jetbrains-mono), monospace"
                fill={TEXT_LO}
                textAnchor="end"
              >
                {Math.round(g * 100)}
              </text>
            </g>
          );
        })}

        {/* Stage labels (top-band, JetBrains Mono uppercase) */}
        {STAGES.map((s) => {
          const x = padX + (s.x0 + (s.x1 - s.x0) / 2) * innerW;
          return (
            <text
              key={`label-${s.label}`}
              x={x}
              y={padTop - 4}
              fontSize="2.4"
              fontFamily="var(--font-jetbrains-mono), monospace"
              fill={s.color}
              textAnchor="middle"
              style={{ letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600 }}
            >
              {s.label.toUpperCase()}
            </text>
          );
        })}

        {/* The curve */}
        <path
          d={pathD}
          fill="none"
          stroke={TEXT_HI}
          strokeWidth="0.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Endpoint highlight: where the line ends (Day 90, low-point) */}
        {(() => {
          const last = CURVE_POINTS[CURVE_POINTS.length - 1];
          const px = padX + last[0] * innerW;
          const py = padTop + (1 - last[1]) * innerH;
          return (
            <g>
              <circle cx={px} cy={py} r="1.4" fill={STAGES[STAGES.length - 1].color} />
              <circle cx={px} cy={py} r="2.6" fill="none" stroke={STAGES[STAGES.length - 1].color} strokeOpacity="0.4" strokeWidth="0.3" />
            </g>
          );
        })()}

        {/* X-axis ticks */}
        {X_TICKS.map((t) => {
          const x = padX + t.pos * innerW;
          const y = padTop + innerH;
          return (
            <g key={`xtick-${t.label}`}>
              <line x1={x} y1={y} x2={x} y2={y + 1} stroke={TEXT_LO} strokeWidth="0.15" />
              <text
                x={x}
                y={y + 4.5}
                fontSize="2.2"
                fontFamily="var(--font-jetbrains-mono), monospace"
                fill={TEXT_LO}
                textAnchor="middle"
              >
                {t.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Footer line — x-axis label */}
      <p
        style={{
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: 9.5,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: TEXT_LO,
          margin: "10px 0 0",
          textAlign: "center",
        }}
      >
        Days since you said &ldquo;this time is different&rdquo;
      </p>
    </div>
  );
}
