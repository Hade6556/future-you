"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { usePlanStore, todayISO } from "../../state/planStore";
import { pickReward } from "../../utils/giftEngine";

type Props = {
  dayNumber: number;
};

export function DailyGift({ dayNumber }: Props) {
  const planId = usePlanStore((s) => s.planId);
  const lastGiftDate = usePlanStore((s) => s.lastGiftDate);
  const setGiftRevealed = usePlanStore((s) => s.setGiftRevealed);

  const today = todayISO();
  const alreadyClaimed = lastGiftDate === today;
  const reward = pickReward(planId, dayNumber);

  // Initialize revealed from persisted state so revisits show immediately
  const [revealed, setRevealed] = useState(alreadyClaimed);

  // Auto-reveal after 400ms — the slot machine moment
  useEffect(() => {
    if (alreadyClaimed || revealed) return;
    const id = setTimeout(() => {
      setRevealed(true);
      setGiftRevealed(reward.type);
    }, 400);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!revealed) {
    // Brief placeholder while countdown fires
    return (
      <div className="px-4">
        <div
          className="rounded-2xl px-6 py-8 text-center"
          style={{
            background: "linear-gradient(135deg, rgba(255,206,92,0.10) 0%, rgba(162,143,255,0.08) 100%)",
            border: "1.5px dashed rgba(255,206,92,0.35)",
          }}
        >
          <span className="animate-gift-bounce inline-block text-[48px]" aria-hidden>🎁</span>
        </div>
      </div>
    );
  }

  // Revealed state — hero presentation with spring entrance
  return (
    <div className="relative px-4">
      {/* Ambient glow behind icon */}
      <motion.div
        className="absolute inset-x-4 top-6 h-20 rounded-full"
        style={{ background: "radial-gradient(ellipse, rgba(255,206,92,0.35) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      />

      <div
        className="relative overflow-hidden rounded-2xl px-6 py-8 text-center"
        style={{
          background: "linear-gradient(135deg, rgba(255,206,92,0.16) 0%, rgba(155,176,104,0.12) 100%)",
          border: "1.5px solid rgba(155,176,104,0.4)",
        }}
      >
        <p
          className="mb-5 text-[12px] font-black uppercase tracking-[0.22em]"
          style={{ color: "var(--accent-secondary)" }}
        >
          Today&apos;s Gift
        </p>

        {/* Slot-machine icon reveal */}
        <motion.span
          className="mb-5 inline-block"
          style={{ fontSize: "64px", display: "inline-block" }}
          aria-hidden
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 380, damping: 18, delay: 0.05 }}
        >
          {reward.icon}
        </motion.span>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <p className="text-[22px] font-extrabold leading-snug" style={{ color: "var(--text-primary)" }}>
            {reward.title}
          </p>
          <p className="mt-2 text-[13px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            {reward.desc}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
