"use client";

import { ACCENT, TEXT_HI, TEXT_MID } from "@/app/theme";

interface QuizHeaderProps {
  question: string;
  subhead?: string;
  /** Optional small uppercase label rendered above the question. */
  eyebrow?: string;
}

/**
 * Splits the question on `**…**` markdown so the wrapped phrase renders in
 * sage-mint italic — same accent treatment used by the landing's headlines.
 */
function renderQuestion(question: string) {
  const parts = question.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    const m = part.match(/^\*\*([^*]+)\*\*$/);
    if (m) {
      return (
        <span key={i} style={{ fontStyle: "italic", color: ACCENT }}>
          {m[1]}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export default function QuizHeader({ question, subhead, eyebrow }: QuizHeaderProps) {
  return (
    <div style={{ marginBottom: 28 }}>
      {eyebrow && (
        <p
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: 11,
            color: ACCENT,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            margin: "0 0 12px",
          }}
        >
          ↳ {eyebrow}
        </p>
      )}
      <h1
        style={{
          fontFamily: "var(--font-barlow-condensed), sans-serif",
          fontWeight: 900,
          fontSize: "clamp(28px, 5.4vw, 36px)",
          color: TEXT_HI,
          margin: "0 0 12px",
          lineHeight: 1.0,
          letterSpacing: "-0.02em",
        }}
      >
        {renderQuestion(question)}
      </h1>
      {subhead && (
        <p
          style={{
            fontFamily: "var(--font-apercu), sans-serif",
            fontSize: 14.5,
            color: TEXT_MID,
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          {subhead}
        </p>
      )}
    </div>
  );
}
