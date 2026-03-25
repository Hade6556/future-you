"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePlanStore } from "../../state/planStore";

const MILESTONES = [5, 7, 14, 30];
const CONFETTI_COLORS = ["#7B6BA8", "#FFCE5C", "#9BB068", "#A28FFF", "#BDA193", "#ffffff"];

function getStreakCopy(streak: number): string {
  if (streak >= 30) return "legendary 🏆";
  if (streak >= 14) return "unstoppable";
  if (streak >= 7) return "on fire 🔥";
  if (streak >= 4) return "building momentum";
  return "warming up";
}

function getNextMilestone(streak: number): number | null {
  return MILESTONES.find((m) => m > streak) ?? null;
}

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
}

/** Green feature card — shows current streak with animated thermometer + milestone confetti. */
export function StreakCard() {
  const streak = usePlanStore((s) => s.streak);
  const bestStreak = usePlanStore((s) => s.bestStreak);
  const streakShields = usePlanStore((s) => s.streakShields);

  const isMilestone = MILESTONES.includes(streak);
  const firedRef = useRef(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (isMilestone && !firedRef.current && streak > 0) {
      firedRef.current = true;
      const burst: Particle[] = Array.from({ length: 10 }, (_, i) => ({
        id: i,
        x: randomBetween(-50, 50),
        y: randomBetween(-60, -20),
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        size: randomBetween(5, 9),
      }));
      setParticles(burst);
      setTimeout(() => setParticles([]), 900);
    }
  }, [isMilestone, streak]);

  // Thermometer fill: caps at 30 days
  const fillPct = Math.min((streak / 30) * 100, 100);
  const milestone7Pct = (7 / 30) * 100;

  return (
    <Link href="/explore" className="no-underline shrink-0">
      <div
        className="relative flex h-[200px] w-[163px] flex-col justify-between rounded-[32px] p-5"
        style={{
          background: "var(--accent-secondary)",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='38' height='38'%3E%3Ccircle cx='19' cy='8' r='5' fill='rgba(255,255,255,0.13)'/%3E%3Ccircle cx='8' cy='19' r='5' fill='rgba(255,255,255,0.13)'/%3E%3Ccircle cx='19' cy='30' r='5' fill='rgba(255,255,255,0.13)'/%3E%3Ccircle cx='30' cy='19' r='5' fill='rgba(255,255,255,0.13)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "38px 38px",
          boxShadow: "0 16px 32px rgba(75,52,37,0.10)",
          overflow: "visible",
        }}
      >
        {/* Confetti particles */}
        <AnimatePresence>
          {particles.map((p) => (
            <motion.span
              key={p.id}
              className="pointer-events-none absolute rounded-full"
              style={{
                width: p.size,
                height: p.size,
                background: p.color,
                top: "50%",
                left: "50%",
                translateX: "-50%",
                translateY: "-50%",
              }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{ x: p.x, y: p.y, opacity: 0, scale: 0.4 }}
              exit={{}}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          ))}
        </AnimatePresence>

        {/* Icon */}
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            stroke="white"
            strokeWidth="1.8"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>

        {/* Streak count */}
        <div>
          <div className="flex items-baseline gap-2">
            <p className="text-[40px] font-extrabold leading-none text-white">
              {streak}
            </p>
            {streakShields > 0 && (
              <span className="text-[13px] leading-none" title={`${streakShields} streak shield${streakShields > 1 ? "s" : ""}`}>
                🛡️{streakShields > 1 && <span className="text-[10px] font-bold text-white/80">×{streakShields}</span>}
              </span>
            )}
          </div>
          <p className="text-[12px] font-semibold text-white/80">
            {getStreakCopy(streak)}
          </p>
          {/* Personal best */}
          {bestStreak > 0 && (
            <p className="mt-0.5 text-[10px] text-white/50">
              {streak >= bestStreak ? "personal best 🏅" : `best: ${bestStreak}`}
            </p>
          )}
          {/* Next milestone teaser */}
          {(() => {
            const next = getNextMilestone(streak);
            return next ? (
              <p className="mt-0.5 text-[10px] text-white/60">
                {next - streak} day{next - streak !== 1 ? "s" : ""} to {next === 7 ? "🔥 7" : next === 14 ? "⚡ 14" : next === 30 ? "🏆 30" : `${next}`}
              </p>
            ) : null;
          })()}
        </div>

        {/* Thermometer bar */}
        <div className="flex flex-col gap-1">
          <div className="relative h-1.5 w-full rounded-full" style={{ background: "rgba(255,255,255,0.2)" }}>
            <motion.div
              className="h-full rounded-full bg-white"
              initial={{ width: 0 }}
              animate={{ width: `${fillPct}%` }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            />
            {/* Milestone tick at day 7 */}
            <div
              className="absolute top-1/2 h-3 w-px -translate-y-1/2"
              style={{ left: `${milestone7Pct}%`, background: "rgba(255,255,255,0.5)" }}
            />
          </div>
          <div className="flex justify-between">
            <span className="text-[9px] text-white/50">0</span>
            {streak >= 7 && (
              <span className="text-[9px] text-white/70">🔥 7</span>
            )}
            <span className="text-[9px] text-white/50">30</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
