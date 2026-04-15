"use client";

import dynamic from "next/dynamic";

// Disable SSR — driven by localStorage / Zustand; avoids hydration mismatch.
const RootGate = dynamic(() => import("./RootGate"), { ssr: false });

export default function Page() {
  return <RootGate />;
}
