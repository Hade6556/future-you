"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePlanStore } from "../state/planStore";
import { computeDayInfo } from "../utils/dayEngine";

interface Props {
  open: boolean;
  onClose: () => void;
}

const STATUS_CONFIG = {
  done:    { label: "Done",    bg: "#4CAF7D", text: "#ffffff" },
  partial: { label: "Partial", bg: "#F5A623", text: "#060912" },
  skipped: { label: "Skipped", bg: "rgba(120,155,195,0.25)", text: "rgba(235,242,255,0.92)" },
  pending: { label: "Pending", bg: "rgba(255,255,255,0.07)", text: "rgba(120,155,195,0.75)" },
};

export function TodaySummaryDrawer({ open, onClose }: Props) {
  const streak = usePlanStore((s) => s.streak);
  const todayStatus = usePlanStore((s) => s.todayStatus);
  const pipelinePlan = usePlanStore((s) => s.pipelinePlan);
  const planStartDate = usePlanStore((s) => s.planStartDate);

  const dayInfo = useMemo(
    () => (pipelinePlan && planStartDate ? computeDayInfo(pipelinePlan, planStartDate) : null),
    [pipelinePlan, planStartDate],
  );

  const status = STATUS_CONFIG[todayStatus] ?? STATUS_CONFIG.pending;
  const progressPct = dayInfo ? Math.round((dayInfo.currentDay / dayInfo.totalDays) * 100) : 0;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[60]"
            style={{ background: "rgba(6,9,18,0.5)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-[70] mx-auto max-w-[375px] rounded-t-3xl px-6 pb-10 pt-5"
            style={{ background: "#0F2040" }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 340, damping: 32 }}
          >
            {/* Drag handle */}
            <div className="mb-5 flex justify-center">
              <div className="h-1 w-10 rounded-full" style={{ background: "rgba(255,255,255,0.14)" }} />
            </div>

            <p
              className="mb-5 text-[11px] font-bold uppercase tracking-[0.18em]"
              style={{ color: "var(--text-muted)" }}
            >
              Today at a Glance
            </p>

            <div className="flex flex-col gap-4">
              {/* Streak */}
              <div className="flex items-center justify-between rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.07)" }}>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>Streak</p>
                  <p className="text-[28px] font-extrabold leading-none" style={{ color: "rgba(235,242,255,0.92)" }}>
                    {streak}
                    <span className="ml-1 text-[13px] font-semibold" style={{ color: "rgba(120,155,195,0.75)" }}>days</span>
                  </p>
                </div>
                <span className="text-3xl" aria-hidden>🔥</span>
              </div>

              {/* Today's status */}
              <div className="flex items-center justify-between rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.07)" }}>
                <p className="text-[11px] font-bold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>Today's task</p>
                <span
                  className="rounded-full px-3 py-1 text-[12px] font-bold"
                  style={{ background: status.bg, color: status.text }}
                >
                  {status.label}
                </span>
              </div>

              {/* Day progress */}
              {dayInfo && (
                <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.07)" }}>
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-[11px] font-bold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>Plan progress</p>
                    <p className="text-[13px] font-bold" style={{ color: "rgba(235,242,255,0.92)" }}>
                      Day {dayInfo.currentDay}
                      <span className="font-normal" style={{ color: "rgba(120,155,195,0.75)" }}> / {dayInfo.totalDays}</span>
                    </p>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,0.14)" }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: "#4CAF7D" }}
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPct}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
