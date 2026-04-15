"use client";

import { motion } from "framer-motion";
import QuizHeader from "../components/QuizHeader";
import OptionChip from "../components/OptionChip";
import CTAButton from "../components/CTAButton";
import { useQuizStore } from "../store/quizStore";
import { trackAnswerSelected } from "../utils/analytics";

const OPTIONS = [
  "📱 Doomscrolling",
  "🏃 Skipping workouts",
  "😴 Poor sleep",
  "🍔 Overeating / junk food",
  "🍷 Alcohol",
  "💭 Negative self-talk",
  "⏳ Procrastinating on priorities",
  "💸 Mindless spending",
  "🏠 Isolating socially",
];

export default function BadHabitsScreen({ onNext }: { onNext: () => void }) {
  const badHabits = useQuizStore((s) => s.answers.badHabits);
  const setBadHabits = useQuizStore((s) => s.setBadHabits);

  function toggle(opt: string) {
    const next = badHabits.includes(opt)
      ? badHabits.filter((h) => h !== opt)
      : [...badHabits, opt];
    setBadHabits(next);
    trackAnswerSelected("bad_habits", next);
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
        question="What habits are stealing your potential?"
        subhead="Your 90-day plan will specifically target these."
      />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, flex: 1, alignContent: "start" }}>
        {OPTIONS.map((opt) => (
          <OptionChip
            key={opt}
            label={opt}
            selected={badHabits.includes(opt)}
            onToggle={() => toggle(opt)}
          />
        ))}
      </div>
      <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 10 }}>
        <CTAButton
          label="Continue"
          onClick={onNext}
          disabled={badHabits.length === 0}
        />
        <CTAButton
          label="I don't have habits I want to break"
          onClick={onNext}
          variant="ghost"
        />
      </div>
    </motion.div>
  );
}
