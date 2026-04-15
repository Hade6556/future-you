"use client";

import { motion } from "framer-motion";
import CTAButton from "../components/CTAButton";
import { ACCENT, TEXT_HI, TEXT_MID, accentRgba } from "@/app/theme";

export default function EmpathyScreen({ onNext }: { onNext: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.25 }}
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          background: accentRgba(0.12),
          backdropFilter: "blur(8px)",
          border: `1px solid ${accentRgba(0.2)}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 24,
          fontSize: 22,
          color: ACCENT,
        }}
      >
        🫂
      </div>

      <h2
        style={{
          fontFamily: "var(--font-barlow-condensed), sans-serif",
          fontWeight: 700,
          fontStyle: "italic",
          fontSize: 28,
          color: TEXT_HI,
          margin: "0 0 16px",
          lineHeight: 1.2,
        }}
      >
        You&apos;re carrying a lot right now.
      </h2>

      <p
        style={{
          fontFamily: "var(--font-apercu), sans-serif",
          fontSize: 15,
          color: TEXT_MID,
          margin: "0 0 40px",
          lineHeight: 1.6,
        }}
      >
        Burnout is one of the most common reasons people feel stuck — not
        laziness, not lack of willpower. Behavio is specifically designed to help
        you rebuild without burning out again.
      </p>

      <CTAButton label="I'm ready to change that →" onClick={onNext} />
    </motion.div>
  );
}
