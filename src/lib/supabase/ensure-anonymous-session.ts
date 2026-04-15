import { createClient } from "@/lib/supabase/client";
import { hasSupabasePublicConfig } from "@/lib/supabase/env";

/**
 * Ensures the browser has a Supabase session without email/password:
 * uses anonymous auth so checkout + sync can use a real `auth.users` id.
 * Requires "Anonymous" enabled in Supabase → Authentication → Providers.
 */
export async function ensureAnonymousSession(): Promise<void> {
  if (!hasSupabasePublicConfig()) return;
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) return;
    const { error } = await supabase.auth.signInAnonymously();
    if (error) {
      console.warn("[ensureAnonymousSession]", error.message);
    }
  } catch (e) {
    console.warn("[ensureAnonymousSession]", e);
  }
}
