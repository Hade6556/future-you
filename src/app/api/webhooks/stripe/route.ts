import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendMetaEvent } from "@/lib/meta-capi";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

const SITE_URL =
  (process.env.NEXT_PUBLIC_URL ?? "").trim() || "https://www.trybehavio.com";

function planIdFromMetadata(meta: Stripe.Metadata | null | undefined): string {
  return (meta?.plan as string) ?? "pro_annual";
}

function fbcFromAttribution(meta: Stripe.Metadata | null | undefined): string | null {
  if (!meta) return null;
  const fbclid = meta.fbclid as string | undefined;
  if (!fbclid) return null;
  // Per Meta docs: _fbc format is fb.1.<unix-ms>.<fbclid>
  return `fb.1.${Date.now()}.${fbclid}`;
}

export async function POST(request: Request) {
  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.error("[stripe webhook] Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL");
    return NextResponse.json({ error: "Server misconfigured" }, { status: 503 });
  }

  const supabase = createAdminClient();

  // Best-effort caller-context fields for Meta CAPI Event Match Quality.
  // These come from the Stripe webhook delivery, not the original buyer's
  // browser, but Meta accepts them as a partial match.
  const clientIp =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  const userAgent = request.headers.get("user-agent") ?? null;

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        if (userId) {
          await supabase
            .from("users")
            .update({
              is_premium: true,
              stripe_customer_id: session.customer as string,
            })
            .eq("id", userId);
        }

        // CAPI: StartTrial — fires on every successful checkout (including
        // those with a 3-day trial; predicted_ltv = the post-trial price so
        // Meta can optimise toward high-LTV users early).
        const amountTotalCents = session.amount_total ?? 0;
        const currency = (session.currency ?? "eur").toUpperCase();
        const plan = planIdFromMetadata(session.metadata);
        const email =
          session.customer_details?.email ??
          (typeof session.customer_email === "string" ? session.customer_email : null);

        await sendMetaEvent({
          eventName: "StartTrial",
          eventId: session.id, // dedups with browser-side fbq StartTrial fired with this session.id as eventID
          eventSourceUrl: `${SITE_URL}/?checkout=success&session_id=${session.id}`,
          email,
          clientIpAddress: clientIp,
          clientUserAgent: userAgent,
          fbc: fbcFromAttribution(session.metadata),
          value: 0, // trial start has no immediate revenue
          currency,
          predictedLtv: amountTotalCents > 0 ? amountTotalCents / 100 : undefined,
          contentIds: [plan],
        });
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;

        // Skip the €0 trial-start invoice. Only fire on real paid conversions.
        if (!invoice.amount_paid || invoice.amount_paid <= 0) break;

        // Pull plan + email + attribution from the linked subscription.
        let plan = "pro_annual";
        let email: string | null = invoice.customer_email ?? null;
        let fbc: string | null = null;
        const subscriptionId = (invoice as unknown as { subscription?: string }).subscription;
        if (subscriptionId) {
          try {
            const sub = await stripe.subscriptions.retrieve(subscriptionId);
            plan = planIdFromMetadata(sub.metadata);
            fbc = fbcFromAttribution(sub.metadata);
            if (!email && typeof sub.customer === "string") {
              const customer = await stripe.customers.retrieve(sub.customer);
              if (customer && !customer.deleted && customer.email) email = customer.email;
            }
          } catch (err) {
            console.warn("[stripe webhook] couldn't enrich Subscribe event:", err);
          }
        }

        const value = invoice.amount_paid / 100;
        const currency = (invoice.currency ?? "eur").toUpperCase();

        await sendMetaEvent({
          eventName: "Subscribe",
          eventId: invoice.id ?? `invoice-${Date.now()}`,
          eventSourceUrl: `${SITE_URL}/`,
          email,
          clientIpAddress: clientIp,
          clientUserAgent: userAgent,
          fbc,
          value,
          currency,
          contentIds: [plan],
        });
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;
        if (userId) {
          const isActive = subscription.status === "active" || subscription.status === "trialing";
          await supabase
            .from("users")
            .update({ is_premium: isActive })
            .eq("id", userId);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;
        if (userId) {
          await supabase
            .from("users")
            .update({ is_premium: false })
            .eq("id", userId);
        }
        break;
      }
    }
  } catch (err) {
    // Always return 200 on internal errors so Stripe doesn't retry forever.
    console.error("[stripe webhook] handler error:", err);
  }

  return NextResponse.json({ received: true });
}
