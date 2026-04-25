"use client";

import { Check } from "lucide-react";
import { ACCENT, NAVY_PANEL, TEXT_HI, TEXT_MID, TEXT_LO, accentRgba } from "@/app/theme";

const OPTIONS = [
  { emoji: "🚀", label: "Career & Purpose" },
  { emoji: "💰", label: "Money & Financial Freedom", selected: true },
  { emoji: "❤️", label: "Relationships & Connection" },
  { emoji: "⚡", label: "Health & Energy" },
  { emoji: "🧠", label: "Mindset & Personal Growth" },
];

export default function QuizMockup() {
  return (
    <div
      role="img"
      aria-label="Sample Behavio quiz screen"
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 360,
        background: NAVY_PANEL,
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 22,
        padding: "22px 22px 24px",
        boxShadow: `0 30px 60px -30px ${accentRgba(0.18)}`,
        fontFamily: "var(--font-apercu), sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: 10,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: TEXT_LO,
          }}
        >
          Step 1 of 7
        </span>
        <div
          style={{
            flex: 1,
            marginLeft: 14,
            height: 3,
            borderRadius: 999,
            background: "rgba(255,255,255,0.06)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              width: "14%",
              background: ACCENT,
              borderRadius: 999,
            }}
          />
        </div>
      </div>

      <h3
        style={{
          fontFamily: "var(--font-barlow-condensed), sans-serif",
          fontStyle: "italic",
          fontWeight: 800,
          fontSize: 22,
          letterSpacing: "-0.01em",
          color: TEXT_HI,
          margin: "0 0 18px",
          lineHeight: 1.15,
        }}
      >
        Which part of your life should this plan focus on first?
      </h3>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {OPTIONS.map((opt) => {
          const isSelected = opt.selected;
          return (
            <div
              key={opt.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 14px",
                borderRadius: 12,
                border: `1.5px solid ${isSelected ? accentRgba(0.55) : "rgba(255,255,255,0.08)"}`,
                background: isSelected ? accentRgba(0.10) : "rgba(255,255,255,0.02)",
                position: "relative",
              }}
            >
              <span style={{ fontSize: 18, lineHeight: 1 }}>{opt.emoji}</span>
              <span
                style={{
                  fontSize: 13.5,
                  fontWeight: isSelected ? 600 : 500,
                  color: isSelected ? TEXT_HI : TEXT_MID,
                  flex: 1,
                  letterSpacing: "-0.01em",
                }}
              >
                {opt.label}
              </span>
              {isSelected && (
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    background: ACCENT,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Check size={11} strokeWidth={3} color="#060912" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
