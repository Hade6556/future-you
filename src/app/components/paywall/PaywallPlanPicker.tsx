"use client";

import type { SubscriptionPlanId } from "@/app/data/pricing";
import { PRICING } from "@/app/data/pricing";
import { TEXT_HI, TEXT_LO, TEXT_MID } from "@/app/theme";

type Props = {
  value: SubscriptionPlanId;
  onChange: (id: SubscriptionPlanId) => void;
  monthlyAvailable: boolean;
  disabled?: boolean;
};

const CARD_BORDER = "1px solid rgba(255,255,255,0.12)";

export function PaywallPlanPicker({ value, onChange, monthlyAvailable, disabled }: Props) {
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
    return (
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange(id)}
        style={{
          width: "100%",
          textAlign: "left",
          padding: "14px 16px",
          borderRadius: 14,
          border: active ? `2px solid ${cta}` : CARD_BORDER,
          background: active ? "color-mix(in srgb, var(--cta) 10%, transparent)" : "rgba(255,255,255,0.04)",
          cursor: "pointer",
          transition: "border-color 0.15s, background 0.15s",
          opacity: disabled ? 0.65 : 1,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          <div>
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
              {plan.label}
              {recommended && (
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
              )}
            </div>
            <div
              style={{
                fontFamily: "var(--font-apercu), sans-serif",
                fontSize: 14,
                color: TEXT_MID,
                marginTop: 4,
              }}
            >
              {plan.priceLine}
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
            }}
          />
        </div>
      </button>
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
        Choose billing
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
