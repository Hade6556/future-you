"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Onboarding has been merged into /quiz/result. Redirect legacy route. */
export default function OnboardingPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/quiz/result");
  }, [router]);

  return null;
}
