import { NextResponse } from "next/server";

/**
 * Cron route: runs at 8am UTC daily to pre-generate mentor messages and send push notifications.
 *
 * Setup required before this route is active:
 * 1. Install web-push:  npm install web-push @types/web-push
 * 2. Generate VAPID keys: npx web-push generate-vapid-keys
 * 3. Add to .env:
 *      VAPID_PUBLIC_KEY=...
 *      VAPID_PRIVATE_KEY=...
 *      VAPID_SUBJECT=mailto:you@yourapp.com
 *      CRON_SECRET=... (random secret to authenticate cron calls)
 * 4. Add to vercel.json:
 *      { "crons": [{ "path": "/api/cron/daily-mentor", "schedule": "0 8 * * *" }] }
 *
 * Push subscription storage:
 * - When user enables notifications, save their PushSubscription object to Supabase
 *   table: push_subscriptions (user_id, subscription JSON, created_at)
 * - This route reads all active subscriptions and sends each user their daily message.
 */

// Authenticate cron calls with a secret header
function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true; // dev mode: allow without secret
  const auth = request.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // TODO: Implement once web-push and Supabase push_subscriptions table are set up.
  // High-level flow:
  //
  // 1. Query Supabase for all users with active push subscriptions
  // 2. For each user, compute their current day + active step (using dayEngine logic)
  // 3. Call /api/mentor-daily to generate their morning message
  // 4. Store the generated message in Supabase daily_messages table
  // 5. Send push notification via web-push:
  //
  //    import webpush from "web-push";
  //    webpush.setVapidDetails(
  //      process.env.VAPID_SUBJECT!,
  //      process.env.VAPID_PUBLIC_KEY!,
  //      process.env.VAPID_PRIVATE_KEY!,
  //    );
  //    await webpush.sendNotification(subscription, JSON.stringify({
  //      title: `Day ${day}, ${userName}`,
  //      body: taskTitle + " — tap to see your mission.",
  //      url: "/",
  //    }));
  //
  // 6. At 6pm UTC, a second cron run checks todayStatus === 'pending'
  //    and sends a shorter nudge notification.

  return NextResponse.json({
    ok: true,
    message: "Cron scaffold ready. Install web-push and connect Supabase to activate.",
  });
}
