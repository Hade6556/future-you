"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { usePlanStore } from "./state/planStore";
import { parseMarketingIntentParam } from "./types/marketingIntent";
import { trackEvent } from "./quiz/utils/analytics";

const HomeClient = dynamic(() => import("./HomeClient"), { ssr: false });

export default function RootGate() {
  const router = useRouter();
  const [urlBoot, setUrlBoot] = useState(false);

  const quizComplete = usePlanStore((s) => s.quizComplete);
  const onboardingComplete = usePlanStore((s) => s.onboardingComplete);
  const pipelinePlan = usePlanStore((s) => s.pipelinePlan);
  const isPremium = usePlanStore((s) => s.isPremium);
  const hydrateFromServer = usePlanStore((s) => s.hydrateFromServer);

  const funnelComplete = quizComplete && onboardingComplete && !!pipelinePlan;
  const readyForHome = funnelComplete && isPremium;

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const parsed = parseMarketingIntentParam(params.get("intent"));
    if (parsed) {
      usePlanStore.getState().setMarketingIntent(parsed);
      trackEvent("intent_selected", { intent: parsed, source: "query" });
      params.delete("intent");
      const qs = params.toString();
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${qs ? `?${qs}` : ""}${window.location.hash}`,
      );
    }
    setUrlBoot(true);
  }, []);

  // After Stripe checkout, poll until the webhook sets is_premium
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("checkout") !== "success") {
      void hydrateFromServer();
      return;
    }

    // Clean the URL
    params.delete("checkout");
    const qs = params.toString();
    window.history.replaceState(null, "", `/${qs ? `?${qs}` : ""}`);

    let attempts = 0;
    const maxAttempts = 10;
    const poll = setInterval(async () => {
      attempts++;
      await hydrateFromServer();
      if (usePlanStore.getState().isPremium || attempts >= maxAttempts) {
        clearInterval(poll);
      }
    }, 2000);

    return () => clearInterval(poll);
  }, [hydrateFromServer]);

  /** Single funnel: quiz → generating → paywall. No intent picker on `/`. */
  useEffect(() => {
    if (!urlBoot || funnelComplete) return;
    if (!quizComplete) {
      router.replace("/quiz");
      return;
    }
    if (quizComplete && onboardingComplete && !pipelinePlan) {
      router.replace("/generating");
      return;
    }
    if (quizComplete && !onboardingComplete) {
      router.replace("/onboarding");
    }
  }, [urlBoot, funnelComplete, quizComplete, onboardingComplete, pipelinePlan, router]);

  useEffect(() => {
    if (!urlBoot || !funnelComplete || isPremium) return;
    router.replace("/paywall");
  }, [urlBoot, funnelComplete, isPremium, router]);

  if (!urlBoot) {
    return null;
  }

  if (readyForHome) {
    return <HomeClient />;
  }

  if (funnelComplete && !isPremium) {
    return null;
  }

  return null;
}
