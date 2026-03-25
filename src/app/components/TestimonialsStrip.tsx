"use client";

const DARK = "rgba(235,242,255,0.92)";
const MUTED = "rgba(120,155,195,0.60)";
const CARD_BG = "rgba(255,255,255,0.07)";
const CARD_BORDER = "rgba(255,255,255,0.14)";
const LIME = "#C8FF00";
const TRUST_GREEN = "#2DD4C0";

const GreenStar = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill={LIME}>
    <path d="M6.5 1l1.545 3.13 3.455.502-2.5 2.436.59 3.44L6.5 8.885l-3.09 1.623.59-3.44L1.5 4.632l3.455-.502L6.5 1z" />
  </svg>
);

const TESTIMONIALS = [
  {
    avatar: "https://i.pravatar.cc/80?img=12",
    name: "Marco T.",
    meta: "34 · Sales Manager",
    day: 47,
    quote:
      "I've started 'getting serious' maybe a dozen times. This is the first time I didn't quit at week 2. I'm on day 47, hit the gym 5 times last week. That's never happened in my life.",
  },
  {
    avatar: "https://i.pravatar.cc/80?img=47",
    name: "Priya M.",
    meta: "28 · Freelance Designer",
    day: 31,
    quote:
      "Raised my rates, locked in 2 retainer clients, and made more in March than any month before. My 90-day plan is basically a business plan I actually follow.",
  },
  {
    avatar: "https://i.pravatar.cc/80?img=33",
    name: "James K.",
    meta: "41 · Software Engineer",
    day: 62,
    quote:
      "Was convinced I just wasn't a discipline person. Turns out I needed a system, not more willpower. Sleep is better, less reactive at work, haven't rage-quit a project in 6 weeks.",
  },
  {
    avatar: "https://i.pravatar.cc/80?img=44",
    name: "Sofia A.",
    meta: "26 · Grad Student",
    day: 19,
    quote:
      "Started thinking this was another self-help thing. I'm 3 weeks in and I've applied to 4 jobs I would've talked myself out of before. Two got back to me already.",
  },
];

export function TestimonialsStrip() {
  return (
    <div className="flex flex-col gap-3 pt-2">

      {/* ── Trust aggregate header ── */}
      <div className="flex flex-col items-center gap-1 pb-1">
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }, (_, i) => <GreenStar key={i} />)}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[13px] font-bold" style={{ color: DARK }}>Excellent</span>
          <span className="text-[12px]" style={{ color: MUTED }}>4.9 out of 5</span>
          <span style={{ color: MUTED }}>·</span>
          <span className="text-[12px]" style={{ color: MUTED }}>1,204 verified reviews</span>
        </div>
      </div>

      {/* ── Individual cards ── */}
      {TESTIMONIALS.map((t) => (
        <div
          key={t.name}
          className="relative rounded-2xl p-4"
          style={{
            backgroundColor: CARD_BG,
            border: `1.5px solid ${CARD_BORDER}`,
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
          }}
        >
          {/* Day badge — top right */}
          <div
            className="absolute right-4 top-4 rounded-full px-2.5 py-0.5 text-[11px] font-bold"
            style={{ backgroundColor: LIME, color: "#060912" }}
          >
            Day {t.day}
          </div>

          {/* Stars */}
          <div className="mb-2 flex gap-0.5">
            {Array.from({ length: 5 }, (_, i) => <GreenStar key={i} />)}
          </div>

          {/* Quote */}
          <p
            className="mb-3 text-[13px] leading-relaxed"
            style={{ color: DARK, fontStyle: "italic" }}
          >
            &ldquo;{t.quote}&rdquo;
          </p>

          {/* Author row */}
          <div className="flex items-center gap-2.5">
            <img
              src={t.avatar}
              alt={t.name}
              className="h-8 w-8 shrink-0 rounded-full object-cover"
            />
            <div className="flex flex-col leading-none gap-0.5">
              <div className="flex items-center gap-1.5">
                <span className="text-[13px] font-semibold" style={{ color: DARK }}>
                  {t.name}
                </span>
                <span
                  className="flex items-center gap-0.5 text-[10px] font-semibold"
                  style={{ color: TRUST_GREEN }}
                >
                  <svg width="9" height="9" viewBox="0 0 9 9" fill={TRUST_GREEN}>
                    <path d="M4.5 0L5.5 3H9L6.3 4.9L7.3 8L4.5 6L1.7 8L2.7 4.9L0 3H3.5Z" />
                  </svg>
                  Verified
                </span>
              </div>
              <span className="text-[11px]" style={{ color: MUTED }}>
                {t.meta}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
