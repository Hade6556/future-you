"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePlanStore } from "../state/planStore";

/**
 * Redirects non-premium users to the paywall.
 * Returns true while redirecting (caller should render null).
 */
export function usePremiumGuard(): boolean {
  const router = useRouter();
  const isPremium = usePlanStore((s) => s.isPremium);

  useEffect(() => {
    if (!isPremium) {
      router.replace("/paywall");
    }
  }, [isPremium, router]);

  return !isPremium;
}
