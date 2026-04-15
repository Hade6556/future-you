"use client";

import { ACCENT, ACCENT_HOVER, ON_ACCENT, accentRgba } from "@/app/theme";

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
        borderRadius: 14,
        border: isPrimary ? "none" : "1px solid rgba(255,255,255,0.12)",
        background: isPrimary
          ? disabled
            ? "rgba(255,255,255,0.08)"
            : `linear-gradient(145deg, ${ACCENT}, ${ACCENT_HOVER})`
          : "rgba(255,255,255,0.04)",
        backdropFilter: isPrimary ? undefined : "blur(8px)",
        color: isPrimary
          ? disabled
            ? "rgba(160,180,210,0.55)"
            : ON_ACCENT
          : "rgba(160,180,210,0.85)",
        fontFamily: "var(--font-barlow-condensed), sans-serif",
        fontWeight: 700,
        fontSize: 16,
        letterSpacing: "0.04em",
        cursor: disabled ? "default" : "pointer",
        transition: "all 0.15s",
        boxShadow: isPrimary && !disabled
          ? `0 0 20px ${accentRgba(0.25)}, 0 2px 8px rgba(0,0,0,0.3)`
          : "none",
      }}
    >
      {label}
    </button>
  );
}
