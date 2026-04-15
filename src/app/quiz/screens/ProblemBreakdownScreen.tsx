"use client";

import { motion } from "framer-motion";
import CTAButton from "../components/CTAButton";
import { useQuizStore, type GoalArea } from "../store/quizStore";
import { ACCENT, TEXT_HI, TEXT_LO, TEXT_MID } from "@/app/theme";

const GOAL_HOOK: Record<GoalArea, string> = {
  "Career & Purpose": "the career move you keep postponing",
  "Money & Financial Freedom": "money stress you’re done carrying",
  "Relationships & Connection": "the connection you want to show up for",
  "Health & Energy": "your body and energy — for real this time",
  "Mindset & Personal Growth": "the mindset shift that changes everything else",
};

function TagPill({ children }: { children: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "8px 12px",
        borderRadius: 999,
        fontFamily: "var(--font-apercu), sans-serif",
        fontSize: 13,
        fontWeight: 500,
        color: TEXT_HI,
        background: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.12)",
        lineHeight: 1.3,
      }}
    >
      {children}
    </span>
  );
}

export default function ProblemBreakdownScreen({ onNext }: { onNext: () => void }) {
  const goalArea = useQuizStore((s) => s.answers.goalArea);
  const specificGoals = useQuizStore((s) => s.answers.specificGoals);
  const problems = useQuizStore((s) => s.answers.problems);
  const badHabits = useQuizStore((s) => s.answers.badHabits);
  const currentState = useQuizStore((s) => s.answers.currentState);

  const hook = goalArea ? GOAL_HOOK[goalArea] : "what you said matters most";
  const topGoals = specificGoals.slice(0, 2).filter(Boolean);

  const friction = problems[0] ?? null;

  const clarityLine =
    problems.length + badHabits.length >= 2
      ? "Naming this stuff puts you ahead of most people who only *feel* stuck."
      : "Even one honest friction point is enough to build a plan that doesn’t gaslight you.";

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.25 }}
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 0,
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: 11,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: TEXT_LO,
          margin: "0 0 10px",
        }}
      >
        Your pattern · unlocked
      </p>

      <h2
        style={{
          fontFamily: "var(--font-barlow-condensed), sans-serif",
          fontWeight: 800,
          fontStyle: "italic",
          fontSize: 28,
          lineHeight: 1.15,
          color: TEXT_HI,
          margin: "0 0 16px",
          letterSpacing: "-0.02em",
        }}
      >
        This isn’t a generic profile. It’s{" "}
        <span style={{ color: ACCENT }}>{hook}</span>, with the real obstacles in the room.
      </h2>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.35 }}
        style={{
          padding: "18px 18px 16px",
          borderRadius: 18,
          background: "linear-gradient(145deg, rgba(94,205,161,0.10) 0%, rgba(255,255,255,0.04) 55%)",
          border: "1px solid rgba(94,205,161,0.22)",
          boxShadow: "0 0 40px rgba(94,205,161,0.08)",
          marginBottom: 18,
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-apercu), sans-serif",
            fontSize: 16,
            color: TEXT_HI,
            margin: "0 0 12px",
            lineHeight: 1.55,
          }}
        >
          {topGoals.length > 0 ? (
            <>
              You’re aiming at{" "}
              {topGoals.length === 1 ? (
                <strong style={{ color: ACCENT }}>{topGoals[0]}</strong>
              ) : (
                <>
                  <strong style={{ color: ACCENT }}>{topGoals[0]}</strong>
                  {" "}and <strong style={{ color: ACCENT }}>{topGoals[1]}</strong>
                </>
              )}
              {" — "}
            </>
          ) : null}
          {friction ? (
            <>
              Most people blame discipline. Your answers point to{" "}
              <strong style={{ color: ACCENT }}>{friction}</strong>
              {" — "}we’ll design around that, not against you.
            </>
          ) : (
            "You’ve already named what slows you down. That’s the hard part — next we turn it into a system."
          )}
        </p>
        {currentState ? (
          <p
            style={{
              fontFamily: "var(--font-apercu), sans-serif",
              fontSize: 14,
              color: TEXT_MID,
              margin: 0,
              lineHeight: 1.5,
              fontStyle: "italic",
            }}
          >
            You said you’re at: “{currentState}” — we’ll pace the plan for that reality, not a fantasy week.
          </p>
        ) : null}
      </motion.div>

      <p
        style={{
          fontFamily: "var(--font-apercu), sans-serif",
          fontSize: 13,
          fontWeight: 600,
          color: TEXT_HI,
          margin: "0 0 10px",
        }}
      >
        What we’ll engineer your days around
      </p>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          marginBottom: 14,
          maxHeight: 140,
          overflowY: "auto",
        }}
      >
        {problems.map((p, i) => (
          <motion.span
            key={`p-${p}`}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.12 + i * 0.04 }}
          >
            <TagPill>{p}</TagPill>
          </motion.span>
        ))}
        {badHabits.map((h, i) => (
          <motion.span
            key={`h-${h}`}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.12 + (problems.length + i) * 0.04 }}
          >
            <TagPill>{h}</TagPill>
          </motion.span>
        ))}
        {problems.length === 0 && badHabits.length === 0 ? (
          <span style={{ fontFamily: "var(--font-apercu), sans-serif", fontSize: 13, color: TEXT_LO }}>
            (We’ll still tune your plan from everything you’ve shared so far.)
          </span>
        ) : null}
      </div>

      <p
        style={{
          fontFamily: "var(--font-apercu), sans-serif",
          fontSize: 14,
          color: TEXT_MID,
          margin: "0 0 8px",
          lineHeight: 1.5,
        }}
      >
        {clarityLine}
      </p>
      <p
        style={{
          fontFamily: "var(--font-apercu), sans-serif",
          fontSize: 13,
          color: TEXT_LO,
          margin: "0 0 22px",
          lineHeight: 1.45,
        }}
      >
        Next: how much time you’ll give this — so your plan isn’t another guilt trip.
      </p>

      <CTAButton label="Show me the rhythm that fits →" onClick={onNext} />
    </motion.div>
  );
}
