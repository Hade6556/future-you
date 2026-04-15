"use client";

import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { NavBar } from "./NavBar";
import { usePlanStore } from "../state/planStore";

const hideNav = ["/signup", "/onboarding", "/generating", "/journal/new", "/quiz"];

export default function Shell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const quizComplete = usePlanStore((s) => s.quizComplete);
  const onboardingComplete = usePlanStore((s) => s.onboardingComplete);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const canAccessMainApp = quizComplete && onboardingComplete;
  const showNav = mounted && canAccessMainApp && !hideNav.includes(pathname);

  return (
    <div className="app-shell">
      <div className="app-phone-canvas">
        {/* Global background gradient mesh — glass only works over this */}
        <div
          aria-hidden
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 0,
            background: `
              radial-gradient(ellipse 70% 50% at 20% 10%, rgba(40,80,200,0.30) 0%, transparent 60%),
              radial-gradient(ellipse 60% 60% at 85% 80%, rgba(15,40,100,0.50) 0%, transparent 60%),
              linear-gradient(160deg, #0f2040 0%, #090f1a 50%, #060912 100%)
            `,
            pointerEvents: "none",
          }}
        />
        {/* Very subtle texture — kept well below notice */}
        <svg
          aria-hidden
          xmlns="http://www.w3.org/2000/svg"
          style={{
            position: "fixed",
            inset: 0,
            width: "100%",
            height: "100%",
            zIndex: 0,
            opacity: 0.028,
            pointerEvents: "none",
          }}
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <pattern
              id="shellHexGrid"
              width="56"
              height="97.98"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M28 0 L52 14 v28 L28 56 L4 42 V14 Z"
                fill="none"
                stroke="rgba(180,200,240,0.55)"
                strokeWidth="0.65"
              />
              <path
                d="M28 56 L52 70 v28 L28 112 L4 98 V70 Z"
                fill="none"
                stroke="rgba(180,200,240,0.55)"
                strokeWidth="0.65"
              />
              <path
                d="M52 14 L80 28 v28 L52 70 L24 56 V28 Z"
                fill="none"
                stroke="rgba(180,200,240,0.55)"
                strokeWidth="0.65"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#shellHexGrid)" />
        </svg>

        <AnimatePresence mode="wait" initial={false}>
          <motion.main
            key={pathname}
            style={{
              position: "relative",
              zIndex: 1,
              minHeight: "100dvh",
              paddingBottom: showNav
                ? "calc(96px + env(safe-area-inset-bottom, 0px))"
                : undefined,
            }}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
          >
            {children}
          </motion.main>
        </AnimatePresence>

        {showNav && <NavBar />}
      </div>
    </div>
  );
}
