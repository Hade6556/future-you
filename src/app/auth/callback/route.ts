import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/route-handler";

/** Same rules as signup `getSafeNextPath` — only same-origin path redirects. */
function safeInternalPath(raw: string | null): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//") || raw.includes("://")) return "/";
  if (raw.startsWith("/signup")) return "/";
  return raw;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const { searchParams, origin } = url;
  const code = searchParams.get("code");
  const next = safeInternalPath(searchParams.get("next"));

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(new URL(next, origin).toString());
    }
  }

  return NextResponse.redirect(new URL("/signup?error=auth_failed", origin).toString());
}
