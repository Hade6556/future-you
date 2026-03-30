"use client";

import type { AmbitionCategory } from "../state/planStore";

const TEXT_HI = "rgba(235,242,255,0.95)";
const TEXT_LO = "rgba(120,155,195,0.40)";
const LIME = "#C8FF00";
const GLASS = "rgba(255,255,255,0.07)";
const GLASS_BORDER = "rgba(255,255,255,0.14)";

const FONT_BODY: React.CSSProperties = {
  fontFamily: "var(--font-apercu), sans-serif",
};

export const ORB_PALETTE = [
  { bg: "linear-gradient(135deg, #fca5a5, #ef4444)", glow: "rgba(239,68,68,0.4)", dot: "#ef4444" },
  { bg: "linear-gradient(135deg, #bbf7d0, #22c55e)", glow: "rgba(34,197,94,0.4)", dot: "#22c55e" },
  { bg: "linear-gradient(135deg, rgba(139,92,246,0.5), #3b82f6)", glow: "rgba(59,130,246,0.4)", dot: "#3b82f6" },
  { bg: "linear-gradient(135deg, #fde68a, #f59e0b)", glow: "rgba(245,158,11,0.4)", dot: "#f59e0b" },
  { bg: "linear-gradient(135deg, #bae6fd, #0ea5e9)", glow: "rgba(14,165,233,0.4)", dot: "#0ea5e9" },
  { bg: "linear-gradient(135deg, #fbcfe8, #ec4899)", glow: "rgba(236,72,153,0.4)", dot: "#ec4899" },
  { bg: "linear-gradient(135deg, #ddd6fe, #8b5cf6)", glow: "rgba(139,92,246,0.4)", dot: "#8b5cf6" },
  { bg: "linear-gradient(135deg, #fed7aa, #f97316)", glow: "rgba(249,115,22,0.4)", dot: "#f97316" },
];

function diameterForPct(pct: number, maxPct: number) {
  return Math.round((pct / Math.max(maxPct, 1)) * 90);
}

function getOrbPosition(i: number, total: number) {
  const angle = (i / total) * 2 * Math.PI - Math.PI / 2;
  return {
    left: `${50 + 32 * Math.cos(angle)}%`,
    top: `${50 + 28 * Math.sin(angle)}%`,
  };
}

type AmbitionMapOrbsProps = {
  categories: AmbitionCategory[];
};

export default function AmbitionMapOrbs({ categories }: AmbitionMapOrbsProps) {
  const cardStyle: React.CSSProperties = {
    background: GLASS,
    border: "1px solid " + GLASS_BORDER,
    borderRadius: 20,
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
  };

  return (
    <>
      {/* Hero card — ambition map */}
      <div style={{
        ...cardStyle,
        padding: "32px 24px",
        boxShadow: "0 8px 28px rgba(0,0,0,0.35)",
        overflow: "hidden", minWidth: 0,
      }}>
        <div style={{
          position: "relative", width: "100%", maxWidth: "100%",
          aspectRatio: "1 / 1", maxHeight: 280,
          margin: "0 auto",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div
            aria-hidden
            style={{
              position: "absolute", inset: 0, opacity: 0.4,
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />
          {categories.length > 0 ? (() => {
            const maxPct = Math.max(...categories.map((c) => c.pct));
            return categories.map((cat, i) => {
              const d = diameterForPct(cat.pct, maxPct);
              const pos = getOrbPosition(i, categories.length);
              const palette = ORB_PALETTE[i % ORB_PALETTE.length];
              const delta = cat.pct - cat.prevPct;
              const deltaLabel = delta > 0 ? `+${delta}%` : delta < 0 ? `${delta}%` : "—";
              return (
                <div
                  key={cat.label}
                  style={{
                    position: "absolute",
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                    width: d, height: d,
                    transform: "translate(-50%, -50%)",
                    ...pos,
                  }}
                >
                  <div
                    style={{
                      width: "100%", height: "100%", borderRadius: "50%",
                      background: palette.bg,
                      boxShadow: `0 0 40px ${palette.glow}`,
                    }}
                  />
                  <span style={{
                    ...FONT_BODY,
                    marginTop: 6, textAlign: "center",
                    fontSize: 12, fontWeight: 500, color: TEXT_HI,
                    textShadow: "0 1px 3px rgba(0,0,0,0.5)",
                  }}>
                    {cat.shortLabel} {cat.pct}%
                  </span>
                  <span style={{
                    ...FONT_BODY,
                    marginTop: 2, fontSize: 10, fontWeight: 500, color: LIME,
                  }}>
                    {deltaLabel} vs last
                  </span>
                </div>
              );
            });
          })() : (
            <p style={{
              ...FONT_BODY,
              fontSize: 12, color: TEXT_LO, textAlign: "center", padding: "0 16px",
            }}>
              Record a brain dump to populate your map
            </p>
          )}
        </div>
      </div>

      {/* Legend */}
      {categories.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {categories.map((cat, i) => (
            <div key={cat.label} style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
              <div style={{
                width: 20, height: 20, flexShrink: 0, borderRadius: "50%",
                background: ORB_PALETTE[i % ORB_PALETTE.length].dot,
              }} />
              <span style={{ ...FONT_BODY, fontSize: 15, color: TEXT_HI }}>
                {cat.label} <strong style={{ fontWeight: 600 }}>{cat.pct}%</strong>
              </span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
