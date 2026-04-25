"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ACCENT, ACCENT_HOVER, ON_ACCENT, accentRgba } from "@/app/theme";
import { trackEvent } from "@/app/quiz/utils/analytics";

/**
 * Mobile-only sticky CTA bar. Appears once the user scrolls past the hero,
 * hides when the final CTA is in view (so we don't stack two CTAs).
 */
export default function StickyCTABar() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let scrolledPastHero = false;
    let finalInView = false;

    function onScroll() {
      scrolledPastHero = window.scrollY > 520;
      setShow(scrolledPastHero && !finalInView);
    }

    const finalEl = document.getElementById("final-cta");
    let observer: IntersectionObserver | null = null;
    if (finalEl) {
      observer = new IntersectionObserver(
        (entries) => {
          finalInView = entries[0]?.isIntersecting ?? false;
          setShow(scrolledPastHero && !finalInView);
        },
        { rootMargin: "-20% 0px -20% 0px" },
      );
      observer.observe(finalEl);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      observer?.disconnect();
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.25 }}
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 30,
            padding: "12px 16px max(12px, env(safe-area-inset-bottom, 12px))",
            background: "rgba(6, 9, 18, 0.92)",
            backdropFilter: "blur(16px)",
            borderTop: "1px solid rgba(255,255,255,0.10)",
          }}
          className="sticky-cta-bar"
        >
          <style>{`
            @media (min-width: 768px) { .sticky-cta-bar { display: none !important; } }
          `}</style>
          <Link
            href="/quiz"
            onClick={() => trackEvent("funnel_start", { source: "landing_sticky" })}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              padding: "14px 20px",
              borderRadius: 12,
              background: `linear-gradient(145deg, ${ACCENT}, ${ACCENT_HOVER})`,
              color: ON_ACCENT,
              fontFamily: "var(--font-barlow-condensed), sans-serif",
              fontWeight: 700,
              fontSize: 15,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              textDecoration: "none",
              boxShadow: `0 0 20px ${accentRgba(0.24)}`,
            }}
          >
            Take the Free Quiz →
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
