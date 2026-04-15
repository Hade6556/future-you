"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { usePlanStore } from "../../state/planStore";
import {
  streakCardConsistencyLine,
  streakCardPersonalBestLine,
  streakNextCheckpointLine,
  gracePassLabel,
  gracePassShort,
} from "@/app/utils/streakCopy";

const subscribe = () => () => {};
const getTrue = () => true;
const getFalse = () => false;
function useHydrated() {
  return useSyncExternalStore(subscribe, getTrue, getFalse);
}

const CHECKPOINT_DAYS = [5, 7, 14, 30];

function getNextCheckpoint(streak: number): number | null {
  return CHECKPOINT_DAYS.find((m) => m > streak) ?? null;
}

/** Compact streak summary — calm consistency framing, no confetti or game chrome. */
export function StreakCard() {
  const hydrated = useHydrated();
  const storeStreak = usePlanStore((s) => s.streak);
  const storeBestStreak = usePlanStore((s) => s.bestStreak);
  const storeStreakShields = usePlanStore((s) => s.streakShields);

  const streak = hydrated ? storeStreak : 0;
  const bestStreak = hydrated ? storeBestStreak : 0;
  const streakShields = hydrated ? storeStreakShields : 0;

  const fillPct = Math.min((streak / 30) * 100, 100);
  const next = getNextCheckpoint(streak);

  return (
    <Link href="/explore" className="no-underline shrink-0">
      <div
        className="relative flex h-[200px] w-[163px] flex-col justify-between rounded-[24px] p-5"
        style={{
          background: "linear-gradient(145deg, rgba(76,175,125,0.35) 0%, var(--accent-secondary) 55%, rgba(6,9,18,0.25) 100%)",
          boxShadow: "0 12px 28px rgba(0,0,0,0.22)",
          border: "1px solid rgba(255,255,255,0.12)",
          overflow: "hidden",
        }}
      >
        {/* Calm continuity mark */}
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect x="3" y="4" width="18" height="18" rx="3" stroke="white" strokeOpacity="0.85" strokeWidth="1.5" />
          <path d="M8 12l2.5 2.5L16 9" stroke="white" strokeOpacity="0.9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

        <div>
          <div className="flex items-baseline gap-2">
            <p className="text-[40px] font-extrabold leading-none text-white tabular-nums">
              {streak}
            </p>
            {streakShields > 0 && (
              <span
                className="text-[12px] font-medium leading-none text-white/85"
                title={gracePassLabel(streakShields)}
              >
                {gracePassShort(streakShields)}
              </span>
            )}
          </div>
          <p className="text-[12px] font-medium text-white/80">
            {streakCardConsistencyLine(streak)}
          </p>
          {bestStreak > 0 && (
            <p className="mt-0.5 text-[12px] text-white/55">
              {streakCardPersonalBestLine(streak >= bestStreak && streak > 0, bestStreak)}
            </p>
          )}
          {next != null && (
            <p className="mt-0.5 text-[12px] text-white/60">
              {streakNextCheckpointLine(streak, next)}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-[11px] font-medium text-white/50 tabular-nums">
            {streak} of 30 days
          </p>
          <div className="relative h-1.5 w-full rounded-full" style={{ background: "rgba(255,255,255,0.18)" }}>
            <motion.div
              className="h-full rounded-full bg-white/90"
              initial={{ width: 0 }}
              animate={{ width: `${fillPct}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
