"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { NavBar } from "./NavBar";
import SplashScreen from "./SplashScreen";
import { usePlanStore } from "../state/planStore";

const hideNav = ["/signup", "/quiz", "/quiz/analyzing", "/quiz/result", "/intake", "/generating"];

export default function Shell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const quizComplete = usePlanStore((s) => s.quizComplete);
  const onboardingComplete = usePlanStore((s) => s.onboardingComplete);
  const canAccessMainApp = quizComplete && onboardingComplete;
  const showNav = canAccessMainApp && !hideNav.includes(pathname);

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

        <SplashScreen />

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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
            {children}
          </motion.main>
        </AnimatePresence>

        {showNav && <NavBar />}
      </div>
    </div>
  );
}
