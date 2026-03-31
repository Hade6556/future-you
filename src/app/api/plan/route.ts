import { NextRequest, NextResponse } from "next/server";
import { runPipeline } from "@/lib/pipeline";
import type { UserContext } from "@/app/types/pipeline";
import { rateLimitResponse } from "@/lib/rateLimit";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const limited = rateLimitResponse(req);
  if (limited) return limited;
  let body: { goal?: string; location?: string; userContext?: UserContext };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { goal, location, userContext } = body;
  if (!goal) {
    return NextResponse.json({ error: "Missing required field: goal" }, { status: 400 });
  }

  try {
    const plan = await runPipeline(goal, location ?? null, userContext);
    return NextResponse.json(plan);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Pipeline error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
