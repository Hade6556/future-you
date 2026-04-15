import { createClient } from "@/lib/supabase/route-handler";
import { hasSupabasePublicConfig } from "@/lib/supabase/env";
import { NextResponse } from "next/server";
import type { User } from "@supabase/supabase-js";

/** Synthetic user returned when Supabase is not configured or user is anonymous. */
const ANON_USER = {
  id: "anon-local",
  email: "local@behavio.dev",
} as User;

/**
 * Require authenticated user in API routes.
 * Returns the user on success, or a 401 NextResponse on failure.
 * When Supabase is not configured, returns an anonymous user so
 * routes can operate without a database.
 */
export async function requireAuth(): Promise<
  { user: User; error?: never } | { user?: never; error: NextResponse }
> {
  if (!hasSupabasePublicConfig()) {
    return { user: ANON_USER };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      ),
    };
  }

  return { user };
}

/**
 * Optionally get the authenticated user. Never returns 401.
 * Returns the real user if logged in, otherwise ANON_USER.
 * Use for features that should work without login (voice dump, coach, etc.).
 */
export async function optionalAuth(): Promise<{ user: User }> {
  if (!hasSupabasePublicConfig()) {
    return { user: ANON_USER };
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    return { user: user ?? ANON_USER };
  } catch {
    return { user: ANON_USER };
  }
}
