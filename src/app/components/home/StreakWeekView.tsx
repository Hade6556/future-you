"use client";

import { motion, AnimatePresence } from "framer-motion";

const DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

type Props = {
  streak: number;
};

export function StreakWeekView({ streak }: Props) {
  const today = new Date().getDay();
  const todayIdx = today === 0 ? 6 : today - 1;

  const milestoneMsg =
    streak === 7
      ? "7-day streak! You're on fire."
      : streak === 30
        ? "30-day streak! Unstoppable."
        : null;

  return (
    <div className="flex flex-col items-center py-4">
      <div className="flex items-center gap-3">
        {DAYS.map((day, i) => {
          const isCompleted = i < todayIdx && i < streak;
          const isToday = i === todayIdx;

          const isRestDay = isToday && day === "Sa";

          return (
            <div key={day} className="flex flex-col items-center gap-1">
              <div
                title={isRestDay ? "Plan rest day — tap to log rest" : undefined}
                className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold transition-all ${
                  isCompleted
                    ? "bg-primary/15 text-primary"
                    : isToday
                      ? isRestDay
                        ? "bg-primary/10 text-primary ring-2 ring-primary/30"
                        : "animate-[streak-ring-pulse_2s_ease-in-out_infinite] bg-primary/15 text-primary ring-2 ring-primary/30"
                      : "bg-inactive-day-label text-text-secondary"
                }`}
              >
                {isCompleted ? (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-primary">
                    <path
                      d="M3 7l3 3 5-5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : isToday ? (
                  isRestDay ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                    </svg>
                  ) : (
                    "•"
                  )
                ) : (
                  ""
                )}
              </div>
              <span className="text-center text-[12px] font-bold uppercase text-text-primary">
                {isRestDay ? "Rest" : isToday ? "Today" : day}
              </span>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {milestoneMsg && (
          <motion.p
            className="mt-3 text-center text-sm font-medium text-foreground"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            exit={{ opacity: 0 }}
          >
            {milestoneMsg}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
