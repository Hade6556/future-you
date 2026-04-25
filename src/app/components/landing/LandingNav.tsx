"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { BehavioLogo } from "@/app/components/BehavioLogo";
import { ACCENT, ACCENT_HOVER, ON_ACCENT, TEXT_MID, accentRgba } from "@/app/theme";
import { trackEvent } from "@/app/quiz/utils/analytics";

export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 320);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        backdropFilter: "blur(14px)",
        background: "rgba(6, 9, 18, 0.72)",
        borderBottom: `1px solid ${scrolled ? "rgba(255,255,255,0.08)" : "transparent"}`,
        transition: "border-color 0.2s",
      }}
    >
      <div
        className="landing-section-inner"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 64,
        }}
      >
        <Link
          href="/"
          aria-label="Behavio home"
          style={{ display: "inline-flex", textDecoration: "none" }}
        >
          <BehavioLogo variant="lockup" size={20} color="rgba(255,255,255,0.95)" />
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <AnimatePresence>
            {scrolled && (
              <motion.div
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  href="/quiz"
                  onClick={() => trackEvent("funnel_start", { source: "landing_nav" })}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 14px",
                    borderRadius: 10,
                    background: `linear-gradient(145deg, ${ACCENT}, ${ACCENT_HOVER})`,
                    color: ON_ACCENT,
                    fontFamily: "var(--font-apercu), sans-serif",
                    fontWeight: 600,
                    fontSize: 13,
                    letterSpacing: "0.01em",
                    textDecoration: "none",
                    boxShadow: `0 0 16px ${accentRgba(0.22)}`,
                  }}
                >
                  Take the quiz →
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          <Link
            href="/signup"
            className="landing-nav-signin"
            style={{
              fontFamily: "var(--font-apercu), sans-serif",
              fontSize: 14,
              color: TEXT_MID,
              textDecoration: "none",
            }}
          >
            Sign in
          </Link>
          <style>{`
            @media (max-width: 479px) { .landing-nav-signin { display: none; } }
          `}</style>
        </div>
      </div>
    </header>
  );
}
