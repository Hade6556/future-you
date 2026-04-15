"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePlanStore } from "../../state/planStore";
import {
  streakChainStatusLine,
  streakRiskUrgencyLine,
  streakNextCheckpointLine,
  streakChainThirtyCompleteLine,
  gracePassLabel,
  type StreakRiskTier,
} from "@/app/utils/streakCopy";

const CHAIN_LENGTH = 30;
const MILESTONE_DAYS = [7, 14, 21, 30];
const GRACE_PASS_MILESTONES = [7, 14, 30];

function getRiskTier(hour: number, status: string, streak: number): StreakRiskTier {
  if (status !== "pending" || streak === 0) return "none";
  if (hour >= 23) return "critical";
  if (hour >= 21) return "urgent";
  if (hour >= 18) return "warning";
  return "none";
}

function getMsUntilMidnight(): number {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return midnight.getTime() - now.getTime();
}

function hoursUntilMidnight(): number {
  return Math.ceil(getMsUntilMidnight() / (1000 * 60 * 60));
}

function getRiskColor(tier: StreakRiskTier): string {
  if (tier === "critical") return "var(--alert-bg)";
  if (tier === "urgent") return "#e86000";
  if (tier === "warning") return "var(--accent-warm)";
  return "var(--text-secondary)";
}

function getNextMilestone(streak: number): number | null {
  return MILESTONE_DAYS.find((m) => m > streak) ?? null;
}

function ContinuityIcon({ atRisk, size = 22 }: { atRisk: boolean; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="3"
        y="4"
        width="18"
        height="18"
        rx="3"
        stroke={atRisk ? "var(--alert-bg)" : "var(--text-primary)"}
        strokeWidth="1.6"
        opacity={atRisk ? 1 : 0.9}
      />
      <path
        d="M8 12l2.5 2.5L16 9"
        stroke={atRisk ? "var(--alert-bg)" : "var(--accent-primary)"}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function StreakChain() {
  const streak = usePlanStore((s) => s.streak);
  const bestStreak = usePlanStore((s) => s.bestStreak);
  const streakShields = usePlanStore((s) => s.streakShields);
  const todayStatus = usePlanStore((s) => s.todayStatus);

  const [riskTier, setRiskTier] = useState<StreakRiskTier>("none");
  useEffect(() => {
    function check() {
      setRiskTier(getRiskTier(new Date().getHours(), todayStatus, streak));
    }
    check();
    const id = setInterval(check, 60_000);
    return () => clearInterval(id);
  }, [todayStatus, streak]);

  const isAtRisk = riskTier !== "none";
  const nextMilestone = getNextMilestone(streak);
  const copy = streakChainStatusLine(streak, isAtRisk);

  const dots = Array.from({ length: CHAIN_LENGTH }, (_, i) => {
    const day = i + 1;
    if (day <= streak) return "done";
    if (day === streak + 1) return "today";
    return "future";
  });

  return (
    <div className="mx-4 rounded-2xl p-4" style={{ background: "var(--card-surface)", border: "1px solid var(--card-stroke)" }}>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ContinuityIcon atRisk={isAtRisk} size={24} />
          <div>
            <div className="flex items-baseline gap-1.5">
              <span
                className="text-[32px] font-black leading-none tabular-nums"
                style={{ color: isAtRisk ? "var(--alert-bg)" : "var(--text-primary)" }}
              >
                {streak}
              </span>
              <span className="text-[13px] font-semibold" style={{ color: "var(--text-muted)" }}>
                day streak
              </span>
            </div>
            <p
              className="text-[13px] font-medium"
              style={{ color: isAtRisk ? "var(--alert-bg)" : "var(--text-secondary)" }}
            >
              {copy}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-0.5">
          {streakShields > 0 && (
            <p className="text-[12px] font-medium" style={{ color: "var(--text-secondary)" }} title={gracePassLabel(streakShields)}>
              {streakShields === 1 ? "1 grace pass" : `${streakShields} grace passes`}
            </p>
          )}
          {bestStreak > 0 && (
            <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>
              {streak >= bestStreak && streak > 0 ? "Longest run so far" : `Best: ${bestStreak} days`}
            </p>
          )}
        </div>
      </div>

      <div className="relative mb-2">
        <div className="flex gap-[3px] overflow-hidden">
          {dots.map((state, i) => {
            const day = i + 1;
            const isMilestone = MILESTONE_DAYS.includes(day);
            const isLastCompleted = state === "done" && day === streak;

            return (
              <motion.div
                key={day}
                className={["flex-1 rounded-full", state === "today" ? "animate-chain-dot-pulse" : ""].join(" ")}
                style={{
                  height: isMilestone ? "12px" : "9px",
                  background:
                    state === "done"
                      ? "var(--accent-primary)"
                      : state === "today"
                        ? isAtRisk
                          ? "var(--alert-bg)"
                          : "var(--accent-primary)"
                        : "var(--badge-bg)",
                  opacity: state === "future" ? 0.4 : 1,
                  border: isMilestone
                    ? `1px solid ${state !== "future" ? "var(--accent-primary)" : "var(--card-stroke)"}`
                    : "none",
                  alignSelf: "center",
                  boxShadow: isLastCompleted ? "0 0 6px 1px var(--accent-primary-glow)" : undefined,
                }}
                initial={state === "done" && day === streak ? { scale: 0 } : { scale: 1 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 380, damping: 18 }}
              />
            );
          })}
        </div>

        <div className="mt-1 flex">
          {dots.map((_, i) => {
            const day = i + 1;
            if (day !== 1 && day !== 7 && day !== 14 && day !== 21 && day !== 30) {
              return <div key={i} className="flex-1" />;
            }
            return (
              <div key={i} className="flex flex-1 justify-center">
                <span
                  className="text-[11px] font-semibold tabular-nums"
                  style={{ color: day <= streak ? "var(--accent-primary)" : "var(--text-muted)" }}
                >
                  {day}
                  {GRACE_PASS_MILESTONES.includes(day) ? " ·" : ""}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {riskTier !== "none" && (
          <motion.p
            key="risk"
            className="text-center text-[12px] font-semibold"
            style={{ color: getRiskColor(riskTier) }}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {streakRiskUrgencyLine(riskTier, hoursUntilMidnight())}
          </motion.p>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {riskTier === "none" && nextMilestone && streak < 30 && (
          <motion.p
            className="text-center text-[12px] font-medium"
            style={{ color: "var(--text-secondary)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {streakNextCheckpointLine(streak, nextMilestone)}
          </motion.p>
        )}
        {streak >= 30 && (
          <motion.p
            className="text-center text-[12px] font-semibold"
            style={{ color: "var(--text-secondary)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {streakChainThirtyCompleteLine()}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export function StreakBadge() {
  const streak = usePlanStore((s) => s.streak);
  const todayStatus = usePlanStore((s) => s.todayStatus);

  const [riskTier, setRiskTier] = useState<StreakRiskTier>("none");
  useEffect(() => {
    function check() {
      setRiskTier(getRiskTier(new Date().getHours(), todayStatus, streak));
    }
    check();
    const id = setInterval(check, 60_000);
    return () => clearInterval(id);
  }, [todayStatus, streak]);

  const isAtRisk = riskTier !== "none";

  return (
    <div className="flex items-center gap-1.5">
      <ContinuityIcon atRisk={isAtRisk} size={22} />
      <span
        className="text-[28px] font-black leading-none tabular-nums"
        style={{ color: isAtRisk ? "var(--alert-bg)" : "var(--text-primary)" }}
      >
        {streak}
      </span>
    </div>
  );
}
