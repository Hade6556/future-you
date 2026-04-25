"use client";

import { BRAND } from "@/app/data/copy";
import { TEXT_HI, TEXT_LO, TEXT_MID } from "@/app/theme";

type Props = {
  compact?: boolean;
};

const DEFAULT_AVATAR = "https://i.pravatar.cc/120?img=5";

export function PaywallProofStack({ compact = false }: Props) {
  const step3 = BRAND.paywall.step3;
  const primaryMetric = step3.proofMetrics[0];
  const proofQuotes = step3.proofQuotes.filter((quote) => !!quote.avatarUrl).slice(0, 2);

  return (
    <div
      style={{
        width: "100%",
        borderRadius: 18,
        border: "1px solid rgba(255,255,255,0.12)",
        background: "rgba(255,255,255,0.03)",
        padding: compact ? "14px 14px 12px" : "18px 16px 14px",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-apercu), sans-serif",
          fontWeight: 700,
          fontSize: compact ? 16 : 17,
          color: TEXT_HI,
          margin: 0,
        }}
      >
        {step3.proofHeadline}
      </p>

      {primaryMetric ? (
        <div
          style={{
            marginTop: 12,
            borderRadius: 12,
            padding: compact ? "10px 12px" : "12px 14px",
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(8,16,32,0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
          }}
        >
          <div>
            <p
              style={{
                margin: 0,
                fontFamily: "var(--font-apercu), sans-serif",
                fontSize: compact ? 12 : 13,
                color: TEXT_MID,
              }}
            >
              {primaryMetric.label}
            </p>
            <p
              style={{
                margin: "2px 0 0",
                fontFamily: "var(--font-apercu), sans-serif",
                fontSize: 11,
                color: TEXT_LO,
              }}
            >
              {primaryMetric.detail}
            </p>
          </div>
          <strong
            style={{
              fontFamily: "var(--font-barlow-condensed), sans-serif",
              fontWeight: 900,
              fontSize: compact ? 26 : 30,
              color: "var(--cta)",
              lineHeight: 1,
              flexShrink: 0,
            }}
          >
            {primaryMetric.value}
          </strong>
        </div>
      ) : null}

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
        {proofQuotes.map((quote, idx) => (
          <blockquote
            key={`${quote.author}-${quote.quote}`}
            style={{
              margin: 0,
              padding: compact ? "9px 10px" : "10px 11px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.08)",
              background:
                idx % 2 === 0
                  ? "linear-gradient(135deg, rgba(94,205,161,0.11), rgba(255,255,255,0.03))"
                  : "linear-gradient(135deg, rgba(130,164,255,0.12), rgba(255,255,255,0.03))",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <div
                aria-hidden
                style={{
                  width: compact ? 26 : 30,
                  height: compact ? 26 : 30,
                  borderRadius: "50%",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-apercu), sans-serif",
                  fontSize: compact ? 10 : 11,
                  fontWeight: 700,
                  color: "#061124",
                  background:
                    idx % 2 === 0
                      ? "linear-gradient(135deg, #bffff0, var(--cta))"
                      : "linear-gradient(135deg, #d9e4ff, #8aa2ff)",
                }}
              >
                <img
                  src={quote.avatarUrl || DEFAULT_AVATAR}
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
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  fontFamily: "var(--font-apercu), sans-serif",
                  fontSize: 11,
                  color: TEXT_LO,
                }}
              >
                <span
                  aria-hidden
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "var(--cta)",
                  }}
                />
                Verified user
              </span>
            </div>
            <p
              style={{
                margin: 0,
                fontFamily: "var(--font-apercu), sans-serif",
                fontSize: compact ? 12 : 13,
                color: TEXT_HI,
                lineHeight: 1.45,
              }}
            >
              "{quote.quote}"
            </p>
            <p
              style={{
                margin: "4px 0 0",
                fontFamily: "var(--font-apercu), sans-serif",
                fontSize: compact ? 10 : 11,
                color: TEXT_LO,
              }}
            >
              {quote.author}
            </p>
          </blockquote>
        ))}
      </div>

      <ul
        style={{
          margin: "12px 0 0",
          padding: 0,
          listStyle: "none",
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        {step3.whyItWorks.map((line) => (
          <li
            key={line}
            style={{
              fontFamily: "var(--font-apercu), sans-serif",
              fontSize: compact ? 12 : 13,
              color: TEXT_MID,
            }}
          >
            {line}
          </li>
        ))}
      </ul>
    </div>
  );
}
