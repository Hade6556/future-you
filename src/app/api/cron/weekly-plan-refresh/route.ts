import { NextResponse } from "next/server";

/**
 * Cron route: runs every Monday at 6am UTC to refresh premium users' plans.
 *
 * Setup:
 * 1. Add to vercel.json:
 *    { "crons": [{ "path": "/api/cron/weekly-plan-refresh", "schedule": "0 6 * * 1" }] }
 * 2. Set CRON_SECRET in environment variables
 *
 * Flow:
 * 1. Query Supabase for all premium users with active plans
 * 2. For each user, gather their weekly progress (tasks, journal, energy)
 * 3. Call /api/plan/refresh to get adjusted phases
 * 4. Store the updated plan in Supabase
 * 5. Set a "plan_updated" flag so the client shows a notification
 */

function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true;
  const auth = request.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // TODO: Implement once Supabase user plan storage is connected.
  // High-level flow:
  //
  // 1. Query premium users with planStartDate set
  // 2. For each user:
  //    a. Compute progress from daily_tasks and reflections tables
  //    b. POST to /api/plan/refresh with plan + progress
  //    c. Update user's plan in Supabase
  //    d. Set plan_updated_at to now()
  // 3. Return summary of refreshed plans
  //
  // const { data: users } = await supabase
  //   .from("users")
  //   .select("id, plan_data, plan_start_date")
  //   .eq("is_premium", true)
  //   .not("plan_data", "is", null);
  //
  // for (const user of users) {
  //   const progress = await computeUserProgress(user.id);
  //   const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/plan/refresh`, {
  //     method: "POST",
  //     body: JSON.stringify({ plan: user.plan_data, progress }),
  //   });
  //   const { plan: updatedPlan } = await res.json();
  //   await supabase.from("users").update({
  //     plan_data: updatedPlan,
  //     plan_updated_at: new Date().toISOString(),
  //   }).eq("id", user.id);
  // }

  return NextResponse.json({
    ok: true,
    message: "Weekly plan refresh scaffold ready. Connect Supabase to activate.",
  });
}
