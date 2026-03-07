"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { usePlanStore } from "../../state/planStore";

type Plan = "trial" | "monthly" | "annual";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function PaywallSheet({ open, onClose }: Props) {
  const router = useRouter();
  const setPremium = usePlanStore((s) => s.setPremium);
  const startTrial = usePlanStore((s) => s.startTrial);
  const setPaywallSeen = usePlanStore((s) => s.setPaywallSeen);
  const [selected, setSelected] = useState<Plan>("annual");

  const handleCta = () => {
    setPaywallSeen();
    if (selected === "trial") {
      startTrial();
    } else {
      setPremium();
    }
    router.push("/signup");
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-x-0 bottom-0 z-50 max-h-[90dvh] overflow-y-auto rounded-t-[32px] bg-white px-6 pb-10 shadow-[0_-8px_40px_rgba(0,0,0,0.15)]"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 40 }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-4">
              <div className="h-1 w-10 rounded-full bg-[#E0E0E0]" />
            </div>

            <h2
              className="text-center text-[22px] font-bold text-[#121212]"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Your personalized plan is ready
            </h2>

            <p className="mt-2 text-center text-[13px] text-[#6A6A6A]">
              Join 12,847 people already coaching with Future Me
            </p>

            <div className="mt-6 flex flex-col gap-3">
              {/* Free Trial */}
              <button
                onClick={() => setSelected("trial")}
                className={`flex items-center justify-between rounded-2xl border p-4 transition-all ${
                  selected === "trial"
                    ? "border-[#121212] ring-2 ring-[#121212]/30"
                    : "border-[#E0E0E0]"
                } bg-white`}
              >
                <div className="text-left">
                  <p className="text-[16px] font-semibold text-[#121212]">Free Trial</p>
                  <p className="text-[13px] text-[#6A6A6A]">7 days, no credit card needed</p>
                </div>
                <span className="text-[16px] font-bold text-[#121212]">Free</span>
              </button>

              {/* Monthly */}
              <button
                onClick={() => setSelected("monthly")}
                className={`flex items-center justify-between rounded-2xl border p-4 transition-all ${
                  selected === "monthly"
                    ? "border-[#121212] ring-2 ring-[#121212]/30"
                    : "border-[#E0E0E0]"
                } bg-white`}
              >
                <div className="text-left">
                  <p className="text-[16px] font-semibold text-[#121212]">Monthly</p>
                  <p className="text-[13px] text-[#6A6A6A]">Billed monthly</p>
                </div>
                <span className="text-[16px] font-bold text-[#121212]">$9.99/mo</span>
              </button>

              {/* Annual — best value */}
              <button
                onClick={() => setSelected("annual")}
                className={`relative flex items-center justify-between rounded-2xl border p-4 transition-all ${
                  selected === "annual"
                    ? "border-[#121212] bg-[#121212] text-white ring-2 ring-[#121212]"
                    : "border-[#E0E0E0] bg-white text-[#121212]"
                }`}
              >
                <span className="absolute -top-2.5 right-4 rounded-full bg-[#6FCF97] px-3 py-0.5 text-[11px] font-bold text-white">
                  BEST VALUE
                </span>
                <div className="text-left">
                  <p className="text-[16px] font-semibold">Annual</p>
                  <p className={`text-[13px] ${selected === "annual" ? "text-white/70" : "text-[#6A6A6A]"}`}>
                    Just $4.99/mo
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[16px] font-bold">$59.99/yr</span>
                  <p className={`text-[12px] line-through ${selected === "annual" ? "text-white/50" : "text-[#6A6A6A]"}`}>
                    $119.88
                  </p>
                </div>
              </button>
            </div>

            <button
              onClick={handleCta}
              className="mt-6 flex h-[56px] w-full items-center justify-center rounded-[28px] bg-[#121212] text-[17px] font-semibold text-white transition-transform active:scale-[0.97]"
            >
              {selected === "trial" ? "Start Free Trial" : "Get Full Access"}
            </button>

            <div className="mt-4 flex items-center justify-center gap-3">
              {["Cancel anytime", "14-day guarantee", "Instant access"].map((t) => (
                <span key={t} className="text-[12px] text-[#6A6A6A]">
                  {t}
                </span>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
