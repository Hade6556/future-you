"use client";

import type { SubscriptionPlanId } from "@/app/data/pricing";
import { PRICING, trialHeroLine } from "@/app/data/pricing";
import { TEXT_HI, TEXT_LO, TEXT_MID } from "@/app/theme";
import { motion } from "framer-motion";

type Props = {
  value: SubscriptionPlanId;
  onChange: (id: SubscriptionPlanId) => void;
  monthlyAvailable: boolean;
  /** From checkout options / Stripe trial config */
  trialDays: number;
  disabled?: boolean;
};

const HERO_GRADIENT =
  "linear-gradient(115deg, #ffffff 0%, var(--cta) 42%, color-mix(in srgb, var(--cta) 55%, #b8fff0) 100%)";

export function PaywallPlanPicker({
  value,
  onChange,
  monthlyAvailable,
  trialDays,
  disabled,
}: Props) {
  const cta = "var(--cta)";

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
      <div
        style={{
          width: "100%",
          borderRadius: 16,
          padding: active ? 2 : 1,
          background: active
            ? `linear-gradient(135deg, ${cta}, rgba(255,255,255,0.42))`
            : "rgba(255,255,255,0.1)",
          boxShadow: active
            ? `0 0 0 1px color-mix(in srgb, ${cta} 40%, transparent), 0 14px 44px color-mix(in srgb, var(--cta) 26%, transparent)`
            : "none",
          transition: "box-shadow 0.2s ease, padding 0.15s ease",
        }}
      >
        <motion.button
          type="button"
          disabled={disabled}
          onClick={() => onChange(id)}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
          style={{
            width: "100%",
            textAlign: "left",
            padding: "14px 16px",
            borderRadius: 14,
            border: "none",
            background: active ? "color-mix(in srgb, #060912 88%, transparent)" : "rgba(12,18,32,0.92)",
            cursor: disabled ? "not-allowed" : "pointer",
            opacity: disabled ? 0.65 : 1,
            display: "block",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-barlow-condensed), sans-serif",
              fontWeight: 900,
              fontSize: 26,
              lineHeight: 1.05,
              fontStyle: "italic",
              letterSpacing: "-0.02em",
              backgroundImage: HERO_GRADIENT,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              marginBottom: 10,
            }}
          >
            {hero}
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontFamily: "var(--font-apercu), sans-serif",
                  fontWeight: 700,
                  fontSize: 16,
                  color: TEXT_HI,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  flexWrap: "wrap",
                }}
              >
                {plan.emoji ? (
                  <span aria-hidden style={{ fontSize: 18, lineHeight: 1 }}>
                    {plan.emoji}
                  </span>
                ) : null}
                {plan.label}
                {recommended ? (
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "#060912",
                      background: cta,
                      padding: "3px 8px",
                      borderRadius: 6,
                    }}
                  >
                    Popular
                  </span>
                ) : null}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-apercu), sans-serif",
                  fontSize: 12,
                  color: TEXT_LO,
                  marginTop: 4,
                }}
              >
                {plan.tagline}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-apercu), sans-serif",
                  fontSize: 13,
                  color: TEXT_MID,
                  marginTop: 6,
                }}
              >
                Then {plan.priceLine} · cancel anytime
              </div>
            </div>
            <span
              aria-hidden
              style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                border: active ? `6px solid ${cta}` : "2px solid rgba(255,255,255,0.25)",
                flexShrink: 0,
                marginTop: 2,
              }}
            />
          </div>
        </motion.button>
      </div>
    );
  };

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
      <p
        style={{
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: 11,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: TEXT_LO,
          margin: "0 0 4px",
        }}
      >
        Start with a free trial
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
