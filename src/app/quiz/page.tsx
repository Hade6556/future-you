"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { QUIZ_SCREENS } from "../data/quiz";
import { usePlanStore } from "../state/planStore";
import { QuizProgress } from "../components/quiz/QuizProgress";
import { InsightCard } from "../components/quiz/InsightCard";
import {
  BinaryQuestion,
  TileSelectQuestion,
  MultiSelectQuestion,
  ScaleQuestion,
  EmojiGridQuestion,
  NameInputQuestion,
  EmailInputQuestion,
} from "../components/quiz/QuestionFormats";
import type { ArchetypeId } from "../types/plan";

export default function QuizPage() {
  const router = useRouter();
  const store = usePlanStore();
  const [currentScreen, setCurrentScreen] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number | number[] | string>>({});
  const [userName, setLocalName] = useState("");

  const screen = QUIZ_SCREENS[currentScreen];
  const total = QUIZ_SCREENS.length;

  const advance = useCallback(() => {
    if (currentScreen >= total - 1) {
      router.push("/quiz/analyzing");
      return;
    }
    setCurrentScreen((n) => n + 1);
  }, [currentScreen, total, router]);

  const handleAnswer = useCallback(
    (screenId: string, value: number | number[] | string) => {
      setAnswers((prev) => ({ ...prev, [screenId]: value }));

      const scr = QUIZ_SCREENS.find((s) => s.id === screenId);
      if (!scr) {
        advance();
        return;
      }

      if (scr.id === "s2_gender" && typeof value === "number" && scr.options) {
        const label = scr.options[value]?.label ?? "";
        store.setGender(label);
      }

      if (scr.id === "s3_ambition" && typeof value === "number" && scr.options) {
        const opt = scr.options[value];
        if (opt?.ambition) store.setAmbitionType(opt.ambition);
      }

      if (scr.id === "s14_name" && typeof value === "string") {
        setLocalName(value);
        store.setUserName(value);
      }

      if (scr.id === "s15_email" && typeof value === "string") {
        store.setEmail(value);

        const scoreMap: Record<string, number> = {};
        for (const [sid, val] of Object.entries({ ...answers, [screenId]: value })) {
          const s = QUIZ_SCREENS.find((q) => q.id === sid);
          if (!s?.options) continue;

          if (typeof val === "number" && s.options[val]) {
            for (const [k, v] of Object.entries(s.options[val].scores)) {
              scoreMap[k] = (scoreMap[k] ?? 0) + v;
            }
          } else if (Array.isArray(val)) {
            for (const idx of val) {
              if (s.options[idx]) {
                for (const [k, v] of Object.entries(s.options[idx].scores)) {
                  scoreMap[k] = (scoreMap[k] ?? 0) + v;
                }
              }
            }
          }
        }

        const best = Object.entries(scoreMap).sort((a, b) => b[1] - a[1])[0];
        const archetypeId = (best?.[0] ?? "steady") as ArchetypeId;
        const ambition = store.ambitionType ?? "wellness";

        store.completeQuiz(archetypeId, ambition);
        advance();
        return;
      }

      if (scr.autoAdvance !== false || scr.type === "binary" || scr.type === "tile-select" || scr.type === "emoji-grid") {
        advance();
      } else {
        advance();
      }
    },
    [advance, answers, store],
  );

  const renderQuestion = () => {
    if (!screen) return null;

    if (screen.type === "insight-card") {
      return <InsightCard screen={screen} onContinue={advance} />;
    }

    const opts = screen.options ?? [];

    switch (screen.type) {
      case "binary":
        return (
          <BinaryQuestion
            options={opts}
            onSelect={(idx) => handleAnswer(screen.id, idx)}
          />
        );
      case "tile-select":
        return (
          <TileSelectQuestion
            options={opts}
            onSelect={(idx) => handleAnswer(screen.id, idx)}
          />
        );
      case "multi-select":
        return (
          <MultiSelectQuestion
            options={opts}
            onSelect={(indices) => handleAnswer(screen.id, indices)}
          />
        );
      case "scale":
        return (
          <ScaleQuestion
            options={opts}
            onSelect={(idx) => handleAnswer(screen.id, idx)}
          />
        );
      case "emoji-grid":
        return (
          <EmojiGridQuestion
            options={opts}
            onSelect={(idx) => handleAnswer(screen.id, idx)}
          />
        );
      case "name-input":
        return (
          <NameInputQuestion
            onSubmit={(name) => handleAnswer(screen.id, name)}
          />
        );
      case "email-input":
        return (
          <EmailInputQuestion
            onSubmit={(email) => handleAnswer(screen.id, email)}
          />
        );
      default:
        return null;
    }
  };

  const questionText = screen?.question?.replace("{name}", userName || "you") ?? "";

  return (
    <div className="relative flex min-h-dvh flex-col bg-[#F8F6F1] px-6 pb-10 pt-[max(56px,env(safe-area-inset-top,16px))]">
      <div className="mx-auto w-full max-w-md">
        <QuizProgress current={currentScreen} total={total} name={userName || undefined} />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="mt-8"
          >
            {screen?.type !== "insight-card" && questionText && (
              <h2
                className="mb-8 text-[22px] font-semibold leading-snug text-[#121212]"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {questionText}
              </h2>
            )}

            {screen?.subtext && screen.type !== "insight-card" && (
              <p className="-mt-4 mb-6 text-[14px] text-[#6A6A6A]">{screen.subtext}</p>
            )}

            {renderQuestion()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
