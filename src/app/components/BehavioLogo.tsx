"use client";

import Image from "next/image";

interface BehavioLogoProps {
  size?: number;
  showMark?: boolean;
}

export function BehavioLogo({ size = 20, showMark = true }: BehavioLogoProps) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, lineHeight: 1 }}>
      {showMark && (
        <Image
          src="/logo.svg"
          alt=""
          width={size}
          height={size}
          style={{ display: "block" }}
        />
      )}
      <span
        style={{
          fontFamily: "var(--font-barlow-condensed), sans-serif",
          fontWeight: 700,
          fontStyle: "italic",
          fontSize: size,
          color: "#C8FF00",
          letterSpacing: "0.02em",
        }}
      >
        behavio
      </span>
    </span>
  );
}
