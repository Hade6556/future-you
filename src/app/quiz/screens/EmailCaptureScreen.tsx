"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import CTAButton from "../components/CTAButton";
import { useQuizStore } from "../store/quizStore";
import { trackAnswerSelected } from "../utils/analytics";
import { TEXT_HI, TEXT_MID, TEXT_LO, GLASS, GLASS_BORDER } from "@/app/theme";

export default function EmailCaptureScreen({ onNext }: { onNext: () => void }) {
  const email = useQuizStore((s) => s.answers.email);
  const setEmail = useQuizStore((s) => s.setEmail);
  const [input, setInput] = useState(email);

  function handleSubmit() {
    setEmail(input);
    trackAnswerSelected("email", input);
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
      <h2
        style={{
          fontFamily: "var(--font-apercu), sans-serif",
          fontWeight: 600,
          fontSize: 24,
          color: TEXT_HI,
          margin: "0 0 8px",
          letterSpacing: "-0.01em",
        }}
      >
        Optional — reminders only
      </h2>
      <p
        style={{
          fontFamily: "var(--font-apercu), sans-serif",
          fontSize: 14,
          color: TEXT_MID,
          margin: "0 0 28px",
          lineHeight: 1.5,
        }}
      >
        Add an email if you want plan reminders. This is not sign-up — you can skip
        and continue. Payment (if you subscribe) happens on Stripe next.
      </p>

      <input
        type="email"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && valid && handleSubmit()}
        placeholder="you@example.com"
        autoFocus
        style={{
          width: "100%",
          padding: "16px 18px",
          borderRadius: 14,
          border: `1px solid ${GLASS_BORDER}`,
          background: GLASS,
          backdropFilter: "blur(12px)",
          color: TEXT_HI,
          fontFamily: "var(--font-apercu), sans-serif",
          fontSize: 16,
          outline: "none",
          marginBottom: 16,
        }}
      />

      <CTAButton label="Continue with this email →" onClick={handleSubmit} disabled={!valid} />

      <button
        type="button"
        onClick={onNext}
        style={{
          marginTop: 12,
          background: "none",
          border: "none",
          color: TEXT_LO,
          fontFamily: "var(--font-apercu), sans-serif",
          fontSize: 13,
          cursor: "pointer",
          textDecoration: "underline",
          textUnderlineOffset: 3,
        }}
      >
        Skip for now
      </button>

      <p
        style={{
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: 11,
          color: TEXT_LO,
          marginTop: 16,
          textAlign: "center",
        }}
      >
        No spam. Just your plan.
      </p>
    </motion.div>
  );
}
