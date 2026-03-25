"use client";

import { useRef, useEffect, useState, useId } from "react";
import { motion } from "framer-motion";

type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
};

/**
 * Floating-label text input for the onboarding quiz name step.
 * Controlled component; parent owns value, onChange, and error state.
 * On error: shakes and shows red border for 350ms, then resets animation class.
 */
export function OnboardingNameInput({
  value,
  onChange,
  placeholder = "e.g. Alex",
  error,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const [focused, setFocused] = useState(false);
  const [shaking, setShaking] = useState(false);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Trigger shake animation whenever a new non-null error arrives
  useEffect(() => {
    if (error) {
      setShaking(true);
      const t = setTimeout(() => setShaking(false), 380);
      return () => clearTimeout(t);
    }
  }, [error]);

  const labelFloated = focused || value.length > 0;

  return (
    <div className="relative">
      {/* Floating label */}
      <label
        htmlFor={inputId}
        className="pointer-events-none absolute left-0 select-none transition-all duration-200"
        style={
          labelFloated
            ? {
                top: 0,
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: error ? "var(--destructive)" : "var(--accent-primary)",
              }
            : {
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: "16px",
                fontWeight: 400,
                color: "var(--text-muted)",
              }
        }
      >
        {placeholder}
      </label>

      {/* Input container with shake */}
      <motion.div
        className={shaking ? "animate-oq-shake" : ""}
        style={{ paddingTop: "20px" }}
      >
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          autoComplete="given-name"
          aria-required="true"
          aria-invalid={!!error}
          className="w-full border-b-2 bg-transparent pb-2 text-[22px] font-semibold text-foreground caret-primary placeholder-transparent outline-none transition-colors duration-200"
          style={{
            borderBottomColor: error
              ? "var(--destructive)"
              : focused
              ? "var(--accent-primary)"
              : "var(--card-stroke)",
            fontFamily: "var(--font-onboarding-display), Georgia, serif",
          }}
        />
      </motion.div>
    </div>
  );
}
