"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  const [prompt, setPrompt] = useState("");
  const router = useRouter();

  const handleSubmit = () => {
    router.push("/tasks");
  };

  return (
    <div className="relative flex min-h-dvh flex-col bg-background pb-32">
      <div className="mt-48 flex items-center justify-center">
        <div className="flex items-center justify-center rounded-full border border-border px-6 py-4">
          <span className="font-display text-base text-foreground">
            What does your best life look like?
          </span>
        </div>
      </div>

      <div className="mx-7 mt-10 flex min-h-[122px] flex-col gap-6 overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-sm">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your ambition — business, fitness, creativity, anything..."
          className="min-h-[22px] w-full resize-none bg-transparent text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
          rows={1}
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button className="rounded-full p-2 transition-colors hover:bg-secondary" aria-label="Add image">
              <ImageIcon />
            </button>
            <button className="rounded-full p-2 transition-colors hover:bg-secondary" aria-label="Voice input">
              <MicIcon />
            </button>
          </div>
          <Button onClick={handleSubmit} size="icon-sm" variant="outline" aria-label="Submit">
            <ArrowUpIcon />
          </Button>
        </div>
      </div>

      <div className="mx-auto mt-4 flex items-center justify-center">
        <div className="relative h-[280px] w-[240px]">
          <Image
            src="/orb-pointing.png"
            alt="Behavio mascot"
            fill
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}

function ImageIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="text-foreground">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5L5 21" />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="text-foreground">
      <rect x="9" y="2" width="6" height="12" rx="3" />
      <path d="M5 10a7 7 0 0014 0" />
      <path d="M12 18v4M8 22h8" />
    </svg>
  );
}

function ArrowUpIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  );
}
