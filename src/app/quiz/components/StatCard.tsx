"use client";

import { ACCENT, TEXT_MID } from "@/app/theme";

interface StatCardProps {
  value: number | string;
  label: string;
}

export default function StatCard({ value, label }: StatCardProps) {
  return (
    <div
      style={{
        flex: 1,
        padding: "24px 16px",
        borderRadius: 16,
        background: "rgba(255,255,255,0.06)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.12)",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-barlow-condensed), sans-serif",
          fontWeight: 800,
          fontSize: 36,
          color: ACCENT,
          lineHeight: 1,
          marginBottom: 6,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontFamily: "var(--font-apercu), sans-serif",
          fontSize: 13,
          color: TEXT_MID,
        }}
      >
        {label}
      </div>
    </div>
  );
}
