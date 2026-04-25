"use client";

import { ACCENT } from "@/app/theme";
const TOTAL_STEPS = 19;

export default function ProgressBar({ step }: { step: number }) {
  const pct = Math.min(100, Math.round((step / TOTAL_STEPS) * 100));
  return (
    <div
      style={{
        width: "100%",
        height: 2,
        borderRadius: 999,
        background: "rgba(255,255,255,0.06)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${pct}%`,
          height: "100%",
          background: ACCENT,
          borderRadius: 999,
          transition: "width 0.45s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      />
    </div>
  );
}
