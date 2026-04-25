"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import CTAButton from "../components/CTAButton";
import { useQuizStore } from "../store/quizStore";
import { trackAnswerSelected, trackLead } from "../utils/analytics";
import { ACCENT, TEXT_HI, TEXT_MID, TEXT_LO, accentRgba } from "@/app/theme";

const REMINDERS = [
  { when: "Tomorrow", what: "Day 1's anchor action" },
  { when: "Sunday",   what: "Your first weekly review" },
  { when: "Day 30",   what: "What changed in your week" },
];

export default function EmailCaptureScreen({ onNext }: { onNext: () => void }) {
  const email = useQuizStore((s) => s.answers.email);
  const setEmail = useQuizStore((s) => s.setEmail);
  const [input, setInput] = useState(email);

  function handleSubmit() {
    setEmail(input);
    trackAnswerSelected("email", input);
    trackLead(input);
    onNext();
  }

  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);

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
        ↳ Save your plan
      </p>

      <h2
        style={{
          fontFamily: "var(--font-barlow-condensed), sans-serif",
          fontWeight: 900,
          fontSize: "clamp(30px, 7vw, 40px)",
          lineHeight: 0.98,
          color: TEXT_HI,
          margin: "0 0 16px",
          letterSpacing: "-0.025em",
        }}
      >
        Want your plan in your{" "}
        <span style={{ fontStyle: "italic", color: ACCENT }}>inbox tomorrow morning?</span>
      </h2>

      <p
        style={{
          fontFamily: "var(--font-apercu), sans-serif",
          fontSize: 14.5,
          color: TEXT_MID,
          margin: "0 0 22px",
          lineHeight: 1.55,
        }}
      >
        Without it, your plan lives only in this browser. Drop your email and
        we&apos;ll send three notes — three real touches, nothing else:
      </p>

      {/* Reminder schedule */}
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: "0 0 28px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {REMINDERS.map((r, i) => (
          <motion.li
            key={r.when}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.08 + i * 0.06, duration: 0.3 }}
            style={{
              display: "grid",
              gridTemplateColumns: "auto 1fr",
              gap: 14,
              alignItems: "baseline",
              padding: "10px 14px",
              borderRadius: 12,
              background: "linear-gradient(180deg, rgba(255,255,255,0.035), rgba(255,255,255,0.005))",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: 10,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: ACCENT,
                fontWeight: 600,
                whiteSpace: "nowrap",
              }}
            >
              → {r.when}
            </span>
            <span
              style={{
                fontFamily: "var(--font-apercu), sans-serif",
                fontSize: 13.5,
                color: TEXT_HI,
                letterSpacing: "-0.005em",
                lineHeight: 1.4,
              }}
            >
              {r.what}
            </span>
          </motion.li>
        ))}
      </ul>

      <input
        type="email"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && valid && handleSubmit()}
        placeholder="you@example.com"
        autoFocus
        style={{
          width: "100%",
          padding: "14px 16px",
          borderRadius: 14,
          border: `1px solid ${valid ? accentRgba(0.45) : "rgba(255,255,255,0.10)"}`,
          background: "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
          color: TEXT_HI,
          fontFamily: "var(--font-apercu), sans-serif",
          fontSize: 15.5,
          outline: "none",
          marginBottom: 14,
          letterSpacing: "-0.005em",
          transition: "border-color 160ms",
        }}
      />

      <CTAButton label="Send me the plan →" onClick={handleSubmit} disabled={!valid} />

      <button
        type="button"
        onClick={onNext}
        style={{
          marginTop: 14,
          background: "none",
          border: "none",
          color: TEXT_LO,
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: 11,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          cursor: "pointer",
          alignSelf: "center",
        }}
      >
        Skip · keep plan in browser only
      </button>

      <p
        style={{
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: 10,
          color: TEXT_LO,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          marginTop: 18,
          textAlign: "center",
        }}
      >
        No spam · 3 emails per phase · Unsubscribe in one click
      </p>
    </motion.div>
  );
}
