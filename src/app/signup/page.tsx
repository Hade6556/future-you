"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePlanStore } from "../state/planStore";
import { createClient } from "@/lib/supabase/client";
import { ACCENT, GLASS, GLASS_BORDER, ON_ACCENT, accentRgba } from "@/app/theme";

/** Internal redirect only — avoids open redirects. */
function getSafeNextPath(): string | null {
  if (typeof window === "undefined") return null;
  const raw = new URLSearchParams(window.location.search).get("next");
  if (!raw || !raw.startsWith("/") || raw.startsWith("//") || raw.includes("://")) return null;
  if (raw.startsWith("/signup")) return null;
  return raw;
}

/** Where Supabase sends users after they click the email confirmation link (must be in Supabase Redirect URLs). */
function getEmailConfirmationRedirectUrl(): string {
  const callback = new URL("/auth/callback", window.location.origin);
  const next = getSafeNextPath();
  if (next) callback.searchParams.set("next", next);
  return callback.toString();
}

function formatAuthError(message: string): string {
  if (/email logins are disabled/i.test(message)) {
    return "Supabase has email/password turned off. Open your Supabase project → Authentication → Providers → Email → enable the Email provider (and “Confirm email” only if you want that gate). Then try again.";
  }
  return message;
}

export default function SignupPage() {
  const router = useRouter();
  const onboardingComplete = usePlanStore((s) => s.onboardingComplete);
  const setEmail = usePlanStore((s) => s.setEmail);
  const setUserName = usePlanStore((s) => s.setUserName);
  const syncToServer = usePlanStore((s) => s.syncToServer);

  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [emailInput, setEmailInput] = useState("");
  const [password, setPassword] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const supabase = useMemo(() => createClient(), []);

  // If user is already authenticated, hydrate and redirect
  useEffect(() => {
    async function checkSession() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const fullName = user.user_metadata?.full_name ?? user.user_metadata?.name ?? "";
        const userEmail = user.email ?? "";
        if (fullName) setUserName(fullName);
        if (userEmail) setEmail(userEmail);
        await syncToServer();

        const next = getSafeNextPath();
        if (next) {
          router.replace(next);
        } else if (onboardingComplete) {
          router.replace("/");
        } else {
          router.replace("/onboarding");
        }
      }
    }
    void checkSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (mode === "signup") {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: emailInput,
        password,
        options: {
          data: { full_name: nameInput },
          emailRedirectTo: getEmailConfirmationRedirectUrl(),
        },
      });
      if (signUpError) {
        setError(formatAuthError(signUpError.message));
        setLoading(false);
        return;
      }
      // When "Confirm email" is ON in Supabase, there is no session until they click the link.
      if (signUpData.user && !signUpData.session) {
        setError(
          "Confirm your email from the link we sent, then you’ll land in the app. To skip this step: Supabase → Authentication → Providers → Email → turn off “Confirm email”.",
        );
        setLoading(false);
        return;
      }
      if (nameInput) setUserName(nameInput);
      setEmail(emailInput);
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: emailInput,
        password,
      });
      if (signInError) {
        setError(formatAuthError(signInError.message));
        setLoading(false);
        return;
      }
      const { data: { user } } = await supabase.auth.getUser();
      const fullName = user?.user_metadata?.full_name ?? "";
      if (fullName) setUserName(fullName);
      setEmail(emailInput);
    }

    try {
      await syncToServer();
    } catch (e) {
      console.warn("[signup] sync failed, continuing anyway", e);
    }

    const next = getSafeNextPath();
    if (next) {
      router.replace(next);
    } else if (onboardingComplete) {
      router.replace("/");
    } else {
      router.replace("/onboarding");
    }
  }

  return (
    <div
      className="flex min-h-dvh flex-col items-center justify-start px-6 pb-10 pt-12"
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
                `radial-gradient(circle, ${accentRgba(0.25)} 0%, rgba(45,212,192,0.12) 50%, transparent 70%)`,
              filter: "blur(20px)",
            }}
          />
          <div
            className="relative h-16 w-16 rounded-full"
            style={{
              background: `linear-gradient(135deg, ${ACCENT} 0%, #2DD4C0 100%)`,
              boxShadow: `0 0 40px ${accentRgba(0.3)}`,
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
            {mode === "signup" ? (
              <>Create your{" "}<span style={{ color: ACCENT }}>account</span></>
            ) : (
              <>Welcome{" "}<span style={{ color: ACCENT }}>back</span></>
            )}
          </h1>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 15,
              color: "var(--text-mid)",
              lineHeight: 1.5,
            }}
          >
            {mode === "signup"
              ? "Create an account to save your plan and track your progress."
              : "Log in to continue where you left off."}
          </p>
        </motion.div>

        {/* Auth form */}
        <motion.form
          onSubmit={(e) => void handleSubmit(e)}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.3 }}
          className="flex w-full flex-col gap-3"
        >
          {mode === "signup" && (
            <input
              type="text"
              placeholder="Full name"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              required
              className="h-12 w-full rounded-xl border px-4 text-sm outline-none transition-colors focus:border-[var(--cta)]"
              style={{
                background: GLASS,
                backdropFilter: "blur(12px)",
                borderColor: GLASS_BORDER,
                color: "var(--text-hi)",
              }}
            />
          )}
          <input
            type="email"
            placeholder="Email address"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            required
            className="h-12 w-full rounded-xl border px-4 text-sm outline-none transition-colors focus:border-[var(--cta)]"
            style={{
              background: GLASS,
              backdropFilter: "blur(12px)",
              borderColor: GLASS_BORDER,
              color: "var(--text-hi)",
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="h-12 w-full rounded-xl border px-4 text-sm outline-none transition-colors focus:border-[var(--cta)]"
            style={{
              background: GLASS,
              backdropFilter: "blur(12px)",
              borderColor: GLASS_BORDER,
              color: "var(--text-hi)",
            }}
          />

          <button
            type="submit"
            disabled={loading}
            className="flex h-14 w-full items-center justify-center gap-3 rounded-full border font-semibold transition-all active:scale-[0.97] disabled:opacity-50"
            style={{
              background: `linear-gradient(135deg, ${ACCENT} 0%, #2DD4C0 100%)`,
              border: "none",
              color: ON_ACCENT,
              fontSize: 15,
            }}
          >
            <span>{loading ? "Please wait..." : mode === "signup" ? "Create account" : "Log in"}</span>
          </button>

          {error && (
            <p className="text-sm" style={{ color: "var(--status-bad)" }}>
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={() => { setMode(mode === "signup" ? "login" : "signup"); setError(null); }}
            className="text-sm transition-colors"
            style={{ color: "var(--text-mid)" }}
          >
            {mode === "signup" ? "Already have an account? Log in" : "Don\u2019t have an account? Sign up"}
          </button>

          {mode === "login" && (
            <Link
              href="/forgot-password"
              className="text-sm underline underline-offset-2 transition-colors"
              style={{ color: "var(--text-lo)" }}
            >
              Forgot password?
            </Link>
          )}
        </motion.form>

        {/* Legal */}
        <p
          className="mt-1 text-center"
          style={{
            fontSize: 13,
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

