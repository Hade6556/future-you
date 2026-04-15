"use client";

import { ACCENT, TEXT_HI, accentRgba } from "@/app/theme";

interface OptionRowProps {
  label: string;
  selected: boolean;
  onSelect: () => void;
}

export default function OptionRow({ label, selected, onSelect }: OptionRowProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      style={{
        width: "100%",
        textAlign: "left",
        padding: "16px 18px",
        borderRadius: 14,
        border: selected
          ? `1.5px solid ${accentRgba(0.5)}`
          : "1px solid rgba(255,255,255,0.10)",
        background: selected
          ? `rgba(94,205,161,0.08)`
          : "rgba(255,255,255,0.05)",
        backdropFilter: "blur(12px)",
        color: selected ? ACCENT : TEXT_HI,
        fontFamily: "var(--font-apercu), sans-serif",
        fontSize: 15,
        fontWeight: 500,
        cursor: "pointer",
        transition: "all 0.15s",
        boxShadow: selected
          ? `0 0 16px ${accentRgba(0.12)}`
          : "none",
      }}
    >
      {label}
    </button>
  );
}
