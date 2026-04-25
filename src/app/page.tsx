"use client";

import dynamic from "next/dynamic";

// Disable SSR — the landing reads localStorage (via planStore) to decide
// whether to render the marketing page or the home dashboard.
const LandingPage = dynamic(() => import("./components/landing/LandingPage"), {
  ssr: false,
});

export default function Page() {
  return <LandingPage />;
}
