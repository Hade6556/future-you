"use client";

import { motion } from "framer-motion";
import QuizHeader from "../components/QuizHeader";
import OptionRow from "../components/OptionRow";
import { useQuizStore } from "../store/quizStore";
import { trackAnswerSelected } from "../utils/analytics";

const OPTIONS = ["👨 Man", "👩 Woman", "🌈 Non-binary", "🤐 Prefer not to say"];

export default function GenderScreen({ onNext }: { onNext: () => void }) {
  const gender = useQuizStore((s) => s.answers.gender);
  const setGender = useQuizStore((s) => s.setGender);

  function handleSelect(opt: string) {
    setGender(opt);
    trackAnswerSelected("gender", opt);
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
      <QuizHeader
        question="How do you identify?"
        subhead="Helps us tailor your coaching voice."
      />
      <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
        {OPTIONS.map((opt) => (
          <OptionRow
            key={opt}
            label={opt}
            selected={gender === opt}
            onSelect={() => handleSelect(opt)}
          />
        ))}
      </div>
    </motion.div>
  );
}
