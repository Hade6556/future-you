"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  async function handleSubmit() {
    if (!email) { setError("Please enter your email."); return; }
    setLoading(true);
    setError(null);
    const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset`,
    });
    setLoading(false);
    if (authError) {
      setError(authError.message);
    } else {
      setSubmitted(true);
    }
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-6" style={{ backgroundColor: "var(--canvas-base)" }}>
      <div className="w-full max-w-sm">
        <Link href="/signup" className="mb-8 inline-block text-sm text-muted-foreground hover:text-foreground">
          ← Back to sign in
        </Link>

        {submitted ? (
          <div className="rounded-2xl border border-border bg-card p-6 text-center">
            <p className="mb-2 text-[22px]">📬</p>
            <h1 className="mb-2 text-lg font-semibold text-foreground">Check your inbox</h1>
            <p className="text-sm text-muted-foreground">
              We sent a password reset link to <strong>{email}</strong>. Check your spam folder if you don't see it.
            </p>
          </div>
        ) : (
          <>
            <h1 className="mb-1 text-[26px] font-bold text-foreground">Forgot password?</h1>
            <p className="mb-6 text-sm text-muted-foreground">
              Enter your email and we'll send you a reset link.
            </p>
            <div className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") void handleSubmit(); }}
                disabled={loading}
                className="h-14 w-full rounded-2xl border border-border bg-card px-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
              <button
                onClick={() => void handleSubmit()}
                disabled={loading}
                className="h-14 w-full rounded-2xl bg-primary text-[16px] font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send reset link"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
