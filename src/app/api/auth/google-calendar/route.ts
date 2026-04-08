import { NextResponse } from "next/server";
import { getAuthUrl } from "@/lib/google-calendar";
import { createClient } from "@/lib/supabase/route-handler";

export async function GET(request: Request) {
  const { origin } = new URL(request.url);

  // If Google isn't configured, redirect back with an error
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return NextResponse.redirect(`${origin}/plan?calendar=not_configured`);
  }

  // Require authenticated user
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.redirect(`${origin}/signup`);
  }

  return NextResponse.redirect(getAuthUrl());
}
