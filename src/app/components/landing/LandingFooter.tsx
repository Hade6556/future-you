"use client";

import Link from "next/link";
import { BehavioLogo } from "@/app/components/BehavioLogo";
import { TEXT_MID, TEXT_LO } from "@/app/theme";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Take the quiz", href: "/quiz" },
      { label: "Sign in", href: "/signup" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Contact", href: "mailto:hello@behavio.app" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
];

export default function LandingFooter() {
  return (
    <footer
      style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        paddingTop: 48,
        paddingBottom: 40,
        marginTop: 24,
      }}
    >
      <div className="landing-section-inner">
        <style>{`
          .footer-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 32px;
          }
          @media (min-width: 768px) {
            .footer-grid { grid-template-columns: 1.5fr repeat(3, 1fr); gap: 48px; }
          }
        `}</style>
        <div className="footer-grid">
          <div>
            <BehavioLogo variant="lockup" size={20} color="rgba(255,255,255,0.95)" />
            <p
              style={{
                fontFamily: "var(--font-apercu), sans-serif",
                fontSize: 13,
                color: TEXT_MID,
                lineHeight: 1.55,
                margin: "16px 0 0",
                maxWidth: 320,
              }}
            >
              90-day plans that re-pace around how you actually live. EU-hosted,
              GDPR-private, and free to start.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <div
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: 10,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: TEXT_LO,
                  marginBottom: 14,
                }}
              >
                {col.title}
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      style={{
                        fontFamily: "var(--font-apercu), sans-serif",
                        fontSize: 14,
                        color: TEXT_MID,
                        textDecoration: "none",
                      }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: 40,
            paddingTop: 24,
            borderTop: "1px solid rgba(255,255,255,0.05)",
            fontFamily: "var(--font-apercu), sans-serif",
            fontSize: 12,
            color: TEXT_LO,
          }}
        >
          © {new Date().getFullYear()} Behavio. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
