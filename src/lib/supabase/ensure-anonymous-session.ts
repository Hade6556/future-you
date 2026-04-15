import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { hasSupabasePublicConfig } from "@/lib/supabase/env";

export type EnsureAnonymousSessionResult = {
  user: User | null;
  /** Present when anonymous sign-in failed (e.g. DB trigger on new user). */
  errorMessage: string | null;
};

/**
 * Ensures the browser has a Supabase session without email/password:
 * uses anonymous auth so checkout + sync can use a real `auth.users` id.
 * Requires "Anonymous" enabled in Supabase → Authentication → Providers.
 *
 * `public.users` trigger must allow null email: `coalesce(new.email, '')`.
 */
export async function ensureAnonymousSession(): Promise<EnsureAnonymousSessionResult> {
  if (!hasSupabasePublicConfig()) {
    return { user: null, errorMessage: null };
  }

  try {
    const supabase = createClient();

    const {
      data: { user: existing },
    } = await supabase.auth.getUser();
    if (existing) {
      return { user: existing, errorMessage: null };
    }

    const { data, error } = await supabase.auth.signInAnonymously();
    if (error) {
      console.warn("[ensureAnonymousSession]", error.message);
      return { user: null, errorMessage: error.message };
    }

    const fromResponse = data.user ?? data.session?.user ?? null;
    if (fromResponse) {
      return { user: fromResponse, errorMessage: null };
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();
    const fromSession = session?.user ?? null;
    if (fromSession) {
      return { user: fromSession, errorMessage: null };
    }

    const {
      data: { user: afterRefresh },
    } = await supabase.auth.getUser();
    return { user: afterRefresh, errorMessage: afterRefresh ? null : "No user after anonymous sign-in" };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.warn("[ensureAnonymousSession]", e);
    return { user: null, errorMessage: msg };
  }
}

/** User-facing hint when paywall checkout cannot get an anonymous session. */
export function formatCheckoutSessionError(errorMessage: string | null): string {
  const detail = errorMessage?.trim();
  let body =
    detail ||
    "Could not start checkout. In Supabase: Authentication → Providers → enable Anonymous.";

  if (/database error creating new user|Database error creating/i.test(detail ?? "")) {
    body +=
      "\n\nYour `handle_new_user` trigger is probably inserting NULL into public.users.email. In Supabase SQL Editor, run the migration in supabase/migrations/003_handle_new_user_anonymous_email.sql (use coalesce(new.email, '')).";
  }

  return body;
}
