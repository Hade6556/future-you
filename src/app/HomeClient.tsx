"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { usePlanStore } from "./state/planStore";
import { PaywallSheet } from "./components/paywall/PaywallSheet";
import { AppTour } from "./components/AppTour";
import { todayISO } from "./state/planStore";
import { computeDayInfo } from "./utils/dayEngine";
import { TestimonialsStrip } from "./components/TestimonialsStrip";

const SESSION_PAYWALL_KEY = "future-you-paywall-last-date";

// ─── Wordmark ─────────────────────────────────────────────────────────────────
function Wordmark({ size = 18 }: { size?: number }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "baseline", gap: "2px", lineHeight: 1 }}>
      <span
        style={{
          fontFamily: "var(--font-libre-baskerville), serif",
          fontStyle: "italic",
          fontWeight: 400,
          fontSize: size,
          color: "rgba(235,242,255,0.92)",
          letterSpacing: "-0.01em",
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
          color: "#C8FF00",
          letterSpacing: "0.01em",
        }}
      >
        YOU
      </span>
    </span>
  );
}

// ─── Hook screen (pre-quiz) ───────────────────────────────────────────────────
function HookScreen() {
  const router = useRouter();
  return (
    <div
      className="flex min-h-dvh flex-col items-center justify-center px-6 pb-12 pt-16"
      style={{ background: "var(--bg-base)" }}
    >
      {/* Background mesh */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          background: `
            radial-gradient(ellipse 70% 50% at 20% 10%, rgba(40,80,200,0.30) 0%, transparent 60%),
            radial-gradient(ellipse 60% 60% at 85% 80%, rgba(15,40,100,0.50) 0%, transparent 60%),
            linear-gradient(160deg, #0f2040 0%, #090f1a 50%, #060912 100%)
          `,
          pointerEvents: "none",
        }}
      />

      <motion.div
        className="relative z-10 mx-auto flex w-full max-w-sm flex-col items-center gap-8"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        {/* Wordmark */}
        <Wordmark size={28} />

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.35 }}
          className="space-y-4 text-center"
        >
          <h1
            style={{
              fontFamily: "var(--font-barlow-condensed), sans-serif",
              fontWeight: 700,
              fontStyle: "italic",
              fontSize: 50,
              lineHeight: 0.96,
              letterSpacing: "-0.03em",
              color: "rgba(235,242,255,0.92)",
              marginBottom: 0,
            }}
          >
            Your{" "}
            <em style={{ fontStyle: "normal", color: "#C8FF00" }}>best self</em>
            {" "}is already in there.
          </h1>
          <p
            style={{
              fontFamily: "var(--font-barlow), sans-serif",
              fontWeight: 300,
              fontSize: 15,
              lineHeight: 1.65,
              color: "rgba(120,155,195,0.50)",
              maxWidth: 270,
              margin: "0 auto",
            }}
          >
            Answer a few quick questions. We&apos;ll build a personal plan to close the gap — fast.
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38 }}
          className="w-full space-y-3"
        >
          <button
            onClick={() => router.push("/quiz")}
            className="btn-cta w-full"
          >
            Let&apos;s do this
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
              <path d="M3.75 9h10.5M9.75 4.5L14.25 9l-4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <p
            style={{
              textAlign: "center",
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 10,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(120,155,195,0.40)",
            }}
          >
            2 min · private · free
          </p>
        </motion.div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="w-full"
        >
          <TestimonialsStrip />
        </motion.div>
      </motion.div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatHeaderDate(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

// ─── Action item with left-edge accent ────────────────────────────────────────
type ActionState = "active" | "done" | "overdue";

function ActionItem({
  title,
  state,
  href,
}: {
  title: string;
  state: ActionState;
  href: string;
}) {
  const accent =
    state === "active"  ? "#C8FF00"
    : state === "done"  ? "rgba(76,175,125,0.40)"
    : /* overdue */       "rgba(255,85,85,0.60)";

  const textColor =
    state === "active"  ? "rgba(235,242,255,0.92)"
    : state === "done"  ? "rgba(120,155,195,0.50)"
    : /* overdue */       "rgba(120,155,195,0.75)";

  return (
    <Link href={href} style={{ display: "block", textDecoration: "none" }}>
      <div
        style={{
          position: "relative",
          background: "rgba(255,255,255,0.05)",
          borderRadius: 14,
          padding: "14px 16px 14px 22px",
          border: "1px solid rgba(255,255,255,0.10)",
          transition: "background 0.15s",
        }}
      >
        {/* Left edge accent */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 8,
            bottom: 8,
            width: 2,
            borderRadius: 1,
            background: accent,
          }}
        />
        <span
          style={{
            fontFamily: "var(--font-barlow-condensed), sans-serif",
            fontWeight: 700,
            fontSize: 15,
            color: textColor,
            textDecoration: state === "done" ? "line-through" : "none",
          }}
        >
          {title}
        </span>
      </div>
    </Link>
  );
}

// ─── Gap Chart ────────────────────────────────────────────────────────────────

function roundRectPath(
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

function GapChart(_props: { streak?: number; todayDone?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Mock stats — will be replaced by real data once backend is wired
  const gapPct = 42;
  const deltaSign = "↓";
  const deltaPct = 3;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const W = canvas.clientWidth || 320;
    const H = canvas.clientHeight || 150;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    const DAYS = 22;
    const PROJ = 8;
    const PAD = 12;
    const chartH = H * 0.60;
    const volH = H * 0.14;
    const totalSlots = DAYS + PROJ;
    const barW = (W - PAD * 2) / totalSlots;
    const gap = barW * 0.40;

    // Mock OHLCV data — tells the story: rough start → dip → strong streak into today
    // Each entry: [open, close, high, low, vol]  (all 0-1 normalised)
    const RAW: [number,number,number,number,number][] = [
      [0.38, 0.34, 0.42, 0.31, 0.30],
      [0.34, 0.30, 0.37, 0.27, 0.28],
      [0.31, 0.35, 0.38, 0.29, 0.34],
      [0.35, 0.32, 0.39, 0.30, 0.25],
      [0.32, 0.28, 0.34, 0.25, 0.22],
      [0.29, 0.33, 0.36, 0.27, 0.38],
      [0.33, 0.30, 0.37, 0.28, 0.27],
      [0.31, 0.27, 0.33, 0.24, 0.20],
      [0.27, 0.24, 0.30, 0.22, 0.18],
      [0.25, 0.29, 0.33, 0.23, 0.40],
      [0.28, 0.33, 0.36, 0.26, 0.52],
      [0.32, 0.38, 0.41, 0.30, 0.58],
      [0.37, 0.43, 0.46, 0.35, 0.64],
      [0.42, 0.40, 0.46, 0.38, 0.48],
      [0.41, 0.46, 0.50, 0.39, 0.60],
      [0.45, 0.51, 0.55, 0.43, 0.68],
      [0.50, 0.47, 0.53, 0.45, 0.44],
      [0.48, 0.54, 0.57, 0.46, 0.72],
      [0.53, 0.59, 0.63, 0.51, 0.76],
      [0.58, 0.55, 0.62, 0.53, 0.50],
      [0.56, 0.62, 0.66, 0.54, 0.80],
      [0.61, 0.68, 0.71, 0.59, 0.88], // today
    ];
    const data = RAW.map(([open, close, high, low, vol], i) => ({
      open, close, high, low, vol,
      isToday: i === DAYS - 1,
      inStreak: close >= open,
    }));

    const minVal = 0.05;
    const maxVal = 0.92;
    const toY = (v: number) =>
      chartH - ((Math.max(minVal, Math.min(maxVal, v)) - minVal) / (maxVal - minVal)) * chartH;

    // Grid lines
    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.lineWidth = 0.5;
    [0, 0.33, 0.67, 1].forEach((t) => {
      const y = t * chartH;
      ctx.beginPath();
      ctx.moveTo(PAD, y);
      ctx.lineTo(W - PAD, y);
      ctx.stroke();
    });

    // Candlesticks
    data.forEach((d, i) => {
      const cx = PAD + i * barW + barW / 2;
      const openY = toY(d.open);
      const closeY = toY(d.close);
      const highY = toY(d.high);
      const lowY = toY(d.low);
      const bodyTop = Math.min(openY, closeY);
      const bodyH = Math.max(2, Math.abs(closeY - openY));
      const bw = barW - gap;

      const color = d.inStreak ? "rgba(76,175,125,0.80)" : "rgba(255,85,85,0.78)";
      const wickColor = d.inStreak ? "rgba(76,175,125,0.45)" : "rgba(255,85,85,0.45)";

      // Wick
      ctx.strokeStyle = wickColor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx, highY);
      ctx.lineTo(cx, lowY);
      ctx.stroke();

      // Body
      ctx.fillStyle = color;
      roundRectPath(ctx, cx - bw / 2, bodyTop, bw, bodyH, 2);
      ctx.fill();

      // Today lime outline
      if (d.isToday) {
        ctx.strokeStyle = "#C8FF00";
        ctx.lineWidth = 1.5;
        roundRectPath(ctx, cx - bw / 2 - 1, bodyTop - 1, bw + 2, bodyH + 2, 3);
        ctx.stroke();
      }
    });

    // Projection line (multi-point dashed amber, curving upward)
    const lastIdx = DAYS - 1;
    const lastX = PAD + lastIdx * barW + barW / 2;
    const lastClose = data[lastIdx].close;
    ctx.strokeStyle = "rgba(245,166,35,0.35)";
    ctx.lineWidth = 1.25;
    ctx.setLineDash([3, 4]);
    ctx.beginPath();
    ctx.moveTo(lastX, toY(lastClose));
    const projValues = [0.03, 0.06, 0.10, 0.15, 0.20, 0.25, 0.31, 0.38];
    projValues.forEach((delta, pi) => {
      const px = PAD + (DAYS + pi) * barW + barW / 2;
      ctx.lineTo(px, toY(Math.min(maxVal - 0.05, lastClose + delta)));
    });
    ctx.stroke();
    ctx.setLineDash([]);

    // Volume bars
    const volTop = chartH + 6;
    data.forEach((d, i) => {
      const x = PAD + i * barW + gap / 2;
      const bw = barW - gap;
      const bh = volH * Math.max(0.05, d.vol);

      let barColor: string;
      if (d.isToday) barColor = "rgba(200,255,0,0.60)";
      else if (d.vol < 0.15) return;
      else if (d.vol > 0.55) barColor = "rgba(255,255,255,0.15)";
      else barColor = "rgba(245,166,35,0.38)";

      ctx.fillStyle = barColor;
      roundRectPath(ctx, x, volTop + volH - bh, bw, bh, 2);
      ctx.fill();
    });

    // X-axis date range labels (5 evenly spaced)
    const now = new Date();
    const fmtShort = (d: Date) =>
      d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const xLabels: { text: string; slot: number }[] = [
      { text: fmtShort(new Date(now.getTime() - (DAYS - 1) * 86400000)), slot: 0 },
      { text: fmtShort(new Date(now.getTime() - Math.round(DAYS * 0.66) * 86400000)), slot: Math.round(DAYS * 0.33) },
      { text: fmtShort(new Date(now.getTime() - Math.round(DAYS * 0.33) * 86400000)), slot: Math.round(DAYS * 0.66) },
      { text: "Today", slot: DAYS - 1 },
      { text: "Goal →", slot: DAYS + Math.round(PROJ * 0.85) },
    ];

    ctx.fillStyle = "rgba(120,155,195,0.40)";
    ctx.font = `400 7px 'JetBrains Mono', monospace`;
    const labelY = volTop + volH + 13;
    xLabels.forEach(({ text, slot }) => {
      const cx = PAD + slot * barW + barW / 2;
      const align = slot === 0 ? "left" : slot >= DAYS + PROJ - 2 ? "right" : "center";
      ctx.textAlign = align;
      ctx.fillText(text, cx, labelY);
    });
  }, []);

  return (
    <section
      style={{
        position: "relative",
        background: "rgba(255,255,255,0.07)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.14)",
        borderRadius: 20,
        padding: "16px 16px 14px",
        overflow: "hidden",
      }}
    >
      {/* Top edge highlight */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0, height: 1,
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)",
        }}
      />

      {/* Header row: gap% left, today delta right */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 8 }}>
        {/* Left: percentage + label */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
          <span
            style={{
              fontFamily: "var(--font-barlow-condensed), sans-serif",
              fontWeight: 700,
              fontSize: 38,
              lineHeight: 1,
              color: "#C8FF00",
              letterSpacing: "-0.03em",
            }}
          >
            {gapPct}%
          </span>
          <span
            style={{
              fontFamily: "var(--font-barlow), sans-serif",
              fontWeight: 300,
              fontSize: 11,
              color: "rgba(120,155,195,0.75)",
              paddingBottom: 3,
            }}
          >
            closed
          </span>
        </div>
        {/* Right: today label + delta */}
        <div style={{ textAlign: "right", paddingBottom: 3 }}>
          <span
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 7,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(120,155,195,0.40)",
              display: "block",
              marginBottom: 2,
            }}
          >
            Today
          </span>
          <span
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 9,
              letterSpacing: "0.05em",
              color: "#4CAF7D",
              display: "block",
            }}
          >
            {deltaSign} −{deltaPct}% gap
          </span>
        </div>
      </div>

      {/* Progress bar: teal-to-lime gradient */}
      <div
        style={{
          height: 2,
          background: "rgba(255,255,255,0.08)",
          borderRadius: 2,
          marginBottom: 10,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${gapPct}%`,
            height: "100%",
            background: "linear-gradient(90deg, rgba(45,212,192,0.8), #C8FF00)",
            borderRadius: 2,
          }}
        />
      </div>

      {/* Chart canvas */}
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: 150, display: "block" }}
      />
    </section>
  );
}

// ─── Main home dashboard ──────────────────────────────────────────────────────
export default function HomeClient() {
  const router = useRouter();
  const quizComplete       = usePlanStore((s) => s.quizComplete);
  const onboardingComplete = usePlanStore((s) => s.onboardingComplete);
  const isPremium          = usePlanStore((s) => s.isPremium);
  const planReady          = usePlanStore((s) => s.planReady);
  const pipelinePlan       = usePlanStore((s) => s.pipelinePlan);
  const planStartDate      = usePlanStore((s) => s.planStartDate);
  const userName           = usePlanStore((s) => s.userName);
  const streak             = usePlanStore((s) => s.streak);
  const todayStatus        = usePlanStore((s) => s.todayStatus);
  const appTourSeen        = usePlanStore((s) => s.appTourSeen);
  const setAppTourSeen     = usePlanStore((s) => s.setAppTourSeen);
  const phoenixDay         = usePlanStore((s) => s.phoenixDay);
  const phoenixPriorStreak = usePlanStore((s) => s.phoenixPriorStreak);
  const exitPhoenixMode    = usePlanStore((s) => s.exitPhoenixMode);

  const [sessionPaywallOpen, setSessionPaywallOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  const dayInfo = useMemo(
    () => (pipelinePlan && planStartDate ? computeDayInfo(pipelinePlan, planStartDate) : null),
    [pipelinePlan, planStartDate],
  );

  useEffect(() => {
    if (quizComplete && !onboardingComplete) {
      router.replace("/quiz/result");
    }
  }, [quizComplete, onboardingComplete, router]);

  useEffect(() => {
    if (!quizComplete || !onboardingComplete || isPremium || !appTourSeen) return;
    const timer = setTimeout(() => {
      const today = new Date().toISOString().slice(0, 10);
      try {
        const last = sessionStorage.getItem(SESSION_PAYWALL_KEY);
        if (last !== today) setSessionPaywallOpen(true);
      } catch {
        setSessionPaywallOpen(true);
      }
    }, 700);
    return () => clearTimeout(timer);
  }, [quizComplete, onboardingComplete, isPremium, appTourSeen]);

  const handleSessionPaywallClose = () => {
    setSessionPaywallOpen(false);
    try {
      sessionStorage.setItem(SESSION_PAYWALL_KEY, new Date().toISOString().slice(0, 10));
    } catch { /* ignore */ }
  };

  if (!quizComplete) return <HookScreen />;
  if (!onboardingComplete) return null;

  // ─── Derived ─────────────────────────────────────────────────────────────────
  const firstName   = userName ? userName.split(" ")[0] : "";
  const questTitle  = dayInfo?.currentStep?.title ?? "Today's ritual";

  const greetingText = (() => {
    if (todayStatus === "done")    return `You closed the gap today, ${firstName || "you"}.`;
    if (todayStatus === "partial") return "Partial progress. Finish what you started.";
    if (phoenixDay || todayStatus === "skipped") return "Streak reset. Gap-closure rate down. Two actions today recovers the ground.";
    if (!planReady || (planStartDate === todayISO() && streak === 0)) return "Your system is ready. First action, now.";
    const h   = new Date().getHours();
    const tod = h < 12 ? "morning" : h < 17 ? "afternoon" : "evening";
    return firstName ? `Good ${tod}, ${firstName}.` : `Good ${tod}.`;
  })();

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "#060912",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background gradient mesh — required behind all glass */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          background: `
            radial-gradient(ellipse 70% 50% at 20% 10%, rgba(40,80,200,0.30) 0%, transparent 60%),
            radial-gradient(ellipse 60% 60% at 85% 80%, rgba(15,40,100,0.50) 0%, transparent 60%),
            linear-gradient(160deg, #0f2040 0%, #090f1a 50%, #060912 100%)
          `,
          pointerEvents: "none",
        }}
      />

      <motion.div
        className="relative z-10 mx-auto w-full max-w-md"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            padding:
              "max(3.25rem, calc(env(safe-area-inset-top, 0px) + 2.75rem)) max(24px, env(safe-area-inset-right, 24px)) 120px max(24px, env(safe-area-inset-left, 24px))",
          }}
        >

          {/* ── Header: greeting + date (left) | streak + avatar (right), vertically centered ── */}
          <header
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 14,
            }}
          >
            <div
              style={{
                flex: 1,
                minWidth: 0,
                paddingRight: 4,
              }}
            >
              <h1
                style={{
                  fontFamily: "var(--font-barlow-condensed), sans-serif",
                  fontWeight: 900,
                  fontStyle: "italic",
                  fontSize: 36,
                  lineHeight: 1.07,
                  letterSpacing: "-0.025em",
                  color: "rgba(235,242,255,0.92)",
                  margin: 0,
                }}
              >
                {greetingText}
              </h1>
              <p
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: 10,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "rgba(120,155,195,0.62)",
                  margin: "6px 0 0",
                  lineHeight: 1.35,
                }}
              >
                {formatHeaderDate()}
                {dayInfo && ` · Day ${dayInfo.currentDay} of ${dayInfo.totalDays}`}
              </p>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                flexShrink: 0,
              }}
            >
              <div
                aria-label={`${streak} day streak`}
                style={{
                  display: "inline-flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 5,
                  padding: "5px 10px 5px 7px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                }}
              >
                {/* Noun Project: noun-fire-4109176 — public/icons/noun-fire-streak.svg */}
                <img
                  src="/icons/noun-fire-streak.svg"
                  width={20}
                  height={26}
                  alt=""
                  aria-hidden
                  style={{ display: "block", flexShrink: 0, objectFit: "contain" }}
                />
                <span
                  style={{
                    fontFamily: "var(--font-barlow-condensed), sans-serif",
                    fontWeight: 900,
                    fontSize: 19,
                    color: "#C8FF00",
                    lineHeight: 1,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {streak}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                    fontSize: 8,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "rgba(120,155,195,0.72)",
                    whiteSpace: "nowrap",
                    lineHeight: 1,
                  }}
                >
                  day streak
                </span>
              </div>

              <Link
                href="/account"
                aria-label="Account settings"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  border: "1.5px solid rgba(255,255,255,0.18)",
                  background: "rgba(255,255,255,0.07)",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                  color: "rgba(235,242,255,0.70)",
                  fontFamily: "var(--font-barlow-condensed), sans-serif",
                  fontWeight: 700,
                  fontSize: 14,
                  letterSpacing: "0.04em",
                  textDecoration: "none",
                  flexShrink: 0,
                }}
              >
                {userName ? userName.charAt(0).toUpperCase() : "?"}
              </Link>
            </div>
          </header>

          {/* ── Phoenix banner ── */}
          {phoenixDay && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                position: "relative",
                background: "rgba(255,255,255,0.07)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(255,85,85,0.30)",
                borderRadius: 20,
                padding: "14px 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <div>
                <p
                  style={{
                    fontFamily: "var(--font-barlow-condensed), sans-serif",
                    fontWeight: 700,
                    fontSize: 13,
                    color: "#FF5555",
                    marginBottom: 2,
                  }}
                >
                  Streak reset after {phoenixPriorStreak} days
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-barlow), sans-serif",
                    fontWeight: 300,
                    fontSize: 12,
                    color: "rgba(120,155,195,0.75)",
                  }}
                >
                  Gap-closure rate down. Two actions today recovers the ground.
                </p>
              </div>
              <button
                onClick={exitPhoenixMode}
                className="btn-cta"
                style={{ padding: "8px 16px", fontSize: 12, flexShrink: 0 }}
              >
                Go
              </button>
            </motion.div>
          )}

          {/* ── Gap chart card ── */}
          <GapChart streak={streak} todayDone={todayStatus === "done"} />

          {/* ── Actions glass card ── */}
          <section
            style={{
              position: "relative",
              background: "rgba(255,255,255,0.07)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(255,255,255,0.14)",
              borderRadius: 20,
              padding: "20px",
              overflow: "hidden",
            }}
          >
            {/* Top edge highlight */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 1,
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)",
              }}
            />

            <p
              style={{
                fontFamily: "var(--font-barlow-condensed), sans-serif",
                fontWeight: 700,
                fontSize: 11,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "rgba(120,155,195,0.40)",
                marginBottom: 12,
              }}
            >
              Actions
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <ActionItem
                title={questTitle}
                state={
                  todayStatus === "done"
                    ? "done"
                    : todayStatus === "partial"
                      ? "active"
                      : "active"
                }
                href="/tasks"
              />
            </div>

            {/* Footer */}
            <div
              style={{
                marginTop: 12,
                paddingTop: 12,
                borderTop: "1px solid rgba(255,255,255,0.06)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: 9,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "rgba(120,155,195,0.40)",
                }}
              >
                {todayStatus === "done" ? "All done today" : "1 action · check in"}
              </span>
              <Link
                href="/tasks"
                style={{
                  fontFamily: "var(--font-barlow-condensed), sans-serif",
                  fontWeight: 700,
                  fontSize: 11,
                  letterSpacing: "0.10em",
                  textTransform: "uppercase",
                  color: todayStatus === "done" ? "#4CAF7D" : "#C8FF00",
                  textDecoration: "none",
                }}
              >
                {todayStatus === "done" ? "Done ✓" : "Check in →"}
              </Link>
            </div>
          </section>

        </div>
      </motion.div>

      <PaywallSheet open={sessionPaywallOpen} onClose={handleSessionPaywallClose} variant="session" />
      <PaywallSheet open={upgradeOpen} onClose={() => setUpgradeOpen(false)} variant="session" />

      {onboardingComplete && !appTourSeen && (
        <AppTour onDismiss={setAppTourSeen} />
      )}
    </div>
  );
}
