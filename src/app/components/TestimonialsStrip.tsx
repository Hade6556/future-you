"use client";

import Image from "next/image";

const DARK = "rgba(235,242,255,0.92)";
const MUTED = "rgba(120,155,195,0.68)";
const CARD_BG = "rgba(255,255,255,0.07)";
const CARD_BORDER = "rgba(255,255,255,0.14)";
const LIME = "#C8FF00";

const TESTIMONIALS = [
  {
    avatar: "/mock/people/mateo-a.jpg",
    name: "Mateo Alvarez",
    meta: "34 · Sales Manager",
    day: 47,
    quote:
      "I've started 'getting serious' maybe a dozen times. This is the first time I didn't quit at week 2. I'm on day 47, hit the gym 5 times last week. That's never happened in my life.",
  },
  {
    avatar: "/mock/people/priya-menon.jpg",
    name: "Priya Menon",
    meta: "28 · Freelance Designer",
    day: 31,
    quote:
      "Raised my rates, locked in 2 retainer clients, and made more in March than any month before. My 90-day plan is basically a business plan I actually follow.",
  },
  {
    avatar: "/mock/people/kenji-sato.jpg",
    name: "Kenji Sato",
    meta: "41 · Software Engineer",
    day: 62,
    quote:
      "Was convinced I just wasn't a discipline person. Turns out I needed a system, not more willpower. Sleep is better, less reactive at work, haven't rage-quit a project in 6 weeks.",
  },
  {
    avatar: "/mock/people/amara-okafor.jpg",
    name: "Amara Okafor",
    meta: "26 · Grad Student",
    day: 19,
    quote:
      "Started thinking this was another self-help thing. I'm 3 weeks in and I've applied to 4 jobs I would've talked myself out of before. Two got back to me already.",
  },
];

export function TestimonialsStrip() {
  return (
    <div className="flex flex-col gap-3 pt-2">

      {/* ── Individual cards ── */}
      {TESTIMONIALS.map((t) => (
        <div
          key={t.name}
          className="relative min-h-[236px] rounded-2xl px-4 pb-4 pt-12"
          style={{
            backgroundColor: CARD_BG,
            border: `1.5px solid ${CARD_BORDER}`,
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
          }}
        >
          {/* Day badge — top right */}
          <div
            className="absolute right-4 top-4 rounded-full px-2.5 py-0.5 text-[13px] font-bold"
            style={{ backgroundColor: LIME, color: "#060912" }}
          >
            Day {t.day}
          </div>

          {/* Quote */}
          <div className="mx-auto flex min-h-[150px] w-full max-w-[92%] -translate-y-2 items-center justify-center py-3">
            <p
              className="text-center text-[13px] leading-relaxed"
              style={{ color: DARK, fontStyle: "italic", lineHeight: 1.72 }}
            >
              &ldquo;{t.quote}&rdquo;
            </p>
          </div>

          {/* Author row (bottom-left) */}
          <div className="absolute bottom-4 left-4 flex items-center gap-2.5">
            <Image
              src={t.avatar}
              alt={t.name}
              width={32}
              height={32}
              className="h-8 w-8 shrink-0 rounded-full object-cover"
            />
            <div className="flex min-w-0 flex-col">
              <span className="text-[13px] font-semibold leading-tight" style={{ color: DARK }}>
                {t.name}
              </span>
              <span className="mt-1 text-[13px] leading-tight" style={{ color: MUTED }}>
                {t.meta}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
