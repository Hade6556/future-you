import { NextRequest, NextResponse } from "next/server";
import { runEventPipeline } from "@/lib/pipeline";
import type { EventSearchContext } from "@/lib/events/resolveEventGoal";
import { isSerpEventsConfigured } from "@/lib/pipeline/eventApiFetcher";
import { rateLimitResponse } from "@/lib/rateLimit";

export const maxDuration = 45;

export async function POST(req: NextRequest) {
  const limited = rateLimitResponse(req);
  if (limited) return limited;

  let body: {
    searchQueries?: string[];
    scoringHint?: string;
    goalRaw?: string;
    location?: string;
    // Legacy fallback
    goal?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const location = body.location ?? "";
  const goalRaw = body.goalRaw ?? body.goal;
  if (!goalRaw) {
    return NextResponse.json(
      {
        error: "Missing required field: goalRaw",
        meta: { serpConfigured: isSerpEventsConfigured() },
      },
      { status: 400 }
    );
  }

  const ctx: EventSearchContext = {
    searchQueries: Array.isArray(body.searchQueries) ? body.searchQueries : [],
    scoringHint: body.scoringHint ?? goalRaw,
    goalRaw,
  };

  try {
    console.log(`[/api/events] goalRaw="${ctx.goalRaw}" curated=${ctx.searchQueries.length > 0} serpConfigured=${isSerpEventsConfigured()}`);
    const events = await runEventPipeline(ctx, location);
    console.log(`[/api/events] success \u2014 events=${events.length}`);
    return NextResponse.json({
      events,
      meta: { serpConfigured: isSerpEventsConfigured() },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Event pipeline error";
    console.error(`[/api/events] FAILED:`, message, err);
    return NextResponse.json(
      { error: message, meta: { serpConfigured: isSerpEventsConfigured() } },
      { status: 500 }
    );
  }
}
