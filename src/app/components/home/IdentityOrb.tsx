"use client";

import { motion } from "framer-motion";

type Props = { size?: number };

/** Gradient orb for identity section—avoids recursive/screenshot imagery. */
export function IdentityOrb({ size = 160 }: Props) {
  return (
    <motion.div
      className="rounded-full shadow-lg"
      style={{
        width: size,
        height: size,
        background:
          "radial-gradient(ellipse 70% 70% at 35% 30%, var(--orb-gradient-start), var(--orb-gradient-end) 85%)",
        boxShadow:
          "0 8px 24px -8px var(--accent-primary-glow-strong), inset 0 1px 0 rgba(255,255,255,0.2)",
      }}
      animate={{ scale: [1, 1.03, 1] }}
      transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
    />
  );
}
