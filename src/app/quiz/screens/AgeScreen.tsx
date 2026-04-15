"use client";

import { motion } from "framer-motion";
import QuizHeader from "../components/QuizHeader";
import OptionRow from "../components/OptionRow";
import { useQuizStore } from "../store/quizStore";
import { trackAnswerSelected } from "../utils/analytics";

const OPTIONS = [
  "🌱 18–24 — Still figuring it all out",
  "🏗️ 25–34 — Building the foundation",
  "🔥 35–44 — Leveling up or pivoting",
  "🎯 45–54 — Hitting my stride",
  "✨ 55+ — Redefining what matters",
];

export default function AgeScreen({ onNext }: { onNext: () => void }) {
  const ageRange = useQuizStore((s) => s.answers.ageRange);
  const setAgeRange = useQuizStore((s) => s.setAgeRange);

  function handleSelect(opt: string) {
    setAgeRange(opt);
    trackAnswerSelected("age_range", opt);
    setTimeout(onNext, 250);
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.25 }}
      style={{ flex: 1, display: "flex", flexDirection: "column" }}
    >
      <QuizHeader question="Which stage of life are you in?" />
      <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
        {OPTIONS.map((opt) => (
          <OptionRow
            key={opt}
            label={opt}
            selected={ageRange === opt}
            onSelect={() => handleSelect(opt)}
          />
        ))}
      </div>
    </motion.div>
  );
}
