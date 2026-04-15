/** Client-safe subscription labels — keep in sync with Stripe products. */

export type SubscriptionPlanId = "pro_annual" | "pro_monthly";

export const PRICING = {
  plans: {
    pro_annual: {
      id: "pro_annual" as const,
      label: "Annual",
      /** Shown after trial — match your Stripe price */
      priceLine: "€44/year",
      recommended: true,
    },
    pro_monthly: {
      id: "pro_monthly" as const,
      label: "Monthly",
      priceLine: "€5.99/month",
      recommended: false,
    },
  },
  /** Shown when both plans are offered */
  annualSavingsHint: "Best value — save vs paying monthly",
} as const;

export function formatTrialPriceNote(trialDays: number, planId: SubscriptionPlanId): string {
  const trial =
    trialDays <= 0 ? "" : trialDays === 1 ? "1 day free, then " : `${trialDays} days free, then `;
  const p = PRICING.plans[planId];
  return `${trial}${p.priceLine} · cancel anytime`;
}
