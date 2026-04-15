"use client";

import { motion } from "framer-motion";
import QuizHeader from "../components/QuizHeader";
import OptionChip from "../components/OptionChip";
import CTAButton from "../components/CTAButton";
import { useQuizStore } from "../store/quizStore";
import { trackAnswerSelected } from "../utils/analytics";

const OPTIONS = [
  "📚 Read self-help books",
  "🎓 Took online courses",
  "🧑‍🏫 Hired a coach",
  "🛋️ Tried therapy",
  "📲 Used habit apps",
  "🎧 Watched YouTube / podcasts",
  "📝 Set goals but lost track",
];

export default function PastAttemptsScreen({ onNext }: { onNext: () => void }) {
  const pastAttempts = useQuizStore((s) => s.answers.pastAttempts);
  const setPastAttempts = useQuizStore((s) => s.setPastAttempts);

  function toggle(opt: string) {
    const next = pastAttempts.includes(opt)
      ? pastAttempts.filter((a) => a !== opt)
      : [...pastAttempts, opt];
    setPastAttempts(next);
    trackAnswerSelected("past_attempts", next);
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
        question="What have you tried before to improve yourself?"
        subhead="Select all that apply"
      />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, flex: 1, alignContent: "start" }}>
        {OPTIONS.map((opt) => (
          <OptionChip
            key={opt}
            label={opt}
            selected={pastAttempts.includes(opt)}
            onToggle={() => toggle(opt)}
          />
        ))}
      </div>
      <div style={{ marginTop: 24 }}>
        <CTAButton
          label="Continue"
          onClick={onNext}
          disabled={pastAttempts.length === 0}
        />
      </div>
    </motion.div>
  );
}
