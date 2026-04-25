"use client";

import { ACCENT, ACCENT_HOVER, ON_ACCENT, TEXT_LO, accentRgba } from "@/app/theme";

interface CTAButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: "primary" | "ghost";
}

export default function CTAButton({
  label,
  onClick,
  disabled = false,
  variant = "primary",
}: CTAButtonProps) {
  const isPrimary = variant === "primary";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="transition-transform duration-150 ease-out active:scale-[0.99] disabled:active:scale-100"
      style={{
        width: "100%",
        padding: "16px 24px",
        borderRadius: 12,
        border: isPrimary ? "none" : "1px solid rgba(255,255,255,0.12)",
        background: isPrimary
          ? disabled
            ? "rgba(255,255,255,0.05)"
            : `linear-gradient(180deg, ${ACCENT} 0%, ${ACCENT_HOVER} 100%)`
          : "transparent",
        color: isPrimary
          ? disabled
            ? TEXT_LO
            : ON_ACCENT
          : "rgba(255,255,255,0.95)",
        fontFamily: "var(--font-apercu), sans-serif",
        fontWeight: 700,
        fontSize: 15,
        letterSpacing: "-0.005em",
        cursor: disabled ? "default" : "pointer",
        transition: "background 160ms, box-shadow 160ms, color 160ms",
        boxShadow: isPrimary && !disabled
          ? `0 1px 0 rgba(255,255,255,0.20) inset, 0 12px 24px -10px ${accentRgba(0.55)}`
          : "none",
      }}
    >
      {label}
    </button>
  );
}
