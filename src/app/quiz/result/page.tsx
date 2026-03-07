"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { ARCHETYPES } from "../../data/archetypes";
import { usePlanStore } from "../../state/planStore";
import { PaywallSheet } from "../../components/paywall/PaywallSheet";

const AMBITION_LABELS: Record<string, string> = {
  entrepreneur: "build a business",
  athlete: "transform your body",
  weight_loss: "lose weight",
  creative: "create something big",
  student: "master new skills",
  wellness: "improve your wellbeing",
};

export default function ResultPage() {
  const router = useRouter();
  const archetype = usePlanStore((s) => s.dogArchetype);
  const ambitionType = usePlanStore((s) => s.ambitionType);
  const userName = usePlanStore((s) => s.userName);
  const [paywallOpen, setPaywallOpen] = useState(false);

  const arch = archetype ? ARCHETYPES.find((a) => a.id === archetype) : null;
  const ambitionLabel = AMBITION_LABELS[ambitionType ?? "wellness"] ?? "reach your goals";

  if (!arch) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#F8F6F1] px-6">
        <p className="text-[#6A6A6A]">Loading your results...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-dvh bg-[#F8F6F1] px-6 pb-12 pt-[max(48px,env(safe-area-inset-top,16px))]">
      <div className="mx-auto max-w-md">
        {/* Mascot entrance */}
        <motion.div
          className="mx-auto h-[180px] w-[180px]"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <div className="relative h-full w-full">
            <Image src="/orb-face.png" alt={arch.name} fill className="object-contain" />
          </div>
        </motion.div>

        {/* Label */}
        <motion.p
          className="mt-4 text-center text-[11px] font-medium uppercase tracking-widest text-[#6A6A6A]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Your coaching archetype is
        </motion.p>

        {/* Name */}
        <motion.h1
          className="mt-2 text-center text-[36px] font-bold leading-tight text-[#121212]"
          style={{ fontFamily: "'Poppins', sans-serif" }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          {arch.emoji} {arch.name}
        </motion.h1>

        {/* Tagline */}
        <motion.p
          className="mt-1 text-center text-[15px] italic text-[#6A6A6A]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          &ldquo;{arch.tagline}&rdquo;
        </motion.p>

        {/* Personalized line */}
        <motion.p
          className="mt-6 text-center text-[15px] font-medium leading-relaxed text-[#121212]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          {userName || "You"}, you said you want to {ambitionLabel}. Here&apos;s your path.
        </motion.p>

        {/* Plan teaser */}
        <motion.div
          className="mt-8 rounded-2xl border border-[#E0E0E0] bg-white p-5"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <p className="text-[11px] font-medium uppercase tracking-widest text-[#6A6A6A]">
            Your 90-Day Roadmap Preview
          </p>
          <ul className="mt-4 flex flex-col gap-3">
            <li className="flex items-start gap-3">
              <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#6FCF97] text-[11px] text-white">
                1
              </span>
              <span className="text-[15px] text-[#121212]">
                Set your foundation — daily rituals matched to your {arch.name} style
              </span>
            </li>
            <li className="relative flex items-start gap-3">
              <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#2D9CDB] text-[11px] text-white">
                2
              </span>
              <span className="text-[15px] text-[#121212] blur-sm">
                Build momentum with weekly challenges tailored to your goals
              </span>
              <span className="absolute right-0 top-0 text-[14px]">🔒</span>
            </li>
            <li className="relative flex items-start gap-3">
              <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#F2994A] text-[11px] text-white">
                3
              </span>
              <span className="text-[15px] text-[#121212] blur-sm">
                Compound results and unlock your personalized mastery phase
              </span>
              <span className="absolute right-0 top-0 text-[14px]">🔒</span>
            </li>
          </ul>
          <button
            onClick={() => setPaywallOpen(true)}
            className="mt-4 text-[14px] font-semibold text-[#6FCF97]"
          >
            Unlock your full plan →
          </button>
        </motion.div>

        {/* Testimonial */}
        <motion.div
          className="mt-6 rounded-2xl border border-[#E0E0E0] bg-white p-5 shadow-sm"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          <span className="text-[28px] leading-none text-[#E0E0E0]">&ldquo;</span>
          <p className="mt-1 text-[15px] leading-relaxed text-[#121212]">
            I&apos;m a {arch.name} too. After 30 days with Future Me I finally stopped starting over
            every Monday.
          </p>
          <p className="mt-3 text-[13px] text-[#6A6A6A]">
            — Jamie, 28 · {arch.name}
          </p>
          <div className="mt-2 flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className="text-[16px] text-[#FFD65A]">★</span>
            ))}
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div
          className="mt-8 flex flex-col items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
        >
          <button
            onClick={() => setPaywallOpen(true)}
            className="flex h-[56px] w-full items-center justify-center rounded-[28px] bg-[#121212] text-[17px] font-semibold text-white transition-transform active:scale-[0.97]"
          >
            Get my full plan
          </button>
          <button
            onClick={() => router.push("/")}
            className="text-[14px] font-medium text-[#6A6A6A] underline"
          >
            Continue exploring for free →
          </button>
        </motion.div>
      </div>

      <PaywallSheet open={paywallOpen} onClose={() => setPaywallOpen(false)} />
    </div>
  );
}
