"use client";

export type PaywallVariant = "control" | "proof";

const STORAGE_KEY = "exp_paywall_proof_v1";

export function resolvePaywallVariant(): PaywallVariant {
  if (typeof window === "undefined") return "proof";

  const params = new URLSearchParams(window.location.search);
  const forced = params.get("paywallVariant");
  if (forced === "control" || forced === "proof") return forced;

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "control" || stored === "proof") return stored;

  const assigned: PaywallVariant = Math.random() < 0.5 ? "control" : "proof";
  window.localStorage.setItem(STORAGE_KEY, assigned);
  return assigned;
}
