import { NextResponse } from "next/server";
import Stripe from "stripe";
import { requireAuth } from "@/lib/auth";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

const ANNUAL_PRICE_ID = process.env.STRIPE_PRICE_PRO_ANNUAL ?? "";

export async function POST(request: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  if (!ANNUAL_PRICE_ID) {
    return NextResponse.json({ error: "Price not configured" }, { status: 503 });
  }

  const origin = request.headers.get("origin") ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: ANNUAL_PRICE_ID, quantity: 1 }],
    success_url: `${origin}/?checkout=success`,
    cancel_url: `${origin}/?checkout=cancelled`,
    metadata: { userId: auth.user.id },
    subscription_data: {
      trial_period_days: 3,
      metadata: { userId: auth.user.id },
    },
  });

  return NextResponse.json({ url: session.url });
}
