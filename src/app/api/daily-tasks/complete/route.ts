import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { hasSupabasePublicConfig } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/route-handler";

export async function POST(request: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  try {
    const { taskId, completed, date } = (await request.json()) as {
      taskId: string;
      completed: boolean;
      date: string;
    };

    if (!hasSupabasePublicConfig()) {
      return NextResponse.json({ ok: true });
    }

    const supabase = await createClient();

    // Upsert into daily_tasks table
    const { error } = await supabase.from("daily_tasks").upsert(
      {
        user_id: auth.user.id,
        date,
        task_id: taskId,
        completed,
        completed_at: completed ? new Date().toISOString() : null,
      },
      { onConflict: "user_id,date,task_id" },
    );

    if (error) {
      console.error("daily_tasks upsert error", error);
      // Non-critical — client state is the source of truth
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("/api/daily-tasks/complete error", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
