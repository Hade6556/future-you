import { NextResponse } from "next/server";
import Stripe from "stripe";
import { requireAuth } from "@/lib/auth";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

const ANNUAL_PRICE_ID = (process.env.STRIPE_PRICE_PRO_ANNUAL ?? "").trim();
const MONTHLY_PRICE_ID = (process.env.STRIPE_PRICE_PRO_MONTHLY ?? "").trim();

function parseTrialDays(): number {
  const raw = parseInt(process.env.STRIPE_TRIAL_DAYS ?? "7", 10);
  if (!Number.isFinite(raw)) return 7;
  return Math.min(365, Math.max(0, raw));
}

/** Public: which plans exist and trial length (for paywall UI). */
export async function GET() {
  const trialDays = parseTrialDays();
  return NextResponse.json({
    trialDays,
    monthlyAvailable: !!MONTHLY_PRICE_ID,
    annualAvailable: !!ANNUAL_PRICE_ID,
  });
}

export async function POST(request: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  let plan: "pro_annual" | "pro_monthly" = "pro_annual";
  try {
    const body = (await request.json()) as { plan?: string };
    if (body?.plan === "pro_monthly") plan = "pro_monthly";
  } catch {
    /* default annual */
  }

  const priceId = plan === "pro_monthly" ? MONTHLY_PRICE_ID : ANNUAL_PRICE_ID;

  if (plan === "pro_monthly" && !MONTHLY_PRICE_ID) {
    return NextResponse.json({ error: "Monthly billing is not available" }, { status: 400 });
  }

  if (!priceId) {
    return NextResponse.json({ error: "Price not configured" }, { status: 503 });
  }

  const origin = request.headers.get("origin") ?? "http://localhost:3000";
  const trialDays = parseTrialDays();

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
