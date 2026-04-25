"use client";

import Link from "next/link";
import { BehavioLogo } from "@/app/components/BehavioLogo";
import { ACCENT, ACCENT_HOVER, ON_ACCENT, TEXT_MID, TEXT_LO, accentRgba } from "@/app/theme";
import { trackEvent } from "@/app/quiz/utils/analytics";

const ANCHORS = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Archetypes",   href: "#archetypes" },
  { label: "FAQ",          href: "#faq" },
];

export default function LandingNav() {
  return (
    <div
      style={{
        position: "sticky",
        top: 14,
        zIndex: 40,
        paddingInline: 16,
        pointerEvents: "none",
      }}
    >
      <header
        aria-label="Behavio"
        style={{
          margin: "0 auto",
          maxWidth: 1040,
          height: 56,
          paddingInline: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.025) 100%)",
          backdropFilter: "blur(22px) saturate(140%)",
          WebkitBackdropFilter: "blur(22px) saturate(140%)",
          border: "1px solid rgba(255,255,255,0.10)",
          borderRadius: 999,
          boxShadow:
            "0 1px 0 rgba(255,255,255,0.10) inset, 0 12px 32px -14px rgba(0,0,0,0.55)",
          pointerEvents: "auto",
        }}
      >
        <style>{`
          .landing-nav-anchors { display: none; }
          @media (min-width: 880px) {
            .landing-nav-anchors { display: inline-flex; }
          }
          .landing-nav-anchor {
            position: relative;
            padding: 6px 12px;
            border-radius: 999px;
            font-family: var(--font-apercu), sans-serif;
            font-size: 13px;
            font-weight: 500;
            color: ${TEXT_MID};
            text-decoration: none;
            letter-spacing: -0.005em;
            transition: color 160ms, background 160ms;
          }
          .landing-nav-anchor:hover {
            color: rgba(255,255,255,0.95);
            background: rgba(255,255,255,0.06);
          }
          .landing-nav-signin {
            font-family: var(--font-apercu), sans-serif;
            font-size: 13px;
            font-weight: 500;
            color: ${TEXT_LO};
            text-decoration: none;
            letter-spacing: -0.005em;
            transition: color 160ms;
            padding: 6px 8px;
          }
          .landing-nav-signin:hover { color: rgba(255,255,255,0.95); }
          @media (max-width: 479px) { .landing-nav-signin { display: none; } }
        `}</style>

        <Link
          href="/"
          aria-label="Behavio home"
          style={{
            display: "inline-flex",
            alignItems: "center",
            paddingInline: 12,
            textDecoration: "none",
          }}
        >
          <BehavioLogo variant="lockup" size={20} color="rgba(255,255,255,0.95)" />
        </Link>

        <nav
          className="landing-nav-anchors"
          aria-label="Sections"
          style={{ alignItems: "center", gap: 4 }}
        >
          {ANCHORS.map((a) => (
            <a key={a.href} href={a.href} className="landing-nav-anchor">
              {a.label}
            </a>
          ))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 6, paddingRight: 4 }}>
          <Link href="/signup" className="landing-nav-signin">
            Sign in
          </Link>
          <Link
            href="/quiz"
            onClick={() => trackEvent("funnel_start", { source: "landing_nav" })}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 14px",
              borderRadius: 999,
              background: `linear-gradient(180deg, ${ACCENT} 0%, ${ACCENT_HOVER} 100%)`,
              color: ON_ACCENT,
              fontFamily: "var(--font-apercu), sans-serif",
              fontWeight: 700,
              fontSize: 13,
              letterSpacing: "-0.005em",
              textDecoration: "none",
              boxShadow: `0 1px 0 rgba(255,255,255,0.20) inset, 0 6px 16px -8px ${accentRgba(0.55)}`,
            }}
          >
            Take the quiz
            <span aria-hidden style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 11 }}>→</span>
          </Link>
        </div>
      </header>
    </div>
  );
}
