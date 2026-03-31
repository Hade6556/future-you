"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePlanStore } from "../state/planStore";
import { createClient } from "@/lib/supabase/client";

type AuthMode = "signup" | "login";

export default function SignupPage() {
  const router = useRouter();
  const userName = usePlanStore((s) => s.userName);
  const onboardingComplete = usePlanStore((s) => s.onboardingComplete);
  const setEmail = usePlanStore((s) => s.setEmail);
  const syncToServer = usePlanStore((s) => s.syncToServer);

  const [mode, setMode] = useState<AuthMode>("signup");
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmailInput] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const supabase = useMemo(() => createClient(), []);
  const destination = onboardingComplete ? "/" : "/quiz/result";

  async function handleEmailAuth() {
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const { data, error: authError } =
        mode === "signup"
          ? await supabase.auth.signUp({ email, password })
          : await supabase.auth.signInWithPassword({ email, password });

      if (authError) {
        setError(authError.message);
        return;
      }

      if (mode === "signup" && !data.session) {
        setMessage(
          "Check your email for a confirmation link to finish signing up.",
        );
        return;
      }

      setEmail(email);
      await syncToServer();
      router.push(mode === "login" ? "/" : destination);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleAuth() {
    setLoading(true);
    setError(null);
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (authError) {
      setError(authError.message);
      setLoading(false);
    }
  }

  function handleSkip() {
    router.push(destination);
  }

  const firstName = userName ? userName.split(" ")[0] : null;

  return (
    <div
      className="flex min-h-dvh flex-col items-center justify-start px-6 pb-12 pt-20"
      style={{ background: "var(--bg-base)" }}
    >
      {/* Background mesh (same as HookScreen) */}
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
            {firstName ? (
              <>
                Save your plan,{" "}
                <span style={{ color: "#C8FF00" }}>{firstName}</span>
              </>
            ) : mode === "signup" ? (
              <>
                Create your{" "}
                <span style={{ color: "#C8FF00" }}>account</span>
              </>
            ) : (
              <>
                Welcome{" "}
                <span style={{ color: "#C8FF00" }}>back</span>
              </>
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
              ? "Keep your progress safe across devices."
              : "Pick up right where you left off."}
          </p>
        </motion.div>

        {/* Primary buttons (pre-form state) */}
        <AnimatePresence mode="wait">
          {!showEmailForm && (
            <motion.div
              key="buttons"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ delay: 0.25, duration: 0.3 }}
              className="flex w-full flex-col gap-3"
            >
              {/* Google */}
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
                <span>Continue with Google</span>
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 py-1">
                <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.10)" }} />
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--text-lo)",
                  }}
                >
                  or
                </span>
                <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.10)" }} />
              </div>

              {/* Email CTA */}
              <button
                onClick={() => {
                  setMode("signup");
                  setShowEmailForm(true);
                }}
                className="btn-cta w-full"
              >
                Create account with email
              </button>

              {/* Login toggle */}
              <button
                onClick={() => {
                  setMode("login");
                  setShowEmailForm(true);
                }}
                className="mt-1 text-sm transition-colors hover:underline"
                style={{ color: "var(--text-mid)" }}
              >
                I already have an account
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Email form */}
        <AnimatePresence mode="wait">
          {showEmailForm && (
            <motion.div
              key="email-form"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="flex w-full flex-col gap-3"
            >
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmailInput(e.target.value)}
                disabled={loading}
                className="capture-form-input h-14 w-full rounded-2xl px-5 text-[15px] outline-none transition-colors"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.14)",
                  color: "var(--text-hi)",
                }}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                onKeyDown={(e) => {
                  if (e.key === "Enter") void handleEmailAuth();
                }}
                className="capture-form-input h-14 w-full rounded-2xl px-5 text-[15px] outline-none transition-colors"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.14)",
                  color: "var(--text-hi)",
                }}
              />

              {error && (
                <p className="text-sm" style={{ color: "var(--status-bad)" }}>
                  {error}
                </p>
              )}
              {message && (
                <p className="text-sm" style={{ color: "var(--status-good)" }}>
                  {message}
                </p>
              )}

              <button
                onClick={() => void handleEmailAuth()}
                disabled={loading}
                className="btn-cta w-full disabled:opacity-50"
              >
                {loading
                  ? "..."
                  : mode === "signup"
                    ? "Create account"
                    : "Sign in"}
              </button>

              {mode === "login" && (
                <Link
                  href="/forgot-password"
                  className="text-sm transition-colors hover:underline"
                  style={{ color: "var(--text-mid)" }}
                >
                  Forgot password?
                </Link>
              )}

              <button
                type="button"
                onClick={() => {
                  setShowEmailForm(false);
                  setError(null);
                  setMessage(null);
                }}
                className="mt-1 text-sm transition-colors hover:underline"
                style={{ color: "var(--text-lo)" }}
              >
                &larr; Back
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Skip */}
        <motion.button
          onClick={handleSkip}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 transition-colors hover:underline"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--text-lo)",
          }}
        >
          skip for now
        </motion.button>

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
