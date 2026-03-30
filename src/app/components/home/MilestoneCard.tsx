"use client";

import type { DayInfo } from "../../utils/dayEngine";

const SHIELD_MILESTONES = [7, 14, 30];

type Props = {
  streak: number;
  dayInfo: DayInfo | null;
};

export function MilestoneCard({ streak, dayInfo }: Props) {
  const line = (() => {
    if (streak > 0) {
      const next = SHIELD_MILESTONES.find((m) => m > streak);
      if (next && next - streak <= 5) {
        const gap = next - streak;
        return `${gap} day${gap === 1 ? "" : "s"} to your next streak shield`;
      }
    }

    if (dayInfo?.currentStep?.success_metric) {
      return `Current target: ${dayInfo.currentStep.success_metric}`;
    }

    if (dayInfo) {
      const pct = Math.round(dayInfo.overallProgress * 100);
      return `Day ${dayInfo.currentDay} of ${dayInfo.totalDays} — ${pct}% through your plan`;
    }

    return null;
  })();

  if (!line) return null;

  return (
    <div
      style={{
        position: "relative",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 14,
        padding: "12px 16px",
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-barlow-condensed), sans-serif",
          fontWeight: 700,
          fontSize: 14,
          color: "rgba(200,255,0,0.55)",
          flexShrink: 0,
        }}
      >
        ◆
      </span>
      <span
        style={{
          fontFamily: "var(--font-apercu), sans-serif",
          fontSize: 12,
          color: "rgba(120,155,195,0.65)",
          lineHeight: 1.4,
        }}
      >
        {line}
      </span>
    </div>
  );
}
