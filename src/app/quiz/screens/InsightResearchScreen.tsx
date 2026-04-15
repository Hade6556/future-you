"use client";

import { motion } from "framer-motion";
import InsightCard from "../components/InsightCard";
import CTAButton from "../components/CTAButton";

export default function InsightResearchScreen({ onNext }: { onNext: () => void }) {
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
        headline="📊 People who define their goals clearly are 6x more likely to achieve them."
        source="Goal-setting research, Dominican University"
        body="Behavio's quiz is built on the same clarity framework. You've already started."
      />
      <div style={{ marginTop: 32 }}>
        <CTAButton label="That's exactly why I'm here →" onClick={onNext} />
      </div>
    </motion.div>
  );
}
