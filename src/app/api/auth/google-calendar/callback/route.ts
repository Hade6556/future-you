import { NextRequest, NextResponse } from "next/server";
import { getOAuth2Client } from "@/lib/google-calendar";
import type { StoredTokens } from "@/lib/google-calendar";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/route-handler";

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error || !code) {
    return NextResponse.redirect(`${origin}/plan?calendar=denied`);
  }

  // Identify user from Supabase session cookie
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.redirect(`${origin}/signup?error=not_authenticated`);
  }

  // Exchange code for tokens
  const oauth2Client = getOAuth2Client();
  let tokenData: {
    access_token?: string | null;
    refresh_token?: string | null;
    expiry_date?: number | null;
    token_type?: string | null;
    scope?: string | null;
  };

  try {
    const result = await oauth2Client.getToken(code);
    tokenData = result.tokens;
  } catch (err) {
    console.error("Google token exchange failed:", err);
    return NextResponse.redirect(`${origin}/plan?calendar=error`);
  }

  if (!tokenData.access_token || !tokenData.refresh_token) {
    // refresh_token is missing — user may have revoked and re-authorized without prompt:"consent"
    return NextResponse.redirect(`${origin}/plan?calendar=missing_refresh`);
  }

  const tokens: StoredTokens = {
    access_token: tokenData.access_token,
    refresh_token: tokenData.refresh_token,
    expiry_date: tokenData.expiry_date ?? null,
    token_type: tokenData.token_type ?? "Bearer",
    scope: tokenData.scope ?? "",
  };

  // Store tokens using admin client (bypasses RLS)
  const admin = createAdminClient();
  const { error: dbError } = await admin
    .from("users")
    .update({ google_calendar_token: tokens })
    .eq("id", user.id);

  if (dbError) {
    console.error("Failed to store Google tokens:", dbError);
    return NextResponse.redirect(`${origin}/plan?calendar=error`);
  }

  return NextResponse.redirect(`${origin}/plan?calendar=connected`);
}
