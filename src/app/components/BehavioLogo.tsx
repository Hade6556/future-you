"use client";

import { ACCENT } from "@/app/theme";

type Variant = "wordmark" | "mark" | "lockup";

interface BehavioLogoProps {
  size?: number;
  variant?: Variant;
  /** Color override for the wordmark text. Mark always uses ACCENT. */
  color?: string;
}

function Mark({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden
      style={{ display: "block", flexShrink: 0 }}
    >
      <circle cx="11" cy="6" r="2.2" fill={ACCENT} />
      <path d="M11 11 L11 33" stroke={ACCENT} strokeWidth="2.6" strokeLinecap="round" />
      <path
        d="M11 22 C 11 16.5, 14.5 13.5, 20 13.5 C 26 13.5, 30 17.5, 30 23.5 C 30 29, 26 33, 20.5 33 C 15 33, 11 29, 11 23.5 Z"
        stroke={ACCENT}
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 23.5 C 16 21, 18 19, 20.5 19 C 23 19, 25 21, 25 23.5 C 25 26, 23 28, 20.5 28 C 18 28, 16 26, 16 23.5 Z"
        fill={ACCENT}
        opacity="0.18"
      />
    </svg>
  );
}

function Wordmark({ size, color }: { size: number; color: string }) {
  return (
    <span
      style={{
        display: "inline-block",
        fontFamily: "var(--font-apercu), sans-serif",
        fontWeight: 600,
        fontSize: size,
        color,
        letterSpacing: "-0.02em",
        lineHeight: 1,
      }}
    >
      behavio
    </span>
  );
}

export function BehavioLogo({
  size = 20,
  variant = "wordmark",
  color = ACCENT,
}: BehavioLogoProps) {
  if (variant === "mark") {
    return <Mark size={size} />;
  }
  if (variant === "lockup") {
    const markSize = Math.round(size * 1.15);
    return (
      <span style={{ display: "inline-flex", alignItems: "center", gap: Math.round(size * 0.4) }}>
        <Mark size={markSize} />
        <Wordmark size={size} color={color} />
      </span>
    );
  }
  return <Wordmark size={size} color={color} />;
}
