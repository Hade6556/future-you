"use client";

import { motion } from "framer-motion";
import InsightCard from "../components/InsightCard";
import CTAButton from "../components/CTAButton";

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
      <InsightCard
        headline="🚫 Books, courses, and willpower aren't enough."
        body="The missing ingredient is a system that adapts to YOU — your energy, your schedule, your setbacks. That's what Behavio's AI builds."
      />
      <div style={{ marginTop: 32 }}>
        <CTAButton label="Build my adaptive system →" onClick={onNext} />
      </div>
    </motion.div>
  );
}
