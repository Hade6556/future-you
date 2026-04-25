"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import CTAButton from "../components/CTAButton";
import { useQuizStore } from "../store/quizStore";
import { ACCENT, TEXT_HI, TEXT_LO, TEXT_MID, accentRgba } from "@/app/theme";

function DiagnosticRow({
  label,
  children,
  accent = false,
  italic = false,
}: {
  label: string;
  children: ReactNode;
  accent?: boolean;
  italic?: boolean;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "auto 1fr",
        gap: 14,
        alignItems: "baseline",
        padding: "12px 0",
        borderTop: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: 9.5,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: TEXT_LO,
          whiteSpace: "nowrap",
          paddingTop: 2,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: "var(--font-apercu), sans-serif",
          fontSize: 14.5,
          fontStyle: italic ? "italic" : "normal",
          fontWeight: italic ? 400 : 500,
          color: accent ? ACCENT : TEXT_HI,
          lineHeight: 1.5,
          letterSpacing: "-0.005em",
        }}
      >
        {children}
      </span>
    </div>
  );
}

function NamePlate({ children }: { children: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 14px",
        borderRadius: 10,
        background: accentRgba(0.08),
        border: `1px solid ${accentRgba(0.25)}`,
        fontFamily: "var(--font-barlow-condensed), sans-serif",
        fontWeight: 900,
        fontStyle: "italic",
        fontSize: 18,
        color: ACCENT,
        letterSpacing: "-0.005em",
        lineHeight: 1,
        textTransform: "uppercase",
      }}
    >
      {children}
    </span>
  );
}

/** Strip leading emoji + whitespace so name plates render as clean typography. */
function stripLeadingEmoji(s: string): string {
  return s.replace(/^[\p{Extended_Pictographic}\s]+/u, "").trim();
}

export default function ProblemBreakdownScreen({ onNext }: { onNext: () => void }) {
  const specificGoals = useQuizStore((s) => s.answers.specificGoals);
  const problems = useQuizStore((s) => s.answers.problems);
  const badHabits = useQuizStore((s) => s.answers.badHabits);
  const currentState = useQuizStore((s) => s.answers.currentState);

  const topGoal = specificGoals[0] ? stripLeadingEmoji(specificGoals[0]) : null;
  const friction = problems[0] ? stripLeadingEmoji(problems[0]) : null;
  const allFrictions = [...problems, ...badHabits].map(stripLeadingEmoji).filter(Boolean);

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
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: 11,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: ACCENT,
          margin: "0 0 14px",
        }}
      >
        ↳ Your pattern · Unlocked
      </p>

      <h2
        style={{
          fontFamily: "var(--font-barlow-condensed), sans-serif",
          fontWeight: 900,
          fontSize: "clamp(32px, 7vw, 44px)",
          lineHeight: 0.98,
          color: TEXT_HI,
          margin: "0 0 26px",
          letterSpacing: "-0.025em",
        }}
      >
        This isn&apos;t a profile. It&apos;s a{" "}
        <span style={{ fontStyle: "italic", color: ACCENT }}>diagnosis.</span>
      </h2>

      {/* Diagnostic chart */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.35 }}
        style={{
          padding: "6px 20px 20px",
          borderRadius: 18,
          background: "linear-gradient(180deg, rgba(255,255,255,0.045), rgba(255,255,255,0.01))",
          border: "1px solid rgba(255,255,255,0.08)",
          marginBottom: 28,
        }}
      >
        {topGoal && (
          <DiagnosticRow label="Aiming at" accent>
            {topGoal}
          </DiagnosticRow>
        )}
        {friction && (
          <DiagnosticRow label="Real blocker">
            {friction}{" "}
            <span style={{ color: TEXT_LO, fontWeight: 400 }}>
              (not lack of discipline)
            </span>
          </DiagnosticRow>
        )}
        {currentState && (
          <DiagnosticRow label="What you said" italic>
            &ldquo;{stripLeadingEmoji(currentState)}&rdquo;
          </DiagnosticRow>
        )}
        <DiagnosticRow label="Design principle">
          We pace around your{" "}
          <span style={{ color: ACCENT, fontWeight: 600 }}>real week</span>
          {" "}— not a fantasy one.
        </DiagnosticRow>
      </motion.div>

      {/* Days engineered around — name plates */}
      {allFrictions.length > 0 && (
        <>
          <p
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 10.5,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: TEXT_LO,
              margin: "0 0 12px",
            }}
          >
            ↳ Days engineered around
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              marginBottom: 18,
            }}
          >
            {allFrictions.slice(0, 4).map((label, i) => (
              <motion.span
                key={label}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18 + i * 0.06 }}
              >
                <NamePlate>{label}</NamePlate>
              </motion.span>
            ))}
          </div>
          <p
            style={{
              fontFamily: "var(--font-apercu), sans-serif",
              fontSize: 14,
              color: TEXT_MID,
              margin: "0 0 28px",
              lineHeight: 1.5,
            }}
          >
            Not around streaks. Around your{" "}
            <span style={{ color: TEXT_HI, fontWeight: 600 }}>real friction.</span>
          </p>
        </>
      )}

      <CTAButton label="Show me the rhythm that fits →" onClick={onNext} />
    </motion.div>
  );
}
