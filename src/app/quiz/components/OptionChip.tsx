"use client";

import { ACCENT, TEXT_HI, accentRgba } from "@/app/theme";

interface OptionChipProps {
  label: string;
  selected: boolean;
  onToggle: () => void;
}

export default function OptionChip({ label, selected, onToggle }: OptionChipProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      style={{
        padding: "12px 14px",
        borderRadius: 14,
        border: selected
          ? `1.5px solid ${accentRgba(0.5)}`
          : "1px solid rgba(255,255,255,0.10)",
        background: selected
          ? "rgba(94,205,161,0.10)"
          : "rgba(255,255,255,0.05)",
        backdropFilter: "blur(12px)",
        color: selected ? ACCENT : TEXT_HI,
        fontFamily: "var(--font-apercu), sans-serif",
        fontSize: 13,
        fontWeight: 500,
        cursor: "pointer",
        transition: "all 0.15s",
        textAlign: "left",
        lineHeight: 1.3,
        boxShadow: selected
          ? `0 0 16px ${accentRgba(0.12)}`
          : "none",
      }}
    >
      {label}
    </button>
  );
}
