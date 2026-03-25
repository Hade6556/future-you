"use client";

export function PageControl({ current = 0, total = 5 }: { current?: number; total?: number }) {
  return (
    <div className="flex items-center justify-center gap-2 py-3">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-2 w-2 rounded-full transition-colors ${
            i === current ? "bg-primary" : "bg-border"
          }`}
        />
      ))}
    </div>
  );
}
