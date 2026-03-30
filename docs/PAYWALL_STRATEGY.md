# Paywall strategy and placements

Based on the Vah Bagdasarian paywall playbook (Superwall podcast). This doc describes current implementation and rules for when IAP is integrated.

---

## Business model (why free + trial)

We use **free app + paywall + trial** (not paid download). Bootstrapped app playbooks (e.g. Kyle Fowler, Cardstock) show the biggest revenue jump comes from switching to free + subscription; we optimize for trial start and trial-to-paid per the benchmarks below.

---

## Placements (status)

| Placement | Status | Notes |
|-----------|--------|--------|
| **Onboarding (quiz result)** | Implemented | Multi-step paywall (3 value steps + price step). User taps "Get my full plan" on result page. |
| **Session start** | Implemented | Once per calendar day for non-premium users on Home. Short variant (1 value step + prices). Key: `sessionStorage["behavio-paywall-last-date"]`. |
| **Transaction abandonment** | Planned | When IAP exists: on native payment cancel, show discount paywall. See below. |
| **After N key actions** | Planned | e.g. after first "brief" completed; show paywall. |
| **Cancel trial** | Planned | When user cancels trial, show discount/win-back offer. |
| **Cancel subscription** | Planned | When user cancels subscription, show win-back offer. |

---

## Transaction abandonment (when IAP exists)

When the user taps "Get Full Access" and the **native payment sheet** appears, then they **cancel** without paying:

1. **Trigger:** Register a handler on "payment cancelled" / "transaction abandoned" (RevenueCat, Superwall, or native StoreKit).
2. **Show:** A **discount paywall** (second chance offer).
3. **Rules (from playbook):**
   - Discount **annual only**. Do not discount weekly or monthly.
   - Optional: offer a **trial toggle** on this discount paywall:
     - "With free trial: 80% off" (standard trial flow).
     - "Skip trial: 90% off" (cheaper for direct purchase).
   - ~10% of users may choose no-trial; incentivize with the deeper discount.
4. **Implementation:** When IAP is integrated, add a dedicated discount paywall view or variant (e.g. `PaywallSheet variant="discount"`) and trigger it from the abandonment handler. Do not show the main onboarding paywall again; keep the screen focused on the discounted annual offer.

---

## Benchmarks (from playbook)

- **Trial start rate:** Target >15%.
- **Trial to paid:** Target >30%.
- **Install to paid (no trial):** Target ≥4%; 10%+ is strong.

---

## Current implementation details

- **Multi-step (onboarding):** Steps 1–3 = value + social proof, no prices. Step 4 = plan selection (annual / weekly / free) + CTA. "Start my journey today" advances to step 4.
- **Session-start:** Uses `PaywallSheet` with `variant="session"` (1 value step, then prices). Shown at most once per calendar day via `sessionStorage`.
- **Copy:** Price step includes annual anchor ("Only $4.17/mo · $0.14/day"), "Limited spots at this price", and "Join 12,000+ people who found their path."
