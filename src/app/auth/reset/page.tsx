"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  async function handleReset() {
    if (!password || password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    setLoading(true);
    setError(null);
    const { error: authError } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (authError) {
      setError(authError.message);
    } else {
      router.push("/");
    }
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-6" style={{ backgroundColor: "var(--canvas-base)" }}>
      <div className="w-full max-w-sm">
        <h1 className="mb-1 text-[26px] font-bold text-foreground">Set new password</h1>
        <p className="mb-6 text-sm text-muted-foreground">Choose a strong password for your account.</p>
        <div className="flex flex-col gap-3">
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            className="h-14 w-full rounded-2xl border border-border bg-card px-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <input
            type="password"
            placeholder="Confirm password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") void handleReset(); }}
            disabled={loading}
            className="h-14 w-full rounded-2xl border border-border bg-card px-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button
            onClick={() => void handleReset()}
            disabled={loading}
            className="h-14 w-full rounded-2xl bg-primary text-[16px] font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Update password"}
          </button>
        </div>
      </div>
    </div>
  );
}
