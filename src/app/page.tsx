"use client";

import dynamic from "next/dynamic";

// Disable SSR — this page is 100% driven by localStorage/Zustand state.
// SSR would always render the "new visitor" state and cause a hydration mismatch.
const HomeClient = dynamic(() => import("./HomeClient"), { ssr: false });

export default function Page() {
  return <HomeClient />;
}
