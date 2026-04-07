"use client";

import { usePlanStore, getCurrentWeekDates, todayISO } from "../../state/planStore";

const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

function getWeeklyCopy(count: number): string {
  if (count === 7) return "Perfect week 🏆";
  if (count >= 5) return "Incredible week 🔥";
  if (count >= 3) return "Building momentum";
  if (count >= 1) return "Just getting started";
  return "Start strong today";
}

export function WeeklyMomentum() {
  const weeklyCompletions = usePlanStore((s) => s.weeklyCompletions);
  const weeklyBest = usePlanStore((s) => s.weeklyBest);

  const weekDates = getCurrentWeekDates();
  const today = todayISO();

  const completedCount = weekDates.filter((d) => weeklyCompletions[d]).length;
  const copy = getWeeklyCopy(completedCount);

  return (
    <div
      className="mx-4 rounded-2xl px-4 py-4"
      style={{ background: "var(--card-surface)", border: "1px solid var(--card-stroke)" }}
    >
      <div className="mb-3 flex items-center justify-between">
        <p
          className="text-[13px] font-bold uppercase tracking-[0.12em]"
          style={{ color: "var(--text-muted)" }}
        >
          This Week
        </p>
        <div className="flex items-center gap-2">
          <p className="text-[13px] font-bold" style={{ color: "var(--text-secondary)" }}>
            {completedCount}/7 days
          </p>
          {weeklyBest > 0 && (
            <p className="text-[13px]" style={{ color: "var(--text-muted)" }}>
              · best: {weeklyBest}
            </p>
          )}
        </div>
      </div>

      {/* 7-dot row */}
      <div className="flex gap-2">
        {weekDates.map((date, i) => {
          const done = !!weeklyCompletions[date];
          const isToday = date === today;
          const isFuture = date > today;

          return (
            <div key={date} className="flex flex-1 flex-col items-center gap-1">
              <div
                className={done ? "animate-dot-pop" : ""}
                style={{
                  width: "100%",
                  aspectRatio: "1",
                  borderRadius: "50%",
                  background: done
                    ? "var(--accent-secondary)"
                    : isToday
                    ? "var(--badge-bg)"
                    : "var(--canvas-base)",
                  border: isToday && !done
                    ? "2px solid var(--accent-primary)"
                    : done
                    ? "2px solid var(--accent-secondary)"
                    : "2px solid var(--card-stroke)",
                  opacity: isFuture ? 0.4 : 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "13px",
                }}
                aria-label={`${DAY_LABELS[i]}: ${done ? "completed" : isToday ? "today" : isFuture ? "upcoming" : "missed"}`}
              >
                {done && (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
                    <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                {isToday && !done && (
                  <div
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: "var(--accent-primary)" }}
                  />
                )}
              </div>
              <span
                className="text-[13px] font-bold"
                style={{
                  color: done
                    ? "var(--accent-secondary)"
                    : isToday
                    ? "var(--accent-primary)"
                    : "var(--text-muted)",
                }}
              >
                {DAY_LABELS[i]}
              </span>
            </div>
          );
        })}
      </div>

      {/* Copy */}
      <p
        className="mt-2.5 text-center text-[14px] font-semibold"
        style={{ color: "var(--text-secondary)" }}
      >
        {copy}
      </p>
    </div>
  );
}
