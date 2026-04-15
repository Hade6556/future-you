"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import CTAButton from "../components/CTAButton";
import { useQuizStore } from "../store/quizStore";
import { calculateArchetype, ARCHETYPE_DESCRIPTIONS } from "../utils/archetypeScoring";
import { trackAnswerSelected } from "../utils/analytics";
import { ACCENT, TEXT_HI, TEXT_MID, accentRgba } from "@/app/theme";

export default function ArchetypeRevealScreen({ onNext }: { onNext: () => void }) {
  const answers = useQuizStore((s) => s.answers);
  const setArchetype = useQuizStore((s) => s.setArchetype);

  const archetype = calculateArchetype(answers);
  const info = ARCHETYPE_DESCRIPTIONS[archetype];

  useEffect(() => {
    setArchetype(archetype);
    trackAnswerSelected("archetype", archetype);
  }, [archetype, setArchetype]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.4 }}
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-apercu), sans-serif",
          fontSize: 14,
          color: TEXT_MID,
          margin: "0 0 12px",
        }}
      >
        Based on your answers, you&apos;re a...
      </p>

      <div style={{ fontSize: 56, lineHeight: 1, marginBottom: 12 }}>
        {info.emoji}
      </div>

      <h1
        style={{
          fontFamily: "var(--font-barlow-condensed), sans-serif",
          fontWeight: 800,
          fontStyle: "italic",
          fontSize: 38,
          color: ACCENT,
          margin: "0 0 16px",
          lineHeight: 1.1,
        }}
      >
        {archetype}
      </h1>

      <p
        style={{
          fontFamily: "var(--font-apercu), sans-serif",
          fontSize: 15,
          color: TEXT_MID,
          margin: "0 0 24px",
          lineHeight: 1.6,
          maxWidth: 320,
        }}
      >
        {info.description}
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 36, flexWrap: "wrap", justifyContent: "center" }}>
        {info.traits.map((trait) => (
          <span
            key={trait}
            style={{
              padding: "6px 14px",
              borderRadius: 100,
              background: accentRgba(0.10),
              backdropFilter: "blur(8px)",
              border: `1px solid ${accentRgba(0.2)}`,
              color: ACCENT,
              fontFamily: "var(--font-apercu), sans-serif",
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            {trait}
          </span>
        ))}
      </div>

      <CTAButton label="This is exactly me →" onClick={onNext} />
    </motion.div>
  );
}
