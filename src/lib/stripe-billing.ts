import { NextResponse } from "next/server";
import Stripe from "stripe";
import { requireAuth } from "@/lib/auth";

export function getStripe(): Stripe | null {
  const key = (process.env.STRIPE_SECRET_KEY ?? "").trim();
  if (!key) return null;
  return new Stripe(key);
}

export function stripePriceIds() {
  return {
    annual: (process.env.STRIPE_PRICE_PRO_ANNUAL ?? "").trim(),
    monthly: (process.env.STRIPE_PRICE_PRO_MONTHLY ?? "").trim(),
  };
}

export function parseStripeTrialDays(): number {
  const raw = parseInt(process.env.STRIPE_TRIAL_DAYS ?? "7", 10);
  if (!Number.isFinite(raw)) return 7;
  return Math.min(365, Math.max(0, raw));
}

/** GET — plan flags + trial length for paywall UI. */
export async function billingPlansGet() {
  const trialDays = parseStripeTrialDays();
  const { annual, monthly } = stripePriceIds();
  return NextResponse.json({
    trialDays,
    monthlyAvailable: !!monthly,
    annualAvailable: !!annual,
  });
}

/** POST — create Stripe Checkout session. */
export async function billingSessionPost(request: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      {
        error:
          "Stripe is not configured on the server. Set STRIPE_SECRET_KEY in .env.local (or your host’s env), restart the dev server, and redeploy if this is production.",
      },
      { status: 503 },
    );
  }

  let plan: "pro_annual" | "pro_monthly" = "pro_annual";
  try {
    const body = (await request.json()) as { plan?: string };
    if (body?.plan === "pro_monthly") plan = "pro_monthly";
  } catch {
    /* default annual */
  }

  const { annual: annualPriceId, monthly: monthlyPriceId } = stripePriceIds();
  const priceId = plan === "pro_monthly" ? monthlyPriceId : annualPriceId;

  if (plan === "pro_monthly" && !monthlyPriceId) {
    return NextResponse.json({ error: "Monthly billing is not available" }, { status: 400 });
  }

  if (!priceId) {
    return NextResponse.json({ error: "Price not configured" }, { status: 503 });
  }

  const origin = request.headers.get("origin") ?? "http://localhost:3000";
  const trialDays = parseStripeTrialDays();

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${origin}/?checkout=success`,
    cancel_url: `${origin}/?checkout=cancelled`,
    metadata: { userId: auth.user.id, plan },
    subscription_data: {
      ...(trialDays > 0 ? { trial_period_days: trialDays } : {}),
      metadata: { userId: auth.user.id, plan },
    },
  });

  return NextResponse.json({ url: session.url });
}
