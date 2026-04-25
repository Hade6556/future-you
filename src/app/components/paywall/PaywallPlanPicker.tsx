"use client";

import type { SubscriptionPlanId } from "@/app/data/pricing";
import { PRICING, trialHeroLine } from "@/app/data/pricing";
import { ACCENT, TEXT_HI, TEXT_LO, TEXT_MID, accentRgba } from "@/app/theme";
import { motion } from "framer-motion";

type Props = {
  value: SubscriptionPlanId;
  onChange: (id: SubscriptionPlanId) => void;
  monthlyAvailable: boolean;
  /** From checkout options / Stripe trial config */
  trialDays: number;
  disabled?: boolean;
};

export function PaywallPlanPicker({
  value,
  onChange,
  monthlyAvailable,
  trialDays,
  disabled,
}: Props) {
  const Row = ({
    id,
    recommended,
  }: {
    id: SubscriptionPlanId;
    recommended?: boolean;
  }) => {
    const active = value === id;
    const plan = PRICING.plans[id];
    const hero = trialHeroLine(trialDays);

    return (
      <motion.button
        type="button"
        disabled={disabled}
        onClick={() => onChange(id)}
        whileTap={{ scale: 0.99 }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
        style={{
          width: "100%",
          textAlign: "left",
          padding: "16px 18px",
          borderRadius: 16,
          border: `1px solid ${active ? accentRgba(0.50) : "rgba(255,255,255,0.07)"}`,
          background: active
            ? `linear-gradient(180deg, ${accentRgba(0.10)}, ${accentRgba(0.02)})`
            : "linear-gradient(180deg, rgba(255,255,255,0.035), rgba(255,255,255,0.01))",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.65 : 1,
          display: "block",
          transition: "border-color 160ms, background 160ms",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {active && (
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              background: `radial-gradient(60% 60% at 0% 0%, ${accentRgba(0.10)}, transparent 65%)`,
              pointerEvents: "none",
            }}
          />
        )}
        <div style={{ position: "relative" }}>
          {/* Top row — billing cadence chip + radio */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 10,
              marginBottom: 12,
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: 10.5,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: TEXT_MID,
                  fontWeight: 600,
                }}
              >
                {plan.label}
              </span>
              {recommended ? (
                <span
                  style={{
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                    fontSize: 9.5,
                    fontWeight: 700,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "#060912",
                    background: ACCENT,
                    padding: "3px 8px",
                    borderRadius: 6,
                    lineHeight: 1,
                  }}
                >
                  Popular
                </span>
              ) : null}
            </div>
            <span
              aria-hidden
              style={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                border: `1.5px solid ${active ? ACCENT : "rgba(255,255,255,0.20)"}`,
                background: active ? ACCENT : "transparent",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 160ms, border-color 160ms",
              }}
            >
              {active && (
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#060912",
                  }}
                />
              )}
            </span>
          </div>

          {/* Hero — the trial offer is the headline */}
          <h3
            style={{
              fontFamily: "var(--font-barlow-condensed), sans-serif",
              fontWeight: 900,
              fontStyle: "italic",
              fontSize: "clamp(28px, 6.4vw, 34px)",
              color: TEXT_HI,
              lineHeight: 0.95,
              letterSpacing: "-0.025em",
              margin: "0 0 8px",
            }}
          >
            {hero}
          </h3>

          <p
            style={{
              fontFamily: "var(--font-apercu), sans-serif",
              fontSize: 13,
              color: TEXT_MID,
              margin: 0,
              lineHeight: 1.45,
            }}
          >
            {plan.tagline}
          </p>

          <p
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 10.5,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: TEXT_LO,
              margin: "10px 0 0",
            }}
          >
            Then {plan.priceLine} · cancel anytime
          </p>
        </div>
      </motion.button>
    );
  };

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
      <p
        style={{
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: 11,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: ACCENT,
          margin: "0 0 4px",
          fontWeight: 600,
        }}
      >
        ↳ Start with a free trial
      </p>
      <Row id="pro_annual" recommended />
      {monthlyAvailable ? <Row id="pro_monthly" /> : null}
      {!monthlyAvailable ? (
        <p style={{ fontFamily: "var(--font-apercu), sans-serif", fontSize: 12, color: TEXT_LO, margin: 0 }}>
          Monthly billing coming soon — annual unlocks the same features.
        </p>
      ) : null}
    </div>
  );
}
