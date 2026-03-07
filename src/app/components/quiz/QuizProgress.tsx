"use client";

import { motion } from "framer-motion";

type Props = {
  current: number;
  total: number;
  name?: string;
};

export function QuizProgress({ current, total, name }: Props) {
  const pct = Math.round(((current + 1) / total) * 100);

  return (
    <div className="w-full px-1">
      <div className="mb-2 flex items-center justify-end">
        <span className="text-[12px] text-[#6A6A6A]">
          {name ? `${name} is ${pct}% done` : `${pct}% done`}
        </span>
      </div>

      <div className="relative h-[6px] w-full overflow-hidden rounded-full bg-[#E0E0E0]">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#6FCF97] to-[#2D9CDB]"
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
        <motion.div
          className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-white shadow-[0_0_8px_white]"
          animate={{ left: `calc(${pct}% - 6px)` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          style={{ willChange: "left" }}
        />
      </div>
    </div>
  );
}
