"use client";

import { TEXT_HI, TEXT_MID } from "@/app/theme";

interface QuizHeaderProps {
  question: string;
  subhead?: string;
}

export default function QuizHeader({ question, subhead }: QuizHeaderProps) {
  return (
    <div style={{ marginBottom: 28 }}>
      <h1
        style={{
          fontFamily: "var(--font-barlow-condensed), sans-serif",
          fontWeight: 700,
          fontStyle: "italic",
          fontSize: 28,
          color: TEXT_HI,
          margin: "0 0 8px",
          lineHeight: 1.2,
        }}
      >
        {question}
      </h1>
      {subhead && (
        <p
          style={{
            fontFamily: "var(--font-apercu), sans-serif",
            fontSize: 14,
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
