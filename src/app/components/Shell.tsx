"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { NavBar } from "./NavBar";

const hideNav = ["/signup", "/quiz", "/quiz/analyzing", "/quiz/result", "/onboarding"];

export default function Shell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const showNav = !hideNav.includes(pathname);

  return (
    <div className="relative min-h-dvh">
      <main className="min-w-0">{children}</main>
      {showNav && <NavBar />}
    </div>
  );
}
