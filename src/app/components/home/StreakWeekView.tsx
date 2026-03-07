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
      ? "🔥 7-day streak! You're on fire."
      : streak === 30
        ? "🏆 30-day streak! Unstoppable."
        : null;

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-3">
        {DAYS.map((day, i) => {
          const isCompleted = i < todayIdx && i < streak;
          const isToday = i === todayIdx;

          return (
            <div key={day} className="flex flex-col items-center gap-1.5">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full text-[13px] font-semibold transition-all ${
                  isCompleted
                    ? "bg-[#121212] text-white"
                    : isToday
                      ? "animate-[streak-ring-pulse_2s_ease-in-out_infinite] bg-[#FFD65A] text-[#121212]"
                      : "bg-[#E0E0E0] text-[#6A6A6A]"
                }`}
              >
                {isCompleted ? (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M3 7l3 3 5-5"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : isToday ? (
                  "✦"
                ) : (
                  ""
                )}
              </div>
              <span
                className={`text-[11px] ${
                  isToday ? "font-semibold text-[#121212]" : "text-[#6A6A6A]"
                }`}
              >
                {day}
              </span>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {milestoneMsg && (
          <motion.p
            className="mt-3 text-center text-[14px] font-medium text-[#121212]"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {milestoneMsg}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
