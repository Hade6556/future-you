"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { NorthStarStatus } from "./status";
import { ModeCard } from "./ModeCard";

const STAGGER = 0.04; /* 40ms */
const MOTION_DURATION = 0.25;

type CardStackProps = {
  chips: NorthStarStatus["chips"];
  onClose: () => void;
  enableMotion: boolean;
};

export function CardStack({ chips, onClose, enableMotion }: CardStackProps) {
  const reduceMotion = useReducedMotion();
  const duration = reduceMotion ? 0.15 : MOTION_DURATION;

  return (
    <div className="flex flex-col gap-4" data-testid="card-stack">
      {chips.map((chip, i) => (
        <motion.div
          key={chip.id}
          initial={enableMotion && !reduceMotion ? { opacity: 0, y: 12 } : undefined}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration, delay: enableMotion ? STAGGER * (i + 1) : 0, ease: "easeOut" }}
        >
          <ModeCard chip={chip} onClose={onClose} enableMotion={enableMotion} />
        </motion.div>
      ))}
    </div>
  );
}
