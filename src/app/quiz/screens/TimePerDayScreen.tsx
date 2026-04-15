"use client";

import { motion } from "framer-motion";
import QuizHeader from "../components/QuizHeader";
import OptionRow from "../components/OptionRow";
import { useQuizStore } from "../store/quizStore";
import { trackAnswerSelected } from "../utils/analytics";

const OPTIONS = [
  "⚡ 5 min — I'm super busy but committed",
  "⏱️ 15 min — I can carve out time most days",
  "🔥 30 min — Growth is my priority right now",
  "🤷 Not sure — help me figure this out",
];

export default function TimePerDayScreen({ onNext }: { onNext: () => void }) {
  const dailyTime = useQuizStore((s) => s.answers.dailyTime);
  const setDailyTime = useQuizStore((s) => s.setDailyTime);

  function handleSelect(opt: string) {
    setDailyTime(opt);
    trackAnswerSelected("daily_time", opt);
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
        question="How much time can you realistically give each day?"
        subhead="Your daily tasks will fit exactly within this window."
      />
      <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
        {OPTIONS.map((opt) => (
          <OptionRow
            key={opt}
            label={opt}
            selected={dailyTime === opt}
            onSelect={() => handleSelect(opt)}
          />
        ))}
      </div>
    </motion.div>
  );
}
