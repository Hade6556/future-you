"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { usePlanStore } from "./state/planStore";
import { MARKETING_INTENTS, type MarketingIntent } from "./types/marketingIntent";
import { INTENT_COPY, INTENT_VISUAL } from "./data/intentConfig";
import { trackEvent } from "./quiz/utils/analytics";
import { TEXT_HI, TEXT_LO, TEXT_MID } from "@/app/theme";

export default function IntentLanding() {
  const router = useRouter();
  const setMarketingIntent = usePlanStore((s) => s.setMarketingIntent);

  const pickIntent = (intent: MarketingIntent) => {
    setMarketingIntent(intent);
    trackEvent("intent_selected", { intent, source: "click" });
    router.replace("/onboarding");
  };

  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        background: "#060912",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          background: `
            radial-gradient(ellipse 70% 50% at 20% 10%, rgba(40,80,200,0.28) 0%, transparent 60%),
            radial-gradient(ellipse 60% 60% at 85% 80%, rgba(15,40,100,0.45) 0%, transparent 60%),
            linear-gradient(160deg, #0f2040 0%, #090f1a 50%, #060912 100%)
          `,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          maxWidth: 420,
          width: "100%",
          margin: "0 auto",
          padding: "max(2.5rem, calc(env(safe-area-inset-top, 0px) + 1.75rem)) 24px 28px",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: 11,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: TEXT_LO,
            margin: "0 0 12px",
          }}
        >
          Behavio
        </p>
        <h1
          style={{
            fontFamily: "var(--font-barlow-condensed), sans-serif",
            fontWeight: 700,
            fontStyle: "italic",
            fontSize: 34,
            lineHeight: 1.15,
            color: TEXT_HI,
            margin: "0 0 10px",
            letterSpacing: "-0.02em",
          }}
        >
          What are you working on first?
        </h1>
        <p
          style={{
            fontFamily: "var(--font-apercu), sans-serif",
            fontSize: 15,
            lineHeight: 1.5,
            color: TEXT_MID,
            margin: "0 0 28px",
          }}
        >
          Pick one — we&apos;ll tailor your plan and coaching tone. You can change details later.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {MARKETING_INTENTS.map((intent) => {
            const copy = INTENT_COPY[intent];
            const vis = INTENT_VISUAL[intent];
            return (
              <motion.button
                key={intent}
                type="button"
                whileTap={{ scale: 0.98 }}
                onClick={() => pickIntent(intent)}
                style={{
                  textAlign: "left",
                  padding: "18px 18px",
                  borderRadius: 16,
                  border: `1px solid rgba(255,255,255,0.12)`,
                  background: "rgba(255,255,255,0.05)",
                  cursor: "pointer",
                  boxShadow: `0 0 0 1px rgba(${vis.accentRgb},0.12)`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 12,
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--font-apercu), sans-serif",
                        fontWeight: 700,
                        fontSize: 17,
                        color: TEXT_HI,
                        marginBottom: 6,
                      }}
                    >
                      {copy.cardTitle}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-apercu), sans-serif",
                        fontSize: 14,
                        lineHeight: 1.45,
                        color: TEXT_MID,
                      }}
                    >
                      {copy.cardSubtitle}
                    </div>
                  </div>
                  <span
                    aria-hidden
                    style={{
                      flexShrink: 0,
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: vis.accent,
                      marginTop: 6,
                      boxShadow: `0 0 12px rgba(${vis.accentRgb},0.5)`,
                    }}
                  />
                </div>
              </motion.button>
            );
          })}
        </div>

        <div
          style={{
            marginTop: "auto",
            paddingTop: 32,
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            justifyContent: "center",
          }}
        >
          {["Private by design", "Built for real life", "90-day structure"].map((t) => (
            <span
              key={t}
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: 10,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: TEXT_LO,
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
