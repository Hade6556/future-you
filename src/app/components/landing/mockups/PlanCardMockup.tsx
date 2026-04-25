"use client";

import { Check, Clock, Flame, ChevronRight } from "lucide-react";
import { ACCENT, NAVY_PANEL, TEXT_HI, TEXT_MID, TEXT_LO, accentRgba } from "@/app/theme";

export type ArchetypeKey =
  | "Strategist"
  | "Steady Builder"
  | "Endurance Engine"
  | "Creative Spark"
  | "Guardian"
  | "Explorer";

type Block = {
  time: string;
  label: string;
  duration: string;
  done?: boolean;
};

type PlanContent = {
  todayBlocks: Block[];
  upNext: string;
  weekFocus: string;
  streak: number;
};

const PLANS: Record<ArchetypeKey, Record<number, PlanContent>> = {
  Strategist: {
    1: {
      weekFocus: "Phase 1 · Map the terrain",
      streak: 1,
      todayBlocks: [
        { time: "08:30", label: "Define the 90-day outcome", duration: "20m" },
        { time: "13:00", label: "Audit current week's calendar", duration: "15m" },
      ],
      upNext: "Tomorrow · Identify week-1 leverage point",
    },
    12: {
      weekFocus: "Phase 1 · Sequencing",
      streak: 11,
      todayBlocks: [
        { time: "08:30", label: "Review weekly OKR draft", duration: "20m", done: true },
        { time: "16:00", label: "Identify the bottleneck task", duration: "15m" },
      ],
      upNext: "Thu · Block 90-min deep-work for bottleneck",
    },
    30: {
      weekFocus: "Phase 2 · Compounding wins",
      streak: 26,
      todayBlocks: [
        { time: "09:00", label: "Ship the leverage move", duration: "60m" },
        { time: "17:30", label: "Weekly retro · what to drop", duration: "10m" },
      ],
      upNext: "Mon · New OKR draft for week 5",
    },
    67: {
      weekFocus: "Phase 3 · Scale the system",
      streak: 58,
      todayBlocks: [
        { time: "09:30", label: "Delegate one recurring task", duration: "20m", done: true },
        { time: "15:00", label: "90-day review · what scaled", duration: "30m" },
      ],
      upNext: "Wed · Document the playbook",
    },
  },
  "Steady Builder": {
    1: {
      weekFocus: "Phase 1 · Lay the rails",
      streak: 1,
      todayBlocks: [
        { time: "07:30", label: "20-min focus block", duration: "20m" },
        { time: "21:00", label: "Note 1 thing that worked", duration: "5m" },
      ],
      upNext: "Tomorrow · Same time, same block",
    },
    12: {
      weekFocus: "Phase 1 · Compounding",
      streak: 12,
      todayBlocks: [
        { time: "07:30", label: "20-min focus block", duration: "20m", done: true },
        { time: "21:00", label: "Daily reflection · 1 line", duration: "5m" },
      ],
      upNext: "Tomorrow · Same block, +5 min stretch",
    },
    30: {
      weekFocus: "Phase 2 · Stretch the block",
      streak: 28,
      todayBlocks: [
        { time: "07:30", label: "30-min focus block", duration: "30m" },
        { time: "21:00", label: "Reflect · what got easier", duration: "5m" },
      ],
      upNext: "Tomorrow · Add 1 deep-work session",
    },
    67: {
      weekFocus: "Phase 3 · Anchor it",
      streak: 64,
      todayBlocks: [
        { time: "07:30", label: "45-min flow block", duration: "45m", done: true },
        { time: "21:00", label: "Track the streak", duration: "5m" },
      ],
      upNext: "Tomorrow · Same. The system is the win.",
    },
  },
  "Endurance Engine": {
    1: { weekFocus: "Phase 1 · Set the cadence", streak: 1, todayBlocks: [{ time: "06:30", label: "Easy 20-min run", duration: "20m" }, { time: "20:00", label: "Tomorrow's prep · 5 min", duration: "5m" }], upNext: "Tomorrow · Same easy 20" },
    12: { weekFocus: "Phase 1 · Cadence", streak: 12, todayBlocks: [{ time: "06:30", label: "Easy 25-min run", duration: "25m", done: true }, { time: "20:00", label: "Tomorrow's prep", duration: "5m" }], upNext: "Sat · First 5K test" },
    30: { weekFocus: "Phase 2 · Build the base", streak: 28, todayBlocks: [{ time: "06:30", label: "Tempo 30-min", duration: "30m" }, { time: "20:00", label: "Recovery log", duration: "5m" }], upNext: "Sun · Long slow run · 60m" },
    67: { weekFocus: "Phase 3 · Race-ready", streak: 62, todayBlocks: [{ time: "06:30", label: "Intervals · 8x400", duration: "40m", done: true }, { time: "20:00", label: "Race-pace check", duration: "5m" }], upNext: "Sat · 10K time trial" },
  },
  "Creative Spark": {
    1: { weekFocus: "Phase 1 · Find the thread", streak: 1, todayBlocks: [{ time: "10:00", label: "30-min idea sketch", duration: "30m" }, { time: "18:00", label: "Capture 3 prompts", duration: "5m" }], upNext: "Tomorrow · Pick one to expand" },
    12: { weekFocus: "Phase 1 · Pick the thread", streak: 10, todayBlocks: [{ time: "10:00", label: "Expand chosen idea", duration: "45m", done: true }, { time: "18:00", label: "Note what surprised you", duration: "5m" }], upNext: "Fri · First small ship" },
    30: { weekFocus: "Phase 2 · Ship small", streak: 25, todayBlocks: [{ time: "10:00", label: "Build draft v1", duration: "60m" }, { time: "18:00", label: "Public share-or-shelve", duration: "10m" }], upNext: "Mon · New thread, same loop" },
    67: { weekFocus: "Phase 3 · Build the body", streak: 56, todayBlocks: [{ time: "10:00", label: "Ship piece #6", duration: "75m", done: true }, { time: "18:00", label: "Review the body of work", duration: "10m" }], upNext: "Wed · Plan the next 90" },
  },
  Guardian: {
    1: { weekFocus: "Phase 1 · Map the money", streak: 1, todayBlocks: [{ time: "20:00", label: "Log today's spend", duration: "5m" }, { time: "20:30", label: "Set 1 weekly cap", duration: "10m" }], upNext: "Sun · Weekly cash review" },
    12: { weekFocus: "Phase 1 · Caps & flow", streak: 12, todayBlocks: [{ time: "20:00", label: "Log today's spend", duration: "5m", done: true }, { time: "20:30", label: "Move 5% to savings", duration: "5m" }], upNext: "Sun · Cap review" },
    30: { weekFocus: "Phase 2 · Buffer", streak: 27, todayBlocks: [{ time: "20:00", label: "Spend log + variance", duration: "5m" }, { time: "20:30", label: "Auto-transfer check", duration: "5m" }], upNext: "Fri · 1-month buffer hit" },
    67: { weekFocus: "Phase 3 · Compound it", streak: 60, todayBlocks: [{ time: "20:00", label: "Log + categorize", duration: "5m", done: true }, { time: "20:30", label: "Quarterly buffer review", duration: "15m" }], upNext: "Mon · Set the next savings goal" },
  },
  Explorer: {
    1: { weekFocus: "Phase 1 · Try things", streak: 1, todayBlocks: [{ time: "12:30", label: "1km easy walk-jog", duration: "15m" }, { time: "21:00", label: "Note how it felt", duration: "5m" }], upNext: "Tomorrow · Same, different route" },
    12: { weekFocus: "Phase 1 · Find the spark", streak: 11, todayBlocks: [{ time: "12:30", label: "2km mixed run", duration: "20m", done: true }, { time: "21:00", label: "Daily 1-line log", duration: "5m" }], upNext: "Sat · Try a trail route" },
    30: { weekFocus: "Phase 2 · Build the habit", streak: 26, todayBlocks: [{ time: "12:30", label: "5km steady run", duration: "35m" }, { time: "21:00", label: "Weekly mood check", duration: "5m" }], upNext: "Sun · First 8K attempt" },
    67: { weekFocus: "Phase 3 · Stretch", streak: 58, todayBlocks: [{ time: "12:30", label: "8K variable pace", duration: "55m", done: true }, { time: "21:00", label: "Plan: half-marathon?", duration: "10m" }], upNext: "Sat · 10K with a friend" },
  },
};

const ARCHETYPE_TAGLINE: Record<ArchetypeKey, string> = {
  Strategist: "Sees the long game",
  "Steady Builder": "Compounds small wins",
  "Endurance Engine": "Outlasts obstacles",
  "Creative Spark": "Builds what others didn't see",
  Guardian: "Protects what matters",
  Explorer: "Finds energy in new ground",
};

interface PlanCardMockupProps {
  archetype?: ArchetypeKey;
  day?: 1 | 12 | 30 | 67;
  variant?: "compact" | "full";
}

export default function PlanCardMockup({
  archetype = "Strategist",
  day = 12,
  variant = "compact",
}: PlanCardMockupProps) {
  const plan = PLANS[archetype][day];

  return (
    <div
      role="img"
      aria-label={`Sample Behavio plan for ${archetype}, day ${day} of 90`}
      style={{
        position: "relative",
        width: "100%",
        maxWidth: variant === "full" ? 420 : 380,
        background: NAVY_PANEL,
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 22,
        overflow: "hidden",
        boxShadow: `0 30px 60px -30px ${accentRgba(0.20)}, 0 1px 0 rgba(255,255,255,0.04) inset`,
        fontFamily: "var(--font-apercu), sans-serif",
      }}
    >
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "rgba(255,255,255,0.02)",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 10,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: TEXT_LO,
            }}
          >
            Your archetype
          </span>
          <span
            style={{
              fontFamily: "var(--font-barlow-condensed), sans-serif",
              fontStyle: "italic",
              fontWeight: 800,
              fontSize: 20,
              letterSpacing: "-0.01em",
              color: TEXT_HI,
              lineHeight: 1.05,
            }}
          >
            {archetype}
          </span>
        </div>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "5px 10px",
            borderRadius: 999,
            background: accentRgba(0.10),
            border: `1px solid ${accentRgba(0.22)}`,
            color: ACCENT,
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: 10,
            letterSpacing: "0.10em",
            textTransform: "uppercase",
          }}
        >
          Day {day} / 90
        </div>
      </div>

      <div style={{ padding: "16px 20px 8px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <span
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 10,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: TEXT_LO,
            }}
          >
            This week
          </span>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              fontSize: 11,
              color: ACCENT,
              fontWeight: 600,
            }}
          >
            <Flame size={11} strokeWidth={2.4} />
            {plan.streak}-day streak
          </span>
        </div>
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: TEXT_HI,
            letterSpacing: "-0.01em",
            marginBottom: 14,
          }}
        >
          {plan.weekFocus}
        </div>

        {plan.todayBlocks.map((b, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 12px",
              borderRadius: 12,
              background: b.done ? "rgba(94,205,161,0.06)" : "rgba(255,255,255,0.03)",
              border: `1px solid ${b.done ? accentRgba(0.18) : "rgba(255,255,255,0.06)"}`,
              marginBottom: 8,
            }}
          >
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: 6,
                background: b.done ? ACCENT : "transparent",
                border: `1.5px solid ${b.done ? ACCENT : "rgba(255,255,255,0.25)"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {b.done && <Check size={11} strokeWidth={3} color="#060912" />}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 13.5,
                  color: b.done ? TEXT_MID : TEXT_HI,
                  fontWeight: 500,
                  textDecoration: b.done ? "line-through" : "none",
                  textDecorationColor: accentRgba(0.4),
                }}
              >
                {b.label}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: 10,
                  color: TEXT_LO,
                  letterSpacing: "0.06em",
                  marginTop: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <Clock size={10} strokeWidth={2} />
                {b.time} · {b.duration}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          padding: "12px 20px 18px",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          marginTop: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
          <span
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 9,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: TEXT_LO,
            }}
          >
            Up next
          </span>
          <span
            style={{
              fontSize: 12.5,
              color: TEXT_MID,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {plan.upNext}
          </span>
        </div>
        <ChevronRight size={16} color={TEXT_LO} />
      </div>

      {variant === "compact" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "linear-gradient(135deg, rgba(94,205,161,0.06) 0%, transparent 35%)",
          }}
          aria-hidden
        />
      )}

      <div
        aria-hidden
        style={{
          position: "absolute",
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: 9,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: TEXT_LO,
          bottom: -22,
          left: 4,
        }}
      >
        {ARCHETYPE_TAGLINE[archetype]}
      </div>
    </div>
  );
}
