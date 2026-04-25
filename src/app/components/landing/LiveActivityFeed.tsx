"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ACCENT, NAVY_PANEL, TEXT_HI, TEXT_MID, TEXT_LO, accentRgba } from "@/app/theme";

type Person = {
  photo: string;
  name: string;
  city: string;
  archetype: string;
  goalArea: string;
};

const PEOPLE_POOL: Person[] = [
  { photo: "/mock/people/maya-r.png",     name: "Maya R.",   city: "Berlin",     archetype: "Strategist",       goalArea: "Health" },
  { photo: "/mock/people/mateo-a.jpg",    name: "Mateo A.",  city: "Madrid",     archetype: "Guardian",         goalArea: "Finance" },
  { photo: "/mock/people/james-k.png",    name: "James K.",  city: "London",     archetype: "Endurance Engine", goalArea: "Career" },
  { photo: "/mock/people/sarah-jones.jpg",name: "Sarah J.",  city: "Dublin",     archetype: "Steady Builder",   goalArea: "Mindset" },
  { photo: "/mock/people/priya-m.png",    name: "Priya M.",  city: "Bristol",    archetype: "Explorer",         goalArea: "Health" },
  { photo: "/mock/people/david-kim.jpg",  name: "David K.",  city: "Seoul",      archetype: "Creative Spark",   goalArea: "Career" },
  { photo: "/mock/people/nina-patel.jpg", name: "Nina P.",   city: "Toronto",    archetype: "Guardian",         goalArea: "Finance" },
  { photo: "/mock/people/alex-chen.jpg",  name: "Alex C.",   city: "Singapore",  archetype: "Strategist",       goalArea: "Career" },
  { photo: "/mock/people/amara-okafor.jpg", name: "Amara O.", city: "Lagos",     archetype: "Endurance Engine", goalArea: "Health" },
  { photo: "/mock/people/carlos-garcia.jpg", name: "Carlos G.", city: "México",  archetype: "Steady Builder",   goalArea: "Mindset" },
  { photo: "/mock/people/emma-wilson.jpg",name: "Emma W.",   city: "Auckland",   archetype: "Creative Spark",   goalArea: "Career" },
  { photo: "/mock/people/kenji-sato.jpg", name: "Kenji S.",  city: "Tokyo",      archetype: "Explorer",         goalArea: "Health" },
  { photo: "/mock/people/marco-t.png",    name: "Marco T.",  city: "Milan",      archetype: "Strategist",       goalArea: "Finance" },
  { photo: "/mock/people/sofia-a.png",    name: "Sofia A.",  city: "Lisbon",     archetype: "Guardian",         goalArea: "Mindset" },
  { photo: "/mock/people/priya-menon.jpg",name: "Priya M.",  city: "Bangalore",  archetype: "Steady Builder",   goalArea: "Career" },
];

const VERBS = [
  "started a plan",
  "unlocked their archetype",
  "hit a 7-day streak",
  "completed Day 12",
  "rebuilt their week",
  "synced their calendar",
  "finished Phase 1",
  "completed today's block",
];

type Activity = {
  id: number;
  person: Person;
  verb: string;
  bornAt: number;
};

let nextId = 0;

function makeActivity(secondsAgo: number): Activity {
  const person = PEOPLE_POOL[Math.floor(Math.random() * PEOPLE_POOL.length)];
  const verb = VERBS[Math.floor(Math.random() * VERBS.length)];
  return {
    id: nextId++,
    person,
    verb,
    bornAt: Date.now() - secondsAgo * 1000,
  };
}

function timeAgo(now: number, bornAt: number): string {
  const diff = Math.max(1, Math.floor((now - bornAt) / 1000));
  if (diff < 60) return `${diff}s ago`;
  const min = Math.floor(diff / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  return `${hr}h ago`;
}

const TICK_MS = 6_000;
const VISIBLE = 4;

export default function LiveActivityFeed() {
  const [items, setItems] = useState<Activity[]>([]);
  const [now, setNow] = useState<number>(0);
  const [liveCount, setLiveCount] = useState(127);

  // Seed with 4 staggered entries, mounted-only to avoid hydration mismatch
  useEffect(() => {
    setItems([
      makeActivity(8),
      makeActivity(31),
      makeActivity(72),
      makeActivity(143),
    ]);
    setNow(Date.now());
  }, []);

  // Push a new activity every TICK_MS, drop the oldest
  useEffect(() => {
    const id = setInterval(() => {
      setItems((prev) => [makeActivity(2), ...prev].slice(0, VISIBLE));
    }, TICK_MS);
    return () => clearInterval(id);
  }, []);

  // Re-render every second so timestamps update
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // Wobble the "in the quiz right now" number naturally
  useEffect(() => {
    const id = setInterval(() => {
      setLiveCount((c) => {
        const drift = Math.floor(Math.random() * 7) - 2; // -2..+4 bias up
        const next = c + drift;
        return Math.max(94, Math.min(168, next));
      });
    }, 4000);
    return () => clearInterval(id);
  }, []);

  // Stable height for the feed container — prevents layout shift as items animate
  const feedHeight = useMemo(() => VISIBLE * 56 + (VISIBLE - 1) * 8, []);

  return (
    <div
      role="img"
      aria-label="Live feed of people building plans on Behavio"
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 380,
        background: NAVY_PANEL,
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 22,
        overflow: "hidden",
        boxShadow: `0 30px 60px -30px ${accentRgba(0.20)}, 0 1px 0 rgba(255,255,255,0.04) inset`,
        fontFamily: "var(--font-apercu), sans-serif",
      }}
    >
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "rgba(255,255,255,0.02)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            aria-hidden
            style={{
              position: "relative",
              display: "inline-flex",
              width: 8,
              height: 8,
            }}
          >
            <span
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                background: ACCENT,
                animation: "pulseDot 1.6s ease-out infinite",
                opacity: 0.55,
              }}
            />
            <span
              style={{
                position: "relative",
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: ACCENT,
              }}
            />
          </span>
          <span
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 10,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: TEXT_HI,
              fontWeight: 600,
            }}
          >
            Live
          </span>
        </div>
        <span
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: 10,
            letterSpacing: "0.10em",
            textTransform: "uppercase",
            color: TEXT_LO,
          }}
        >
          last 3 min
        </span>
      </div>

      <style>{`
        @keyframes pulseDot {
          0%   { transform: scale(1);   opacity: 0.55; }
          70%  { transform: scale(2.6); opacity: 0;    }
          100% { transform: scale(2.6); opacity: 0;    }
        }
      `}</style>

      <div
        style={{
          padding: "14px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
          height: feedHeight + 28,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <AnimatePresence initial={false}>
          {items.map((it, idx) => (
            <motion.div
              key={it.id}
              layout
              initial={{ opacity: 0, y: -12, filter: "blur(4px)" }}
              animate={{ opacity: idx === 0 ? 1 : 1 - idx * 0.16, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: 8, filter: "blur(4px)" }}
              transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "8px 10px",
                borderRadius: 12,
                background: idx === 0 ? accentRgba(0.06) : "rgba(255,255,255,0.025)",
                border: `1px solid ${idx === 0 ? accentRgba(0.22) : "rgba(255,255,255,0.05)"}`,
                position: "relative",
              }}
            >
              {idx === 0 && (
                <span
                  aria-hidden
                  style={{
                    position: "absolute",
                    left: -1,
                    top: 8,
                    bottom: 8,
                    width: 2,
                    borderRadius: 2,
                    background: ACCENT,
                  }}
                />
              )}
              <Image
                src={it.person.photo}
                alt={it.person.name}
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
              <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
                <div
                  style={{
                    fontSize: 13,
                    color: TEXT_HI,
                    fontWeight: 500,
                    letterSpacing: "-0.005em",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  <span style={{ fontWeight: 600 }}>{it.person.name}</span>
                  <span style={{ color: TEXT_MID }}> {it.verb}</span>
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                    fontSize: 9.5,
                    letterSpacing: "0.10em",
                    color: TEXT_LO,
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {it.person.city} · {it.person.goalArea} · {it.person.archetype}
                </div>
              </div>
              <span
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: 10,
                  letterSpacing: "0.06em",
                  color: idx === 0 ? ACCENT : TEXT_LO,
                  flexShrink: 0,
                }}
              >
                {now ? timeAgo(now, it.bornAt) : "—"}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div
        style={{
          padding: "14px 20px",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          background: "rgba(255,255,255,0.02)",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
          <span
            style={{
              fontFamily: "var(--font-barlow-condensed), sans-serif",
              fontWeight: 800,
              fontStyle: "italic",
              fontSize: 22,
              color: TEXT_HI,
              letterSpacing: "-0.01em",
              lineHeight: 1,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {liveCount}
          </span>
          <span
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 9.5,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: TEXT_LO,
            }}
          >
            in the quiz right now
          </span>
        </div>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 10px",
            borderRadius: 999,
            background: accentRgba(0.10),
            border: `1px solid ${accentRgba(0.22)}`,
            color: ACCENT,
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: 10,
            letterSpacing: "0.10em",
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          ↳ Join them
        </span>
      </div>
    </div>
  );
}
