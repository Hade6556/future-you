"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { usePlanStore } from "../state/planStore";
import { BRAND } from "../data/copy";
import { FunnelThemeShell } from "../components/funnel/FunnelThemeShell";
import { PaywallPlanPicker } from "../components/paywall/PaywallPlanPicker";
import { PaywallProofStack } from "../components/paywall/PaywallProofStack";
import { PaywallReassurance } from "../components/paywall/PaywallReassurance";
import { resolvePaywallVariant, type PaywallVariant } from "../components/paywall/paywallExperiment";
import { paywallCheckoutFootnote, PRICING, type SubscriptionPlanId } from "../data/pricing";
import { useCheckoutOptions } from "../hooks/useCheckoutOptions";
import { trackEvent } from "../quiz/utils/analytics";
import { ACCENT, ACCENT_HOVER, NAVY, TEXT_HI, TEXT_MID, TEXT_LO, GLASS_BORDER, accentRgba } from "@/app/theme";

const heading: React.CSSProperties = {
  fontFamily: "var(--font-apercu), sans-serif",
  fontWeight: 700,
  fontStyle: "normal",
  color: TEXT_HI,
  margin: 0,
};

const bodyText: React.CSSProperties = {
  fontFamily: "var(--font-apercu), sans-serif",
  fontWeight: 400,
  color: TEXT_MID,
  margin: 0,
};

const eyebrow: React.CSSProperties = {
  fontFamily: "var(--font-jetbrains-mono), monospace",
  fontSize: 11,
  letterSpacing: "0.18em",
  textTransform: "uppercase" as const,
  color: TEXT_LO,
  margin: 0,
};

function BlurredPlanPreview() {
  const pipelinePlan = usePlanStore((s) => s.pipelinePlan);
  const phases = pipelinePlan?.phases ?? [];
  const totalWeeks = pipelinePlan?.horizon_weeks ?? 12;

  return (
    <div
      style={{
        width: "100%",
        borderRadius: 20,
        background: "rgba(255,255,255,0.04)",
        border: `1px solid ${GLASS_BORDER}`,
        padding: "20px 18px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Phase 1 — visible teaser */}
      {phases[0] && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <span
              style={{
                display: "flex",
                height: 24,
                width: 24,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                background: "var(--cta)",
                color: NAVY,
                fontFamily: "var(--font-barlow-condensed), sans-serif",
                fontWeight: 800,
                fontSize: 13,
              }}
            >
              1
            </span>
            <span style={{ ...heading, fontSize: 15, fontStyle: "normal" }}>
              {phases[0].phase_name}
            </span>
          </div>
          <p style={{ ...bodyText, fontSize: 14, paddingLeft: 34 }}>
            {phases[0].goal}
          </p>
        </div>
      )}

      {/* Remaining phases — blurred */}
      <div
        style={{
          filter: "blur(5px)",
          opacity: 0.45,
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        {phases.slice(1).map((phase, i) => (
          <div key={phase.phase_number} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <span
                style={{
                  display: "flex",
                  height: 24,
                  width: 24,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  background: TEXT_LO,
                  color: NAVY,
                  fontFamily: "var(--font-barlow-condensed), sans-serif",
                  fontWeight: 800,
                  fontSize: 13,
                }}
              >
                {i + 2}
              </span>
              <span style={{ ...heading, fontSize: 15, fontStyle: "normal" }}>
                {phase.phase_name}
              </span>
            </div>
            <p style={{ ...bodyText, fontSize: 13, paddingLeft: 34 }}>
              {phase.goal}
            </p>
          </div>
        ))}
      </div>

      {/* Summary line */}
      <div
        style={{
          marginTop: 12,
          paddingTop: 12,
          borderTop: `1px solid ${GLASS_BORDER}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ ...eyebrow }}>
          {phases.length} phases · {totalWeeks} weeks
        </span>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            color: "var(--cta)",
            fontFamily: "var(--font-barlow-condensed), sans-serif",
            fontWeight: 700,
            fontSize: 13,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
            <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          Locked
        </span>
      </div>
    </div>
  );
}

export default function PaywallPage() {
  const router = useRouter();
  const isPremium = usePlanStore((s) => s.isPremium);
  const pipelinePlan = usePlanStore((s) => s.pipelinePlan);
  const startTrial = usePlanStore((s) => s.startTrial);
  const setPaywallSeen = usePlanStore((s) => s.setPaywallSeen);
  const userName = usePlanStore((s) => s.userName);
  const marketingIntent = usePlanStore((s) => s.marketingIntent);

  const checkoutOptions = useCheckoutOptions();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlanId>("pro_annual");
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [variant, setVariant] = useState<PaywallVariant>("proof");
  const proofSeenTracked = useRef(false);

  // Guard: no plan generated yet → send back to onboarding
  useEffect(() => {
    const assigned = resolvePaywallVariant();
    setVariant(assigned);
    trackEvent("paywall_viewed", { surface: "page", variant: assigned });
  }, []);

  useEffect(() => {
    if (variant !== "proof" || proofSeenTracked.current) return;
    proofSeenTracked.current = true;
    trackEvent("paywall_proof_seen", { surface: "page", variant });
  }, [variant]);

  useEffect(() => {
    trackEvent("paywall_plan_selected", { surface: "page", variant, plan: selectedPlan });
  }, [selectedPlan, variant]);

  useEffect(() => {
    if (!pipelinePlan && !isPremium) {
      router.replace("/onboarding");
    }
  }, [pipelinePlan, isPremium, router]);

  useEffect(() => {
    if (!checkoutOptions) return;
    if (selectedPlan === "pro_monthly" && !checkoutOptions.monthlyAvailable) {
      setSelectedPlan("pro_annual");
    }
  }, [checkoutOptions, selectedPlan]);

  if (isPremium) {
    router.replace("/");
    return null;
  }

  const handleStartFree = async () => {
    trackEvent("paywall_cta_clicked", { surface: "page", variant, plan: selectedPlan });
    setCheckoutLoading(true);

    try {
      const { hasSupabasePublicConfig } = await import("@/lib/supabase/env");
      if (hasSupabasePublicConfig()) {
        const { ensureAnonymousSession, formatCheckoutSessionError } = await import(
          "@/lib/supabase/ensure-anonymous-session"
        );
        const { user, errorMessage } = await ensureAnonymousSession();
        if (!user) {
          setCheckoutLoading(false);
          alert(formatCheckoutSessionError(errorMessage));
          return;
        }
      }
    } catch {
      /* Supabase not configured — continue to billing session (local-only dev) */
    }

    let attribution: Record<string, string> = {};
    try {
      attribution = JSON.parse(window.sessionStorage.getItem("behavio_attribution") ?? "{}");
    } catch {}

    try {
      const res = await fetch("/api/billing/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: selectedPlan, attribution }),
        credentials: "include",
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (data.url) {
        trackEvent("paywall_checkout_redirect_success", { surface: "page", variant, plan: selectedPlan });
        setPaywallSeen();
        startTrial();
        window.location.href = data.url;
        return;
      }
      trackEvent("paywall_checkout_redirect_failed", {
        surface: "page",
        variant,
        plan: selectedPlan,
        reason: data.error ?? "no_url",
      });
      setCheckoutLoading(false);
      alert(data.error ?? "Payment is not available right now. Please try again later.");
    } catch {
      trackEvent("paywall_checkout_redirect_failed", {
        surface: "page",
        variant,
        plan: selectedPlan,
        reason: "request_failed",
      });
      setCheckoutLoading(false);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <FunnelThemeShell intent={marketingIntent}>
    <div
      style={{
        minHeight: "100dvh",
        background: NAVY,
        position: "relative",
        overflow: "hidden",
        // Override the per-intent --cta on the paywall — this is a critical
        // conversion screen and consistency with the rest of the app
        // (sage-mint accent everywhere) beats per-intent vibe-matching.
        ["--cta" as string]: ACCENT,
      } as React.CSSProperties}
    >
      {/* Background mesh */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          background: `
            radial-gradient(ellipse 70% 55% at 50% 20%, rgba(94,205,161,0.08) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 10% 90%, rgba(15,40,110,0.40) 0%, transparent 55%),
            linear-gradient(170deg, #0f1e3a 0%, #060912 55%)
          `,
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minHeight: "100dvh",
          padding: "max(3rem, env(safe-area-inset-top, 3rem)) 24px 40px",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            maxWidth: 380,
          }}
        >
          {/* Headline */}
          <p
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 11,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: ACCENT,
              margin: "0 0 14px",
              textAlign: "center",
            }}
          >
            ↳ Phase 1 unlocked
          </p>
          <h1
            style={{
              fontFamily: "var(--font-barlow-condensed), sans-serif",
              fontWeight: 900,
              fontSize: "clamp(36px, 9vw, 48px)",
              lineHeight: 1.0,
              textAlign: "center",
              letterSpacing: "-0.025em",
              color: TEXT_HI,
              margin: 0,
            }}
          >
            {userName ? `${userName}, your` : "Your"}{" "}
            <span style={{ fontStyle: "italic", color: "var(--cta)" }}>plan is ready.</span>
          </h1>
          <p
            style={{
              ...bodyText,
              fontSize: 15,
              lineHeight: 1.6,
              textAlign: "center",
              marginTop: 12,
              maxWidth: 300,
            }}
          >
            Start free. Full access. No commitment.
          </p>

          {/* A/B: control keeps blurred preview, variant shows proof stack */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.35 }}
            style={{ width: "100%", marginTop: 28 }}
          >
            {variant === "proof" ? <PaywallProofStack /> : <BlurredPlanPreview />}
          </motion.div>

          <div style={{ width: "100%", maxWidth: 360, marginTop: 20 }}>
            <PaywallPlanPicker
              value={selectedPlan}
              onChange={setSelectedPlan}
              monthlyAvailable={checkoutOptions?.monthlyAvailable !== false}
              trialDays={checkoutOptions?.trialDays ?? 3}
              disabled={checkoutLoading}
            />
            {checkoutOptions?.monthlyAvailable !== false && selectedPlan === "pro_annual" ? (
              <p
                style={{
                  ...bodyText,
                  fontSize: 12,
                  color: TEXT_LO,
                  marginTop: 8,
                  textAlign: "center",
                }}
              >
                {PRICING.annualSavingsHint}
              </p>
            ) : null}
          </div>

          {/* CTA */}
          <button
            onClick={() => void handleStartFree()}
            disabled={checkoutLoading}
            style={{
              width: "100%",
              maxWidth: 360,
              padding: "16px 24px",
              borderRadius: 12,
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font-apercu), sans-serif",
              fontWeight: 700,
              fontSize: 15.5,
              letterSpacing: "-0.005em",
              background: `linear-gradient(180deg, ${ACCENT} 0%, ${ACCENT_HOVER} 100%)`,
              color: NAVY,
              marginTop: 28,
              opacity: checkoutLoading ? 0.6 : 1,
              boxShadow: `0 1px 0 rgba(255,255,255,0.20) inset, 0 12px 28px -10px ${accentRgba(0.55)}`,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            {checkoutLoading ? "Redirecting…" : (
              <>
                Start free now
                <span aria-hidden style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 12 }}>→</span>
              </>
            )}
          </button>

          {/* Price note — small, muted */}
          <p
            style={{
              ...bodyText,
              fontSize: 13,
              color: TEXT_LO,
              textAlign: "center",
              marginTop: 10,
            }}
          >
            {paywallCheckoutFootnote()}
          </p>

          <PaywallReassurance />

          {/* Trust badges */}
          <div
            style={{
              width: "100%",
              maxWidth: 360,
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              columnGap: 10,
              marginTop: 16,
            }}
          >
            {BRAND.paywall.step3.trust.map((t) => (
              <span key={t} style={{ ...eyebrow, textAlign: "center", lineHeight: 1.35, display: "block" }}>
                {t}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
    </FunnelThemeShell>
  );
}
