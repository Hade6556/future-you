"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePlanStore } from "../state/planStore";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const onboardingComplete = usePlanStore((s) => s.onboardingComplete);
  const setEmail = usePlanStore((s) => s.setEmail);
  const setUserName = usePlanStore((s) => s.setUserName);
  const syncToServer = usePlanStore((s) => s.syncToServer);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const supabase = useMemo(() => createClient(), []);

  // If user is already authenticated (returning from Google callback), hydrate and redirect
  useEffect(() => {
    async function checkSession() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Hydrate name and email from Google profile
        const fullName = user.user_metadata?.full_name ?? user.user_metadata?.name ?? "";
        const userEmail = user.email ?? "";
        if (fullName) setUserName(fullName);
        if (userEmail) setEmail(userEmail);
        await syncToServer();

        if (onboardingComplete) {
          router.replace("/");
        } else {
          router.replace("/intake");
        }
      }
    }
    void checkSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleGoogleAuth() {
    setLoading(true);
    setError(null);
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=/signup` },
    });
    if (authError) {
      setError(authError.message);
      setLoading(false);
    }
  }

  return (
    <div
      className="flex min-h-dvh flex-col items-center justify-start px-6 pb-12 pt-20"
      style={{ background: "var(--bg-base)" }}
    >
      {/* Background mesh */}
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

      <motion.div
        className="relative z-10 mx-auto flex w-full max-w-sm flex-col items-center gap-6 text-center"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        {/* Glowing orb accent */}
        <div
          aria-hidden
          className="relative mb-2 flex h-24 w-24 items-center justify-center"
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(200,255,0,0.25) 0%, rgba(45,212,192,0.12) 50%, transparent 70%)",
              filter: "blur(20px)",
            }}
          />
          <div
            className="relative h-16 w-16 rounded-full"
            style={{
              background: "linear-gradient(135deg, #C8FF00 0%, #2DD4C0 100%)",
              boxShadow: "0 0 40px rgba(200,255,0,0.30)",
            }}
          />
        </div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.35 }}
          className="space-y-2"
        >
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: 32,
              lineHeight: 1.1,
              letterSpacing: "-0.01em",
              color: "var(--text-hi)",
            }}
          >
            Create your{" "}
            <span style={{ color: "#C8FF00" }}>account</span>
          </h1>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 15,
              color: "var(--text-mid)",
              lineHeight: 1.5,
            }}
          >
            Sign in to save your plan and track your progress.
          </p>
        </motion.div>

        {/* Google auth button */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.3 }}
          className="flex w-full flex-col gap-3"
        >
          <button
            onClick={() => void handleGoogleAuth()}
            disabled={loading}
            className="flex h-14 w-full items-center justify-center gap-3 rounded-full border font-semibold transition-all active:scale-[0.97] disabled:opacity-50"
            style={{
              background: "rgba(255,255,255,0.07)",
              backdropFilter: "blur(12px)",
              borderColor: "rgba(255,255,255,0.16)",
              color: "var(--text-hi)",
              fontSize: 15,
            }}
          >
            <GoogleIcon />
            <span>{loading ? "Redirecting..." : "Continue with Google"}</span>
          </button>

          {error && (
            <p className="text-sm" style={{ color: "var(--status-bad)" }}>
              {error}
            </p>
          )}
        </motion.div>

        {/* Legal */}
        <p
          className="mt-1 text-center"
          style={{
            fontSize: 11,
            color: "var(--text-lo)",
            lineHeight: 1.5,
          }}
        >
          By continuing you agree to our{" "}
          <Link
            href="/terms"
            className="underline underline-offset-2 transition-colors"
            style={{ color: "var(--text-mid)" }}
          >
            Terms
          </Link>
          {" "}and{" "}
          <Link
            href="/privacy"
            className="underline underline-offset-2 transition-colors"
            style={{ color: "var(--text-mid)" }}
          >
            Privacy Policy
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A11.96 11.96 0 001 12c0 1.94.46 3.77 1.18 5.07l3.66-2.98z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}
