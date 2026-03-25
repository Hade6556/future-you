"use client";

import { useState, useRef, useEffect } from "react";
import type React from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { QuizOption } from "../../data/quiz";

/* ─── Design tokens ─── */
const LIME = "#C8FF00";
const NAVY = "#0A1628";
const TEXT_HI = "rgba(235,242,255,0.92)";
const TEXT_MID = "rgba(120,155,195,0.75)";
const TEXT_LO = "rgba(120,155,195,0.40)";
const GLASS = "rgba(255,255,255,0.07)";
const GLASS_BORDER = "rgba(255,255,255,0.14)";

/* ─── Wordmark ─── */
function Wordmark({ size = 28 }: { size?: number }) {
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

/* ══════════════════════════════════════════════════════
   SPLASH STEP — full-screen hero, single CTA
══════════════════════════════════════════════════════ */

export function SplashStep({ onContinue }: { onContinue: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-end",
        minHeight: "100dvh",
        padding: "0 28px 56px",
        gap: 0,
      }}
    >
      {/* Logo */}
      <div style={{ position: "absolute", top: "max(3.5rem, env(safe-area-inset-top, 3.5rem))", left: 28 }}>
        <Wordmark size={24} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.35 }}
        style={{ marginBottom: 18 }}
      >
        <h1
          style={{
            fontFamily: "var(--font-barlow-condensed), sans-serif",
            fontWeight: 700,
            fontStyle: "italic",
            fontSize: 50,
            lineHeight: 0.96,
            letterSpacing: "-0.03em",
            color: TEXT_HI,
            margin: "0 0 18px",
          }}
        >
          Your{" "}
          <em style={{ fontStyle: "normal", color: LIME }}>best self</em>
          {" "}is already<br />in there.
        </h1>
        <p
          style={{
            fontFamily: "var(--font-barlow), sans-serif",
            fontWeight: 300,
            fontSize: 15,
            lineHeight: 1.65,
            color: TEXT_MID,
            margin: "0 0 36px",
            maxWidth: 270,
          }}
        >
          Answer a few quick questions. We&apos;ll build a personal plan to close the gap — fast.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.38 }}
        style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%" }}
      >
        <button
          onClick={onContinue}
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
          }}
        >
          Let&apos;s do this
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
            <path d="M3.75 9h10.5M9.75 4.5L14.25 9l-4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <p
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: 10,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: TEXT_LO,
            margin: 0,
            textAlign: "center",
          }}
        >
          2 min · private · free
        </p>
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════
   TWO-COL CARDS — gender selection
══════════════════════════════════════════════════════ */

type TwoColCardsProps = {
  options: QuizOption[];
  onSelect: (value: number) => void;
};

export function TwoColCards({ options, onSelect }: TwoColCardsProps) {
  const [selected, setSelected] = useState<number | null>(null);

  const pick = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    setTimeout(() => onSelect(idx), 300);
  };

  return (
    <div style={{ display: "flex", gap: 12, width: "100%" }}>
      {options.map((opt, i) => {
        const isSelected = selected === i;
        return (
          <motion.button
            key={i}
            onClick={() => pick(i)}
            animate={{
              background: isSelected ? "rgba(200,255,0,0.12)" : GLASS,
            }}
            whileTap={{ scale: 0.97 }}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 14,
              padding: "32px 16px",
              borderRadius: 20,
              border: `1px solid ${isSelected ? LIME : GLASS_BORDER}`,
              background: isSelected ? "rgba(200,255,0,0.12)" : GLASS,
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              cursor: "pointer",
              minHeight: 150,
            }}
          >
            {opt.icon && (
              <span style={{ fontSize: 36, lineHeight: 1 }}>{opt.icon}</span>
            )}
            <span
              style={{
                fontFamily: "var(--font-barlow-condensed), sans-serif",
                fontWeight: 700,
                fontSize: 17,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: isSelected ? LIME : TEXT_HI,
              }}
            >
              {opt.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   LIST ROWS — field, feeling, goal, timeline
══════════════════════════════════════════════════════ */

type ListRowsProps = {
  options: QuizOption[];
  onSelect: (value: number) => void;
};

export function ListRows({ options, onSelect }: ListRowsProps) {
  const [selected, setSelected] = useState<number | null>(null);

  const pick = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    setTimeout(() => onSelect(idx), 280);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%" }}>
      {options.map((opt, i) => {
        const isSelected = selected === i;
        return (
          <motion.button
            key={i}
            onClick={() => pick(i)}
            animate={{
              background: isSelected ? "rgba(200,255,0,0.10)" : GLASS,
            }}
            whileTap={{ scale: 0.98 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "16px 18px",
              borderRadius: 14,
              border: `1px solid ${isSelected ? "rgba(200,255,0,0.40)" : GLASS_BORDER}`,
              background: isSelected ? "rgba(200,255,0,0.10)" : GLASS,
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              cursor: "pointer",
              textAlign: "left",
              width: "100%",
            }}
          >
            {opt.icon && (
              <span
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.06)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  flexShrink: 0,
                }}
              >
                {opt.icon}
              </span>
            )}
            <span
              style={{
                fontFamily: "var(--font-barlow-condensed), sans-serif",
                fontWeight: 700,
                fontSize: 16,
                color: isSelected ? LIME : TEXT_HI,
                flex: 1,
              }}
            >
              {opt.label}
            </span>

            {isSelected ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                style={{
                  width: 22,
                  height: 22,
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
              </motion.div>
            ) : (
              <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
                <path
                  d="M1 1L7 7L1 13"
                  stroke={TEXT_LO}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   INSIGHT CARD — belief seed / objection handler
══════════════════════════════════════════════════════ */

type InsightCardProps = {
  stat?: string;
  headline: string;
  body?: string;
  ctaLabel?: string;
  onContinue: () => void;
};

export function InsightCard({ stat, headline, body, ctaLabel, onContinue }: InsightCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      style={{ display: "flex", flexDirection: "column", gap: 20, width: "100%" }}
    >
      {/* Lime-tinted insight card */}
      <div
        style={{
          position: "relative",
          background: "rgba(200,255,0,0.05)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          border: "1px solid rgba(200,255,0,0.18)",
          borderRadius: 20,
          padding: "24px 22px",
          overflow: "hidden",
        }}
      >
        {/* Top lime highlight */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 1,
            background: "linear-gradient(90deg, transparent, rgba(200,255,0,0.30), transparent)",
          }}
        />

        {/* Eyebrow */}
        <div
          style={{
            fontFamily: "var(--font-barlow-condensed), sans-serif",
            fontWeight: 700,
            fontSize: 10,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "rgba(200,255,0,0.60)",
            marginBottom: 10,
            display: "flex",
            alignItems: "center",
            gap: 7,
          }}
        >
          <span style={{ display: "block", width: 16, height: 1, background: "rgba(200,255,0,0.40)" }} />
          What the data shows
        </div>

        <p
          style={{
            fontFamily: "var(--font-barlow), sans-serif",
            fontWeight: 300,
            fontSize: 15,
            lineHeight: 1.65,
            color: "rgba(235,242,255,0.82)",
            margin: "0 0 16px",
          }}
          dangerouslySetInnerHTML={{
            __html: body
              ? body.replace(/\*\*(.*?)\*\*/g, '<strong style="font-weight:500;color:rgba(235,242,255,0.92)">$1</strong>')
              : headline,
          }}
        />

        {stat && (
          <div
            style={{
              marginTop: 16,
              paddingTop: 16,
              borderTop: "1px solid rgba(255,255,255,0.07)",
              display: "flex",
              alignItems: "baseline",
              gap: 6,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-barlow-condensed), sans-serif",
                fontWeight: 700,
                fontSize: 34,
                color: LIME,
                letterSpacing: "-0.02em",
              }}
            >
              {stat}
            </span>
            <span
              style={{
                fontFamily: "var(--font-barlow), sans-serif",
                fontWeight: 300,
                fontSize: 13,
                color: TEXT_MID,
              }}
            >
              {headline}
            </span>
          </div>
        )}
      </div>

      <button
        onClick={onContinue}
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
        }}
      >
        {ctaLabel ?? "Continue"}
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
          <path d="M3.75 9h10.5M9.75 4.5L14.25 9l-4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════
   YES/NO PILLS — binary history question
══════════════════════════════════════════════════════ */

type YesNoProps = {
  onSelect: (value: number) => void;
};

export function YesNoPills({ onSelect }: YesNoProps) {
  const [selected, setSelected] = useState<number | null>(null);

  const pick = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    setTimeout(() => onSelect(idx), 300);
  };

  return (
    <div style={{ display: "flex", gap: 12, width: "100%" }}>
      {["Yes", "No"].map((label, i) => {
        const isSelected = selected === i;
        return (
          <motion.button
            key={i}
            onClick={() => pick(i)}
            animate={{
              background: isSelected ? LIME : GLASS,
            }}
            whileTap={{ scale: 0.96 }}
            style={{
              flex: 1,
              padding: "20px 16px",
              borderRadius: 100,
              border: `1px solid ${isSelected ? LIME : GLASS_BORDER}`,
              background: isSelected ? LIME : GLASS,
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              cursor: "pointer",
              fontFamily: "var(--font-barlow-condensed), sans-serif",
              fontWeight: 800,
              fontSize: 18,
              letterSpacing: "0.08em",
              textTransform: "uppercase" as const,
              color: isSelected ? NAVY : TEXT_HI,
            }}
          >
            {label}
          </motion.button>
        );
      })}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   COMMITMENT SCALE — 1–5 tap buttons
══════════════════════════════════════════════════════ */

type CommitmentScaleProps = {
  subtext?: string;
  onSelect: (value: number) => void;
};

export function CommitmentScale({ subtext, onSelect }: CommitmentScaleProps) {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, width: "100%" }}>
      {subtext && (
        <p
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: 10,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: TEXT_LO,
            textAlign: "center",
            margin: 0,
          }}
        >
          {subtext}
        </p>
      )}

      <div style={{ display: "flex", gap: 8, width: "100%" }}>
        {[1, 2, 3, 4, 5].map((val) => {
          const isSelected = selected === val;
          return (
            <motion.button
              key={val}
              onClick={() => setSelected(val)}
              animate={{
                background: isSelected ? LIME : GLASS,
              }}
              whileTap={{ scale: 0.92 }}
              style={{
                flex: 1,
                aspectRatio: "1",
                borderRadius: 14,
                border: `1px solid ${isSelected ? LIME : GLASS_BORDER}`,
                background: isSelected ? LIME : GLASS,
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                cursor: "pointer",
                fontFamily: "var(--font-barlow-condensed), sans-serif",
                fontWeight: 800,
                fontSize: 22,
                color: isSelected ? NAVY : TEXT_HI,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {val}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {selected !== null && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onClick={() => onSelect(selected)}
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
            }}
          >
            That&apos;s my commitment
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
              <path d="M3.75 9h10.5M9.75 4.5L14.25 9l-4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   WIN CELEBRATION — confetti + "Top 12%"
══════════════════════════════════════════════════════ */

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

export function WinCelebration({ onContinue }: { onContinue: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const W = canvas.clientWidth || 340;
    const H = canvas.clientHeight || 280;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    const colors = ["#C8FF00", "#4CAF7D", "#2DD4C0", "rgba(255,255,255,0.8)", "#F5A623"];
    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * W,
      y: -20 - Math.random() * 100,
      vx: (Math.random() - 0.5) * 2,
      vy: 2 + Math.random() * 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      w: 6 + Math.random() * 6,
      h: 3 + Math.random() * 3,
      rotation: Math.random() * Math.PI * 2,
      rotV: (Math.random() - 0.5) * 0.15,
    }));

    let frame = 0;
    let animId: number;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      frame++;

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.06;
        p.rotation += p.rotV;
        if (p.y > H + 20) {
          p.y = -20;
          p.x = Math.random() * W;
          p.vy = 2 + Math.random() * 3;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = Math.min(1, frame / 20);
        ctx.fillStyle = p.color;
        roundRect(ctx, -p.w / 2, -p.h / 2, p.w, p.h, 1);
        ctx.fill();
        ctx.restore();
      });

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animId);
  }, []);

  useEffect(() => {
    const timer = setTimeout(onContinue, 2800);
    return () => clearTimeout(timer);
  }, [onContinue]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "55vh",
        position: "relative",
        textAlign: "center",
        gap: 0,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      />

      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.15, type: "spring", stiffness: 280, damping: 22 }}
        style={{ zIndex: 1 }}
      >
        <div
          style={{
            fontFamily: "var(--font-barlow-condensed), sans-serif",
            fontWeight: 800,
            fontSize: 11,
            letterSpacing: "0.20em",
            textTransform: "uppercase",
            color: TEXT_LO,
            marginBottom: 6,
          }}
        >
          You&apos;re in the
        </div>
        <div
          style={{
            fontFamily: "var(--font-barlow-condensed), sans-serif",
            fontWeight: 800,
            fontStyle: "italic",
            fontSize: 96,
            lineHeight: 1,
            letterSpacing: "-0.02em",
            color: LIME,
          }}
        >
          Top 12%
        </div>
        <p
          style={{
            fontFamily: "var(--font-barlow), sans-serif",
            fontWeight: 300,
            fontSize: 16,
            color: TEXT_MID,
            marginTop: 12,
          }}
        >
          Your plan is being built.
        </p>
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════
   CAPTURE FORM — name + email
══════════════════════════════════════════════════════ */

type CaptureFormProps = {
  onSubmit: (name: string, email: string) => void;
};

export function CaptureForm({ onSubmit }: CaptureFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const canSubmit = name.trim().length > 0 && email.includes("@");

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "16px 18px",
    background: GLASS,
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    border: `1px solid ${GLASS_BORDER}`,
    borderRadius: 14,
    color: TEXT_HI,
    fontFamily: "var(--font-barlow), sans-serif",
    fontWeight: 400,
    fontSize: 16,
    outline: "none",
    boxSizing: "border-box" as const,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%" }}>
      <input
        type="text"
        placeholder="Your first name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={inputStyle}
        autoComplete="given-name"
      />
      <input
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={inputStyle}
        autoComplete="email"
      />
      <motion.button
        onClick={() => canSubmit && onSubmit(name.trim(), email.trim())}
        animate={{ opacity: canSubmit ? 1 : 0.4 }}
        whileTap={canSubmit ? { scale: 0.97 } : {}}
        style={{
          width: "100%",
          background: canSubmit ? "#4CAF7D" : LIME,
          color: "#060912",
          fontFamily: "var(--font-barlow-condensed), sans-serif",
          fontWeight: 700,
          fontSize: 18,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          borderRadius: 100,
          padding: "20px 32px",
          border: "none",
          cursor: canSubmit ? "pointer" : "default",
          marginTop: 4,
          boxShadow: canSubmit ? "0 8px 32px rgba(76,175,125,0.30)" : "0 8px 32px rgba(200,255,0,0.25)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
        }}
      >
        Send My Plan
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
          <path d="M3.75 9h10.5M9.75 4.5L14.25 9l-4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </motion.button>
      <p
        style={{
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: 9,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: TEXT_LO,
          textAlign: "center",
          margin: 0,
        }}
      >
        Private · no spam · cancel anytime
      </p>
    </div>
  );
}
