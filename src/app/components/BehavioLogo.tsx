"use client";

import { ACCENT } from "@/app/theme";

interface BehavioLogoProps {
  size?: number;
}

export function BehavioLogo({ size = 20 }: BehavioLogoProps) {
  return (
    <span
      style={{
        display: "inline-block",
        fontFamily: "var(--font-barlow-condensed), sans-serif",
        fontWeight: 700,
        fontStyle: "italic",
        fontSize: size,
        color: ACCENT,
        letterSpacing: "0.02em",
        lineHeight: 1,
      }}
    >
      behavio
    </span>
  );
}
