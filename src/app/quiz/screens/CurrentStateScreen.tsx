"use client";

import { motion } from "framer-motion";
import QuizHeader from "../components/QuizHeader";
import OptionRow from "../components/OptionRow";
import { useQuizStore } from "../store/quizStore";
import { trackAnswerSelected } from "../utils/analytics";

const OPTIONS = [
  "😤 Stuck and frustrated — I've tried before and it didn't stick",
  "🧊 Aware but paralysed — I know what to do, I just can't start",
  "🌪️ Ready but scattered — motivated but no clear system",
  "🚂 Building momentum — I have some wins but need real structure",
];

export default function CurrentStateScreen({ onNext }: { onNext: () => void }) {
  const currentState = useQuizStore((s) => s.answers.currentState);
  const setCurrentState = useQuizStore((s) => s.setCurrentState);

  function handleSelect(opt: string) {
    setCurrentState(opt);
    trackAnswerSelected("current_state", opt);
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
      <QuizHeader question="Where are you right now, honestly?" />
      <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
        {OPTIONS.map((opt) => (
          <OptionRow
            key={opt}
            label={opt}
            selected={currentState === opt}
            onSelect={() => handleSelect(opt)}
          />
        ))}
      </div>
    </motion.div>
  );
}
