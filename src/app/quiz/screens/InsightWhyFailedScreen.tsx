"use client";

import { motion } from "framer-motion";
import CTAButton from "../components/CTAButton";
import { ACCENT, TEXT_HI, TEXT_MID, TEXT_LO, accentRgba } from "@/app/theme";

const TRIED = ["Books.", "Courses.", "Streaks.", "Willpower."];

export default function InsightWhyFailedScreen({ onNext }: { onNext: () => void }) {
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
      <p
        style={{
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: 11,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: ACCENT,
          margin: "0 0 18px",
        }}
      >
        ↳ Why nothing stuck
      </p>

      {/* Tried list — struck-through */}
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: "0 0 22px",
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        {TRIED.map((item, i) => (
          <motion.li
            key={item}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.08 + i * 0.08, duration: 0.3 }}
            style={{
              fontFamily: "var(--font-barlow-condensed), sans-serif",
              fontWeight: 900,
              fontStyle: "italic",
              fontSize: "clamp(36px, 8.4vw, 56px)",
              lineHeight: 0.95,
              letterSpacing: "-0.025em",
              color: TEXT_LO,
              textDecoration: "line-through",
              textDecorationColor: accentRgba(0.45),
              textDecorationThickness: 2,
            }}
          >
            {item}
          </motion.li>
        ))}
      </ul>

      <motion.h2
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: TRIED.length * 0.08 + 0.1, duration: 0.4 }}
        style={{
          fontFamily: "var(--font-barlow-condensed), sans-serif",
          fontWeight: 900,
          fontSize: "clamp(32px, 7vw, 44px)",
          color: TEXT_HI,
          lineHeight: 0.98,
          letterSpacing: "-0.025em",
          margin: "0 0 18px",
        }}
      >
        None of them{" "}
        <span style={{ fontStyle: "italic", color: ACCENT }}>adapt to you.</span>
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: TRIED.length * 0.08 + 0.2, duration: 0.4 }}
        style={{
          fontFamily: "var(--font-apercu), sans-serif",
          fontSize: 15,
          color: TEXT_MID,
          margin: "0 0 12px",
          lineHeight: 1.55,
        }}
      >
        That&apos;s why nothing stuck. The tool was wrong, not you. Behavio
        builds the missing piece — a plan that{" "}
        <span style={{ color: TEXT_HI, fontWeight: 600 }}>re-paces around your week</span>{" "}
        instead of breaking the moment life does.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: TRIED.length * 0.08 + 0.3, duration: 0.4 }}
        style={{ marginTop: 32 }}
      >
        <CTAButton label="Build the system that fits →" onClick={onNext} />
      </motion.div>
    </motion.div>
  );
}
