"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageControl } from "../components/PageControl";

export default function AboutPage() {
  const [prompt, setPrompt] = useState("");
  const router = useRouter();

  const handleSubmit = () => {
    router.push("/tasks");
  };

  return (
    <div className="relative flex min-h-dvh flex-col bg-[#F8F6F1] pb-28">
      {/* Title pill */}
      <div className="mt-[224px] flex items-center justify-center">
        <div className="flex items-center justify-center rounded-full border border-[#CAC4D0] px-6 py-4">
          <span className="text-base font-medium tracking-wide text-[#49454F]">
            What does your best life look like?
          </span>
        </div>
      </div>

      {/* AI Chat Box */}
      <div className="mx-7 mt-10 flex min-h-[122px] flex-col gap-6 overflow-hidden rounded-2xl border border-[#D9D9D9] bg-white p-4 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your ambition — business, fitness, creativity, anything..."
          className="min-h-[22px] w-full resize-none bg-transparent text-base text-[#121212]/40 placeholder:text-[#121212]/40 focus:text-[#121212] focus:outline-none"
          rows={1}
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button className="rounded-full p-2 transition-colors hover:bg-black/5" aria-label="Add image">
              <ImageIcon />
            </button>
            <button className="rounded-full p-2 transition-colors hover:bg-black/5" aria-label="Voice input">
              <MicIcon />
            </button>
          </div>
          <button
            onClick={handleSubmit}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#B3B3B3] bg-[#D9D9D9] transition-colors hover:bg-[#C0C0C0]"
            aria-label="Submit"
          >
            <ArrowUpIcon />
          </button>
        </div>
      </div>

      {/* Mascot - pointing finger */}
      <div className="mx-auto mt-4 flex items-center justify-center">
        <div className="relative h-[303px] w-[258px]">
          <Image
            src="/orb-pointing.png"
            alt="Future Me mascot"
            fill
            className="object-contain"
          />
        </div>
      </div>

      {/* Page dots */}
      <div className="mt-auto">
        <PageControl current={1} total={5} />
      </div>
    </div>
  );
}

function ImageIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#121212" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5L5 21" />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#121212" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="2" width="6" height="12" rx="3" />
      <path d="M5 10a7 7 0 0014 0" />
      <path d="M12 18v4M8 22h8" />
    </svg>
  );
}

function ArrowUpIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#121212" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  );
}
