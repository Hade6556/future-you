"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import CTAButton from "../components/CTAButton";
import { trackEvent } from "../utils/analytics";
import {
  ACCENT,
  ACCENT_HOVER,
  TEXT_HI,
  TEXT_MID,
  TEXT_LO,
  accentRgba,
} from "@/app/theme";

const REVIEWS = [
  { name: "Maya R.", photo: "https://i.pravatar.cc/64?img=47", text: "Changed how I think about goals", ago: "2d ago" },
  { name: "James T.", photo: "https://i.pravatar.cc/64?img=12", text: "Finally something that actually works", ago: "5d ago" },
  { name: "Sara K.", photo: "https://i.pravatar.cc/64?img=23", text: "Best investment I've made in myself", ago: "1w ago" },
];

function StarRow({ count, size = 10 }: { count: number; size?: number }) {
  return (
    <span style={{ display: "inline-flex", gap: 1 }}>
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 12 12" fill="#F5C518">
          <path d="M6 0l1.76 3.64L12 4.24 8.88 7.2l.72 4.32L6 9.48 2.4 11.52l.72-4.32L0 4.24l4.24-.6z" />
        </svg>
      ))}
    </span>
  );
}

export default function SplashScreen({ onNext }: { onNext: () => void }) {
  const [countUp, setCountUp] = useState(0);

  useEffect(() => {
    trackEvent("funnel_start");
  }, []);

  useEffect(() => {
    const target = 43219;
    const steps = 30;
    const increment = target / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCountUp(target);
        clearInterval(interval);
      } else {
        setCountUp(Math.round(current));
      }
    }, 40);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 4px",
      }}
    >
      {/* App of the Day badge */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "14px 16px",
          borderRadius: 16,
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.10)",
          marginBottom: 28,
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 13,
            background: `linear-gradient(145deg, ${ACCENT}, ${ACCENT_HOVER})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            fontWeight: 700,
            color: "#060912",
            fontFamily: "var(--font-apercu), sans-serif",
            letterSpacing: "-0.02em",
            flexShrink: 0,
          }}
        >
          B
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 9,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: TEXT_LO,
              marginBottom: 2,
            }}
          >
            App of the Day
          </div>
          <div
            style={{
              fontFamily: "var(--font-apercu), sans-serif",
              fontWeight: 600,
              fontSize: 15,
              color: TEXT_HI,
              lineHeight: 1.25,
            }}
          >
            Behavio
          </div>
          <div
            style={{
              fontFamily: "var(--font-apercu), sans-serif",
              fontSize: 12,
              color: TEXT_MID,
              marginTop: 1,
            }}
          >
            AI-Powered Life Coach
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-barlow-condensed), sans-serif",
              fontWeight: 800,
              fontSize: 16,
              color: TEXT_HI,
              lineHeight: 1,
            }}
          >
            4.9
          </div>
          <StarRow count={5} size={9} />
        </div>
      </motion.div>

      {/* Hero headline — accent only on the key phrase */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        style={{
          fontFamily: "var(--font-barlow-condensed), sans-serif",
          fontWeight: 900,
          fontStyle: "italic",
          fontSize: 34,
          color: TEXT_HI,
          margin: "0 0 12px",
          lineHeight: 1.1,
          letterSpacing: "-0.02em",
        }}
      >
        Close the gap between who you are and who you&apos;re{" "}
        <span style={{ color: ACCENT }}>meant to be.</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        style={{
          fontFamily: "var(--font-apercu), sans-serif",
          fontSize: 15,
          color: TEXT_MID,
          margin: "0 0 24px",
          lineHeight: 1.55,
          maxWidth: 340,
        }}
      >
        Your AI-powered 90-day plan. Built around your life. Starts today.
      </motion.p>

      {/* Single standout stat, not three equal-weight boxes */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.4 }}
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 6,
          marginBottom: 24,
          fontFamily: "var(--font-apercu), sans-serif",
          fontSize: 14,
          color: TEXT_MID,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-barlow-condensed), sans-serif",
            fontWeight: 800,
            fontSize: 20,
            color: TEXT_HI,
          }}
        >
          {countUp.toLocaleString()}+
        </span>{" "}
        people already building their plan
      </motion.div>

      {/* Reviews with avatars and real details */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.4 }}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          marginBottom: 28,
        }}
      >
        {REVIEWS.map((r, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 14px",
              borderRadius: 12,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {/* Avatar photo */}
            <img
              src={r.photo}
              alt={r.name}
              width={32}
              height={32}
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                objectFit: "cover",
                flexShrink: 0,
                border: "1.5px solid rgba(255,255,255,0.12)",
              }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                <StarRow count={5} size={9} />
                <span
                  style={{
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                    fontSize: 9,
                    color: TEXT_LO,
                    letterSpacing: "0.04em",
                  }}
                >
                  {r.ago}
                </span>
              </div>
              <div
                style={{
                  fontFamily: "var(--font-apercu), sans-serif",
                  fontSize: 13,
                  color: "rgba(235,242,255,0.80)",
                  fontWeight: 500,
                  lineHeight: 1.3,
                }}
              >
                &ldquo;{r.text}&rdquo;
              </div>
              <div
                style={{
                  fontFamily: "var(--font-apercu), sans-serif",
                  fontSize: 11,
                  color: TEXT_LO,
                  marginTop: 1,
                }}
              >
                {r.name}
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.4 }}
      >
        <CTAButton label="Take the Free Quiz →" onClick={onNext} />

        <p
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: 10,
            color: TEXT_LO,
            marginTop: 14,
            letterSpacing: "0.10em",
            textTransform: "uppercase",
            textAlign: "center",
          }}
        >
          Free &middot; 3 min &middot; No credit card
        </p>
      </motion.div>
    </motion.div>
  );
}
