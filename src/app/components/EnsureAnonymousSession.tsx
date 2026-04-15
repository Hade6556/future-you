"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { ensureAnonymousSession } from "@/lib/supabase/ensure-anonymous-session";

const skipPaths = ["/signup", "/forgot-password"];

export function EnsureAnonymousSession() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    if (skipPaths.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return;
    if (pathname.startsWith("/auth")) return;
    void ensureAnonymousSession();
  }, [pathname]);

  return null;
}
