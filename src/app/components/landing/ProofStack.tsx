"use client";

import Image from "next/image";
import Reveal from "./Reveal";
import { ACCENT, TEXT_HI, TEXT_MID, TEXT_LO, accentRgba } from "@/app/theme";

type HeroQuote = {
  photo: string;
  pull: string;
  body: string;
  name: string;
  city: string;
  archetype: string;
  outcome: string;
  day: number;
};

const HERO_QUOTES: HeroQuote[] = [
  {
    photo: "/mock/people/maya-r.png",
    pull: "Down 9kg in 11 weeks.",
    body: "First time it stuck. The plan adjusted itself the days I couldn't show up — so I never spiralled into 'forget it, start Monday' again.",
    name: "Maya R.",
    city: "Berlin",
    archetype: "Strategist",
    outcome: "Health · Day 84",
    day: 84,
  },
  {
    photo: "/mock/people/mateo-a.jpg",
    pull: "Saved €4,200 in eight weeks.",
    body: "It's just spreadsheets and caps — nothing exotic. Behavio's job is making me actually open the thing every night. That's the whole trick.",
    name: "Mateo A.",
    city: "Madrid",
    archetype: "Guardian",
    outcome: "Finance · Day 58",
    day: 58,
  },
  {
    photo: "/mock/people/james-k.png",
    pull: "Got the promotion I'd been chasing for two years.",
    body: "The daily action was tiny — 25 minutes, every weekday. But it stayed on the calendar even on weeks I was sure I'd skip. That's why it worked.",
    name: "James K.",
    city: "London",
    archetype: "Endurance Engine",
    outcome: "Career · Day 67",
    day: 67,
  },
];

const SHORT_QUOTES = [
  { photo: "/mock/people/sarah-jones.jpg", name: "Sarah J.", outcome: "84-day journaling streak. Never made it past week 3 before.", tag: "Mindset · Steady Builder" },
  { photo: "/mock/people/priya-m.png", name: "Priya M.", outcome: "First 10K at 38, started at 1km in week 1.", tag: "Health · Explorer" },
  { photo: "/mock/people/david-kim.jpg", name: "David K.", outcome: "Shipped six side-project pieces in a quarter.", tag: "Career · Creative Spark" },
  { photo: "/mock/people/nina-patel.jpg", name: "Nina P.", outcome: "Cut spend 22%, didn't track a single transaction manually.", tag: "Finance · Guardian" },
];

export default function ProofStack() {
  return (
    <section style={{ paddingTop: 88, paddingBottom: 88 }}>
      <div className="landing-section-inner">
        <Reveal offset={10}>
          <div style={{ marginBottom: 48, maxWidth: 760 }}>
            <p
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: 11,
                color: ACCENT,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                margin: "0 0 14px",
              }}
            >
              ↳ Real plans · Real outcomes
            </p>
            <h2
              style={{
                fontFamily: "var(--font-barlow-condensed), sans-serif",
                fontWeight: 900,
                fontSize: "clamp(32px, 4vw, 52px)",
                color: TEXT_HI,
                lineHeight: 1.0,
                letterSpacing: "-0.02em",
                margin: 0,
              }}
            >
              What changes after{" "}
              <span style={{ fontStyle: "italic", color: ACCENT }}>day 30.</span>
            </h2>
          </div>
        </Reveal>

        <style>{`
          .proof-hero-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 18px;
          }
          @media (min-width: 900px) {
            .proof-hero-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 22px; }
          }
          .proof-card {
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 26px;
            border-radius: 20px;
            background: linear-gradient(180deg, rgba(255,255,255,0.035), rgba(255,255,255,0.01));
            border: 1px solid rgba(255,255,255,0.08);
            min-height: 320px;
          }
          .proof-short-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 12px;
            margin-top: 22px;
          }
          @media (min-width: 768px) {
            .proof-short-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
          }
          @media (min-width: 1100px) {
            .proof-short-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
          }
        `}</style>

        <div className="proof-hero-grid">
          {HERO_QUOTES.map((q, i) => (
            <Reveal key={q.name} offset={14} delay={0.04 + i * 0.06}>
              <figure className="proof-card" style={{ margin: 0 }}>
                <div>
                  <span
                    aria-hidden
                    style={{
                      fontFamily: "var(--font-barlow-condensed), sans-serif",
                      fontStyle: "italic",
                      fontWeight: 900,
                      fontSize: 56,
                      color: accentRgba(0.45),
                      lineHeight: 0.7,
                      display: "block",
                      marginBottom: 4,
                    }}
                  >
                    &ldquo;
                  </span>
                  <p
                    style={{
                      fontFamily: "var(--font-barlow-condensed), sans-serif",
                      fontWeight: 900,
                      fontStyle: "italic",
                      fontSize: 26,
                      lineHeight: 1.1,
                      letterSpacing: "-0.01em",
                      color: TEXT_HI,
                      margin: "0 0 14px",
                    }}
                  >
                    {q.pull}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-apercu), sans-serif",
                      fontSize: 14.5,
                      color: TEXT_MID,
                      lineHeight: 1.55,
                      margin: 0,
                    }}
                  >
                    {q.body}
                  </p>
                </div>

                <figcaption
                  style={{
                    marginTop: 20,
                    paddingTop: 18,
                    borderTop: "1px solid rgba(255,255,255,0.06)",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <Image
                    src={q.photo}
                    alt={q.name}
                    width={44}
                    height={44}
                    loading="lazy"
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "1px solid rgba(255,255,255,0.12)",
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <span
                      style={{
                        fontFamily: "var(--font-apercu), sans-serif",
                        fontSize: 13.5,
                        fontWeight: 600,
                        color: TEXT_HI,
                        letterSpacing: "-0.005em",
                      }}
                    >
                      {q.name} · {q.city}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-jetbrains-mono), monospace",
                        fontSize: 10,
                        letterSpacing: "0.10em",
                        color: TEXT_LO,
                        textTransform: "uppercase",
                      }}
                    >
                      {q.outcome} · {q.archetype}
                    </span>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        <div className="proof-short-grid">
          {SHORT_QUOTES.map((s, i) => (
            <Reveal key={s.name} offset={10} delay={0.05 + i * 0.04}>
              <div
                style={{
                  padding: "16px 18px",
                  borderRadius: 14,
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Image
                    src={s.photo}
                    alt={s.name}
                    width={32}
                    height={32}
                    loading="lazy"
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "1px solid rgba(255,255,255,0.10)",
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "var(--font-apercu), sans-serif",
                      fontSize: 13,
                      fontWeight: 600,
                      color: TEXT_HI,
                      letterSpacing: "-0.005em",
                    }}
                  >
                    {s.name}
                  </span>
                </div>
                <p
                  style={{
                    fontFamily: "var(--font-apercu), sans-serif",
                    fontSize: 13.5,
                    color: TEXT_HI,
                    margin: 0,
                    lineHeight: 1.45,
                    fontWeight: 500,
                  }}
                >
                  &ldquo;{s.outcome}&rdquo;
                </p>
                <div
                  style={{
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                    fontSize: 10,
                    letterSpacing: "0.10em",
                    color: ACCENT,
                    textTransform: "uppercase",
                    marginTop: "auto",
                  }}
                >
                  {s.tag}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
