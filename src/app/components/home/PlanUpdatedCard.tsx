"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const LIME = "#C8FF00";
const TEXT_HI = "rgba(235,242,255,0.92)";
const TEXT_LO = "rgba(120,155,195,0.50)";

type Props = {
  summary: string;
  onDismiss: () => void;
};

export function PlanUpdatedCard({ summary, onDismiss }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      style={{
        position: "relative",
        background: "rgba(200,255,0,0.04)",
        border: "1px solid rgba(200,255,0,0.16)",
        borderRadius: 16,
        padding: "16px 18px",
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 10,
          background: "rgba(200,255,0,0.10)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"
            stroke={LIME}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontFamily: "var(--font-barlow-condensed), sans-serif",
            fontWeight: 700,
            fontSize: 13,
            color: LIME,
            margin: 0,
            marginBottom: 3,
          }}
        >
          Plan updated this week
        </p>
        <p
          style={{
            fontFamily: "var(--font-body), Georgia, serif",
            fontSize: 12,
            color: TEXT_LO,
            margin: 0,
            lineHeight: 1.45,
          }}
        >
          {summary}
        </p>
        <Link
          href="/plan"
          style={{
            display: "inline-block",
            marginTop: 8,
            fontFamily: "var(--font-barlow-condensed), sans-serif",
            fontWeight: 700,
            fontSize: 11,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: TEXT_HI,
            textDecoration: "none",
          }}
        >
          View changes
        </Link>
      </div>

      {/* Dismiss */}
      <button
        onClick={onDismiss}
        aria-label="Dismiss"
        style={{
          background: "none",
          border: "none",
          padding: 4,
          cursor: "pointer",
          color: TEXT_LO,
          fontSize: 16,
          lineHeight: 1,
          flexShrink: 0,
        }}
      >
        x
      </button>
    </motion.div>
  );
}
