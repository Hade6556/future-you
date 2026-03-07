"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Home", icon: HomeIcon },
  { href: "/tasks", label: "Tasks", icon: TasksIcon },
  { href: "/events", label: "Events", icon: EventsIcon },
  { href: "/structure", label: "Structure", icon: StructureIcon },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-4 left-6 right-6 z-40 mx-auto max-w-sm">
      <div className="flex items-stretch rounded-[80px] bg-[#121212] px-2">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex min-w-[112px] flex-1 flex-col items-center justify-center gap-1 pb-4 pt-3"
            >
              <div
                className={`flex h-8 w-16 items-center justify-center overflow-hidden rounded-full ${
                  active ? "bg-white/10" : ""
                }`}
              >
                <item.icon />
              </div>
              <span
                className={`text-xs tracking-wide ${
                  active ? "font-semibold text-white" : "font-medium text-white/70"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function HomeIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
      <path d="M9 21V12h6v9" />
    </svg>
  );
}

function TasksIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function EventsIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 2v4M7 2v4" />
      <rect x="3" y="4" width="18" height="17" rx="3" />
      <path d="M3 9h18" />
    </svg>
  );
}

function StructureIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}
