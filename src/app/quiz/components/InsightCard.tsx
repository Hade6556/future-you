"use client";

import { ACCENT, TEXT_HI, TEXT_MID, TEXT_LO, accentRgba } from "@/app/theme";

interface InsightCardProps {
  headline: string;
  body: string;
  /** Top eyebrow source label, rendered with `↳` prefix. */
  source?: string;
  /**
   * Optional poster-style stat. When present, the stat value becomes the hero
   * (giant Barlow Black italic), and `headline` drops to a supporting line.
   */
  stat?: { value: string; caption?: string };
  /** Bottom-of-card byline (e.g., citation, peer-review note). */
  byline?: string;
}

export default function InsightCard({ headline, body, source, stat, byline }: InsightCardProps) {
  return (
    <div
      style={{
        position: "relative",
        padding: "26px 22px",
        borderRadius: 18,
        background: "linear-gradient(180deg, rgba(255,255,255,0.045), rgba(255,255,255,0.01))",
        border: "1px solid rgba(255,255,255,0.08)",
        overflow: "hidden",
      }}
    >
      {stat && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(60% 60% at 0% 0%, ${accentRgba(0.10)}, transparent 65%)`,
            pointerEvents: "none",
          }}
        />
      )}
      <div style={{ position: "relative" }}>
        {source && (
          <p
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 10.5,
              color: ACCENT,
              margin: "0 0 14px",
              textTransform: "uppercase",
              letterSpacing: "0.18em",
            }}
          >
            ↳ {source}
          </p>
        )}

        {stat ? (
          <>
            <div
              style={{
                fontFamily: "var(--font-barlow-condensed), sans-serif",
                fontWeight: 900,
                fontStyle: "italic",
                fontSize: "clamp(72px, 18vw, 108px)",
                lineHeight: 0.88,
                letterSpacing: "-0.04em",
                color: ACCENT,
                fontVariantNumeric: "tabular-nums",
                margin: "0 0 4px",
              }}
            >
              {stat.value}
            </div>
            {stat.caption && (
              <p
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: 10.5,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: TEXT_MID,
                  margin: "0 0 18px",
                }}
              >
                {stat.caption}
              </p>
            )}
            <p
              style={{
                fontFamily: "var(--font-barlow-condensed), sans-serif",
                fontWeight: 900,
                fontSize: "clamp(20px, 4.5vw, 26px)",
                color: TEXT_HI,
                margin: "0 0 14px",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
              }}
            >
              {headline}
            </p>
          </>
        ) : (
          <h2
            style={{
              fontFamily: "var(--font-barlow-condensed), sans-serif",
              fontWeight: 900,
              fontSize: "clamp(24px, 4.5vw, 30px)",
              color: TEXT_HI,
              margin: "0 0 14px",
              lineHeight: 1.05,
              letterSpacing: "-0.018em",
            }}
          >
            {headline}
          </h2>
        )}

        <p
          style={{
            fontFamily: "var(--font-apercu), sans-serif",
            fontSize: 15,
            color: TEXT_MID,
            margin: 0,
            lineHeight: 1.55,
          }}
        >
          {body}
        </p>

        {byline && (
          <div
            style={{
              marginTop: 18,
              paddingTop: 14,
              borderTop: "1px solid rgba(255,255,255,0.06)",
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexWrap: "wrap",
              fontFamily: "var(--font-apercu), sans-serif",
              fontSize: 12,
              fontStyle: "italic",
              color: TEXT_LO,
              letterSpacing: "-0.005em",
            }}
          >
            <span
              aria-hidden
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 14,
                height: 14,
                borderRadius: 999,
                background: accentRgba(0.12),
                border: `1px solid ${accentRgba(0.30)}`,
                color: ACCENT,
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: 8,
                fontStyle: "normal",
                fontWeight: 900,
                lineHeight: 1,
              }}
            >
              ✓
            </span>
            <span>{byline}</span>
          </div>
        )}
      </div>
    </div>
  );
}
