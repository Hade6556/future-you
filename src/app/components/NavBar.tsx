"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { motion } from "framer-motion";
import { MicrophoneIcon } from "@heroicons/react/24/outline";
import { ACCENT } from "@/app/theme";

// ── Icons ─────────────────────────────────────────────────────────────────────

function HomeIcon({ active }: { active: boolean }) {
  const c = active ? ACCENT : "rgba(160,180,210,0.50)";
  return (
    <svg width="20" height="20" viewBox="188 535 22 22" fill="none" aria-hidden>
      <path d="M190 544L196.172 537.828C197.734 536.266 200.266 536.266 201.828 537.828L208 544"
        stroke={c} strokeWidth="2" strokeLinejoin="round" />
      <path d="M193 541V548C193 551.314 195.686 554 199 554C202.314 554 205 551.314 205 548V541"
        stroke={c} strokeWidth="2" strokeLinejoin="round" />
      <rect x="197" y="546" width="4" height="4" rx="2" stroke={c} strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function ChatIcon({ active }: { active: boolean }) {
  const c = active ? ACCENT : "rgba(160,180,210,0.50)";
  return (
    <svg width="20" height="20" viewBox="255 534 24 22" fill="none" aria-hidden>
      <path d="M276 544C276 540.134 272.866 537 269 537H265C261.134 537 258 540.134 258 544V550.172C258 551.953 260.154 552.846 261.414 551.586L261.868 551.132C261.953 551.047 262.067 551 262.186 551H269C272.866 551 276 547.866 276 544Z"
        stroke={c} strokeWidth="2" strokeLinejoin="round" />
      <circle cx="263" cy="544" r="1" fill={c} />
      <circle cx="267" cy="544" r="1" fill={c} />
      <circle cx="271" cy="544" r="1" fill={c} />
    </svg>
  );
}

function ProfileIcon({ active }: { active: boolean }) {
  const c = active ? ACCENT : "rgba(160,180,210,0.50)";
  return (
    <svg width="20" height="20" viewBox="484 536 22 22" fill="none" aria-hidden>
      <rect x="490" y="539" width="8" height="8" rx="4" stroke={c} strokeWidth="2" strokeLinejoin="round" />
      <path d="M487 554C487 553.081 487.181 552.17 487.533 551.321C487.885 550.472 488.4 549.7 489.05 549.05C489.7 548.4 490.472 547.885 491.321 547.533C492.17 547.181 493.081 547 494 547C494.919 547 495.83 547.181 496.679 547.533C497.528 547.885 498.3 548.4 498.95 549.05C499.6 549.7 500.115 550.472 500.467 551.321C500.819 552.17 501 553.081 501 554"
        stroke={c} strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function ExploreIcon({ active }: { active: boolean }) {
  const c = active ? ACCENT : "rgba(160,180,210,0.50)";
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <circle cx="10" cy="10" r="8" stroke={c} strokeWidth="1.5" />
      <path d="M12.5 7.5l-1.8 3.2-3.2 1.8 1.8-3.2 3.2-1.8z" fill={c} />
    </svg>
  );
}

const leftItems = [
  { href: "/",        label: "Today",   Icon: HomeIcon    },
  { href: "/explore", label: "Explore", Icon: ExploreIcon },
];
const rightItems = [
  { href: "/plan",    label: "Plan",    Icon: ChatIcon    },
  { href: "/account", label: "Account", Icon: ProfileIcon },
];

const FAB_HREF = "/journal/new";

const NAV_H = 72;
const NAV_BG = "rgba(10,22,40,0.96)";
const NAV_BORDER = "1px solid rgba(255,255,255,0.08)";
const NAV_RADIUS = 22;
const FAB_SIZE = 56;
const CRADLE_GAP = 14;
const CRADLE_HALF_W = FAB_SIZE / 2 + CRADLE_GAP;

export function NavBar() {
  const pathname = usePathname();
  const router   = useRouter();

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  const navItemStyle = (active: boolean): React.CSSProperties => ({
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    textDecoration: "none",
  });

  const labelStyle = (active: boolean): React.CSSProperties => ({
    fontFamily: "var(--font-display), -apple-system, BlinkMacSystemFont, sans-serif",
    fontWeight: 700,
    fontSize: 12,
    letterSpacing: "0.10em",
    textTransform: "uppercase",
    color: active ? ACCENT : "rgba(160,180,210,0.50)",
    lineHeight: 1,
  });

  return (
    <>
      <nav
        className="app-fixed-phone z-40"
        style={{ bottom: 0 }}
        aria-label="Main navigation"
      >
        {/*
         * Two-panel layout with a concave cradle gap — matches the reference exactly.
         * Left pill + Right pill are separate rounded rects; the FAB sits in the gap.
         * An SVG arc behind the gap draws the concave inner edge.
         */}
        <div style={{
          display: "flex",
          alignItems: "stretch",
          height: NAV_H,
          marginLeft: 12,
          marginRight: 12,
          position: "relative",
        }}>

          {/* ── Left pill ──────────────────────────────────────── */}
          <div style={{
            flex: 1,
            background: NAV_BG,
            borderTop: NAV_BORDER,
            borderLeft: NAV_BORDER,
            borderTopLeftRadius: NAV_RADIUS,
            display: "flex",
            alignItems: "center",
            boxShadow: "0 -4px 24px rgba(0,0,0,0.35)",
          }}>
            {leftItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link key={item.href} href={item.href} aria-label={item.label} style={navItemStyle(active)}>
                  <item.Icon active={active} />
                  <span style={labelStyle(active)}>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* ── Centre cradle gap ──────────────────────────────── */}
          <div style={{
            width: CRADLE_HALF_W * 2,
            flexShrink: 0,
            position: "relative",
            overflow: "visible",
          }}>
            {/* Concave arc SVG — fills the gap behind the FAB */}
            <svg
              aria-hidden
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: "100%",
                height: "100%",
                overflow: "visible",
              }}
              viewBox={`0 0 ${CRADLE_HALF_W * 2} ${NAV_H}`}
              preserveAspectRatio="none"
            >
              <path
                d={`M 0 0 Q ${CRADLE_HALF_W} ${FAB_SIZE * 0.75} ${CRADLE_HALF_W * 2} 0 L ${CRADLE_HALF_W * 2} ${NAV_H} L 0 ${NAV_H} Z`}
                fill={NAV_BG}
              />
              <path
                d={`M 0 0 Q ${CRADLE_HALF_W} ${FAB_SIZE * 0.75} ${CRADLE_HALF_W * 2} 0`}
                fill="none"
                stroke="rgba(255,255,255,0.10)"
                strokeWidth="1"
              />
            </svg>
          </div>

          {/* ── Right pill ─────────────────────────────────────── */}
          <div style={{
            flex: 1,
            background: NAV_BG,
            borderTop: NAV_BORDER,
            borderRight: NAV_BORDER,
            borderTopRightRadius: NAV_RADIUS,
            display: "flex",
            alignItems: "center",
            boxShadow: "0 -4px 24px rgba(0,0,0,0.35)",
          }}>
            {rightItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link key={item.href} href={item.href} aria-label={item.label} style={navItemStyle(active)}>
                  <item.Icon active={active} />
                  <span style={labelStyle(active)}>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* iOS safe-area fill */}
        <div style={{ background: "rgba(10,22,40,0.96)", height: "env(safe-area-inset-bottom, 0px)" }} />

        {/* ── Centre FAB — lime, absolutely positioned in the cradle ── */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            top: -FAB_SIZE / 2 + 6,
            zIndex: 50,
          }}
        >
          {/* FAB — direct link to voice journal */}
          <motion.button
            onClick={() => router.push(FAB_HREF)}
            whileTap={{ scale: 0.92 }}
            style={{
              width: FAB_SIZE,
              height: FAB_SIZE,
              borderRadius: "50%",
              backgroundColor: ACCENT,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 4px 16px rgba(94,205,161,0.40), 0 8px 32px rgba(94,205,161,0.20)",
            }}
            aria-label="Voice journal"
          >
            <MicrophoneIcon style={{ width: 22, height: 22, color: "#0A1628" }} aria-hidden />
          </motion.button>
        </div>
      </nav>
    </>
  );
}
