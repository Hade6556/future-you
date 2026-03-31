import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { hasSupabasePublicConfig } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

const hasSupabase = hasSupabasePublicConfig();

export async function GET() {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  if (!hasSupabase) {
    return NextResponse.json({ dumps: [] });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reflections")
    .select("id, date, content, coach_response, sentiment, created_at")
    .eq("user_id", auth.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[brain-dumps GET]", error);
    return NextResponse.json({ dumps: [] });
  }

  const dumps = (data ?? []).map((r) => ({
    id: r.id,
    timestamp: r.created_at,
    date: r.date,
    content: r.content ?? "",
    coach_response: r.coach_response ?? null,
    sentiment: r.sentiment ?? null,
    source: "voice",
    word_count: r.content ? r.content.trim().split(/\s+/).length : 0,
  }));

  return NextResponse.json({ dumps });
}

interface PostBody {
  content: string;
  coach_response?: string | null;
  sentiment?: "positive" | "neutral" | "negative" | null;
}

export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  try {
    const body = (await req.json()) as PostBody;
    const { content, coach_response = null, sentiment = null } = body;

    if (!content?.trim()) {
      return NextResponse.json(
        { error: "content is required" },
        { status: 400 },
      );
    }

    if (!hasSupabase) {
      return NextResponse.json({ id: `local-${Date.now()}` });
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("reflections")
      .insert({
        user_id: auth.user.id,
        content: content.trim(),
        coach_response,
        sentiment,
      })
      .select("id")
      .single();

    if (error) {
      console.error("[brain-dumps POST]", error);
      return NextResponse.json({ error: "failed to save" }, { status: 500 });
    }

    return NextResponse.json({ id: data.id });
  } catch (err) {
    console.error("[brain-dumps POST]", err);
    return NextResponse.json({ error: "failed to save" }, { status: 500 });
  }
}
