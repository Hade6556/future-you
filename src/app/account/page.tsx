"use client";

import { useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePlanStore } from "@/app/state/planStore";

const LIME = "#C8FF00";
const NAVY = "#060912";
const TEXT_HI = "rgba(235,242,255,0.95)";
const TEXT_MID = "rgba(120,155,195,0.75)";
const TEXT_LO = "rgba(120,155,195,0.40)";
const GLASS = "rgba(255,255,255,0.07)";
const GLASS_BORDER = "rgba(255,255,255,0.14)";
const DANGER = "#FF5555";

const heading: CSSProperties = {
  fontFamily: "var(--font-barlow-condensed), sans-serif",
  fontWeight: 900,
  fontStyle: "italic",
  color: TEXT_HI,
  margin: 0,
};

const body: CSSProperties = {
  fontFamily: "var(--font-apercu), sans-serif",
  fontWeight: 400,
  color: TEXT_MID,
  margin: 0,
};

const eyebrow: CSSProperties = {
  fontFamily: "var(--font-jetbrains-mono), monospace",
  fontSize: 10,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color: TEXT_LO,
  margin: 0,
};

const card: CSSProperties = {
  background: GLASS,
  border: `1px solid ${GLASS_BORDER}`,
  borderRadius: 20,
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  padding: "22px 20px",
  display: "flex",
  flexDirection: "column",
  gap: 16,
};

const inputStyle: CSSProperties = {
  ...body,
  flex: 1,
  background: "rgba(255,255,255,0.04)",
  border: `1px solid ${GLASS_BORDER}`,
  borderRadius: 14,
  padding: "12px 16px",
  fontSize: 15,
  color: TEXT_HI,
  outline: "none",
};

const ctaButton: CSSProperties = {
  background: LIME,
  color: NAVY,
  border: "none",
  borderRadius: 14,
  padding: "14px 0",
  width: "100%",
  fontFamily: "var(--font-barlow-condensed), sans-serif",
  fontWeight: 800,
  fontSize: 15,
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  cursor: "pointer",
};

const ghostButton: CSSProperties = {
  background: "rgba(255,255,255,0.06)",
  color: TEXT_MID,
  border: `1px solid ${GLASS_BORDER}`,
  borderRadius: 14,
  padding: "14px 0",
  width: "100%",
  fontFamily: "var(--font-barlow-condensed), sans-serif",
  fontWeight: 700,
  fontSize: 15,
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  cursor: "pointer",
};

export default function AccountPage() {
  const router = useRouter();
  const userName = usePlanStore((s) => s.userName);
  const email = usePlanStore((s) => s.email);
  const isPremium = usePlanStore((s) => s.isPremium);
  const setUserName = usePlanStore((s) => s.setUserName);
  const setPremium = usePlanStore((s) => s.setPremium);
  const resetStore = usePlanStore((s) => s.resetForDemo);

  const [editName, setEditName] = useState(userName || "");
  const [nameSaved, setNameSaved] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const nameChanged = editName.trim().length > 0 && editName !== userName;

  function handleSaveName() {
    if (!nameChanged) return;
    setUserName(editName.trim());
    setNameSaved(true);
    setTimeout(() => setNameSaved(false), 2500);
  }

  function handleSignOut() {
    resetStore();
    router.replace("/");
  }

  function handleDeleteAccount() {
    resetStore();
    router.replace("/");
  }

  function handleUpgrade() {
    setPremium();
  }

  const initial = (userName || email || "?").charAt(0).toUpperCase();

  return (
    <div style={{ minHeight: "100dvh", background: NAVY, position: "relative", overflow: "hidden" }}>
      {/* Background mesh */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          background: `
            radial-gradient(ellipse 80% 55% at 50% -5%, rgba(50,90,220,0.38) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 90% 90%, rgba(15,40,110,0.40) 0%, transparent 55%),
            linear-gradient(170deg, #0d1a3a 0%, #060912 55%)
          `,
          pointerEvents: "none",
        }}
      />
      {/* Grid overlay */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 20,
          width: "100%",
          maxWidth: 448,
          margin: "0 auto",
          minWidth: 0,
          padding: "max(3.5rem, calc(env(safe-area-inset-top, 0px) + 2.75rem)) 24px 160px",
        }}
      >
        {/* Back link */}
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            color: TEXT_MID,
            textDecoration: "none",
            fontFamily: "var(--font-barlow-condensed), sans-serif",
            fontWeight: 700,
            fontSize: 14,
            letterSpacing: "0.04em",
            width: "fit-content",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>

        {/* Header with avatar */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${LIME}, rgba(200,255,0,0.50))`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: "0 4px 20px rgba(200,255,0,0.25)",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-barlow-condensed), sans-serif",
                fontWeight: 900,
                fontSize: 28,
                color: NAVY,
                lineHeight: 1,
              }}
            >
              {initial}
            </span>
          </div>
          <div>
            <h1 style={{ ...heading, fontSize: 38, lineHeight: 1.05, letterSpacing: "-0.03em" }}>
              Account
            </h1>
            {email && (
              <p style={{ ...eyebrow, marginTop: 4, fontSize: 11 }}>{email}</p>
            )}
          </div>
        </div>

        {/* Profile card */}
        <section style={card}>
          <p style={eyebrow}>Profile</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <label
              htmlFor="display-name"
              style={{ ...body, fontSize: 13, fontWeight: 600, color: TEXT_HI }}
            >
              Display name
            </label>
            <div style={{ display: "flex", gap: 10 }}>
              <input
                id="display-name"
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
                maxLength={40}
                placeholder="Your name"
                style={inputStyle}
              />
              <button
                type="button"
                onClick={handleSaveName}
                disabled={!nameChanged}
                style={{
                  flexShrink: 0,
                  background: nameChanged ? LIME : "rgba(255,255,255,0.06)",
                  color: nameChanged ? NAVY : TEXT_LO,
                  border: "none",
                  borderRadius: 12,
                  padding: "0 20px",
                  fontFamily: "var(--font-barlow-condensed), sans-serif",
                  fontWeight: 800,
                  fontSize: 14,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  cursor: nameChanged ? "pointer" : "default",
                  opacity: nameChanged ? 1 : 0.4,
                  transition: "all 0.15s",
                }}
              >
                {nameSaved ? "Saved!" : "Save"}
              </button>
            </div>
          </div>
        </section>

        {/* Subscription card */}
        <section style={card}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <p style={eyebrow}>Subscription</p>
            <span
              style={{
                borderRadius: 999,
                padding: "4px 12px",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                fontFamily: "var(--font-jetbrains-mono), monospace",
                background: isPremium ? "rgba(200,255,0,0.12)" : "rgba(255,255,255,0.06)",
                color: isPremium ? LIME : TEXT_LO,
              }}
            >
              {isPremium ? "Premium" : "Free"}
            </span>
          </div>

          {isPremium ? (
            <p style={{ ...body, fontSize: 14, color: TEXT_MID }}>
              Your premium access is active.
            </p>
          ) : (
            <button type="button" onClick={handleUpgrade} style={ctaButton}>
              Upgrade to Premium
            </button>
          )}
        </section>

        {/* Actions card */}
        <section style={card}>
          <p style={eyebrow}>Actions</p>

          <button type="button" onClick={handleSignOut} style={ghostButton}>
            Sign out
          </button>

          {!showDeleteConfirm ? (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              style={{
                ...ghostButton,
                background: "rgba(255,68,68,0.08)",
                border: `1px solid rgba(255,68,68,0.20)`,
                color: DANGER,
              }}
            >
              Delete account
            </button>
          ) : (
            <div
              style={{
                borderRadius: 16,
                border: `1px solid rgba(255,68,68,0.25)`,
                background: "rgba(255,68,68,0.06)",
                padding: 16,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <p style={{ ...body, fontSize: 13, fontWeight: 600, color: TEXT_HI }}>
                Are you sure? This permanently deletes your account, plans, and all data. This cannot be undone.
              </p>
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  style={{ ...ghostButton, flex: 1, padding: "12px 0" }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  style={{
                    flex: 1,
                    background: DANGER,
                    color: "#fff",
                    border: "none",
                    borderRadius: 14,
                    padding: "12px 0",
                    fontFamily: "var(--font-barlow-condensed), sans-serif",
                    fontWeight: 800,
                    fontSize: 15,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                  }}
                >
                  Yes, delete
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Legal links */}
        <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 8 }}>
          {[
            { href: "/terms", label: "Terms" },
            { href: "/privacy", label: "Privacy" },
            { href: "/about", label: "About" },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              style={{
                ...eyebrow,
                fontSize: 10,
                color: TEXT_LO,
                textDecoration: "none",
              }}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
