import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/route-handler";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  buildAuthenticatedClient,
  phaseDateRange,
  addDays,
  upsertCalendarEvent,
  type StoredTokens,
} from "@/lib/google-calendar";
import type { GoalPlan } from "@/app/types/pipeline";

export async function POST(req: NextRequest) {
  // Authenticate user
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Load stored Google tokens
  const admin = createAdminClient();
  const { data: userData, error: userErr } = await admin
    .from("users")
    .select("google_calendar_token, google_calendar_id")
    .eq("id", user.id)
    .single();

  if (userErr || !userData?.google_calendar_token) {
    return NextResponse.json({ error: "Google Calendar not connected" }, { status: 400 });
  }

  const storedTokens = userData.google_calendar_token as StoredTokens;
  const auth = buildAuthenticatedClient(storedTokens);
  const calendarId: string = userData.google_calendar_id ?? "primary";

  // Persist refreshed tokens back to DB whenever googleapis auto-refreshes
  auth.on("tokens", async (newTokens) => {
    const merged: StoredTokens = {
      ...storedTokens,
      ...newTokens,
      access_token: newTokens.access_token ?? storedTokens.access_token,
      refresh_token: newTokens.refresh_token ?? storedTokens.refresh_token,
      expiry_date: newTokens.expiry_date ?? storedTokens.expiry_date,
      token_type: newTokens.token_type ?? storedTokens.token_type,
      scope: newTokens.scope ?? storedTokens.scope,
      id_token: newTokens.id_token ?? storedTokens.id_token,
    };
    await admin
      .from("users")
      .update({ google_calendar_token: merged })
      .eq("id", user.id);
  });

  // Parse GoalPlan from request
  let plan: GoalPlan;
  try {
    plan = (await req.json()) as GoalPlan;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // Idempotency key — guard against old cached plans without plan_id
  const planId = plan.plan_id ?? `local-${Date.now()}`;
  const planStartDate = new Date();
  const created: string[] = [];

  try {
    // 1. Phase events (multi-day blocks)
    for (let i = 0; i < plan.phases.length; i++) {
      const phase = plan.phases[i];
      const { startDate, endDate } = phaseDateRange(plan.phases, i, planStartDate);

      const stepList = phase.steps.map((s) => `• ${s.title}`).join("\n");
      const id = await upsertCalendarEvent(auth, calendarId, {
        summary: `Phase ${phase.phase_number}: ${phase.phase_name}`,
        description: `Goal: ${phase.goal}\n\nSteps:\n${stepList}`,
        startDate,
        endDate,
        planId,
        eventKey: `phase-${phase.phase_number}`,
      });
      created.push(id);

      // 2. Milestones — spread evenly across phase duration
      for (let mi = 0; mi < phase.milestones.length; mi++) {
        const totalDays = (phase.duration_weeks ?? 1) * 7;
        const offsetDays =
          phase.milestones.length > 1
            ? Math.floor((totalDays * mi) / (phase.milestones.length - 1))
            : 0;
        const msDate = addDays(startDate, offsetDays);
        const msEnd = addDays(msDate, 1);

        const mid = await upsertCalendarEvent(auth, calendarId, {
          summary: `✓ ${phase.milestones[mi]}`,
          description: `Milestone for Phase ${phase.phase_number}: ${phase.phase_name}`,
          startDate: msDate,
          endDate: msEnd,
          planId,
          eventKey: `milestone-${phase.phase_number}-${mi}`,
        });
        created.push(mid);
      }
    }

    // 3. Recommended events (already have absolute start_date)
    for (const ev of plan.recommended_events) {
      if (!ev.start_date) continue;

      const evEnd = addDays(ev.start_date, 1);
      const descParts = [
        ev.description ?? "",
        ev.location ? `📍 ${ev.location}` : "",
        ev.virtual ? "🌐 Virtual event" : "",
        ev.price_label ? `💰 ${ev.price_label}` : "",
        ev.source_url ? `🔗 ${ev.source_url}` : "",
      ].filter(Boolean);

      const eid = await upsertCalendarEvent(auth, calendarId, {
        summary: ev.title,
        description: descParts.join("\n"),
        startDate: ev.start_date,
        endDate: evEnd,
        planId,
        eventKey: `event-${ev.event_id}`,
      });
      created.push(eid);
    }
  } catch (err) {
    console.error("Calendar sync error:", err);
    return NextResponse.json({ error: "Sync failed", detail: String(err) }, { status: 500 });
  }

  return NextResponse.json({ ok: true, eventsCreated: created.length });
}
