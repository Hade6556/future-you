"use client";

import { motion } from "framer-motion";
import QuizHeader from "../components/QuizHeader";
import OptionRow from "../components/OptionRow";
import CTAButton from "../components/CTAButton";
import { useQuizStore, type GoalArea } from "../store/quizStore";
import { trackAnswerSelected } from "../utils/analytics";

const GOAL_OPTIONS: Record<GoalArea, string[]> = {
  "Career & Purpose": [
    "📈 Get promoted",
    "💡 Start something of my own",
    "🎯 Find meaningful work",
    "🔄 Change industries",
    "⭐ Be recognised for my skills",
  ],
  "Money & Financial Freedom": [
    "🛡️ Build an emergency fund",
    "💳 Pay off debt",
    "📊 Start investing",
    "💵 Increase my income",
    "🏦 Achieve financial independence",
  ],
  "Relationships & Connection": [
    "🗣️ Improve my communication",
    "🤝 Build deeper friendships",
    "💕 Find a partner",
    "🔧 Fix a strained relationship",
    "🚧 Set better boundaries",
  ],
  "Health & Energy": [
    "⚖️ Lose weight",
    "🏋️ Build consistent exercise",
    "😴 Sleep better",
    "🧘 Reduce stress",
    "🥗 Improve nutrition",
  ],
  "Mindset & Personal Growth": [
    "⏰ Stop procrastinating",
    "💪 Build confidence",
    "🌊 Manage anxiety",
    "🔓 Break bad habits",
    "🧩 Think more clearly",
  ],
};

export default function SpecificGoalsScreen({ onNext }: { onNext: () => void }) {
  const goalArea = useQuizStore((s) => s.answers.goalArea);
  const specificGoals = useQuizStore((s) => s.answers.specificGoals);
  const setSpecificGoals = useQuizStore((s) => s.setSpecificGoals);

  const options = goalArea ? GOAL_OPTIONS[goalArea] : [];

  function toggle(opt: string) {
    const next = specificGoals.includes(opt)
      ? specificGoals.filter((g) => g !== opt)
      : [...specificGoals, opt];
    setSpecificGoals(next);
    trackAnswerSelected("specific_goals", next);
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
        question={`What does success look like for you in ${goalArea ?? "your goal area"}?`}
        subhead="Select all that apply."
      />
      <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
        {options.map((opt) => (
          <OptionRow
            key={opt}
            label={opt}
            selected={specificGoals.includes(opt)}
            onSelect={() => toggle(opt)}
          />
        ))}
      </div>
      <div style={{ marginTop: 24 }}>
        <CTAButton
          label="Continue"
          onClick={onNext}
          disabled={specificGoals.length === 0}
        />
      </div>
    </motion.div>
  );
}
