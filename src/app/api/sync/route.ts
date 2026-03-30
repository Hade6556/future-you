import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

/**
 * POST /api/sync
 *
 * Two-way sync between client localStorage state and Supabase.
 * - Accepts the client's current state
 * - Merges with server state (server wins on conflicts for critical fields)
 * - Writes merged result to Supabase
 * - Returns authoritative state to client
 */

interface SyncPayload {
  // Core progress
  streak: number;
  bestStreak: number;
  streakShields: number;
  futureScore: number;
  lastCompletedDate: string | null;

  // Identity
  userName: string;
  archetype: string | null;
  ambitionType: string | null;

  // Onboarding
  onboardingComplete: boolean;
  quizData: Record<string, unknown> | null;

  // Plan
  planId: string | null;
  planStartDate: string | null;
  intakeResponse: Record<string, unknown> | null;
  pipelineOutput: Record<string, unknown> | null;
  goal: string | null;
}

interface SyncResponse {
  streak: number;
  bestStreak: number;
  streakShields: number;
  futureScore: number;
  lastCompletedDate: string | null;
  isPremium: boolean;
  trialStartedAt: string | null;
  userName: string;
  archetype: string | null;
  ambitionType: string | null;
  onboardingComplete: boolean;
  planId: string | null;
}

export async function POST(req: Request) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.json({ skipped: true }, { status: 200 });
  }

  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const supabase = await createClient();
  const body = (await req.json()) as SyncPayload;

  // Fetch current server state
  const { data: serverUser, error: fetchErr } = await supabase
    .from("users")
    .select(
      "streak, last_completed_date, user_name, archetype, ambition_type, is_premium, trial_started_at, stripe_customer_id, best_streak, streak_shields, future_score, onboarding_complete, quiz_data",
    )
    .eq("id", auth.user.id)
    .single();

  if (fetchErr || !serverUser) {
    console.error("[sync] failed to fetch user", fetchErr);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }

  // Merge: server wins for critical fields if server has a more recent lastCompletedDate
  const serverLastDate = serverUser.last_completed_date ?? "";
  const clientLastDate = body.lastCompletedDate ?? "";
  const serverIsNewer = serverLastDate > clientLastDate;

  const mergedStreak = serverIsNewer ? (serverUser.streak ?? 0) : body.streak;
  const mergedBestStreak = Math.max(serverUser.best_streak ?? 0, body.bestStreak ?? 0);
  const mergedShields = serverIsNewer
    ? (serverUser.streak_shields ?? 0)
    : body.streakShields;
  const mergedFutureScore = serverIsNewer
    ? (serverUser.future_score ?? 0)
    : body.futureScore;
  const mergedLastDate = serverIsNewer ? serverLastDate : clientLastDate;
  const mergedUserName = body.userName || serverUser.user_name || "";
  const mergedArchetype = body.archetype || serverUser.archetype || null;
  const mergedAmbitionType = body.ambitionType || serverUser.ambition_type || null;
  const mergedOnboardingComplete =
    body.onboardingComplete || serverUser.onboarding_complete || false;

  // Write merged state to users table
  const { error: updateErr } = await supabase
    .from("users")
    .update({
      streak: mergedStreak,
      best_streak: mergedBestStreak,
      streak_shields: mergedShields,
      future_score: mergedFutureScore,
      last_completed_date: mergedLastDate || null,
      user_name: mergedUserName || null,
      archetype: mergedArchetype,
      ambition_type: mergedAmbitionType,
      onboarding_complete: mergedOnboardingComplete,
      quiz_data: body.quizData ?? serverUser.quiz_data ?? null,
    })
    .eq("id", auth.user.id);

  if (updateErr) {
    console.error("[sync] failed to update user", updateErr);
    return NextResponse.json({ error: "Failed to sync" }, { status: 500 });
  }

  // Upsert plan if client has one and server doesn't
  let mergedPlanId = body.planId;
  if (body.planId && (body.intakeResponse || body.pipelineOutput)) {
    const { data: existingPlan } = await supabase
      .from("plans")
      .select("id")
      .eq("user_id", auth.user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (!existingPlan) {
      const { data: newPlan } = await supabase
        .from("plans")
        .insert({
          user_id: auth.user.id,
          goal: body.goal ?? "My goal",
          intake_response: body.intakeResponse ?? null,
          pipeline_output: body.pipelineOutput ?? null,
        })
        .select("id")
        .single();
      if (newPlan) mergedPlanId = newPlan.id;
    } else {
      mergedPlanId = existingPlan.id;
    }
  }

  const response: SyncResponse = {
    streak: mergedStreak,
    bestStreak: mergedBestStreak,
    streakShields: mergedShields,
    futureScore: mergedFutureScore,
    lastCompletedDate: mergedLastDate || null,
    isPremium: serverUser.is_premium ?? false,
    trialStartedAt: serverUser.trial_started_at ?? null,
    userName: mergedUserName,
    archetype: mergedArchetype,
    ambitionType: mergedAmbitionType,
    onboardingComplete: mergedOnboardingComplete,
    planId: mergedPlanId,
  };

  return NextResponse.json(response);
}
