"use client";

import { useEffect, useState } from "react";
import { ACCENT, accentRgba } from "@/app/theme";

interface HomeLivePulseProps {
  archetypeLabel: string;
}

const TODAY_BASE = 243;
const RIGHT_NOW_BASE = 12;

/** Pluralize an archetype label for the peer count line ("Strategist" → "Strategists"). */
function pluralize(label: string): string {
  // Already-plural words in our set: "Steady Builder" → "Steady Builders", etc.
  return label.endsWith("s") ? label : `${label}s`;
}

export default function HomeLivePulse({ archetypeLabel }: HomeLivePulseProps) {
  const [todayCount, setTodayCount] = useState(TODAY_BASE);
  const [rightNow, setRightNow] = useState(RIGHT_NOW_BASE);

  // "Today" count drifts up slowly (+1 every ~22s) to feel earned.
  useEffect(() => {
    const id = setInterval(() => setTodayCount((c) => c + 1), 22_000);
    return () => clearInterval(id);
  }, []);

  // "Right now" wobbles ±a few every 5s — natural live feel.
  useEffect(() => {
    const id = setInterval(() => {
      setRightNow((c) => {
        const drift = Math.floor(Math.random() * 5) - 1; // -1..+3
        return Math.max(4, Math.min(28, c + drift));
      });
    }, 5_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        padding: "10px 14px",
        borderRadius: 999,
        background: "linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0.005))",
        border: "1px solid rgba(255,255,255,0.06)",
        fontFamily: "var(--font-jetbrains-mono), monospace",
        fontSize: 10.5,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: "rgba(160,180,210,0.75)",
      }}
    >
      <span
        aria-hidden
        style={{
          position: "relative",
          display: "inline-flex",
          width: 6,
          height: 6,
          flexShrink: 0,
        }}
      >
        <span
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: ACCENT,
            animation: "homeLivePulse 1.6s ease-out infinite",
            opacity: 0.55,
          }}
        />
        <span
          style={{
            position: "relative",
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: ACCENT,
          }}
        />
      </span>
      <style>{`
        @keyframes homeLivePulse {
          0%   { transform: scale(1);   opacity: 0.55; }
          70%  { transform: scale(2.6); opacity: 0;    }
          100% { transform: scale(2.6); opacity: 0;    }
        }
      `}</style>
      <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        <span style={{ color: ACCENT, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
          {todayCount}
        </span>{" "}
        {pluralize(archetypeLabel)} today
        <span aria-hidden style={{ color: accentRgba(0.40), margin: "0 8px" }}>·</span>
        <span style={{ color: ACCENT, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
          {rightNow}
        </span>{" "}
        right now
      </span>
    </div>
  );
}
