"use client";

import { useEffect, useState } from "react";
import { OrbAvatar } from "./mascot/OrbAvatar";

export default function SplashScreen() {
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("splash_shown")) return;
      setVisible(true);
      const fadeTimer = setTimeout(() => setFading(true), 1800);
      const hideTimer = setTimeout(() => {
        setVisible(false);
        sessionStorage.setItem("splash_shown", "1");
      }, 2350);
      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(hideTimer);
      };
    } catch {
      // private/restricted mode — skip splash
    }
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-6"
      style={{
        background: "radial-gradient(ellipse 70% 50% at 20% 10%, rgba(40,80,200,0.30) 0%, transparent 60%), radial-gradient(ellipse 60% 60% at 85% 80%, rgba(15,40,100,0.50) 0%, transparent 60%), linear-gradient(160deg, #0f2040 0%, #090f1a 50%, #060912 100%)",
        opacity: fading ? 0 : 1,
        transition: "opacity 500ms ease-out",
        pointerEvents: "none",
      }}
    >
      <OrbAvatar emotion="default" size={96} />

      {/* Wordmark */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 0 }}>
        <span
          style={{
            fontFamily: "var(--font-barlow-condensed), sans-serif",
            fontStyle: "italic",
            fontWeight: 700,
            fontSize: 28,
            color: "#C8FF00",
            letterSpacing: "0.02em",
          }}
        >
          behavio
        </span>
      </div>

      {/* Pulsing dots */}
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-2 w-2 rounded-full animate-pulse"
            style={{
              background: "#C8FF00",
              opacity: 0.7,
              animationDelay: `${i * 200}ms`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
