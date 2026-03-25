"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { usePlanStore } from "../../state/planStore";

/* ─── Design tokens ─── */
const LIME = "#C8FF00";
const NAVY = "#0A1628";
const TEXT_HI = "rgba(235,242,255,0.92)";
const TEXT_MID = "rgba(120,155,195,0.75)";
const TEXT_LO = "rgba(120,155,195,0.40)";
const GLASS = "rgba(255,255,255,0.07)";
const GLASS_BORDER = "rgba(255,255,255,0.14)";

/* ─── Wordmark ─── */
function Wordmark({ size = 24 }: { size?: number }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "baseline", gap: 2, lineHeight: 1 }}>
      <span
        style={{
          fontFamily: "var(--font-libre-baskerville), serif",
          fontStyle: "italic",
          fontWeight: 400,
          fontSize: size,
          color: TEXT_HI,
        }}
      >
        Future
      </span>
      <span
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontStyle: "italic",
          fontWeight: 600,
          fontSize: size,
          color: LIME,
        }}
      >
        YOU
      </span>
    </span>
  );
}

/* ─── Background mesh ─── */
const BG_MESH = `
  radial-gradient(ellipse 70% 50% at 20% 10%, rgba(40,80,200,0.30) 0%, transparent 60%),
  radial-gradient(ellipse 60% 60% at 85% 80%, rgba(15,40,100,0.50) 0%, transparent 60%),
  linear-gradient(160deg, #0f2040 0%, #090f1a 50%, #060912 100%)
`;

/* ─── Screen 1: Connect LinkedIn ─── */
function ConnectScreen({ onSkip, onConnect }: { onSkip: () => void; onConnect: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100dvh",
        position: "relative",
      }}
    >
      {/* Logo */}
      <div
        style={{
          position: "absolute",
          top: "max(3.5rem, env(safe-area-inset-top, 3.5rem))",
          left: 32,
          display: "flex",
          alignItems: "baseline",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-libre-baskerville), serif",
            fontWeight: 400,
            fontStyle: "italic",
            fontSize: 21,
            color: TEXT_HI,
          }}
        >
          Future
        </span>
        <span
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontWeight: 600,
            fontStyle: "italic",
            fontSize: 31,
            lineHeight: 0.82,
            color: LIME,
            letterSpacing: "-0.01em",
          }}
        >
          YOU
        </span>
      </div>

      {/* Bottom-aligned content (matching HTML layout) */}
      <div
        style={{
          marginTop: "auto",
          padding: "0 32px 52px",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-barlow-condensed), sans-serif",
            fontWeight: 900,
            fontStyle: "italic",
            fontSize: 56,
            lineHeight: 0.92,
            letterSpacing: "-0.03em",
            color: TEXT_HI,
            margin: "0 0 18px",
          }}
        >
          Time to become{" "}
          <em style={{ fontStyle: "normal", color: LIME, display: "block" }}>
            who you&apos;re supposed to be.
          </em>
        </h1>
        <p
          style={{
            fontFamily: "var(--font-barlow), sans-serif",
            fontWeight: 300,
            fontSize: 15,
            color: TEXT_MID,
            lineHeight: 1.6,
            margin: "0 0 36px",
            maxWidth: 280,
          }}
        >
          Connect LinkedIn. We read your data, map your gaps, and build a daily system to close them.
        </p>

        <button
          onClick={onConnect}
          style={{
            width: "100%",
            background: LIME,
            color: "#060912",
            fontFamily: "var(--font-barlow-condensed), sans-serif",
            fontWeight: 700,
            fontSize: 18,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            borderRadius: 100,
            padding: "20px 32px",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 8px 32px rgba(200,255,0,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            marginBottom: 14,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#060912" aria-hidden>
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
          Connect LinkedIn
        </button>

        <button
          onClick={onSkip}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: "var(--font-barlow), sans-serif",
            fontWeight: 300,
            fontSize: 13,
            color: TEXT_MID,
            padding: "8px 0",
            textAlign: "center" as const,
            width: "100%",
          }}
        >
          I&apos;ll do this later
        </button>
      </div>
    </motion.div>
  );
}

/* ─── Screen 2: Scanning Animation ─── */
const DATA_STREAM = [
  "Analyzing LinkedIn profile...",
  "Reading post frequency: 2.4 / week",
  "Calculating engagement rate: 3.2%",
  "Mapping follower trajectory: +127%",
  "Identifying behavioral gaps...",
  "Measuring consistency score: 61%",
  "Calibrating action weights...",
  "Building your gap model...",
  "System ready.",
];

function ScanningScreen() {
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < DATA_STREAM.length) {
        setLines((prev) => [...prev, DATA_STREAM[i]]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 320);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.35 }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100dvh",
        padding: "0 32px 100px",
        gap: 0,
      }}
    >
      {/* Pulsing rings around LinkedIn badge (matching HTML spec) */}
      <div
        style={{
          width: 200,
          height: 200,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 40,
        }}
      >
        {[
          { size: 200, border: "rgba(200,255,0,0.08)", delay: 0 },
          { size: 152, border: "rgba(200,255,0,0.14)", delay: 0.4 },
          { size: 108, border: "rgba(200,255,0,0.22)", delay: 0.8 },
        ].map((ring, i) => (
          <motion.div
            key={i}
            animate={{ scale: [0.9, 1.08, 0.9], opacity: [0, 1, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, delay: ring.delay, ease: "easeOut" }}
            style={{
              position: "absolute",
              width: ring.size,
              height: ring.size,
              borderRadius: "50%",
              border: `1px solid ${ring.border}`,
            }}
          />
        ))}
        {/* LinkedIn badge */}
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 18,
            background: "#0A66C2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 32px rgba(10,102,194,0.50)",
            zIndex: 2,
            position: "relative",
          }}
        >
          <svg width="34" height="34" viewBox="0 0 24 24" fill="white" aria-hidden>
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
        </div>
      </div>

      <h2
        style={{
          fontFamily: "var(--font-barlow-condensed), sans-serif",
          fontWeight: 900,
          fontStyle: "italic",
          fontSize: 42,
          lineHeight: 1,
          letterSpacing: "-0.02em",
          color: TEXT_HI,
          textAlign: "center",
          margin: "0 0 10px",
        }}
      >
        Reading your <em style={{ fontStyle: "normal", color: LIME }}>DNA.</em>
      </h2>

      {/* Scrolling data stream */}
      <div
        style={{
          width: "100%",
          maxWidth: 320,
          overflow: "hidden",
          height: 80,
          position: "relative",
          marginBottom: 40,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 28,
            background: "linear-gradient(to bottom, #060912, transparent)",
            zIndex: 2,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 28,
            background: "linear-gradient(to top, #060912, transparent)",
            zIndex: 2,
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {lines.map((line, i) => (
            <p
              key={i}
              style={{
                fontFamily: "var(--font-barlow-condensed), sans-serif",
                fontWeight: 400,
                fontStyle: "italic",
                fontSize: 14,
                letterSpacing: "0.04em",
                color: i === lines.length - 1 ? LIME : TEXT_LO,
                margin: 0,
                textAlign: "center",
              }}
            >
              {line}
            </p>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Screen 3: Results + Goal Selection ─── */
const STAT_CARDS = [
  { label: "Posts / Week", value: "2.4", delta: "−38% vs peers", color: "#FF5555" },
  { label: "Engagement Rate", value: "3.2%", delta: "+1.1% this month", color: "#4CAF7D" },
  { label: "Follower Growth", value: "+127%", delta: "Last 90 days", color: "#2DD4C0" },
];

const GOALS = [
  { label: "Grow LinkedIn authority", icon: "📈" },
  { label: "Land my next role", icon: "🏆" },
  { label: "Build my personal brand", icon: "🚀" },
  { label: "Grow my business", icon: "💼" },
  { label: "Expand my network", icon: "🤝" },
];

function ResultsScreen({ onBuildPlan }: { onBuildPlan: (goal: string) => void }) {
  const [selectedGoal, setSelectedGoal] = useState<number | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "max(5rem, env(safe-area-inset-top, 5rem)) 32px 48px",
        gap: 0,
      }}
    >
      {/* Eyebrow + headline */}
      <p
        style={{
          fontFamily: "var(--font-barlow-condensed), sans-serif",
          fontWeight: 400,
          fontStyle: "italic",
          fontSize: 15,
          color: TEXT_MID,
          letterSpacing: "0.04em",
          margin: "0 0 8px",
        }}
      >
        Alex — here&apos;s the truth.
      </p>
      <h1
        style={{
          fontFamily: "var(--font-barlow-condensed), sans-serif",
          fontWeight: 900,
          fontStyle: "italic",
          fontSize: 56,
          lineHeight: 0.95,
          letterSpacing: "-0.03em",
          color: TEXT_HI,
          margin: "0 0 32px",
        }}
      >
        You&apos;re closer than<br />you{" "}
        <em style={{ fontStyle: "normal", color: LIME }}>think.</em>
      </h1>

      {/* Stat rows — HTML spec: large number + label + desc */}
      <div style={{ display: "flex", flexDirection: "column", marginBottom: 32 }}>
        {STAT_CARDS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15 + 0.1 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 0,
              padding: "18px 0",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              borderTop: i === 0 ? "1px solid rgba(255,255,255,0.06)" : "none",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-barlow-condensed), sans-serif",
                fontWeight: 900,
                fontSize: 48,
                lineHeight: 1,
                letterSpacing: "-0.03em",
                color: LIME,
                minWidth: 120,
              }}
            >
              {stat.value}
            </span>
            <div>
              <div
                style={{
                  fontFamily: "var(--font-barlow-condensed), sans-serif",
                  fontWeight: 900,
                  fontSize: 15,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  color: TEXT_HI,
                  marginBottom: 3,
                }}
              >
                {stat.label}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-barlow), sans-serif",
                  fontWeight: 300,
                  fontSize: 12,
                  color: TEXT_MID,
                  lineHeight: 1.5,
                }}
              >
                {stat.delta}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Goal selection */}
      <div>
        <span
          style={{
            fontFamily: "var(--font-barlow-condensed), sans-serif",
            fontWeight: 400,
            fontStyle: "italic",
            fontSize: 15,
            color: TEXT_MID,
            display: "block",
            margin: "0 0 12px",
          }}
        >
          What are you working toward?
        </span>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {GOALS.map((goal, i) => {
            const isSelected = selectedGoal === i;
            return (
              <motion.button
                key={i}
                onClick={() => setSelectedGoal(i)}
                animate={{ background: isSelected ? "rgba(200,255,0,0.10)" : GLASS }}
                whileTap={{ scale: 0.98 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "14px 16px",
                  borderRadius: 14,
                  border: `1px solid ${isSelected ? "rgba(200,255,0,0.40)" : GLASS_BORDER}`,
                  background: isSelected ? "rgba(200,255,0,0.10)" : GLASS,
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  cursor: "pointer",
                  textAlign: "left",
                  width: "100%",
                }}
              >
                <span style={{ fontSize: 18 }}>{goal.icon}</span>
                <span
                  style={{
                    fontFamily: "var(--font-barlow-condensed), sans-serif",
                    fontWeight: 900,
                    fontSize: 18,
                    letterSpacing: "-0.01em",
                    color: isSelected ? LIME : TEXT_HI,
                    flex: 1,
                  }}
                >
                  {goal.label}
                </span>
                {isSelected && (
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      background: LIME,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path
                        d="M1 4L3.5 6.5L9 1"
                        stroke={NAVY}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Build Plan CTA */}
      <AnimatePresence>
        {selectedGoal !== null && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onClick={() => onBuildPlan(GOALS[selectedGoal].label)}
            style={{
              width: "100%",
              background: "#4CAF7D",
              color: "#060912",
              fontFamily: "var(--font-barlow-condensed), sans-serif",
              fontWeight: 700,
              fontSize: 18,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              borderRadius: 100,
              padding: "20px 32px",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 8px 32px rgba(76,175,125,0.30)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
            }}
          >
            Build My Plan
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
              <path d="M3.75 9h10.5M9.75 4.5L14.25 9l-4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Main page ─── */
export default function ResultPage() {
  const router = useRouter();
  const completeOnboarding = usePlanStore((s) => s.completeOnboarding);
  const [step, setStep] = useState<"connect" | "scanning" | "results">("connect");

  const handleConnect = () => {
    // In a real app, trigger LinkedIn OAuth here.
    // For now, simulate the scan flow.
    setStep("scanning");
    setTimeout(() => setStep("results"), DATA_STREAM.length * 320 + 400);
  };

  const handleSkip = () => {
    setStep("scanning");
    setTimeout(() => setStep("results"), 2200);
  };

  const handleBuildPlan = () => {
    completeOnboarding();
    router.push("/intake");
  };

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "#060912",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background gradient mesh */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          background: BG_MESH,
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        <AnimatePresence mode="wait">
          {step === "connect" && (
            <ConnectScreen
              key="connect"
              onConnect={handleConnect}
              onSkip={handleSkip}
            />
          )}
          {step === "scanning" && <ScanningScreen key="scanning" />}
          {step === "results" && (
            <ResultsScreen key="results" onBuildPlan={handleBuildPlan} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
