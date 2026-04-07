"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePlanStore } from "../state/planStore";
import { computeDayInfo } from "../utils/dayEngine";
import { Card, CardContent } from "@/components/ui/card";
import type { DailyMentorMessage, CheckinResponse } from "../types/pipeline";

// ─── Types ────────────────────────────────────────────────────────────────────

type UiPhase =
  | "loading"      // fetching morning message
  | "mission"      // showing morning message + checkin buttons
  | "replied"      // showing mentor reply (brief, during exit transition)
  | "complete";    // already done today (loaded from persisted state)

// ─── Main component ───────────────────────────────────────────────────────────

export function DailyCoachingSection() {
  const pipelinePlan = usePlanStore((s) => s.pipelinePlan);
  const planStartDate = usePlanStore((s) => s.planStartDate);
  const todayStatus = usePlanStore((s) => s.todayStatus);
  const setTodayStatus = usePlanStore((s) => s.setTodayStatus);
  const incrementStreak = usePlanStore((s) => s.incrementStreak);
  const useStreakShield = usePlanStore((s) => s.useStreakShield);
  const userName = usePlanStore((s) => s.userName);
  const dogArchetype = usePlanStore((s) => s.dogArchetype);
  const ambitionType = usePlanStore((s) => s.ambitionType);
  const streak = usePlanStore((s) => s.streak);
  const recalculateAndPersistScore = usePlanStore((s) => s.recalculateAndPersistScore);

  const [uiPhase, setUiPhase] = useState<UiPhase>(
    todayStatus !== "pending" ? "complete" : "loading",
  );
  const [mentorMsg, setMentorMsg] = useState<DailyMentorMessage | null>(null);
  const [checkinReply, setCheckinReply] = useState<CheckinResponse | null>(null);
  const [checkinLoading, setCheckinLoading] = useState(false);
  const [showStamp, setShowStamp] = useState(false);

  // Compute day info from the plan
  const dayInfo =
    pipelinePlan && planStartDate ? computeDayInfo(pipelinePlan, planStartDate) : null;

  // Fetch today's mentor message on mount (only if status is pending)
  const fetchMorningMessage = useCallback(async () => {
    if (!dayInfo || todayStatus !== "pending") return;
    setUiPhase("loading");
    try {
      const res = await fetch("/api/mentor-daily", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          day: dayInfo.currentDay,
          totalDays: dayInfo.totalDays,
          userName,
          archetype: dogArchetype,
          ambitionType,
          currentStep: dayInfo.currentStep
            ? {
                title: dayInfo.currentStep.title,
                description: dayInfo.currentStep.description,
                success_metric: dayInfo.currentStep.success_metric,
                duration_weeks: dayInfo.currentStep.duration_weeks,
              }
            : null,
          phaseGoal: dayInfo.currentPhase?.goal ?? null,
          phaseName: dayInfo.currentPhase?.phase_name ?? null,
          yesterdayStatus: null,
        }),
        credentials: "include",
      });
      const data = (await res.json()) as DailyMentorMessage;
      setMentorMsg(data);
      setUiPhase("mission");
    } catch {
      setMentorMsg({
        morningMessage:
          "Today's task is waiting. Open your plan, pick up where you left off, and do one thing.",
        taskTitle: dayInfo.currentStep?.title ?? "Today's task",
        estimatedMinutes: 15,
        reminderMessage: "Did you get today's task done? One tap when done.",
      });
      setUiPhase("mission");
    }
  }, [dayInfo, todayStatus, userName, dogArchetype, ambitionType]);

  useEffect(() => {
    void fetchMorningMessage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle one of the check-in buttons
  async function handleCheckin(status: "done" | "partial" | "skipped") {
    if (status === "done") {
      setShowStamp(true);
      await new Promise((r) => setTimeout(r, 750));
      setShowStamp(false);
    }
    setCheckinLoading(true);
    if (status === "done") {
      incrementStreak();
    } else if (status === "partial") {
      useStreakShield();
    }
    setTodayStatus(status);
    recalculateAndPersistScore();

    try {
      const res = await fetch("/api/mentor-checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          status,
          day: dayInfo?.currentDay ?? 1,
          totalDays: dayInfo?.totalDays ?? 90,
          userName,
          archetype: dogArchetype,
          ambitionType,
          currentStepTitle: dayInfo?.currentStep?.title ?? null,
          nextStepTitle: dayInfo?.nextStep?.title ?? null,
          streak: status === "done" ? streak + 1 : streak,
        }),
      });
      const reply = (await res.json()) as CheckinResponse;
      setCheckinReply(reply);
    } catch {
      setCheckinReply({
        reply:
          status === "done"
            ? "Locked in. Tomorrow we keep building."
            : "Noted. Tomorrow we pick back up.",
        tomorrowPreview: dayInfo?.nextStep?.title ?? null,
      });
    } finally {
      setCheckinLoading(false);
      setUiPhase("replied");
    }
  }

  // ─── Loading state ──────────────────────────────────────────────────────────
  if (uiPhase === "loading") {
    return (
      <Card style={{ background: "var(--card-surface)", border: "1px solid var(--card-stroke)" }}>
        <CardContent className="flex items-center gap-3 px-6 py-7">
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="h-2 w-2 rounded-full bg-muted-foreground"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
          <p className="text-[14px] text-muted-foreground">Your mentor is preparing today…</p>
        </CardContent>
      </Card>
    );
  }

  // ─── Already completed today (kept for compatibility, rarely shown) ─────────
  if (uiPhase === "complete" || uiPhase === "replied") {
    return null;
  }

  // ─── Mission + check-in (combined) ─────────────────────────────────────────
  if (uiPhase === "mission" && mentorMsg) {
    return (
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
      >
        {/* Done stamp overlay */}
        <AnimatePresence>
          {showStamp && (
            <motion.div
              className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl"
              style={{ background: "rgba(155,176,104,0.12)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="flex h-20 w-20 items-center justify-center rounded-full border-[3px] text-center"
                style={{ borderColor: "var(--accent-secondary)", color: "var(--accent-secondary)", background: "white" }}
                initial={{ scale: 0, rotate: -15 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 22 }}
              >
                <span className="text-[13px] font-black uppercase leading-tight">Done<br />✓</span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <Card style={{ background: "var(--card-surface)", border: "1px solid var(--card-stroke)" }}>
          <CardContent className="px-6 py-7 space-y-5">
            {/* Day label */}
            {dayInfo && (
              <p className="text-[13px] font-bold uppercase tracking-[0.18em]" style={{ color: "var(--text-muted)" }}>
                Day {dayInfo.currentDay} of {dayInfo.totalDays}
                {dayInfo.currentPhase ? ` · ${dayInfo.currentPhase.phase_name}` : ""}
              </p>
            )}

            {/* Mentor message */}
            <p className="text-[17px] leading-loose text-foreground">
              {mentorMsg.morningMessage}
            </p>

            {/* Task meta */}
            <div className="rounded-xl px-4 py-3" style={{ background: "var(--badge-bg)" }}>
              <p className="text-[14px] font-bold text-foreground">{mentorMsg.taskTitle}</p>
              <p className="mt-0.5 text-[12px]" style={{ color: "var(--text-secondary)" }}>
                ✦ {mentorMsg.estimatedMinutes} min
              </p>
            </div>

            {/* Check-in buttons */}
            <div className="space-y-2.5">
              <motion.button
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 18 }}
                disabled={checkinLoading}
                onClick={() => void handleCheckin("done")}
                className="w-full rounded-2xl py-4 text-[16px] font-bold text-white disabled:opacity-50"
                style={{ background: "var(--accent-secondary)" }}
              >
                ✓ Done today
              </motion.button>
              <div className="flex gap-2">
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 400, damping: 18 }}
                  disabled={checkinLoading}
                  onClick={() => void handleCheckin("partial")}
                  className="flex-1 rounded-xl border py-3 text-[13px] font-semibold text-muted-foreground transition-colors hover:bg-muted disabled:opacity-50"
                  style={{ borderColor: "var(--card-stroke)" }}
                >
                  Partial
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 400, damping: 18 }}
                  disabled={checkinLoading}
                  onClick={() => void handleCheckin("skipped")}
                  className="flex-1 rounded-xl border py-3 text-[13px] font-semibold text-muted-foreground transition-colors hover:bg-muted disabled:opacity-50"
                  style={{ borderColor: "var(--card-stroke)" }}
                >
                  Skip
                </motion.button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return null;
}
