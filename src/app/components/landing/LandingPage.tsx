"use client";

import { useEffect, useLayoutEffect } from "react";
import dynamic from "next/dynamic";
import { useFunnelResume } from "@/app/state/useFunnelResume";
import { usePlanStore } from "@/app/state/planStore";
import { parseMarketingIntentParam } from "@/app/types/marketingIntent";
import { trackEvent, trackPurchase } from "@/app/quiz/utils/analytics";

import LandingNav from "./LandingNav";
import ResumeBanner from "./ResumeBanner";
import Hero from "./Hero";
import ArchetypePreview from "./ArchetypePreview";
import HowItWorks from "./HowItWorks";
import ProofStack from "./ProofStack";
import TrustStrip from "./TrustStrip";
import MiniFAQ from "./MiniFAQ";
import FinalCTA from "./FinalCTA";
import LandingFooter from "./LandingFooter";
import StickyCTABar from "./StickyCTABar";

const HomeClient = dynamic(() => import("@/app/HomeClient"), { ssr: false });

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid", "ttclid", "gclid"] as const;

/**
 * Public landing page at `/`. Handles UTM/intent capture, Stripe checkout polling,
 * and decides between rendering the marketing page or the home dashboard for
 * users who already finished the funnel.
 */
export default function LandingPage() {
  const { status, resumeHref } = useFunnelResume();
  const hydrateFromServer = usePlanStore((s) => s.hydrateFromServer);

  // ── UTM/intent capture (preserved from former RootGate) ─────────────────
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);

    try {
      const captured: Record<string, string> = {};
      for (const k of UTM_KEYS) {
        const v = params.get(k);
        if (v) captured[k] = v;
      }
      if (Object.keys(captured).length > 0) {
        const existing = JSON.parse(window.sessionStorage.getItem("behavio_attribution") ?? "{}");
        window.sessionStorage.setItem(
          "behavio_attribution",
          JSON.stringify({ ...existing, ...captured, first_seen: existing.first_seen ?? Date.now() }),
        );
        trackEvent("attribution_captured", captured);
      }
    } catch {}

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
  }, []);

  // ── Stripe checkout success polling (preserved from former RootGate) ────
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("checkout") !== "success") {
      void hydrateFromServer();
      return;
    }

    const planFromUrl = params.get("plan") ?? "pro_annual";
    const sessionId = params.get("session_id") ?? undefined;

    params.delete("checkout");
    params.delete("plan");
    params.delete("session_id");
    const qs = params.toString();
    window.history.replaceState(null, "", `/${qs ? `?${qs}` : ""}`);

    let attempts = 0;
    const maxAttempts = 10;
    const poll = setInterval(async () => {
      attempts++;
      await hydrateFromServer();
      if (usePlanStore.getState().isPremium || attempts >= maxAttempts) {
        clearInterval(poll);
        const value = planFromUrl === "pro_monthly" ? 9.99 : 44;
        trackPurchase({
          value,
          currency: "EUR",
          plan: planFromUrl,
          transactionId: sessionId,
        });
      }
    }, 2000);
    return () => clearInterval(poll);
  }, [hydrateFromServer]);

  useEffect(() => {
    trackEvent("landing_view");
  }, []);

  // Returning users with a complete plan see the home dashboard, not the landing.
  if (status === "complete") {
    return <HomeClient />;
  }

  return (
    <div className="landing-root">
      <LandingNav />
      <ResumeBanner status={status} resumeHref={resumeHref} />
      <main>
        <Hero />
        <ArchetypePreview />
        <HowItWorks />
        <ProofStack />
        <TrustStrip />
        <MiniFAQ />
        <FinalCTA />
      </main>
      <LandingFooter />
      <StickyCTABar />
    </div>
  );
}
