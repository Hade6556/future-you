"use client";

import { motion } from "framer-motion";
import QuizHeader from "../components/QuizHeader";
import OptionRow from "../components/OptionRow";
import CTAButton from "../components/CTAButton";
import { useQuizStore, type GoalArea } from "../store/quizStore";
import { trackAnswerSelected } from "../utils/analytics";

const EMOJI_MAP: Record<GoalArea, string> = {
  "Career & Purpose": "🚀",
  "Money & Financial Freedom": "💰",
  "Relationships & Connection": "❤️",
  "Health & Energy": "⚡",
  "Mindset & Personal Growth": "🧠",
};

const OPTIONS: GoalArea[] = [
  "Career & Purpose",
  "Money & Financial Freedom",
  "Relationships & Connection",
  "Health & Energy",
  "Mindset & Personal Growth",
];

export default function GoalAreaScreen({ onNext }: { onNext: () => void }) {
  const goalArea = useQuizStore((s) => s.answers.goalArea);
  const setGoalArea = useQuizStore((s) => s.setGoalArea);

  function handleSelect(opt: GoalArea) {
    setGoalArea(opt);
    trackAnswerSelected("goal_area", opt);
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
        question="What area of your life feels most stuck right now?"
        subhead="Your entire 90-day plan will be built around this."
      />
      <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
        {OPTIONS.map((opt) => (
          <OptionRow
            key={opt}
            label={`${EMOJI_MAP[opt]}  ${opt}`}
            selected={goalArea === opt}
            onSelect={() => handleSelect(opt)}
          />
        ))}
      </div>
      <div style={{ marginTop: 24 }}>
        <CTAButton label="Continue" onClick={onNext} disabled={!goalArea} />
      </div>
    </motion.div>
  );
}
