"use client";

// MascotEmotion and MascotReactor are both defined in OrbAvatar.
// Re-export them here so existing imports keep working unchanged.
export type { MascotEmotion } from "./OrbAvatar";
export { OrbAvatar as MascotReactor } from "./OrbAvatar";
