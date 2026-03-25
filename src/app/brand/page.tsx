"use client";

import { motion } from "framer-motion";

/* ─── Design tokens (mirrored from brand book) ─── */
const T = {
  navyBase: "#060912",
  navy900: "#0A1628",
  navy800: "#0F2040",
  navy700: "#1A3158",
  navy400: "#7A9BC2",
  lime: "#C8FF00",
  positive: "#4CAF7D",
  negative: "#FF5555",
  amber: "#F5A623",
  teal: "#2DD4C0",
  textHi: "rgba(235,242,255,0.92)",
  textMid: "rgba(120,155,195,0.75)",
  textLo: "rgba(120,155,195,0.40)",
  glassFill: "rgba(255,255,255,0.07)",
  glassBorder: "rgba(255,255,255,0.14)",
  glassBlur: "blur(16px)",
};

function ChapterLabel({ n, label }: { n: string; label: string }) {
  return (
    <div style={{ marginBottom: 56 }}>
      <div
        style={{
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: 9,
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          color: T.teal,
          marginBottom: 6,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <span style={{ display: "block", width: 28, height: 1, background: T.teal, opacity: 0.5 }} />
        {n}
      </div>
      <h2
        style={{
          fontFamily: "var(--font-barlow-condensed), sans-serif",
          fontWeight: 700,
          fontSize: 52,
          lineHeight: 1,
          letterSpacing: "-0.02em",
          color: T.textHi,
          margin: 0,
        }}
      >
        {label}
      </h2>
    </div>
  );
}

function ColorSwatch({ hex, name, role }: { hex: string; name: string; role: string }) {
  const isDark = name.includes("Navy") || name === "Base";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div
        style={{
          height: 80,
          borderRadius: 12,
          background: hex,
          border: isDark ? "1px solid rgba(255,255,255,0.14)" : "none",
        }}
      />
      <div>
        <p
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: 9,
            letterSpacing: "0.12em",
            color: T.textLo,
            margin: "0 0 2px",
          }}
        >
          {hex}
        </p>
        <p
          style={{
            fontFamily: "var(--font-barlow-condensed), sans-serif",
            fontWeight: 700,
            fontSize: 13,
            color: T.textHi,
            margin: "0 0 1px",
          }}
        >
          {name}
        </p>
        <p
          style={{
            fontFamily: "var(--font-barlow), sans-serif",
            fontWeight: 300,
            fontSize: 11,
            color: T.textMid,
            margin: 0,
          }}
        >
          {role}
        </p>
      </div>
    </div>
  );
}

const PRIMITIVES = [
  { hex: "#060912", name: "Navy 950", role: "App background" },
  { hex: "#0A1628", name: "Navy 900", role: "Raised surface" },
  { hex: "#0F2040", name: "Navy 800", role: "Elevated card" },
  { hex: "#1A3158", name: "Navy 700", role: "Chip/tab" },
  { hex: "#7A9BC2", name: "Navy 400", role: "Muted blue text" },
  { hex: "#C8FF00", name: "Yellow (CTA)", role: "Primary action" },
  { hex: "#4CAF7D", name: "Positive", role: "Success/done" },
  { hex: "#FF5555", name: "Negative", role: "Error/overdue" },
  { hex: "#F5A623", name: "Amber", role: "Warning/projection" },
  { hex: "#2DD4C0", name: "Teal", role: "Accent cool" },
];

const TYPE_SPECIMENS = [
  {
    family: "Barlow Condensed",
    role: "Display / Headlines",
    fontVar: "var(--font-barlow-condensed)",
    sample: "Build your gap.",
    size: 48,
    weight: 700,
    italic: true,
  },
  {
    family: "Libre Baskerville",
    role: "Logo (Future)",
    fontVar: "var(--font-libre-baskerville)",
    sample: "Future",
    size: 42,
    weight: 400,
    italic: true,
  },
  {
    family: "Cormorant",
    role: "Logo (YOU)",
    fontVar: "var(--font-cormorant)",
    sample: "YOU",
    size: 48,
    weight: 600,
    italic: true,
  },
  {
    family: "Barlow",
    role: "Body / Descriptions",
    fontVar: "var(--font-barlow)",
    sample: "Close the gap between who you are and who you are meant to be.",
    size: 16,
    weight: 300,
    italic: false,
  },
  {
    family: "JetBrains Mono",
    role: "Labels / Stats / Mono",
    fontVar: "var(--font-jetbrains-mono)",
    sample: "GAP SCORE · 0.74 · BUILDING PLAN",
    size: 12,
    weight: 400,
    italic: false,
  },
];

const COMPONENT_SPECIMENS = [
  { label: "CTA Primary", type: "cta" },
  { label: "Glass Card", type: "glass" },
  { label: "List Row", type: "row" },
  { label: "Insight Card", type: "insight" },
];

export default function BrandBookPage() {
  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "#060912",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background mesh */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          background: `
            radial-gradient(ellipse 70% 60% at 15% 15%, rgba(40,80,180,0.25) 0%, transparent 60%),
            radial-gradient(ellipse 50% 60% at 90% 80%, rgba(15,40,100,0.45) 0%, transparent 60%),
            linear-gradient(150deg, #0f2040 0%, #090f1a 60%, #060912 100%)
          `,
          pointerEvents: "none",
        }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 800,
          margin: "0 auto",
          padding: "max(5rem, env(safe-area-inset-top, 5rem)) 24px 80px",
        }}
      >

        {/* ── Cover ── */}
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            borderRadius: 24,
            border: "1px solid rgba(255,255,255,0.08)",
            marginBottom: 80,
            minHeight: 360,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
          }}
        >
          {/* Grid overlay */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />

          <div style={{ position: "relative", zIndex: 2, padding: "48px 56px 32px" }}>
            <p
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: 10,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: T.teal,
                opacity: 0.7,
                margin: "0 0 24px",
              }}
            >
              Future YOU · Brand System · v1
            </p>

            {/* Wordmark */}
            <div style={{ display: "flex", alignItems: "baseline", gap: 0, marginBottom: 24 }}>
              <span
                style={{
                  fontFamily: "var(--font-libre-baskerville), serif",
                  fontWeight: 400,
                  fontStyle: "italic",
                  fontSize: 84,
                  lineHeight: 0.9,
                  letterSpacing: "-0.02em",
                  color: T.textHi,
                }}
              >
                Future
              </span>
              <span
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  fontWeight: 600,
                  fontStyle: "italic",
                  fontSize: 84,
                  lineHeight: 0.9,
                  letterSpacing: "0.02em",
                  color: T.lime,
                }}
              >
                YOU
              </span>
            </div>

            <p
              style={{
                fontFamily: "var(--font-barlow), sans-serif",
                fontWeight: 300,
                fontSize: 16,
                color: T.textMid,
                maxWidth: 400,
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              Close the gap between who you are and who you&apos;re meant to be.
            </p>
          </div>

          {/* Bottom bar */}
          <div
            style={{
              position: "relative",
              zIndex: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px 56px",
              borderTop: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: 9,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: T.textLo,
              }}
            >
              Internal Reference
            </span>
            <span
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: 9,
                color: T.textLo,
                letterSpacing: "0.12em",
              }}
            >
              Navy / Yellow / Glass
            </span>
          </div>
        </div>

        {/* ── 01 Palette ── */}
        <section style={{ marginBottom: 100, paddingBottom: 100, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <ChapterLabel n="01" label="Palette" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 16, marginBottom: 24 }}>
            {PRIMITIVES.map((c) => (
              <ColorSwatch key={c.hex} hex={c.hex} name={c.name} role={c.role} />
            ))}
          </div>
          <div
            style={{
              background: T.glassFill,
              backdropFilter: T.glassBlur,
              border: `1px solid ${T.glassBorder}`,
              borderRadius: 16,
              padding: "20px 24px",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-barlow), sans-serif",
                fontWeight: 300,
                fontSize: 13,
                color: T.textMid,
                margin: 0,
                lineHeight: 1.7,
              }}
            >
              <strong style={{ color: T.textHi, fontWeight: 500 }}>Glass system:</strong> All cards use{" "}
              <code style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 11, color: T.lime }}>rgba(255,255,255,0.07)</code>{" "}
              fill + 16px blur + <code style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 11, color: T.teal }}>rgba(255,255,255,0.14)</code>{" "}
              border. Never use solid backgrounds on interactive cards.
            </p>
          </div>
        </section>

        {/* ── 02 Typography ── */}
        <section style={{ marginBottom: 100, paddingBottom: 100, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <ChapterLabel n="02" label="Typography" />
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            {TYPE_SPECIMENS.map((spec) => (
              <div
                key={spec.family}
                style={{
                  background: T.glassFill,
                  backdropFilter: T.glassBlur,
                  border: `1px solid ${T.glassBorder}`,
                  borderRadius: 16,
                  padding: "24px 28px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 16,
                    paddingBottom: 16,
                    borderBottom: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontFamily: "var(--font-jetbrains-mono), monospace",
                        fontSize: 9,
                        letterSpacing: "0.16em",
                        textTransform: "uppercase",
                        color: T.teal,
                        margin: "0 0 3px",
                      }}
                    >
                      {spec.role}
                    </p>
                    <p
                      style={{
                        fontFamily: "var(--font-barlow-condensed), sans-serif",
                        fontWeight: 700,
                        fontSize: 13,
                        color: T.textHi,
                        margin: 0,
                      }}
                    >
                      {spec.family}
                    </p>
                  </div>
                  <span
                    style={{
                      fontFamily: "var(--font-jetbrains-mono), monospace",
                      fontSize: 9,
                      color: T.textLo,
                    }}
                  >
                    {spec.size}px / {spec.weight}
                  </span>
                </div>
                <p
                  style={{
                    fontFamily: spec.fontVar,
                    fontWeight: spec.weight,
                    fontStyle: spec.italic ? "italic" : "normal",
                    fontSize: spec.size,
                    lineHeight: 1.1,
                    color: spec.family === "Cormorant" ? T.lime : T.textHi,
                    margin: 0,
                    letterSpacing: spec.size > 24 ? "-0.02em" : "0",
                  }}
                >
                  {spec.sample}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 03 Components ── */}
        <section style={{ marginBottom: 100, paddingBottom: 100, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <ChapterLabel n="03" label="Components" />
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

            {/* CTA Button */}
            <div>
              <p style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase", color: T.textLo, margin: "0 0 12px" }}>
                Primary CTA
              </p>
              <button
                style={{
                  background: T.lime,
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
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                Build My Plan
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M3.75 9h10.5M9.75 4.5L14.25 9l-4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            {/* Glass card specimen */}
            <div>
              <p style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase", color: T.textLo, margin: "0 0 12px" }}>
                Glass Card
              </p>
              <div
                style={{
                  position: "relative",
                  background: T.glassFill,
                  backdropFilter: T.glassBlur,
                  WebkitBackdropFilter: T.glassBlur,
                  border: `1px solid ${T.glassBorder}`,
                  borderRadius: 20,
                  padding: "20px 20px 16px",
                  overflow: "hidden",
                }}
              >
                <div
                  aria-hidden
                  style={{
                    position: "absolute",
                    top: 0, left: 0, right: 0, height: 1,
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)",
                  }}
                />
                <p style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 8, letterSpacing: "0.16em", textTransform: "uppercase", color: T.textLo, margin: "0 0 6px" }}>
                  Gap Score
                </p>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                  <span style={{ fontFamily: "var(--font-barlow-condensed), sans-serif", fontWeight: 900, fontSize: 48, color: T.lime, letterSpacing: "-0.02em", lineHeight: 1 }}>74%</span>
                  <span style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 300, fontSize: 13, color: T.textMid }}>closed this month</span>
                </div>
              </div>
            </div>

            {/* List row specimen */}
            <div>
              <p style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase", color: T.textLo, margin: "0 0 12px" }}>
                List Row (Selected)
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {["Tech & Product", "Business & Sales", "Creative & Marketing"].map((label, i) => (
                  <div
                    key={label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      padding: "15px 18px",
                      borderRadius: 14,
                      border: `1.5px solid ${i === 0 ? T.lime : T.glassBorder}`,
                      background: i === 0 ? "rgba(200,255,0,0.07)" : T.glassFill,
                      backdropFilter: T.glassBlur,
                      WebkitBackdropFilter: T.glassBlur,
                    }}
                  >
                    <span style={{ fontFamily: "var(--font-barlow-condensed), sans-serif", fontWeight: 600, fontSize: 17, color: i === 0 ? T.lime : T.textHi, flex: 1 }}>
                      {label}
                    </span>
                    <div
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        border: `1.5px solid ${i === 0 ? T.lime : "rgba(255,255,255,0.18)"}`,
                        background: i === 0 ? T.lime : "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {i === 0 && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4l2.5 2.5L9 1" stroke="#060912" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Insight card specimen */}
            <div>
              <p style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase", color: T.textLo, margin: "0 0 12px" }}>
                Insight Card
              </p>
              <div
                style={{
                  position: "relative",
                  background: "rgba(200,255,0,0.05)",
                  backdropFilter: T.glassBlur,
                  border: "1px solid rgba(200,255,0,0.18)",
                  borderRadius: 20,
                  padding: "24px 22px",
                  overflow: "hidden",
                }}
              >
                <div
                  aria-hidden
                  style={{
                    position: "absolute",
                    top: 0, left: 0, right: 0, height: 1,
                    background: "linear-gradient(90deg, transparent, rgba(200,255,0,0.30), transparent)",
                  }}
                />
                <div style={{ fontFamily: "var(--font-barlow-condensed), sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(200,255,0,0.60)", marginBottom: 10, display: "flex", alignItems: "center", gap: 7 }}>
                  <span style={{ display: "block", width: 16, height: 1, background: "rgba(200,255,0,0.40)" }} />
                  What the data shows
                </div>
                <p style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 300, fontSize: 15, color: "rgba(235,242,255,0.82)", lineHeight: 1.65, margin: "0 0 16px" }}>
                  People who feel exactly what you described are <strong style={{ fontWeight: 500, color: T.textHi }}>not behind.</strong> They&apos;re at the precise point where the right system makes all the difference.
                </p>
                <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "baseline", gap: 6 }}>
                  <span style={{ fontFamily: "var(--font-barlow-condensed), sans-serif", fontWeight: 700, fontSize: 34, color: T.lime, letterSpacing: "-0.02em" }}>87%</span>
                  <span style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 300, fontSize: 13, color: T.textMid }}>hit their first milestone in under 90 days</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 04 Voice / Motion ── */}
        <section>
          <ChapterLabel n="04" label="Voice & Motion" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[
              { key: "Tone", value: "Direct. Confident. Precise. No fluff." },
              { key: "Verbs", value: "Close. Build. Execute. Track. Ship." },
              { key: "Transitions", value: "0.35s ease-out · translateY(-6px) → 0" },
              { key: "Progress", value: "0.6s cubic-bezier(0.4,0,0.2,1)" },
              { key: "Confetti cols", value: "#C8FF00 · #4CAF7D · #7A9BC2 · white" },
              { key: "Easing", value: "spring(stiffness:300, damping:24) for pops" },
            ].map(({ key, value }) => (
              <div
                key={key}
                style={{
                  background: T.glassFill,
                  backdropFilter: T.glassBlur,
                  border: `1px solid ${T.glassBorder}`,
                  borderRadius: 14,
                  padding: "16px 20px",
                }}
              >
                <p style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase", color: T.teal, margin: "0 0 4px" }}>
                  {key}
                </p>
                <p style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 300, fontSize: 13, color: T.textHi, margin: 0 }}>
                  {value}
                </p>
              </div>
            ))}
          </div>
        </section>

      </motion.div>
    </div>
  );
}
