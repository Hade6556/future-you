"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ACCENT, accentRgba } from "@/app/theme";
import { isResumable, type FunnelStatus } from "@/app/state/useFunnelResume";

const COPY: Record<Exclude<FunnelStatus, "fresh" | "complete">, { label: string; cta: string }> = {
  mid_onboarding: {
    label: "Welcome back. Your archetype is ready.",
    cta: "Finish onboarding →",
  },
  mid_generating: {
    label: "Welcome back. Your plan is almost done.",
    cta: "See your plan →",
  },
};

export default function ResumeBanner({
  status,
  resumeHref,
}: {
  status: FunnelStatus;
  resumeHref: string;
}) {
  const [dismissed, setDismissed] = useState(false);
  const resumable = isResumable(status);
  const show = resumable && !dismissed;
  const copy = resumable
    ? COPY[status as Exclude<FunnelStatus, "fresh" | "complete">]
    : null;

  return (
    <AnimatePresence>
      {show && copy && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          style={{
            background: accentRgba(0.08),
            borderBottom: `1px solid ${accentRgba(0.22)}`,
          }}
        >
          <div
            className="landing-section-inner"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              paddingTop: 10,
              paddingBottom: 10,
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-apercu), sans-serif",
                fontSize: 14,
                color: "rgba(255,255,255,0.92)",
                fontWeight: 500,
              }}
            >
              {copy.label}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Link
                href={resumeHref}
                style={{
                  fontFamily: "var(--font-apercu), sans-serif",
                  fontSize: 14,
                  fontWeight: 600,
                  color: ACCENT,
                  textDecoration: "none",
                  letterSpacing: "0.01em",
                }}
              >
                {copy.cta}
              </Link>
              <button
                type="button"
                aria-label="Dismiss"
                onClick={() => setDismissed(true)}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "rgba(255,255,255,0.55)",
                  fontSize: 18,
                  lineHeight: 1,
                  padding: 4,
                }}
              >
                ×
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
