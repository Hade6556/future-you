"use client";

import { motion } from "framer-motion";

type Props = {
  current: number;
  total: number;
  name?: string;
  milestoneLabel?: string;
};

export function QuizProgress({ current, total }: Props) {
  const pct = Math.round(((current + 1) / total) * 100);

  return (
    <div className="flex w-full items-center gap-3">
      <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-border">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-primary"
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>
      <span className="shrink-0 text-[12px] font-medium text-muted-foreground">
        {current + 1}/{total}
      </span>
    </div>
  );
}
