import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import Stripe from "stripe";

/**
 * Cron route: runs daily to notify users whose paid trial ends tomorrow.
 *
 * Window uses STRIPE_TRIAL_DAYS (default 3): we select users whose trial_started_at
 * falls on the calendar day (trialDays - 1) days ago so the Stripe trial typically
 * ends the next day.
 *
 * Setup:
 * 1. Add to vercel.json:
 *    { "crons": [{ "path": "/api/cron/trial-reminder", "schedule": "0 10 * * *" }] }
 * 2. Set CRON_SECRET env var to authenticate calls.
 */

function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true;
  const auth = request.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;
  const supabase = createAdminClient();

  const trialRaw = parseInt(process.env.STRIPE_TRIAL_DAYS ?? "3", 10);
  const trialDays = Number.isFinite(trialRaw) ? Math.min(365, Math.max(0, trialRaw)) : 3;
  const reminderOffsetDays = trialDays > 0 ? Math.max(1, trialDays - 1) : 0;

  if (reminderOffsetDays === 0) {
    return NextResponse.json({ sent: 0, message: "STRIPE_TRIAL_DAYS is 0 — no trial reminders" });
  }

  const now = new Date();
  const targetDay = new Date(now.getTime() - reminderOffsetDays * 24 * 60 * 60 * 1000);
  const windowStart = targetDay.toISOString().slice(0, 10) + "T00:00:00Z";
  const windowEnd = targetDay.toISOString().slice(0, 10) + "T23:59:59Z";

  const { data: users, error } = await supabase
    .from("users")
    .select("id, email, stripe_customer_id, trial_started_at")
    .gte("trial_started_at", windowStart)
    .lte("trial_started_at", windowEnd)
    .eq("is_premium", true)
    .not("stripe_customer_id", "is", null);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!users || users.length === 0) {
    return NextResponse.json({ sent: 0, message: "No users to notify" });
  }

  let sent = 0;

  for (const user of users) {
    // Use Stripe to send an upcoming invoice email (Stripe handles this
    // automatically if enabled in dashboard settings). As an additional
    // measure, we can trigger a customer portal link email or use a
    // custom email service here.
    //
    // For now, log the users. In production, integrate with your email
    // provider (e.g. Resend, SendGrid, Supabase Edge Functions).
    if (stripe && user.stripe_customer_id) {
      try {
        // Retrieve the subscription to confirm it's still trialing
        const subscriptions = await stripe.subscriptions.list({
          customer: user.stripe_customer_id,
          status: "trialing",
          limit: 1,
        });

        if (subscriptions.data.length > 0) {
          // TODO: Send email via your email provider
          // e.g. await sendTrialReminderEmail(user.email, portalUrl);
          console.log(
            `[trial-reminder] User ${user.id} (${user.email}) trial ends tomorrow — reminder needed`
          );
          sent++;
        }
      } catch (err) {
        console.error(`[trial-reminder] Error checking subscription for ${user.id}:`, err);
      }
    }
  }

  return NextResponse.json({ sent, total: users.length });
}
