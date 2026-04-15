/**
 * Behavio — Dark navy + silver text + restrained sage-mint accent (calm, coaching tone).
 * Use with [globals.css](globals.css) tokens. Import in TS/TSX for inline styles.
 */

export const NAVY = "#060912";
/** Panel / elevated surfaces (was mixed with NAVY in components) */
export const NAVY_PANEL = "#0A1628";

/** Primary CTA and interactive accent (soft mint–sage, not neon) */
export const ACCENT = "#5ECDAA";
export const ACCENT_HOVER = "#4BB892";
export const ACCENT_RGB = "94,205,161" as const;

export const TEXT_HI = "rgba(255,255,255,0.95)";
export const TEXT_MID = "rgba(160,180,210,0.75)";
export const TEXT_LO = "rgba(130,155,195,0.45)";

export const GLASS = "rgba(255,255,255,0.05)";
export const GLASS_BORDER = "rgba(255,255,255,0.10)";

/** Text / icons on top of ACCENT buttons */
export const ON_ACCENT = NAVY;

/** rgba(ACCENT, opacity) for glows and borders */
export function accentRgba(a: number): string {
  return `rgba(${ACCENT_RGB},${a})`;
}
