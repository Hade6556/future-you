"use client";

import Image from "next/image";
import { PageControl } from "../components/PageControl";

const stats = [
  { label: "Business goals", pct: "45%", color: "#EB5757" },
  { label: "Fitness & health", pct: "25%", color: "#6FCF97" },
  { label: "Personal growth", pct: "30%", color: "#56CCF2" },
];

export default function StructurePage() {
  return (
    <div className="relative flex min-h-dvh flex-col bg-[#F8F6F1] pb-28">
      {/* Title */}
      <p
        className="mt-[57px] text-center text-[20px] font-extralight text-[#121212]"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        Your ambition map
      </p>

      {/* Visualization area - rounded square with bubbles */}
      <div className="mx-auto mt-4 flex aspect-square w-full max-w-[380px] items-center justify-center overflow-hidden rounded-3xl border-2 border-[#121212]/10 bg-white/50 px-4">
        {/* Colorful orbs */}
        <div className="relative h-[280px] w-[280px]">
          {/* Red orb */}
          <div className="absolute left-[10%] top-[15%] h-[140px] w-[140px] rounded-full bg-gradient-radial from-[#FF6B6B] to-[#EB5757] shadow-[0_0_40px_rgba(235,87,87,0.4)]" />
          {/* Green orb */}
          <div className="absolute right-[5%] top-[5%] h-[110px] w-[110px] rounded-full bg-gradient-radial from-[#8EE5A1] to-[#6FCF97] shadow-[0_0_40px_rgba(111,207,151,0.4)]" />
          {/* Blue orb */}
          <div className="absolute bottom-[5%] left-[25%] h-[130px] w-[130px] rounded-full bg-gradient-radial from-[#73CAFF] to-[#2D9CDB] shadow-[0_0_40px_rgba(45,156,219,0.4)]" />
        </div>
      </div>

      {/* Stats with colored dots + mascot */}
      <div className="relative mx-6 mt-4">
        {/* Mascot in right */}
        <div className="absolute -right-2 top-0">
          <div className="relative h-[210px] w-[180px]">
            <Image
              src="/orb-thinking.png"
              alt=""
              fill
              className="object-contain"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-3">
              <div
                className="h-6 w-6 shrink-0 rounded-full"
                style={{ backgroundColor: stat.color }}
              />
              <span
                className="text-[16px] font-extralight text-[#121212]"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                -{stat.label}{" "}
                <span className="font-semibold">{stat.pct}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Mic button - frosted glass */}
      <div className="mx-auto mt-8 flex items-center justify-center">
        <div className="flex h-[150px] w-[135px] items-center justify-center rounded-[296px] bg-[#F8F6F1] shadow-[0px_8px_40px_0px_rgba(0,0,0,0.12)]">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#121212" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="2" width="6" height="12" rx="3" />
            <path d="M5 10a7 7 0 0014 0" />
            <path d="M12 18v4M8 22h8" />
          </svg>
        </div>
      </div>

      {/* Page dots */}
      <div className="mt-auto">
        <PageControl current={3} total={5} />
      </div>
    </div>
  );
}
