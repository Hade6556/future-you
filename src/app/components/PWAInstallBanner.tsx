"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDownTrayIcon, XMarkIcon } from "@heroicons/react/24/outline";

const DISMISSED_KEY = "behavio-pwa-banner-dismissed";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PWAInstallBanner() {
  const [show, setShow] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(DISMISSED_KEY)) return;
    } catch {
      // ignore
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShow(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    if (result.outcome === "accepted") setShow(false);
  };

  const handleDismiss = () => {
    setShow(false);
    try {
      sessionStorage.setItem(DISMISSED_KEY, "1");
    } catch {
      // ignore
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="flex min-w-0 items-center justify-between gap-3 rounded-2xl border border-primary/20 bg-secondary/60 p-3"
        >
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <ArrowDownTrayIcon className="h-4 w-4 text-primary" aria-hidden />
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-text-primary">Add to Home Screen</p>
              <p className="text-[13px] text-text-secondary">One tap to today&apos;s plan</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={handleInstall}
              className="touch-target rounded-lg bg-primary px-3 py-1.5 text-[12px] font-semibold text-primary-foreground transition-colors hover:bg-primary-hover active:scale-[0.97]"
            >
              Add
            </button>
            <button
              type="button"
              onClick={handleDismiss}
              className="touch-target flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary hover:bg-muted"
              aria-label="Dismiss"
            >
              <XMarkIcon className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
