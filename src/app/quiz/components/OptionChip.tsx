"use client";

import { ACCENT, TEXT_HI, TEXT_MID, accentRgba } from "@/app/theme";

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
        padding: "11px 14px",
        borderRadius: 12,
        border: `1px solid ${selected ? accentRgba(0.45) : "rgba(255,255,255,0.08)"}`,
        background: selected
          ? accentRgba(0.10)
          : "linear-gradient(180deg, rgba(255,255,255,0.035), rgba(255,255,255,0.01))",
        color: selected ? TEXT_HI : TEXT_MID,
        fontFamily: "var(--font-apercu), sans-serif",
        fontSize: 13.5,
        fontWeight: selected ? 600 : 500,
        letterSpacing: "-0.005em",
        cursor: "pointer",
        transition: "border-color 160ms, background 160ms, color 160ms",
        textAlign: "left",
        lineHeight: 1.35,
      }}
    >
      {selected && (
        <span
          aria-hidden
          style={{
            display: "inline-block",
            width: 10,
            height: 1,
            background: ACCENT,
            verticalAlign: "middle",
            marginRight: 8,
          }}
        />
      )}
      {label}
    </button>
  );
}
