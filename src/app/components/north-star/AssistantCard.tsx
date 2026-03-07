"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { NorthStarStatus } from "./status";
import { HeroCTA } from "./HeroCTA";
import { CardStack } from "./CardStack";
import { Sheet } from "./Sheet";

type AssistantCardProps = {
  status: NorthStarStatus;
  onClose: () => void;
};

export function AssistantCard({ status, onClose }: AssistantCardProps) {
  const reduceMotion = useReducedMotion();
  const duration = reduceMotion ? 0.15 : 0.25;
  const enableMotion = !reduceMotion;

  return (
    <Sheet onClose={onClose}>
      <HeroCTA
        headline={status.heroHeadline}
        ctaLabel={status.heroCtaLabel}
        ctaHref={status.heroCtaHref}
        onClose={onClose}
      />

      <CardStack chips={status.chips} onClose={onClose} enableMotion={enableMotion} />

      <div className="flex flex-col gap-2 pt-0">
        <div className="flex items-center justify-between plan-supporting">
          <span className="font-medium text-slate-400">Streak</span>
          <span className="font-semibold text-white">
            {status.streak} {status.streak === 1 ? "day" : "days"}
          </span>
        </div>
        <div
          className="h-1.5 overflow-hidden rounded-full bg-white/10"
          role="progressbar"
          aria-valuenow={Math.min(100, status.streak * 4)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <motion.div
            className="h-full rounded-full"
            style={{
              background: "var(--plasma-glow)",
              ...(enableMotion ? { animation: "streak-pulse 2.5s ease-in-out infinite" } : {}),
            }}
            initial={false}
            animate={{
              width: `${Math.min(100, status.streak * 4)}%`,
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>
    </Sheet>
  );
}
