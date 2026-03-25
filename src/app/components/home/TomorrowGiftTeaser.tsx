"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { usePlanStore } from "../../state/planStore";
import { pickReward } from "../../utils/giftEngine";

function getMsUntilMidnight(): number {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return midnight.getTime() - now.getTime();
}

function formatCountdown(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

type Props = {
  dayNumber: number;
};

export function TomorrowGiftTeaser({ dayNumber }: Props) {
  const planId = usePlanStore((s) => s.planId);
  const tomorrowReward = pickReward(planId, dayNumber + 1);

  const [countdown, setCountdown] = useState(() => formatCountdown(getMsUntilMidnight()));

  useEffect(() => {
    const id = setInterval(() => {
      setCountdown(formatCountdown(getMsUntilMidnight()));
    }, 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      className="px-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45 }}
    >
      <p
        className="mb-2 px-1 text-[10px] font-black uppercase tracking-widest"
        style={{ color: "var(--text-muted)" }}
      >
        Tomorrow&apos;s gift
      </p>

      <div
        className="relative overflow-hidden rounded-2xl px-6 py-5"
        style={{
          background: "linear-gradient(135deg, rgba(255,206,92,0.07) 0%, rgba(162,143,255,0.05) 100%)",
          border: "1.5px dashed rgba(255,206,92,0.25)",
        }}
      >
        <div className="flex items-center gap-4">
          {/* Blurred icon with lock overlay */}
          <div className="relative flex h-14 w-14 flex-shrink-0 items-center justify-center">
            <span
              className="text-[44px] leading-none"
              style={{ filter: "blur(7px)", userSelect: "none" }}
              aria-hidden
            >
              {tomorrowReward.icon}
            </span>
            {/* Lock overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[22px]" aria-hidden>🔒</span>
            </div>
          </div>

          {/* Text */}
          <div className="min-w-0 flex-1">
            <p
              className="text-[15px] font-bold leading-snug"
              style={{ color: "var(--text-primary)" }}
            >
              Tomorrow&apos;s gift is waiting...
            </p>
            <p
              className="mt-0.5 text-[12px] font-semibold"
              style={{ color: "var(--text-muted)" }}
            >
              Unlocks in {countdown}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
