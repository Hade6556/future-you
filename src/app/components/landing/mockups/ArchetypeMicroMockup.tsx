"use client";

import { ACCENT, TEXT_MID, TEXT_LO, accentRgba } from "@/app/theme";
import type { ArchetypeKey } from "./PlanCardMockup";

type Bar = { label: string; value: number; highlight?: boolean };

const SIGNATURE: Record<ArchetypeKey, Bar[]> = {
  Strategist: [
    { label: "Plan", value: 0.85, highlight: true },
    { label: "Sprint", value: 0.55 },
    { label: "Review", value: 0.7 },
    { label: "Rest", value: 0.35 },
  ],
  "Steady Builder": [
    { label: "Mon", value: 0.55 },
    { label: "Tue", value: 0.55 },
    { label: "Wed", value: 0.55, highlight: true },
    { label: "Thu", value: 0.55 },
    { label: "Fri", value: 0.55 },
  ],
  "Endurance Engine": [
    { label: "W1", value: 0.3 },
    { label: "W2", value: 0.45 },
    { label: "W3", value: 0.6 },
    { label: "W4", value: 0.75 },
    { label: "W5", value: 0.9, highlight: true },
  ],
  "Creative Spark": [
    { label: "Idea", value: 0.95, highlight: true },
    { label: "Pause", value: 0.2 },
    { label: "Ship", value: 0.7 },
    { label: "Pause", value: 0.2 },
  ],
  Guardian: [
    { label: "Cap", value: 0.4 },
    { label: "Save", value: 0.85, highlight: true },
    { label: "Spend", value: 0.45 },
    { label: "Buffer", value: 0.7 },
  ],
  Explorer: [
    { label: "Try", value: 0.7 },
    { label: "New", value: 0.85, highlight: true },
    { label: "Same", value: 0.4 },
    { label: "New", value: 0.8 },
  ],
};

interface ArchetypeMicroMockupProps {
  archetype: ArchetypeKey;
}

export default function ArchetypeMicroMockup({ archetype }: ArchetypeMicroMockupProps) {
  const bars = SIGNATURE[archetype];
  return (
    <div
      aria-hidden
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: 5,
        height: 56,
        padding: "8px 4px 4px",
        marginTop: 12,
        borderTop: "1px dashed rgba(255,255,255,0.08)",
      }}
    >
      {bars.map((b, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
            height: "100%",
          }}
        >
          <div
            style={{
              flex: 1,
              width: "100%",
              display: "flex",
              alignItems: "flex-end",
            }}
          >
            <div
              style={{
                width: "100%",
                height: `${b.value * 100}%`,
                borderRadius: 2,
                background: b.highlight ? ACCENT : accentRgba(0.22),
                border: `1px solid ${b.highlight ? ACCENT : accentRgba(0.30)}`,
                boxShadow: b.highlight ? `0 0 8px ${accentRgba(0.45)}` : "none",
              }}
            />
          </div>
          <div
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 8,
              letterSpacing: "0.10em",
              color: b.highlight ? TEXT_MID : TEXT_LO,
              textTransform: "uppercase",
            }}
          >
            {b.label}
          </div>
        </div>
      ))}
    </div>
  );
}
