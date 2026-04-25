import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseAnonKey } from "@/lib/supabase/env";

function isPublicPath(pathname: string): boolean {
  if (pathname === "/") return true;
  if (pathname === "/landing") return true;
  if (pathname.startsWith("/api/")) return true;
  if (pathname.startsWith("/auth/")) return true;
  if (pathname.startsWith("/signup")) return true;
  if (pathname.startsWith("/quiz")) return true;
  if (pathname.startsWith("/onboarding")) return true;
  if (pathname.startsWith("/generating")) return true;
  if (pathname.startsWith("/paywall")) return true;
  if (pathname.startsWith("/forgot-password")) return true;
  if (pathname === "/privacy" || pathname === "/terms") return true;
  if (pathname === "/icon.svg") return true;
  return false;
}

/** Routes that require an active premium subscription. */
function isPremiumPath(pathname: string): boolean {
  if (pathname.startsWith("/tasks")) return true;
  if (pathname.startsWith("/plan")) return true;
  if (pathname.startsWith("/journal")) return true;
  if (pathname.startsWith("/explore")) return true;
  return false;
}

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = getSupabaseAnonKey();

  // If Supabase isn't configured yet, pass through
  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // Refresh session — do not remove this.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  if (!user && !isPublicPath(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // Premium gate: redirect non-premium users to the paywall
  if (user && isPremiumPath(pathname)) {
    const { data } = await supabase
      .from("users")
      .select("is_premium")
      .eq("id", user.id)
      .single();

    if (!data?.is_premium) {
      const url = request.nextUrl.clone();
      url.pathname = "/paywall";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
