"use client";

import { ACCENT, NAVY_PANEL, TEXT_HI, TEXT_MID, TEXT_LO, accentRgba } from "@/app/theme";

const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

type Event = {
  day: number;
  startRow: number;
  span: number;
  title: string;
  kind: "behavio" | "other";
};

const EVENTS: Event[] = [
  { day: 0, startRow: 1, span: 2, title: "20-min focus", kind: "behavio" },
  { day: 0, startRow: 7, span: 3, title: "Standup", kind: "other" },
  { day: 1, startRow: 1, span: 2, title: "20-min focus", kind: "behavio" },
  { day: 1, startRow: 6, span: 4, title: "Design review", kind: "other" },
  { day: 2, startRow: 1, span: 2, title: "20-min focus", kind: "behavio" },
  { day: 2, startRow: 4, span: 3, title: "Reflect · 5 min", kind: "behavio" },
  { day: 3, startRow: 1, span: 2, title: "20-min focus", kind: "behavio" },
  { day: 3, startRow: 8, span: 3, title: "1:1 Maya", kind: "other" },
  { day: 4, startRow: 1, span: 2, title: "20-min focus", kind: "behavio" },
  { day: 4, startRow: 5, span: 4, title: "Weekly retro", kind: "behavio" },
  { day: 5, startRow: 3, span: 2, title: "Long walk", kind: "behavio" },
  { day: 6, startRow: 4, span: 2, title: "Plan next wk", kind: "behavio" },
];

const ROWS = 11;

export default function CalendarMockup() {
  return (
    <div
      role="img"
      aria-label="Behavio events synced into your week's calendar"
      style={{
        width: "100%",
        maxWidth: 540,
        background: NAVY_PANEL,
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 22,
        padding: 18,
        fontFamily: "var(--font-apercu), sans-serif",
        boxShadow: `0 30px 60px -30px ${accentRgba(0.18)}`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 14,
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-barlow-condensed), sans-serif",
            fontWeight: 800,
            fontStyle: "italic",
            fontSize: 18,
            color: TEXT_HI,
            letterSpacing: "-0.01em",
          }}
        >
          April 2026 · Week 17
        </div>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: 10,
            letterSpacing: "0.10em",
            textTransform: "uppercase",
            color: ACCENT,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: 2,
              background: ACCENT,
              display: "inline-block",
            }}
          />
          Behavio synced
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 4,
          marginBottom: 6,
        }}
      >
        {DAYS.map((d) => (
          <div
            key={d}
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 9.5,
              letterSpacing: "0.12em",
              color: TEXT_LO,
              textAlign: "center",
              padding: "4px 0",
            }}
          >
            {d}
          </div>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gridTemplateRows: `repeat(${ROWS}, 18px)`,
          gap: 4,
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.04)",
          borderRadius: 12,
          padding: 6,
        }}
      >
        {EVENTS.map((ev, i) => {
          const isBehavio = ev.kind === "behavio";
          return (
            <div
              key={i}
              style={{
                gridColumn: ev.day + 1,
                gridRow: `${ev.startRow} / span ${ev.span}`,
                borderRadius: 6,
                background: isBehavio ? accentRgba(0.18) : "rgba(255,255,255,0.06)",
                border: `1px solid ${isBehavio ? accentRgba(0.45) : "rgba(255,255,255,0.10)"}`,
                padding: "4px 6px",
                fontSize: 9.5,
                color: isBehavio ? ACCENT : TEXT_MID,
                fontWeight: isBehavio ? 600 : 500,
                lineHeight: 1.15,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                letterSpacing: "-0.01em",
              }}
            >
              {ev.title}
            </div>
          );
        })}
      </div>
    </div>
  );
}
