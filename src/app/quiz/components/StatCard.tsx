"use client";

import { ACCENT, TEXT_LO } from "@/app/theme";

interface StatCardProps {
  value: number | string;
  label: string;
}

export default function StatCard({ value, label }: StatCardProps) {
  return (
    <div
      style={{
        flex: 1,
        padding: "22px 16px",
        borderRadius: 16,
        background: "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
        border: "1px solid rgba(255,255,255,0.08)",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-barlow-condensed), sans-serif",
          fontWeight: 900,
          fontSize: 38,
          fontStyle: "italic",
          color: ACCENT,
          lineHeight: 1,
          marginBottom: 8,
          letterSpacing: "-0.02em",
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: 10,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: TEXT_LO,
        }}
      >
        {label}
      </div>
    </div>
  );
}
