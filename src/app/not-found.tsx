import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center" style={{ backgroundColor: "var(--canvas-base)" }}>
      <p className="mb-4 text-5xl">🔍</p>
      <h1 className="mb-2 text-[22px] font-bold text-foreground">Page not found</h1>
      <p className="mb-8 max-w-xs text-sm text-muted-foreground">
        This page doesn't exist. Head back to your dashboard.
      </p>
      <Link
        href="/"
        className="flex h-11 items-center rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground hover:opacity-90"
      >
        Go home
      </Link>
    </div>
  );
}
