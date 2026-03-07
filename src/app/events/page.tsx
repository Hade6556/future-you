"use client";

import Image from "next/image";
import { PageControl } from "../components/PageControl";

export default function EventsPage() {
  return (
    <div className="relative flex min-h-dvh flex-col bg-[#F8F6F1] pb-28">
      {/* Header */}
      <h1
        className="mt-[109px] px-12 text-[24px] font-extralight text-[#121212]"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        Best match for you! 🔥
      </h1>

      {/* Stacked event card */}
      <div className="mx-5 mt-6">
        <div className="relative overflow-hidden rounded-3xl bg-white shadow-md">
          {/* Card header area */}
          <div className="flex items-start gap-3 px-5 pt-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#121212]">
              <span className="text-lg text-white">📅</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-[#121212]">EVENT!</p>
              <p className="text-xs text-[#121212]/60">This is an event!</p>
            </div>
            <button className="text-[#121212]/40">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="5" r="2" />
                <circle cx="12" cy="12" r="2" />
                <circle cx="12" cy="19" r="2" />
              </svg>
            </button>
          </div>

          {/* View more */}
          <p
            className="px-5 pt-3 text-[24px] font-extralight text-[#121212]"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            view 2 more...
          </p>

          {/* Event image area */}
          <div className="mx-5 mt-3 flex h-[187px] items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-amber-100 to-orange-100">
            <div className="flex flex-col items-center gap-1 p-4 text-center">
              <p className="text-3xl font-bold text-[#121212]">2026</p>
              <p className="text-lg font-bold uppercase tracking-wider text-[#EB5757]">
                SAVE THE DATE!
              </p>
              <p className="text-2xl font-black uppercase tracking-widest text-[#121212]">
                GROWTH SUMMIT
              </p>
              <p className="text-sm font-medium text-[#121212]/60">Sept. 7 · ADAPT</p>
            </div>
          </div>

          {/* Card body */}
          <div className="px-5 pb-5 pt-4">
            <p className="text-base font-semibold text-[#121212]">Growth Summit 2026</p>

            {/* Mascot + description */}
            <div className="mt-4 flex items-end gap-3">
              <div className="relative h-[120px] w-[100px] shrink-0">
                <Image
                  src="/orb-lantern.png"
                  alt="Future Me mascot"
                  fill
                  className="object-contain"
                />
              </div>
              <p
                className="flex-1 text-[16px] font-extralight leading-relaxed text-[#121212]"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Future Me found <span className="font-semibold">3</span> events matched to your ambition
              </p>
            </div>

            {/* Action buttons */}
            <div className="mt-4 flex gap-3">
              <button className="flex h-10 flex-1 items-center justify-center rounded-full border border-[#121212]/20 text-sm font-medium text-[#121212]">
                Next
              </button>
              <button className="flex h-10 flex-1 items-center justify-center rounded-full bg-[#6FCF97] text-sm font-medium text-white">
                Accept
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Page dots */}
      <div className="mt-auto">
        <PageControl current={4} total={5} />
      </div>
    </div>
  );
}
