"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePlanStore } from "../../state/planStore";

const CHAIN_LENGTH = 30;
const MILESTONE_DAYS = [7, 14, 21, 30];
const SHIELD_MILESTONES = [7, 14, 30];

type RiskTier = "none" | "warning" | "urgent" | "critical";

function getRiskTier(hour: number, status: string, streak: number): RiskTier {
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

function getStreakCopy(streak: number, atRisk: boolean): string {
  if (atRisk) return "chain at risk";
  if (streak >= 30) return "legendary 🏆";
  if (streak >= 21) return "unstoppable ⚡";
  if (streak >= 14) return "on fire 🔥";
  if (streak >= 7) return "building heat 🔥";
  if (streak >= 3) return "gaining momentum";
  if (streak === 0) return "start your chain";
  return "warming up";
}

function getRiskCopy(tier: RiskTier): string {
  if (tier === "critical") return "⚠ Expires in under an hour";
  if (tier === "urgent") return `Last chance — ${hoursUntilMidnight()}h left to save your streak`;
  if (tier === "warning") return "Your streak expires tonight";
  return "";
}

function getRiskColor(tier: RiskTier): string {
  if (tier === "critical") return "var(--alert-bg)";
  if (tier === "urgent") return "#e86000";
  if (tier === "warning") return "var(--accent-warm)";
  return "var(--text-secondary)";
}

function getNextMilestone(streak: number): number | null {
  return MILESTONE_DAYS.find((m) => m > streak) ?? null;
}

export function StreakChain() {
  const streak = usePlanStore((s) => s.streak);
  const bestStreak = usePlanStore((s) => s.bestStreak);
  const streakShields = usePlanStore((s) => s.streakShields);
  const todayStatus = usePlanStore((s) => s.todayStatus);

  // Loss aversion: graduated risk tiers as the day goes on
  const [riskTier, setRiskTier] = useState<RiskTier>("none");
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
  const copy = getStreakCopy(streak, isAtRisk);

  // Build dot states for 30-day chain
  const dots = Array.from({ length: CHAIN_LENGTH }, (_, i) => {
    const day = i + 1; // 1-indexed
    if (day <= streak) return "done";
    if (day === streak + 1) return "today";
    return "future";
  });

  return (
    <div className="mx-4 rounded-2xl p-4" style={{ background: "var(--card-surface)", border: "1px solid var(--card-stroke)" }}>
      {/* Header row */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={isAtRisk ? "animate-flame-flicker" : ""}
            style={{ fontSize: "22px", display: "inline-block" }}
            aria-hidden
          >
            🔥
          </span>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span
                className="text-[32px] font-black leading-none tabular-nums"
                style={{ color: isAtRisk ? "var(--alert-bg)" : "var(--text-primary)" }}
              >
                {streak}
              </span>
              <span className="text-[13px] font-semibold" style={{ color: "var(--text-muted)" }}>
                day chain
              </span>
            </div>
            <p
              className="text-[13px] font-semibold"
              style={{ color: isAtRisk ? "var(--alert-bg)" : "var(--text-secondary)" }}
            >
              {copy}
            </p>
          </div>
        </div>

        {/* Shields */}
        <div className="flex flex-col items-end gap-0.5">
          {streakShields > 0 && (
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(streakShields, 3) }, (_, i) => (
                <span key={i} className="text-[18px]" aria-hidden>🛡️</span>
              ))}
              {streakShields > 3 && (
                <span className="text-[13px] font-bold" style={{ color: "var(--text-secondary)" }}>
                  ×{streakShields}
                </span>
              )}
            </div>
          )}
          {bestStreak > 0 && (
            <p className="text-[13px]" style={{ color: "var(--text-muted)" }}>
              {streak >= bestStreak && streak > 0 ? "🏅 personal best" : `best: ${bestStreak}`}
            </p>
          )}
        </div>
      </div>

      {/* Dot chain */}
      <div className="relative mb-2">
        {/* Milestone shield icons floating above */}
        <div className="absolute -top-4 left-0 right-0 flex" aria-hidden>
          {dots.map((_, i) => {
            const day = i + 1;
            if (!SHIELD_MILESTONES.includes(day)) return <div key={i} className="flex-1" />;
            const earned = day <= streak;
            return (
              <div key={i} className="flex flex-1 justify-center" style={{ transform: "translateX(50%)" }}>
                <span
                  className="text-[13px] leading-none"
                  style={{ opacity: earned ? 1 : 0.25 }}
                >
                  🛡️
                </span>
              </div>
            );
          })}
        </div>

        {/* The dot row */}
        <div className="flex gap-[3px] overflow-hidden">
          {dots.map((state, i) => {
            const day = i + 1;
            const isMilestone = MILESTONE_DAYS.includes(day);
            const isLastCompleted = state === "done" && day === streak;

            return (
              <motion.div
                key={day}
                className={[
                  "flex-1 rounded-full",
                  state === "today" ? "animate-chain-dot-pulse" : "",
                ].join(" ")}
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
                  boxShadow: isLastCompleted ? "0 0 8px 2px var(--accent-primary)" : undefined,
                }}
                initial={state === "done" && day === streak ? { scale: 0 } : { scale: 1 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              />
            );
          })}
        </div>

        {/* Tick labels below */}
        <div className="mt-1 flex">
          {dots.map((_, i) => {
            const day = i + 1;
            if (day !== 1 && day !== 7 && day !== 14 && day !== 21 && day !== 30) {
              return <div key={i} className="flex-1" />;
            }
            return (
              <div key={i} className="flex flex-1 justify-center">
                <span
                  className="text-[12px] font-bold"
                  style={{ color: day <= streak ? "var(--accent-primary)" : "var(--text-muted)" }}
                >
                  {day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Risk countdown — loss aversion */}
      <AnimatePresence>
        {riskTier !== "none" && (
          <motion.p
            key="risk"
            className={["text-center text-[12px] font-bold", riskTier === "critical" ? "animate-flame-flicker" : ""].join(" ")}
            style={{ color: getRiskColor(riskTier) }}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {getRiskCopy(riskTier)}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Next milestone teaser */}
      <AnimatePresence>
        {riskTier === "none" && nextMilestone && (
          <motion.p
            className="text-center text-[13px] font-semibold"
            style={{ color: "var(--text-secondary)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {nextMilestone === 7
              ? `${nextMilestone - streak} day${nextMilestone - streak !== 1 ? "s" : ""} to earn your first 🛡️ shield`
              : `${nextMilestone - streak} day${nextMilestone - streak !== 1 ? "s" : ""} to ${nextMilestone === 14 ? "⚡ 14" : nextMilestone === 21 ? "💪 21" : "🏆 30"}`}
          </motion.p>
        )}
        {streak >= 30 && (
          <motion.p
            className="text-center text-[13px] font-bold"
            style={{ color: "var(--accent-warm)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            🏆 Legendary — you&apos;ve hit the 30-day mark
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export function StreakBadge() {
  const streak = usePlanStore((s) => s.streak);
  const todayStatus = usePlanStore((s) => s.todayStatus);

  const [riskTier, setRiskTier] = useState<RiskTier>("none");
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
      <span
        className={isAtRisk ? "animate-flame-flicker" : ""}
        style={{ fontSize: "22px", display: "inline-block" }}
        aria-hidden
      >
        🔥
      </span>
      <span
        className="text-[28px] font-black leading-none tabular-nums"
        style={{ color: isAtRisk ? "var(--alert-bg)" : "var(--text-primary)" }}
      >
        {streak}
      </span>
    </div>
  );
}
