"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { usePlanStore } from "../../state/planStore";
import { Button } from "@/components/ui/button";
import { TrustpilotStars } from "@/components/ui/TrustpilotStars";
import { BRAND } from "../../data/copy";

type Plan = "free" | "weekly" | "annual";

type Props = {
  open: boolean;
  onClose: () => void;
  /** Onboarding = 3 value steps then prices; session = 1 value step then prices. */
  variant?: "onboarding" | "session";
};

// Animated progress ring for step 1
function ProgressRing({ size = 56 }: { size?: number }) {
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <motion.div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border)" strokeWidth={3} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--accent-success)"
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut", delay: 0.2 }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.4, type: "spring", stiffness: 300, damping: 20 }}
          className="text-[18px]"
        >
          ✓
        </motion.span>
      </div>
    </motion.div>
  );
}

export function PaywallSheet({ open, onClose, variant = "onboarding" }: Props) {
  const router = useRouter();
  const setPremium = usePlanStore((s) => s.setPremium);
  const startTrial = usePlanStore((s) => s.startTrial);
  const setPaywallSeen = usePlanStore((s) => s.setPaywallSeen);
  const [selected, setSelected] = useState<Plan>("annual");
  // onboarding: 3 steps (value, features, pricing); session: 2 steps (value, pricing)
  const maxStep = variant === "onboarding" ? 3 : 2;
  const [step, setStep] = useState(1);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    if (open) setStep(1);
  }, [open]);

  const handleCta = async () => {
    setPaywallSeen();
    if (selected === "free") {
      startTrial();
      router.push("/signup");
      return;
    }

    const stripePlan = selected === "annual" ? "pro_annual" : "pro_monthly";
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: stripePlan }),
      });
      const data = await res.json() as { url?: string; error?: string };
      if (data.url) {
        window.location.href = data.url;
      } else {
        setPremium();
        router.push("/signup");
      }
    } catch {
      setPremium();
      router.push("/signup");
    } finally {
      setCheckoutLoading(false);
    }
  };

  const showPriceStep = step === maxStep;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-foreground/25"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-x-0 bottom-0 z-50 max-h-[90dvh] overflow-y-auto rounded-t-2xl border-t border-border bg-card px-6 pb-10 shadow-[0_-2px_16px_rgba(0,0,0,0.2)]"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 40 }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pb-4 pt-3">
              <div className="h-1 w-10 rounded-full bg-border" />
            </div>

            <AnimatePresence mode="wait">
              {/* ── Step 1: Value / Progress ── */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="flex flex-col items-center pb-6 text-center"
                >
                  <ProgressRing size={64} />

                  <h2 className="mt-5 font-display text-[28px] font-bold leading-tight text-foreground">
                    {BRAND.paywall.step1.headline}
                  </h2>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                    {BRAND.paywall.step1.subtext}
                  </p>
                  <p className="mt-4 text-[12px] font-medium uppercase tracking-widest text-muted-foreground">
                    Join 43,219+ who found their path
                  </p>

                  <Button
                    onClick={() => setStep(variant === "onboarding" ? 2 : maxStep)}
                    className="mt-8 w-full rounded-full"
                    size="lg"
                  >
                    {BRAND.paywall.step1.cta}
                  </Button>
                </motion.div>
              )}

              {/* ── Step 2: Features + Social Proof (onboarding only) ── */}
              {variant === "onboarding" && step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="flex flex-col pb-6"
                >
                  <h2 className="text-center font-display text-[24px] font-bold text-foreground">
                    {BRAND.paywall.step2.headline}
                  </h2>

                  <ul className="mt-5 space-y-3">
                    {BRAND.paywall.step2.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-[15px] text-foreground">
                        <span className="mt-0.5 h-4 w-4 flex-shrink-0 rounded-full bg-accent text-[10px] font-bold text-white flex items-center justify-center">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  {/* Social proof */}
                  <div className="mt-6 rounded-xl border border-border bg-secondary p-4">
                    <div className="flex items-start gap-3">
                      <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-muted">
                        <Image
                          src="https://api.dicebear.com/7.x/avataaars/png?seed=MayaR&size=80"
                          alt=""
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <TrustpilotStars rating={5} size="sm" className="mb-1" />
                        <p className="text-[13px] font-semibold text-foreground">Maya R.</p>
                      </div>
                    </div>
                    <p className="mt-2 text-[14px] leading-relaxed text-foreground">
                      {BRAND.paywall.step2.quote}
                    </p>
                    <p className="mt-2 text-[11px] uppercase tracking-widest text-muted-foreground">
                      {BRAND.paywall.step2.socialCount}
                    </p>
                  </div>

                  <Button onClick={() => setStep(3)} className="mt-6 w-full rounded-full" size="lg">
                    {BRAND.paywall.step2.cta}
                  </Button>
                </motion.div>
              )}

              {/* ── Pricing step ── */}
              {showPriceStep && (
                <motion.div
                  key="prices"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="flex flex-col"
                >
                  <h2 className="text-center font-display text-[24px] font-bold leading-tight text-foreground">
                    {BRAND.paywall.step3.headline}
                  </h2>
                  <p className="mt-2 text-center text-[12px] font-medium uppercase tracking-widest text-muted-foreground">
                    {BRAND.paywall.step3.socialCount}
                  </p>

                  <div className="mt-5 flex flex-col gap-3">
                    {/* Annual — default selected */}
                    <button
                      onClick={() => setSelected("annual")}
                      className={`relative flex flex-col rounded-2xl border p-4 text-left transition-all ${
                        selected === "annual"
                          ? "border-primary bg-primary/8 ring-2 ring-primary/25"
                          : "border-border bg-card"
                      }`}
                    >
                      {/* Amber "Most Popular" badge */}
                      <span className="absolute -top-3 right-4 rounded-full bg-accent-warm px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                        Most Popular · Save 58%
                      </span>
                      <div className="flex items-center justify-between">
                        <p className="text-[15px] font-semibold text-foreground">Annual</p>
                        <span className="text-[16px] font-bold text-foreground">$49.99/yr</span>
                      </div>
                      <p className={`mt-0.5 text-[13px] ${selected === "annual" ? "text-primary" : "text-muted-foreground"}`}>
                        $4.17/mo · $0.14/day
                      </p>
                      <p className="mt-1 text-[11px] text-muted-foreground italic">
                        {BRAND.paywall.step3.annualReframe}
                      </p>
                    </button>

                    {/* Weekly */}
                    <button
                      onClick={() => setSelected("weekly")}
                      className={`flex items-center justify-between rounded-2xl border p-4 transition-all ${
                        selected === "weekly"
                          ? "border-primary bg-primary/8 ring-2 ring-primary/25"
                          : "border-border bg-card"
                      }`}
                    >
                      <div className="text-left">
                        <p className="text-[15px] font-semibold text-foreground">Weekly</p>
                        <p className="text-[12px] text-muted-foreground italic">
                          {BRAND.paywall.step3.weeklyReframe}
                        </p>
                      </div>
                      <span className="text-[16px] font-bold text-foreground">$9.99/wk</span>
                    </button>

                    {/* Free trial */}
                    <button
                      onClick={() => setSelected("free")}
                      className={`flex items-center justify-between rounded-2xl border border-dashed p-4 transition-all ${
                        selected === "free" ? "border-muted-foreground ring-1 ring-border" : "border-border"
                      } bg-transparent`}
                    >
                      <div className="text-left">
                        <p className="text-[15px] font-semibold text-foreground">Free Trial</p>
                        <p className="text-[12px] text-muted-foreground italic">
                          {BRAND.paywall.step3.freeReframe}
                        </p>
                      </div>
                      <span className="text-[13px] font-semibold text-muted-foreground">14 days</span>
                    </button>
                  </div>

                  <Button
                    onClick={() => void handleCta()}
                    disabled={checkoutLoading}
                    variant={selected === "free" ? "outline" : "default"}
                    className={`mt-6 w-full rounded-full ${
                      selected === "free" ? "border-border text-foreground" : "bg-primary text-primary-foreground hover:bg-primary-hover"
                    }`}
                    size="lg"
                  >
                    {checkoutLoading
                      ? "Redirecting..."
                      : selected === "free"
                      ? BRAND.cta.continueForFree
                      : BRAND.cta.getFullAccess}
                  </Button>

                  <div className="mt-4 flex items-center justify-center gap-4">
                    {BRAND.paywall.step3.trust.map((t) => (
                      <span key={t} className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
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
