"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { createClient } from "@/lib/supabase/client";
import { usePlanStore } from "@/app/state/planStore";
import { Input } from "@/components/ui/input";

type UserData = {
  user_name: string | null;
  is_premium: boolean;
  stripe_customer_id: string | null;
  email: string | null;
};

export default function AccountPage() {
  const router = useRouter();
  const setUserName = usePlanStore((s) => s.setUserName);
  const resetStore = usePlanStore((s) => s.resetForDemo);

  const [userData, setUserData] = useState<UserData | null>(null);
  const [authEmail, setAuthEmail] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const [editName, setEditName] = useState("");
  const [savingName, setSavingName] = useState(false);
  const [nameSaved, setNameSaved] = useState(false);

  const [portalLoading, setPortalLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/signup");
        return;
      }
      setAuthEmail(user.email ?? "");
      const { data } = await supabase
        .from("users")
        .select("user_name, is_premium, stripe_customer_id, email")
        .eq("id", user.id)
        .single();
      if (data) {
        setUserData(data as UserData);
        setEditName(data.user_name ?? "");
      }
      setLoading(false);
    }
    void load();
  }, [router]);

  async function handleSaveName() {
    if (!editName.trim()) return;
    setSavingName(true);
    setNameSaved(false);
    try {
      const res = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName: editName }),
      });
      if (res.ok) {
        setUserName(editName);
        setNameSaved(true);
        setTimeout(() => setNameSaved(false), 2500);
      }
    } finally {
      setSavingName(false);
    }
  }

  async function handleManageSubscription() {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/account/portal", { method: "POST" });
      const data = await res.json() as { url?: string; error?: string };
      if (data.url) window.location.href = data.url;
    } finally {
      setPortalLoading(false);
    }
  }

  async function handleUpgrade() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "pro_monthly", userId: user.id }),
      });
      const data = await res.json() as { url?: string };
      if (data.url) window.location.href = data.url;
    } finally {
      setCheckoutLoading(false);
    }
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    resetStore();
    router.replace("/signup");
  }

  async function handleDeleteAccount() {
    setDeleting(true);
    try {
      const res = await fetch("/api/account", { method: "DELETE" });
      if (res.ok) {
        resetStore();
        router.replace("/signup");
      }
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="content-padding relative flex min-h-dvh flex-col bg-background pb-36 pt-[max(3.5rem,env(safe-area-inset-top,3.5rem))]">
        <div className="section-gap mx-auto flex w-full max-w-md flex-col animate-pulse gap-4">
          <div className="h-6 w-32 rounded-full bg-border" />
          <div className="h-32 rounded-2xl bg-card border border-border" />
          <div className="h-24 rounded-2xl bg-card border border-border" />
          <div className="h-24 rounded-2xl bg-card border border-border" />
        </div>
      </div>
    );
  }

  const isPremium = userData?.is_premium ?? false;
  const hasStripeId = !!userData?.stripe_customer_id;
  const currentName = userData?.user_name ?? "";
  const nameChanged = editName !== currentName && editName.trim().length > 0;

  return (
    <div className="content-padding relative flex min-h-dvh flex-col bg-background pb-36 pt-[max(3.5rem,env(safe-area-inset-top,3.5rem))]">
      <div className="section-gap mx-auto flex w-full max-w-md flex-col min-w-0">

        {/* Back nav */}
        <Link
          href="/"
          className="flex w-fit items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold transition-colors hover:bg-muted"
          style={{ color: "var(--text-secondary)" }}
        >
          <ChevronLeftIcon className="h-4 w-4" />
          Back
        </Link>

        {/* Header */}
        <header>
          <h1 className="text-[30px] font-extrabold leading-[1.1] tracking-tight text-foreground">
            Account
          </h1>
          <p className="mt-1 text-[14px] text-muted-foreground">{authEmail}</p>
        </header>

        {/* Profile section */}
        <section
          className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5"
          style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}
        >
          <p
            className="text-[11px] font-bold uppercase tracking-wider"
            style={{ color: "var(--text-secondary)" }}
          >
            Profile
          </p>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="display-name"
              className="text-[13px] font-semibold text-foreground"
            >
              Display name
            </label>
            <div className="flex gap-2">
              <Input
                id="display-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                maxLength={40}
                placeholder="Your name"
                className="flex-1"
              />
              <button
                type="button"
                onClick={() => void handleSaveName()}
                disabled={savingName || !nameChanged}
                className="shrink-0 rounded-full px-4 py-2 text-sm font-bold text-white transition-opacity disabled:opacity-40"
                style={{ background: "var(--accent-primary)" }}
              >
                {savingName ? "Saving…" : nameSaved ? "Saved!" : "Save"}
              </button>
            </div>
          </div>
        </section>

        {/* Subscription section */}
        <section
          className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5"
          style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}
        >
          <div className="flex items-center justify-between">
            <p
              className="text-[11px] font-bold uppercase tracking-wider"
              style={{ color: "var(--text-secondary)" }}
            >
              Subscription
            </p>
            <span
              className="rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide"
              style={{
                background: isPremium ? "rgba(92,139,74,0.15)" : "var(--badge-bg)",
                color: isPremium ? "#5C8B4A" : "var(--text-secondary)",
              }}
            >
              {isPremium ? "Premium" : "Free"}
            </span>
          </div>

          {isPremium && hasStripeId ? (
            <button
              type="button"
              onClick={() => void handleManageSubscription()}
              disabled={portalLoading}
              className="rounded-full px-5 py-2.5 text-sm font-bold text-white transition-opacity disabled:opacity-60"
              style={{ background: "var(--accent-primary)" }}
            >
              {portalLoading ? "Loading…" : "Manage subscription"}
            </button>
          ) : isPremium ? (
            <p className="text-[13px] text-muted-foreground">
              Your premium access is active.
            </p>
          ) : (
            <button
              type="button"
              onClick={() => void handleUpgrade()}
              disabled={checkoutLoading}
              className="rounded-full px-5 py-2.5 text-sm font-bold text-white transition-opacity disabled:opacity-60"
              style={{ background: "var(--accent-primary)" }}
            >
              {checkoutLoading ? "Loading…" : "Upgrade to Premium"}
            </button>
          )}
        </section>

        {/* Danger zone */}
        <section
          className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5"
          style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}
        >
          <p
            className="text-[11px] font-bold uppercase tracking-wider"
            style={{ color: "var(--text-secondary)" }}
          >
            Account
          </p>

          <button
            type="button"
            onClick={() => void handleSignOut()}
            className="w-full rounded-full px-5 py-2.5 text-sm font-bold transition-colors"
            style={{ background: "var(--badge-bg)", color: "var(--text-secondary)" }}
          >
            Sign out
          </button>

          {!showDeleteConfirm ? (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full rounded-full px-5 py-2.5 text-sm font-bold text-white transition-opacity"
              style={{ background: "#DF4B01" }}
            >
              Delete account
            </button>
          ) : (
            <div className="flex flex-col gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-4">
              <p className="text-[13px] font-semibold text-foreground">
                Are you sure? This permanently deletes your account, plans, and all data. This cannot be undone.
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 rounded-full px-4 py-2 text-sm font-bold transition-colors"
                  style={{ background: "var(--badge-bg)", color: "var(--text-secondary)" }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => void handleDeleteAccount()}
                  disabled={deleting}
                  className="flex-1 rounded-full px-4 py-2 text-sm font-bold text-white transition-opacity disabled:opacity-60"
                  style={{ background: "#DF4B01" }}
                >
                  {deleting ? "Deleting…" : "Yes, delete"}
                </button>
              </div>
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
