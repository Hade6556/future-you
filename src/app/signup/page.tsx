"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePlanStore } from "../state/planStore";
import { Input } from "@/components/ui/input";
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

      // Email confirmation enabled: signUp succeeds with no session until user confirms
      if (mode === "signup" && !data.session) {
        setMessage(
          "Check your email for a confirmation link to finish signing up.",
        );
        return;
      }

      setEmail(email);
      await syncToServer();
      router.push(destination);
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

  return (
    <div className="relative flex min-h-dvh flex-col items-center bg-background overflow-hidden" style={{ backgroundColor: "var(--canvas-base)" }}>
      {/* Mascot hero */}
      <div className="relative w-full flex justify-center pt-16 pb-2">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative h-[280px] w-[280px]"
        >
          <Image
            src="/orb-pointing.png"
            alt="Behavio"
            fill
            className="object-contain drop-shadow-2xl"
            priority
          />
        </motion.div>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="flex w-full max-w-sm flex-col items-center gap-4 px-6 pb-10"
      >
        <h1 className="text-center font-display text-[28px] font-semibold text-foreground">
          {userName ? `Save your plan, ${userName}` : "Sign up"}
        </h1>

        {/* Primary CTA */}
        {!showEmailForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex w-full flex-col gap-3 mt-2"
          >
            <button
              onClick={() => { setMode("signup"); setShowEmailForm(true); }}
              className="h-14 w-full rounded-2xl bg-primary text-[16px] font-semibold text-primary-foreground transition-opacity hover:bg-primary-hover active:scale-[0.98]"
            >
              Create account
            </button>
            <button
              onClick={() => { setMode("login"); setShowEmailForm(true); }}
              className="h-14 w-full rounded-2xl border-2 border-border bg-card text-[16px] font-medium text-foreground transition-colors hover:bg-muted active:scale-[0.98]"
            >
              I already have an account
            </button>
          </motion.div>
        )}

        {/* Email form */}
        <AnimatePresence>
          {showEmailForm && (
            <motion.div
              key="email-form"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex w-full flex-col gap-3 overflow-hidden"
            >
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmailInput(e.target.value)}
                disabled={loading}
                className="h-14 rounded-2xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                onKeyDown={(e) => { if (e.key === "Enter") void handleEmailAuth(); }}
                className="h-14 rounded-2xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              {error && <p className="text-sm text-destructive text-center">{error}</p>}
              {message && (
                <p className="text-sm text-center text-muted-foreground">{message}</p>
              )}
              <button
                onClick={() => void handleEmailAuth()}
                disabled={loading}
                className="h-14 w-full rounded-2xl bg-primary text-[16px] font-semibold text-primary-foreground transition-opacity hover:bg-primary-hover disabled:opacity-50 active:scale-[0.98]"
              >
                {loading ? "..." : mode === "signup" ? "Create account" : "Sign in"}
              </button>
              {mode === "login" && (
                <Link
                  href="/forgot-password"
                  className="text-center text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground"
                >
                  Forgot password?
                </Link>
              )}
              <button
                type="button"
                onClick={() => setShowEmailForm(false)}
                className="text-center text-sm text-muted-foreground hover:text-foreground"
              >
                ← Back
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Divider */}
        {!showEmailForm && (
          <div className="flex w-full items-center gap-3 my-1">
            <div className="h-px flex-1 bg-border" />
            <span className="text-[15px] font-medium text-muted-foreground">or continue with</span>
            <div className="h-px flex-1 bg-border" />
          </div>
        )}

        {/* Social buttons */}
        {!showEmailForm && (
          <button
            onClick={() => void handleGoogleAuth()}
            disabled={loading}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border-2 border-border bg-card text-[15px] font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-50"
          >
            <GoogleIcon />
            <span>Continue with Google</span>
          </button>
        )}

        {/* Skip */}
        <button
          onClick={handleSkip}
          className="mt-4 text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground"
        >
          Skip for now
        </button>

        {/* Legal */}
        <p className="mt-2 text-center text-[11px] text-muted-foreground/60">
          By continuing you agree to our{" "}
          <Link href="/terms" className="underline hover:text-muted-foreground">Terms</Link>
          {" "}and{" "}
          <Link href="/privacy" className="underline hover:text-muted-foreground">Privacy Policy</Link>
        </p>
      </motion.div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A11.96 11.96 0 001 12c0 1.94.46 3.77 1.18 5.07l3.66-2.98z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

