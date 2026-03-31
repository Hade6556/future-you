/**
 * Resolves the browser/server public Supabase key.
 * Order matches Supabase docs: publishable key (new), legacy names, then anon JWT.
 */
export function getSupabaseAnonKey(): string | undefined {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export function hasSupabasePublicConfig(): boolean {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && getSupabaseAnonKey());
}
