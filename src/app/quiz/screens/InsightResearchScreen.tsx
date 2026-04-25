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
        source="Goal-clarity research"
        stat={{ value: "6×", caption: "more likely to achieve" }}
        headline="People who define their goals clearly hit them six times more often."
        body="Behavio's quiz uses the same clarity framework. You've already started — the next questions sharpen it."
        byline="Source · Dominican University · n=149 · peer-reviewed"
      />
      <div style={{ marginTop: 32 }}>
        <CTAButton label="That's exactly why I'm here →" onClick={onNext} />
      </div>
    </motion.div>
  );
}
