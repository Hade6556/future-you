"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { usePlanStore } from "../state/planStore";
import { BRAND } from "../data/copy";

const LIME = "#C8FF00";
const NAVY = "#060912";
const TEXT_HI = "rgba(235,242,255,0.95)";
const TEXT_MID = "rgba(120,155,195,0.80)";
const TEXT_LO = "rgba(120,155,195,0.50)";
const GLASS_BORDER = "rgba(255,255,255,0.10)";

const heading: React.CSSProperties = {
  fontFamily: "var(--font-barlow-condensed), sans-serif",
  fontWeight: 900,
  fontStyle: "italic",
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
  fontSize: 10,
  letterSpacing: "0.16em",
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
                background: LIME,
                color: NAVY,
                fontFamily: "var(--font-barlow-condensed), sans-serif",
                fontWeight: 800,
                fontSize: 11,
              }}
            >
              1
            </span>
            <span style={{ ...heading, fontSize: 14, fontStyle: "normal" }}>
              {phases[0].phase_name}
            </span>
          </div>
          <p style={{ ...bodyText, fontSize: 12, paddingLeft: 34 }}>
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
                  fontSize: 11,
                }}
              >
                {i + 2}
              </span>
              <span style={{ ...heading, fontSize: 13, fontStyle: "normal" }}>
                {phase.phase_name}
              </span>
            </div>
            <p style={{ ...bodyText, fontSize: 11, paddingLeft: 34 }}>
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
        <span style={{ ...eyebrow, fontSize: 9 }}>
          {phases.length} phases · {totalWeeks} weeks
        </span>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            color: LIME,
            fontFamily: "var(--font-barlow-condensed), sans-serif",
            fontWeight: 700,
            fontSize: 11,
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
  const startTrial = usePlanStore((s) => s.startTrial);
  const setPaywallSeen = usePlanStore((s) => s.setPaywallSeen);
  const userName = usePlanStore((s) => s.userName);

  const [checkoutLoading, setCheckoutLoading] = useState(false);

  if (isPremium) {
    router.replace("/plan?reveal=true");
    return null;
  }

  const handleStartFree = async () => {
    setPaywallSeen();
    startTrial();
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "pro_annual" }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (data.url) {
        window.location.href = data.url;
      } else {
        // Stripe not configured — grant access locally for dev
        usePlanStore.getState().setPremium();
        router.push("/plan?reveal=true");
      }
    } catch {
      // Fallback for dev/offline
      usePlanStore.getState().setPremium();
      router.push("/plan?reveal=true");
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: NAVY,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background mesh */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          background: `
            radial-gradient(ellipse 70% 55% at 50% 20%, rgba(200,255,0,0.08) 0%, transparent 60%),
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
          padding: "max(4rem, env(safe-area-inset-top, 4rem)) 24px 60px",
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
          <h1
            style={{
              ...heading,
              fontSize: 42,
              lineHeight: 1.05,
              textAlign: "center",
              letterSpacing: "-0.02em",
            }}
          >
            {userName ? `${userName}, your` : "Your"}{" "}
            <span style={{ color: LIME }}>plan is ready.</span>
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

          {/* Blurred plan preview */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.35 }}
            style={{ width: "100%", marginTop: 28 }}
          >
            <BlurredPlanPreview />
          </motion.div>

          {/* CTA */}
          <button
            onClick={() => void handleStartFree()}
            disabled={checkoutLoading}
            style={{
              width: "100%",
              maxWidth: 360,
              padding: "18px 0",
              borderRadius: 14,
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font-barlow-condensed), sans-serif",
              fontWeight: 800,
              fontSize: 17,
              letterSpacing: "0.10em",
              textTransform: "uppercase",
              background: LIME,
              color: NAVY,
              marginTop: 28,
              opacity: checkoutLoading ? 0.6 : 1,
              boxShadow: "0 8px 32px rgba(200,255,0,0.20)",
            }}
          >
            {checkoutLoading ? "Redirecting..." : "Start Free Now"}
          </button>

          {/* Price note — small, muted */}
          <p
            style={{
              ...bodyText,
              fontSize: 12,
              color: TEXT_LO,
              textAlign: "center",
              marginTop: 10,
            }}
          >
            {BRAND.paywall.step3.priceNote}
          </p>

          {/* Trust badges */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 20,
              marginTop: 16,
            }}
          >
            {BRAND.paywall.step3.trust.map((t) => (
              <span key={t} style={{ ...eyebrow, fontSize: 9 }}>
                {t}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
