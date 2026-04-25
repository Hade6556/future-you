/** Client-safe subscription labels — keep in sync with Stripe products. */

export type SubscriptionPlanId = "pro_annual" | "pro_monthly";

export const PRICING = {
  plans: {
    pro_annual: {
      id: "pro_annual" as const,
      label: "Annual",
      emoji: "✨",
      tagline: "Best value after your trial",
      /** Shown after trial — match your Stripe price */
      priceLine: "€44/year",
      recommended: true,
    },
    pro_monthly: {
      id: "pro_monthly" as const,
      label: "Monthly",
      emoji: "⚡",
      tagline: "Flexible month to month",
      /** Shown after trial — match your Stripe price */
      priceLine: "€9.99/month",
      recommended: false,
    },
  },
  /** Shown when both plans are offered */
  annualSavingsHint: "Save 63% — €44/year (≈ €0.85/week) vs €120 if billed monthly",
} as const;

/** Large headline inside plan cards (trial-first paywall). */
export function trialHeroLine(trialDays: number): string {
  if (trialDays <= 0) return "Full access today";
  if (trialDays === 1) return "1 day free";
  return `${trialDays} days free`;
}

/** Under the main CTA — avoids repeating trial + price shown on cards. */
export function paywallCheckoutFootnote(): string {
  return "Cancel anytime · Secure checkout with Stripe";
}

export function formatTrialPriceNote(trialDays: number, planId: SubscriptionPlanId): string {
  const trial =
    trialDays <= 0 ? "" : trialDays === 1 ? "1 day free, then " : `${trialDays} days free, then `;
  const p = PRICING.plans[planId];
  return `${trial}${p.priceLine} · cancel anytime`;
}
