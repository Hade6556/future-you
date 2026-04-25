"use client";

import { BRAND } from "@/app/data/copy";
import { ACCENT, TEXT_HI, TEXT_LO, TEXT_MID, accentRgba } from "@/app/theme";

type Props = {
  compact?: boolean;
};

const DEFAULT_AVATAR = "https://i.pravatar.cc/120?img=5";

export function PaywallProofStack({ compact = false }: Props) {
  const step3 = BRAND.paywall.step3;
  const primaryMetric = step3.proofMetrics[0];
  const proofQuote = step3.proofQuotes.find((quote) => !!quote.avatarUrl) ?? step3.proofQuotes[0];
  const benefits = step3.whyItWorks.slice(0, 3);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        borderRadius: 18,
        border: "1px solid rgba(255,255,255,0.08)",
        background: "linear-gradient(180deg, rgba(255,255,255,0.045), rgba(255,255,255,0.01))",
        padding: compact ? "20px 18px" : "24px 22px",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(60% 60% at 0% 0%, ${accentRgba(0.10)}, transparent 65%)`,
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative" }}>
        {/* Stat hero */}
        {primaryMetric ? (
          <div style={{ marginBottom: 18 }}>
            <div
              style={{
                fontFamily: "var(--font-barlow-condensed), sans-serif",
                fontWeight: 900,
                fontStyle: "italic",
                fontSize: compact ? "clamp(56px, 14vw, 80px)" : "clamp(64px, 16vw, 96px)",
                lineHeight: 0.88,
                letterSpacing: "-0.04em",
                color: ACCENT,
                fontVariantNumeric: "tabular-nums",
                margin: "0 0 4px",
              }}
            >
              {primaryMetric.value}
            </div>
            <p
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: 10.5,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: TEXT_MID,
                margin: 0,
                lineHeight: 1.4,
              }}
            >
              {primaryMetric.label}
              {primaryMetric.detail ? (
                <>
                  <span aria-hidden style={{ color: TEXT_LO, margin: "0 6px" }}>·</span>
                  {primaryMetric.detail}
                </>
              ) : null}
            </p>
          </div>
        ) : null}

        {/* Headline */}
        <h2
          style={{
            fontFamily: "var(--font-barlow-condensed), sans-serif",
            fontWeight: 900,
            fontSize: compact ? "clamp(20px, 4.4vw, 24px)" : "clamp(22px, 5vw, 28px)",
            color: TEXT_HI,
            margin: "0 0 18px",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
          }}
        >
          You don&apos;t need more{" "}
          <span style={{ fontStyle: "italic", color: ACCENT }}>motivation.</span>{" "}
          You need a system that{" "}
          <span style={{ fontStyle: "italic", color: ACCENT }}>catches you.</span>
        </h2>

        {/* Single editorial pull-quote testimonial */}
        {proofQuote ? (
          <figure
            style={{
              margin: "0 0 18px",
              padding: "16px 16px",
              borderRadius: 14,
              background: "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.005))",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <blockquote
              style={{
                margin: 0,
                fontFamily: "var(--font-barlow-condensed), sans-serif",
                fontWeight: 900,
                fontStyle: "italic",
                fontSize: 18,
                color: TEXT_HI,
                lineHeight: 1.15,
                letterSpacing: "-0.01em",
              }}
            >
              &ldquo;{proofQuote.quote}&rdquo;
            </blockquote>
            <figcaption
              style={{
                marginTop: 12,
                paddingTop: 10,
                borderTop: "1px solid rgba(255,255,255,0.05)",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div
                aria-hidden
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "1px solid rgba(255,255,255,0.10)",
                  flexShrink: 0,
                }}
              >
                <img
                  src={proofQuote.avatarUrl || DEFAULT_AVATAR}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    if (e.currentTarget.src !== DEFAULT_AVATAR) {
                      e.currentTarget.src = DEFAULT_AVATAR;
                    }
                  }}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <span
                style={{
                  fontFamily: "var(--font-apercu), sans-serif",
                  fontSize: 12,
                  color: TEXT_HI,
                  fontWeight: 600,
                  letterSpacing: "-0.005em",
                }}
              >
                {proofQuote.author}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: 9.5,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: ACCENT,
                  marginLeft: "auto",
                  fontWeight: 600,
                }}
              >
                ✓ Verified
              </span>
            </figcaption>
          </figure>
        ) : null}

        {/* Benefit list */}
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {benefits.map((line) => (
            <li
              key={line}
              style={{
                display: "flex",
                gap: 10,
                alignItems: "flex-start",
                fontFamily: "var(--font-apercu), sans-serif",
                fontSize: 13.5,
                color: TEXT_HI,
                lineHeight: 1.45,
                letterSpacing: "-0.005em",
              }}
            >
              <span
                aria-hidden
                style={{
                  flexShrink: 0,
                  marginTop: 8,
                  width: 8,
                  height: 1,
                  background: ACCENT,
                }}
              />
              {line}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
