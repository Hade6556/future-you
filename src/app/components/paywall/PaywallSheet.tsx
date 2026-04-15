"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePlanStore } from "../../state/planStore";
import { BRAND } from "../../data/copy";
import { formatTrialPriceNote, PRICING, type SubscriptionPlanId } from "../../data/pricing";
import { useCheckoutOptions } from "../../hooks/useCheckoutOptions";
import { PaywallPlanPicker } from "./PaywallPlanPicker";
import { ACCENT as LIME, NAVY, TEXT_HI, TEXT_MID, TEXT_LO, GLASS_BORDER } from "@/app/theme";

type Props = {
  open: boolean;
  onClose: () => void;
  variant?: "onboarding" | "session";
};

const GLASS = "rgba(15,32,64,0.92)";

function ProgressRing({ size = 56 }: { size?: number }) {
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <motion.div style={{ position: "relative", width: size, height: size }}>
      <svg
        width={size}
        height={size}
        style={{ transform: "rotate(-90deg)" }}
        viewBox={`0 0 ${size} ${size}`}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={3}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={LIME}
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut", delay: 0.2 }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.4, type: "spring", stiffness: 300, damping: 20 }}
          style={{ fontSize: 18, color: LIME }}
        >
          ✓
        </motion.span>
      </div>
    </motion.div>
  );
}

export function PaywallSheet({ open, onClose, variant = "onboarding" }: Props) {
  const startTrial = usePlanStore((s) => s.startTrial);
  const setPaywallSeen = usePlanStore((s) => s.setPaywallSeen);
  const maxStep = variant === "onboarding" ? 3 : 2;
  const [step, setStep] = useState(1);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const checkoutOptions = useCheckoutOptions();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlanId>("pro_annual");

  useEffect(() => {
    if (open) setStep(1);
  }, [open]);

  useEffect(() => {
    if (!checkoutOptions) return;
    if (selectedPlan === "pro_monthly" && !checkoutOptions.monthlyAvailable) {
      setSelectedPlan("pro_annual");
    }
  }, [checkoutOptions, selectedPlan]);

  const handleStartFree = async () => {
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
      /* Supabase not configured — continue to billing session */
    }

    try {
      const res = await fetch("/api/billing/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: selectedPlan }),
        credentials: "include",
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (data.url) {
        setPaywallSeen();
        startTrial();
        window.location.href = data.url;
        return;
      }
      setCheckoutLoading(false);
      alert(data.error ?? "Payment is not available right now. Please try again later.");
    } catch {
      setCheckoutLoading(false);
      alert("Something went wrong. Please try again.");
    }
  };

  const showPriceStep = step === maxStep;

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

  const ctaButton: React.CSSProperties = {
    width: "100%",
    padding: "16px 0",
    borderRadius: 16,
    border: "none",
    cursor: "pointer",
    fontFamily: "var(--font-barlow-condensed), sans-serif",
    fontWeight: 800,
    fontSize: 16,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    background: LIME,
    color: NAVY,
  };

  const eyebrow: React.CSSProperties = {
    fontFamily: "var(--font-jetbrains-mono), monospace",
    fontSize: 13,
    letterSpacing: "0.16em",
    textTransform: "uppercase" as const,
    color: TEXT_LO,
    margin: 0,
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop — z-[70] to fully cover NavBar (z-40) and FAB (z-50) */}
          <motion.div
            key="paywall-backdrop"
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 70,
              background: "rgba(6,9,18,0.80)",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            key="paywall-sheet"
            style={{
              position: "fixed",
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 80,
              maxHeight: "85dvh",
              overflowY: "auto",
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              background: GLASS,
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              borderTop: `1px solid ${GLASS_BORDER}`,
              boxShadow: "0 -4px 40px rgba(0,0,0,0.50)",
              padding: "0 24px 120px",
            }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 40 }}
          >
            {/* Drag handle */}
            <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 20px" }}>
              <div
                style={{
                  width: 40,
                  height: 4,
                  borderRadius: 2,
                  background: "rgba(255,255,255,0.15)",
                }}
              />
            </div>

            <AnimatePresence mode="wait">
              {/* Step 1 — Value / Progress */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    paddingBottom: 24,
                  }}
                >
                  <ProgressRing size={64} />

                  <p style={{ ...bodyText, fontSize: 15, lineHeight: 1.6, marginTop: 20 }}>
                    {BRAND.paywall.step1.subtext}
                  </p>
                  <p style={{ ...eyebrow, marginTop: 16 }}>
                    Join 43,219+ who found their path
                  </p>

                  <button
                    onClick={() => setStep(variant === "onboarding" ? 2 : maxStep)}
                    style={{ ...ctaButton, marginTop: 28 }}
                  >
                    {BRAND.paywall.step1.cta}
                  </button>
                </motion.div>
              )}

              {/* Step 2 — Features (onboarding only) */}
              {variant === "onboarding" && step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  style={{ display: "flex", flexDirection: "column", paddingBottom: 24 }}
                >
                  <h2 style={{ ...heading, fontSize: 24, textAlign: "center" }}>
                    {BRAND.paywall.step2.headline}
                  </h2>

                  <ul style={{ listStyle: "none", padding: 0, margin: "20px 0 0", display: "flex", flexDirection: "column", gap: 12 }}>
                    {BRAND.paywall.step2.features.map((f) => (
                      <li
                        key={f}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 12,
                          ...bodyText,
                          fontSize: 15,
                          color: TEXT_HI,
                        }}
                      >
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 18,
                            height: 18,
                            borderRadius: "50%",
                            background: LIME,
                            color: NAVY,
                            fontSize: 13,
                            fontWeight: 700,
                            flexShrink: 0,
                            marginTop: 2,
                          }}
                        >
                          ✓
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  {/* Quote */}
                  <div
                    style={{
                      marginTop: 24,
                      borderRadius: 16,
                      border: `1px solid ${GLASS_BORDER}`,
                      background: "rgba(255,255,255,0.04)",
                      padding: 16,
                    }}
                  >
                    <p style={{ ...bodyText, fontSize: 14, lineHeight: 1.6, color: TEXT_HI }}>
                      {BRAND.paywall.step2.quote}
                    </p>
                    <p
                      style={{
                        ...bodyText,
                        fontSize: 13,
                        fontWeight: 600,
                        marginTop: 8,
                        color: TEXT_MID,
                      }}
                    >
                      — {BRAND.paywall.step2.reviewer}
                    </p>
                    <p style={{ ...eyebrow, marginTop: 8 }}>
                      {BRAND.paywall.step2.socialCount}
                    </p>
                  </div>

                  <button onClick={() => setStep(3)} style={{ ...ctaButton, marginTop: 24 }}>
                    {BRAND.paywall.step2.cta}
                  </button>
                </motion.div>
              )}

              {/* Pricing step — single "Start Free Now" CTA */}
              {showPriceStep && (
                <motion.div
                  key="prices"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  <h2 style={{ ...heading, fontSize: 28, lineHeight: 1.15 }}>
                    {BRAND.paywall.step3.headline}
                  </h2>
                  <p style={{ ...eyebrow, marginTop: 8 }}>
                    {BRAND.paywall.step3.socialCount}
                  </p>

                  <div style={{ width: "100%", marginTop: 20 }}>
                    <PaywallPlanPicker
                      value={selectedPlan}
                      onChange={setSelectedPlan}
                      monthlyAvailable={checkoutOptions?.monthlyAvailable !== false}
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

                  <button
                    onClick={() => void handleStartFree()}
                    disabled={checkoutLoading}
                    style={{
                      ...ctaButton,
                      marginTop: 20,
                      opacity: checkoutLoading ? 0.6 : 1,
                      boxShadow: "0 8px 32px rgba(94,205,161,0.20)",
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
                      marginTop: 10,
                    }}
                  >
                    {formatTrialPriceNote(checkoutOptions?.trialDays ?? 7, selectedPlan)}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 16,
                      marginTop: 16,
                    }}
                  >
                    {BRAND.paywall.step3.trust.map((t) => (
                      <span key={t} style={{ ...eyebrow, fontSize: 12 }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
