"use client";

import React from "react";
import { motion } from "framer-motion";

// ─── Types ─────────────────────────────────────────────────────────────────────

export type MascotEmotion =
  | "default"
  | "thinking"
  | "excited"
  | "pointing"
  | "celebrating"
  | "encouraging";

// ─── Fixed-viewBox constants ───────────────────────────────────────────────────
// All coordinates are in the canonical 100×140 viewBox. Human-readable integers.

const EYE_LX = 42;   // left eye center X
const EYE_RX = 58;   // right eye center X
const EYE_Y  = 44;   // eye center Y
const EYE_R  = 5.5;  // eye white radius
const PUP_R  = 2.8;  // pupil radius

// Body trapezoid path (top x=37→63 y=72, bottom x=34→66 y=109, rounded corners)
const BODY_PATH =
  "M 37 72 L 63 72 Q 70 72 70 78 L 67 105 Q 66 110 61 110 L 39 110 Q 34 110 33 105 L 30 78 Q 30 72 37 72 Z";

// ─── Body gradient colors per emotion ─────────────────────────────────────────

const BODY_GRAD: Record<MascotEmotion, [string, string]> = {
  default:     ["#1A3158", "#0F2040"],
  thinking:    ["#122840", "#0A1A30"],
  excited:     ["#1A3158", "#2DD4C0"],
  pointing:    ["#1A3158", "#0F2040"],
  celebrating: ["#2DD4C0", "#C8FF00"],
  encouraging: ["#1A3158", "#2DD4C0"],
};

// Arm color = body gradient top color (same as BODY_GRAD[emotion][0])
const ARM_COLOR: Record<MascotEmotion, string> = {
  default:     "#1A3158",
  thinking:    "#122840",
  excited:     "#2DD4C0",
  pointing:    "#1A3158",
  celebrating: "#2DD4C0",
  encouraging: "#1A3158",
};

// ─── Animation configs per emotion ────────────────────────────────────────────

const ANIM: Record<MascotEmotion, object> = {
  default:     { scale: [1, 1.03, 1],   transition: { repeat: Infinity, duration: 3, ease: "easeInOut" } },
  thinking:    { rotate: [-4, 4, -4],   transition: { repeat: Infinity, duration: 2.5, ease: "easeInOut" } },
  excited:     { scale: [1, 1.06, 1],   transition: { repeat: Infinity, duration: 2.0, ease: "easeInOut" } },
  pointing:    {},
  celebrating: { y: [0, -8, 0],         transition: { repeat: Infinity, duration: 2.2, ease: "easeInOut" } },
  encouraging: { y: [0, -5, 0],         transition: { repeat: Infinity, duration: 2.8, ease: "easeInOut" } },
};

// ─── Face components (fixed viewBox coords) ────────────────────────────────────

function FaceDefault() {
  return (
    <g>
      {/* Eyes */}
      <circle cx={EYE_LX} cy={EYE_Y} r={EYE_R} fill="white" />
      <circle cx={EYE_RX} cy={EYE_Y} r={EYE_R} fill="white" />
      {/* Pupils — looking slightly down-center */}
      <circle cx={42.5} cy={44.5} r={PUP_R} fill="#0A1628" />
      <circle cx={57.5} cy={44.5} r={PUP_R} fill="#0A1628" />
      {/* Smile */}
      <path d="M 43 53 Q 50 57 57 53" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </g>
  );
}

function FaceExcited() {
  return (
    <g>
      {/* Wide eyes */}
      <circle cx={EYE_LX} cy={EYE_Y} r={6} fill="white" />
      <circle cx={EYE_RX} cy={EYE_Y} r={6} fill="white" />
      {/* Shine highlights */}
      <circle cx={39.5} cy={41.5} r={1.8} fill="rgba(255,255,255,0.75)" />
      <circle cx={55.5} cy={41.5} r={1.8} fill="rgba(255,255,255,0.75)" />
      {/* Pupils centered */}
      <circle cx={EYE_LX} cy={44.5} r={PUP_R} fill="#0A1628" />
      <circle cx={EYE_RX} cy={44.5} r={PUP_R} fill="#0A1628" />
      {/* Big open smile with fill */}
      <path d="M 42 52 Q 50 60 58 52" stroke="white" strokeWidth="1.8" fill="rgba(255,255,255,0.15)" strokeLinecap="round" />
    </g>
  );
}

function FaceThinking() {
  return (
    <g>
      {/* Eyes */}
      <circle cx={EYE_LX} cy={EYE_Y} r={EYE_R} fill="white" />
      <circle cx={EYE_RX} cy={EYE_Y} r={EYE_R} fill="white" />
      {/* Pupils shifted upper-right — contemplating */}
      <circle cx={43.5} cy={42.5} r={PUP_R} fill="#0A1628" />
      <circle cx={59}   cy={42.5} r={PUP_R} fill="#0A1628" />
      {/* Wavy thinking mouth */}
      <path
        d="M 43 53 q 3.5 -2.5 7 0 q 3.5 2.5 7 0"
        stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"
      />
      {/* Thought bubble dots trailing upper-right */}
      <circle cx={67} cy={36} r={1.8} fill="rgba(255,255,255,0.60)" />
      <circle cx={71} cy={31} r={1.3} fill="rgba(255,255,255,0.45)" />
      <circle cx={74} cy={27} r={0.9} fill="rgba(255,255,255,0.30)" />
    </g>
  );
}

function FacePointing() {
  return (
    <g>
      {/* Left eye — wink arc */}
      <path
        d={`M ${EYE_LX - EYE_R} ${EYE_Y} Q ${EYE_LX} ${EYE_Y - EYE_R * 0.9} ${EYE_LX + EYE_R} ${EYE_Y}`}
        stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round"
      />
      {/* Right eye — normal, looking forward */}
      <circle cx={EYE_RX} cy={EYE_Y} r={EYE_R} fill="white" />
      <circle cx={58.5}   cy={EYE_Y} r={PUP_R} fill="#0A1628" />
      {/* Confident smile */}
      <path d="M 43 52 Q 50 57.5 57 52" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </g>
  );
}

function FaceCelebrating() {
  // 8-point star eye helper
  const starEye = (x: number, y: number, r: number) => {
    const pts = Array.from({ length: 8 }, (_, i) => {
      const angle = (i * Math.PI) / 4 - Math.PI / 2;
      const rr = i % 2 === 0 ? r : r * 0.45;
      return `${x + rr * Math.cos(angle)},${y + rr * Math.sin(angle)}`;
    }).join(" ");
    return <polygon key={`star-${x}`} points={pts} fill="white" />;
  };
  return (
    <g>
      {starEye(EYE_LX, EYE_Y, EYE_R)}
      {starEye(EYE_RX, EYE_Y, EYE_R)}
      {/* Big grin with fill */}
      <path d="M 41 51.5 Q 50 61 59 51.5" stroke="white" strokeWidth="1.8" fill="rgba(255,255,255,0.20)" strokeLinecap="round" />
      {/* Rosy cheeks */}
      <circle cx={36} cy={50} r={4} fill="rgba(255,180,130,0.30)" />
      <circle cx={64} cy={50} r={4} fill="rgba(255,180,130,0.30)" />
    </g>
  );
}

function FaceEncouraging() {
  return (
    <g>
      {/* Warm squint eyes */}
      <path
        d={`M ${EYE_LX - EYE_R} ${EYE_Y + EYE_R * 0.2} Q ${EYE_LX} ${EYE_Y - EYE_R * 0.7} ${EYE_LX + EYE_R} ${EYE_Y + EYE_R * 0.2}`}
        stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round"
      />
      <path
        d={`M ${EYE_RX - EYE_R} ${EYE_Y + EYE_R * 0.2} Q ${EYE_RX} ${EYE_Y - EYE_R * 0.7} ${EYE_RX + EYE_R} ${EYE_Y + EYE_R * 0.2}`}
        stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round"
      />
      {/* Warm smile */}
      <path d="M 43 52.5 Q 50 58 57 52.5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Rosy cheeks */}
      <circle cx={36} cy={50} r={4} fill="rgba(255,150,150,0.22)" />
      <circle cx={64} cy={50} r={4} fill="rgba(255,150,150,0.22)" />
    </g>
  );
}

const FACE_MAP: Record<MascotEmotion, React.ComponentType> = {
  default:     FaceDefault,
  thinking:    FaceThinking,
  excited:     FaceExcited,
  pointing:    FacePointing,
  celebrating: FaceCelebrating,
  encouraging: FaceEncouraging,
};

// ─── Arms ──────────────────────────────────────────────────────────────────────
// Shoulder anchors: left=(30,78) right=(70,78)
// Each arm is a quadratic bezier path: M sx sy Q cx cy ex ey
// For "thinking" right arm, two line segments simulate a bent elbow.

type ArmDef =
  | { type: "curve"; lx: number; ly: number; lcx: number; lcy: number; rx: number; ry: number; rcx: number; rcy: number }
  | { type: "bent-right"; lx: number; ly: number; lcx: number; lcy: number; rex1: number; rey1: number; rex2: number; rey2: number };

const ARM_CONFIGS: Record<MascotEmotion, ArmDef> = {
  default: {
    type: "curve",
    lx: 20, ly: 98, lcx: 22, lcy: 82,
    rx: 80, ry: 98, rcx: 78, rcy: 82,
  },
  thinking: {
    type: "bent-right",
    lx: 20, ly: 98, lcx: 22, lcy: 82,
    rex1: 76, rey1: 68, rex2: 65, rey2: 60,
  },
  pointing: {
    type: "curve",
    lx: 20, ly: 98, lcx: 22, lcy: 82,
    rx: 92, ry: 58, rcx: 80, rcy: 70,
  },
  celebrating: {
    type: "curve",
    lx: 18, ly: 58, lcx: 20, lcy: 68,
    rx: 82, ry: 58, rcx: 80, rcy: 68,
  },
  encouraging: {
    type: "curve",
    lx: 16, ly: 82, lcx: 22, lcy: 80,
    rx: 84, ry: 82, rcx: 78, rcy: 80,
  },
  excited: {
    type: "curve",
    lx: 14, ly: 60, lcx: 18, lcy: 66,
    rx: 86, ry: 60, rcx: 82, rcy: 66,
  },
};

function ArmPair({ emotion }: { emotion: MascotEmotion }) {
  const cfg = ARM_CONFIGS[emotion];
  const color = ARM_COLOR[emotion];
  const sw = 7;

  const leftArm = (
    <path
      d={`M 30 78 Q ${cfg.lcx} ${cfg.lcy} ${cfg.lx} ${cfg.ly}`}
      stroke={color} strokeWidth={sw} strokeLinecap="round" fill="none"
    />
  );

  let rightArm: React.ReactNode;
  if (cfg.type === "bent-right") {
    rightArm = (
      <path
        d={`M 70 78 L ${cfg.rex1} ${cfg.rey1} L ${cfg.rex2} ${cfg.rey2}`}
        stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none"
      />
    );
  } else {
    rightArm = (
      <path
        d={`M 70 78 Q ${cfg.rcx} ${cfg.rcy} ${cfg.rx} ${cfg.ry}`}
        stroke={color} strokeWidth={sw} strokeLinecap="round" fill="none"
      />
    );
  }

  return (
    <>
      {leftArm}
      {rightArm}
    </>
  );
}

// ─── Sparkles (celebrating + excited) ─────────────────────────────────────────

function Sparkles() {
  const sparks = [
    { x: 18, y: 22, s: 8,  delay: 0 },
    { x: 82, y: 17, s: 10, delay: 0.3 },
    { x: 88, y: 52, s: 7,  delay: 0.15 },
    { x: 12, y: 56, s: 6,  delay: 0.45 },
  ];
  return (
    <>
      {sparks.map((sp, i) => (
        <motion.text
          key={i}
          x={sp.x} y={sp.y}
          fontSize={sp.s}
          fill="#C8FF00"
          textAnchor="middle"
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.8, delay: sp.delay, ease: "easeInOut" }}
        >
          ✦
        </motion.text>
      ))}
    </>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

type Props = { emotion: MascotEmotion; size?: number };

export function OrbAvatar({ emotion, size = 80 }: Props) {
  const width  = size;
  const height = Math.round(size * 1.4);
  const [c1, c2] = BODY_GRAD[emotion];
  const bodyGradId = `milo-body-${emotion}`;
  const FaceComponent = FACE_MAP[emotion];
  const { transition, ...animProps } = ANIM[emotion] as { transition?: object } & object;

  return (
    <motion.div
      className="milo-ring"
      style={{ width, height }}
      animate={animProps}
      transition={transition}
    >
      <svg
        width={width}
        height={height}
        viewBox="0 0 100 140"
        overflow="visible"
        style={{ display: "block" }}
      >
        <defs>
          {/* Head gradient — cool navy-teal, consistent across emotions */}
          <radialGradient id="milo-head" cx="40%" cy="35%" r="60%">
            <stop offset="0%"   stopColor="#2DD4C0" />
            <stop offset="55%"  stopColor="#1A90B0" />
            <stop offset="100%" stopColor="#0F5070" />
          </radialGradient>

          {/* Body gradient — emotion-tinted */}
          <linearGradient id={bodyGradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={c1} />
            <stop offset="100%" stopColor={c2} />
          </linearGradient>

          {/* Aurora blur filter */}
          <filter id="milo-aurora" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Layer 1: Aurora glow ring behind head */}
        <circle
          cx="50" cy="46" r="28"
          fill="none"
          stroke={c1}
          strokeWidth="6"
          opacity="0.20"
          filter="url(#milo-aurora)"
        />

        {/* Layer 2: Arms (behind body so shoulder join is hidden) */}
        <ArmPair emotion={emotion} />

        {/* Layer 3: Body / suit */}
        <path d={BODY_PATH} fill={`url(#${bodyGradId})`} />
        {/* Body shine highlight */}
        <ellipse cx="44" cy="82" rx="8" ry="5" fill="rgba(255,255,255,0.12)" />

        {/* Layer 4: Neck connector */}
        <rect x="46" y="65" width="8" height="9" rx="3" fill="#1A90B0" />

        {/* Layer 5: Head */}
        <ellipse cx="50" cy="46" rx="20" ry="21" fill="url(#milo-head)" />
        {/* Head shine */}
        <ellipse cx="43" cy="38" rx="6" ry="3.5" fill="rgba(255,255,255,0.20)" />

        {/* Layer 6: Face */}
        <FaceComponent />

        {/* Layer 7: Sparkles (celebrating + excited) */}
        {(emotion === "celebrating" || emotion === "excited") && <Sparkles />}
      </svg>
    </motion.div>
  );
}
