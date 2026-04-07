"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { usePlanStore } from "../../state/planStore";
import { createClient } from "@/lib/supabase/client";

const LIME = "#C8FF00";
const TEXT_HI = "rgba(235,242,255,0.92)";
const TEXT_MID = "rgba(120,155,195,0.85)";

export default function ResultPage() {
  const router = useRouter();
  const userName = usePlanStore((s) => s.userName);

  useEffect(() => {
    const timer = setTimeout(async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      router.push(user ? "/intake" : "/signup");
    }, 3000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "#060912",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          background: `
            radial-gradient(ellipse 70% 55% at 50% 20%, rgba(200,255,0,0.10) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 10% 90%, rgba(15,40,110,0.40) 0%, transparent 55%),
            linear-gradient(170deg, #0f1e3a 0%, #060912 55%)
          `,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100dvh",
          padding: "0 32px",
          textAlign: "center",
        }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              border: `3px solid rgba(200,255,0,0.15)`,
              borderTopColor: LIME,
              margin: "0 auto 32px",
            }}
          />

          <h1
            style={{
              fontFamily: "var(--font-display), sans-serif",
              fontWeight: 700,
              fontSize: 32,
              lineHeight: 1.1,
              letterSpacing: "-0.01em",
              color: TEXT_HI,
              margin: "0 0 12px",
            }}
          >
            Building your{" "}
            <span style={{ color: LIME }}>plan</span>
          </h1>

          <p
            style={{
              fontFamily: "var(--font-body), Georgia, serif",
              fontWeight: 400,
              fontSize: 15,
              color: TEXT_MID,
              lineHeight: 1.6,
              margin: 0,
              maxWidth: 260,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            {userName ? `Hang tight, ${userName}` : "Hang tight"} — we're
            crafting something personal for you.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
