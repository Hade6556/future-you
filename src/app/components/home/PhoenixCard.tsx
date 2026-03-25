"use client";

import { motion } from "framer-motion";

type Props = {
  priorStreak: number;
  onStart: () => void;
};

export function PhoenixCard({ priorStreak, onStart }: Props) {
  const ghostDots = Math.min(priorStreak, 10);

  return (
    <motion.div
      className="mx-4 overflow-hidden rounded-2xl p-6"
      style={{
        background: "linear-gradient(135deg, rgba(255,100,50,0.12) 0%, rgba(162,50,20,0.08) 100%)",
        border: "1.5px solid rgba(255,100,50,0.25)",
      }}
      initial={{ opacity: 0, scale: 0.92, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 220, damping: 22, delay: 0.1 }}
    >
      {/* Icon */}
      <motion.div
        className="mb-4 text-center text-[48px]"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.2 }}
        aria-hidden
      >
        🦅
      </motion.div>

      {/* Copy */}
      <motion.div
        className="mb-5 text-center"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <p
          className="text-[22px] font-extrabold leading-snug"
          style={{ color: "var(--text-primary)" }}
        >
          You fell off.
        </p>
        <p
          className="mt-1.5 text-[14px] leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          Every legend has a chapter like this.
        </p>
      </motion.div>

      {/* Ghost chain — prior streak faded + today's empty dot */}
      {priorStreak > 0 && (
        <motion.div
          className="mb-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <p
            className="mb-2 text-center text-[10px] font-bold uppercase tracking-widest"
            style={{ color: "var(--text-muted)", opacity: 0.6 }}
          >
            Your {priorStreak}-day chain
          </p>
          <div className="flex items-center justify-center gap-[4px]">
            {Array.from({ length: ghostDots }, (_, i) => (
              <div
                key={i}
                className="h-[9px] rounded-full"
                style={{
                  width: `${Math.min(28, Math.floor(220 / ghostDots))}px`,
                  background: "var(--accent-primary)",
                  opacity: 0.2,
                }}
              />
            ))}
            {/* Today's empty pulsing dot */}
            <div
              className="animate-chain-dot-pulse h-[9px] rounded-full"
              style={{
                width: "28px",
                background: "var(--accent-primary)",
              }}
            />
          </div>
        </motion.div>
      )}

      {/* CTA */}
      <motion.button
        onClick={onStart}
        className="w-full rounded-2xl py-4 text-[15px] font-bold text-white"
        style={{
          background: "linear-gradient(135deg, #ff6432 0%, #e84000 100%)",
        }}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        whileTap={{ scale: 0.97 }}
      >
        Start My Phoenix Run
      </motion.button>
    </motion.div>
  );
}
