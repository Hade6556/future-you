"use client";

import { TEXT_HI, TEXT_MID, TEXT_LO, accentRgba } from "@/app/theme";

interface InsightCardProps {
  headline: string;
  body: string;
  source?: string;
}

export default function InsightCard({ headline, body, source }: InsightCardProps) {
  return (
    <div
      style={{
        padding: "28px 22px",
        borderRadius: 18,
        background: "rgba(255,255,255,0.06)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.12)",
        boxShadow: `0 0 30px ${accentRgba(0.06)}, 0 4px 20px rgba(0,0,0,0.2)`,
      }}
    >
      <h2
        style={{
          fontFamily: "var(--font-barlow-condensed), sans-serif",
          fontWeight: 700,
          fontStyle: "italic",
          fontSize: 24,
          color: TEXT_HI,
          margin: "0 0 12px",
          lineHeight: 1.3,
        }}
      >
        {headline}
      </h2>
      {source && (
        <p
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: 11,
            color: TEXT_LO,
            margin: "0 0 12px",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {source}
        </p>
      )}
      <p
        style={{
          fontFamily: "var(--font-apercu), sans-serif",
          fontSize: 15,
          color: TEXT_MID,
          margin: 0,
          lineHeight: 1.6,
        }}
      >
        {body}
      </p>
    </div>
  );
}
