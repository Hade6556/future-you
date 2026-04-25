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
  return 3;
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
  let attribution: Record<string, string> = {};
  try {
    const body = (await request.json()) as { plan?: string; attribution?: Record<string, string> };
    if (body?.plan === "pro_monthly") plan = "pro_monthly";
    if (body?.attribution && typeof body.attribution === "object") {
      // Stripe metadata cap is 50 keys / 500 chars per value — trim defensively
      for (const [k, v] of Object.entries(body.attribution).slice(0, 20)) {
        if (typeof v === "string") attribution[k] = String(v).slice(0, 500);
      }
    }
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

  const origin =
    request.headers.get("origin") ??
    process.env.NEXT_PUBLIC_URL ??
    "http://localhost:3000";
  const trialDays = parseStripeTrialDays();

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${origin}/?checkout=success&plan=${plan}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/paywall?checkout=cancelled`,
    metadata: { userId: auth.user.id, plan, ...attribution },
    subscription_data: {
      ...(trialDays > 0 ? { trial_period_days: trialDays } : {}),
      metadata: { userId: auth.user.id, plan, ...attribution },
    },
  });

  return NextResponse.json({ url: session.url });
}
