/**
 * Resolves the browser/server public Supabase key.
 * Prefer NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY (Supabase dashboard naming),
 * fall back to NEXT_PUBLIC_SUPABASE_ANON_KEY.
 */
export function getSupabaseAnonKey(): string | undefined {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export function hasSupabasePublicConfig(): boolean {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && getSupabaseAnonKey());
}
