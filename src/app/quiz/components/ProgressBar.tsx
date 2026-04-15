"use client";

import { ACCENT, accentRgba } from "@/app/theme";
const TOTAL_STEPS = 18;

export default function ProgressBar({ step }: { step: number }) {
  const pct = Math.min(100, Math.round((step / TOTAL_STEPS) * 100));
  return (
    <div
      style={{
        width: "100%",
        height: 4,
        borderRadius: 2,
        background: "rgba(255,255,255,0.08)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${pct}%`,
          height: "100%",
          background: ACCENT,
          borderRadius: 2,
          transition: "width 0.4s ease",
          boxShadow: `0 0 8px ${accentRgba(0.4)}`,
        }}
      />
    </div>
  );
}
