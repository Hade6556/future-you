"use client";

import { motion } from "framer-motion";
import QuizHeader from "../components/QuizHeader";
import OptionChip from "../components/OptionChip";
import CTAButton from "../components/CTAButton";
import { useQuizStore } from "../store/quizStore";
import { trackAnswerSelected } from "../utils/analytics";

const OPTIONS = [
  "🦥 Procrastination",
  "🎯 Lack of focus",
  "🔁 Bad habits",
  "😰 Chronic stress",
  "🪫 Low energy",
  "🌀 Overthinking",
  "😨 Fear of failure",
  "🧭 No clear direction",
  "📉 Inconsistency",
  "🔥 Burnout",
];

export default function ProblemsScreen({ onNext }: { onNext: () => void }) {
  const problems = useQuizStore((s) => s.answers.problems);
  const setProblems = useQuizStore((s) => s.setProblems);

  function toggle(opt: string) {
    const next = problems.includes(opt)
      ? problems.filter((p) => p !== opt)
      : [...problems, opt];
    setProblems(next);
    trackAnswerSelected("problems", next);
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.25 }}
      style={{ flex: 1, display: "flex", flexDirection: "column" }}
    >
      <QuizHeader
        question="What's getting in your way?"
        subhead="Your AI coach has seen it all. No judgment."
      />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, flex: 1, alignContent: "start" }}>
        {OPTIONS.map((opt) => (
          <OptionChip
            key={opt}
            label={opt}
            selected={problems.includes(opt)}
            onToggle={() => toggle(opt)}
          />
        ))}
      </div>
      <div style={{ marginTop: 24 }}>
        <CTAButton
          label="Continue"
          onClick={onNext}
          disabled={problems.length === 0}
        />
      </div>
    </motion.div>
  );
}
