import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/route-handler";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

export async function POST(request: Request) {
  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: userData } = await supabase
    .from("users")
    .select("stripe_customer_id, is_premium, email")
    .eq("id", user.id)
    .single();

  let customerId = userData?.stripe_customer_id as string | null;

  // Lazy backfill for premium users who subscribed before stripe_customer_id was stored
  if (!customerId && userData?.is_premium) {
    const email = userData.email ?? user.email;
    if (email) {
      const customers = await stripe.customers.list({ email, limit: 1 });
      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
        await supabase
          .from("users")
          .update({ stripe_customer_id: customerId })
          .eq("id", user.id);
      }
    }
  }

  if (!customerId) {
    return NextResponse.json({ error: "no_subscription" }, { status: 400 });
  }

  const origin = request.headers.get("origin") ?? "http://localhost:3000";
  const portalSession = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${origin}/account`,
  });

  return NextResponse.json({ url: portalSession.url });
}
