"use client";

import { usePlanStore, getCurrentWeekDates, todayISO } from "../../state/planStore";
import { ACCENT, GLASS, GLASS_BORDER, accentRgba } from "@/app/theme";
import { streakMomentumContextLine } from "@/app/utils/streakCopy";

const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

export function StreakMomentumCard() {
  const streak = usePlanStore((s) => s.streak);
  const bestStreak = usePlanStore((s) => s.bestStreak);
  const dailyScores = usePlanStore((s) => s.dailyScores);

  const weekDates = getCurrentWeekDates();
  const today = todayISO();

  const contextLine = streakMomentumContextLine(streak, bestStreak);

  return (
    <section
      style={{
        position: "relative",
        background: GLASS,
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: `1px solid ${GLASS_BORDER}`,
        borderRadius: 16,
        padding: "14px 16px",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0, height: 1,
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)",
        }}
      />

      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        <span
          style={{
            fontFamily: "var(--font-barlow-condensed), sans-serif",
            fontWeight: 900,
            fontSize: 36,
            lineHeight: 1,
            color: streak > 0 ? ACCENT : "rgba(130,155,195,0.45)",
            letterSpacing: "-0.03em",
          }}
        >
          {streak}
        </span>
        <span
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: 12,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "rgba(140,170,210,0.60)",
            paddingBottom: 4,
          }}
        >
          day streak
        </span>
      </div>

      {/* 7-day dot row */}
      <div style={{ display: "flex", gap: 6, marginTop: 10, justifyContent: "space-between" }}>
        {weekDates.map((date, i) => {
          const isToday = date === today;
          const isFuture = date > today;
          const scores = dailyScores?.[date];
          const completed = scores != null && (scores.close > 0 || scores.volume > 0);

          return (
            <div key={date} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flex: 1 }}>
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: completed
                    ? accentRgba(0.16)
                    : "rgba(255,255,255,0.04)",
                  border: isToday
                    ? `2px solid ${ACCENT}`
                    : completed
                      ? `1.5px solid ${accentRgba(0.32)}`
                      : "1.5px solid rgba(255,255,255,0.08)",
                  boxShadow: isToday && !completed
                    ? `0 0 0 3px ${accentRgba(0.1)}`
                    : "none",
                  opacity: isFuture ? 0.35 : 1,
                  transition: "all 0.2s ease",
                }}
              >
                {completed && (
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: ACCENT,
                    }}
                  />
                )}
              </div>
              <span
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: 12,
                  letterSpacing: "0.06em",
                  color: isToday
                    ? accentRgba(0.72)
                    : "rgba(120,155,195,0.35)",
                  fontWeight: isToday ? 600 : 400,
                }}
              >
                {DAY_LABELS[i]}
              </span>
            </div>
          );
        })}
      </div>

      {/* Context line */}
      <p
        style={{
          fontFamily: "var(--font-apercu), sans-serif",
          fontSize: 12,
          color: streak >= bestStreak && streak > 0
            ? ACCENT
            : "rgba(160,180,210,0.55)",
          marginTop: 8,
          marginBottom: 0,
          textAlign: "center",
        }}
      >
        {contextLine}
      </p>
    </section>
  );
}
