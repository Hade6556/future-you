"use client";

import { ACCENT, TEXT_HI, TEXT_MID, accentRgba } from "@/app/theme";

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
        padding: "14px 16px",
        borderRadius: 14,
        border: `1px solid ${selected ? accentRgba(0.45) : "rgba(255,255,255,0.08)"}`,
        background: selected
          ? accentRgba(0.10)
          : "linear-gradient(180deg, rgba(255,255,255,0.035), rgba(255,255,255,0.01))",
        color: selected ? TEXT_HI : TEXT_MID,
        fontFamily: "var(--font-apercu), sans-serif",
        fontSize: 15,
        fontWeight: selected ? 600 : 500,
        letterSpacing: "-0.005em",
        cursor: "pointer",
        transition: "border-color 160ms, background 160ms, color 160ms",
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}
    >
      <span
        aria-hidden
        style={{
          width: 14,
          height: 14,
          borderRadius: 4,
          flexShrink: 0,
          background: selected ? ACCENT : "transparent",
          border: `1.5px solid ${selected ? ACCENT : "rgba(255,255,255,0.20)"}`,
          transition: "background 160ms, border-color 160ms",
          position: "relative",
        }}
      >
        {selected && (
          <span
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 9,
              color: "#060912",
              fontWeight: 900,
              lineHeight: 1,
            }}
          >
            ✓
          </span>
        )}
      </span>
      <span style={{ flex: 1 }}>{label}</span>
    </button>
  );
}
