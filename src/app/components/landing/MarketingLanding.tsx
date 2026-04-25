"use client";

import type { FunnelStatus } from "@/app/state/useFunnelResume";

import LandingNav from "./LandingNav";
import ResumeBanner from "./ResumeBanner";
import Hero from "./Hero";
import ArchetypePreview from "./ArchetypePreview";
import HowItWorks from "./HowItWorks";
import ComparisonTable from "./ComparisonTable";
import ProofStack from "./ProofStack";
import TrustStrip from "./TrustStrip";
import MiniFAQ from "./MiniFAQ";
import FinalCTA from "./FinalCTA";
import LandingFooter from "./LandingFooter";
import StickyCTABar from "./StickyCTABar";

interface MarketingLandingProps {
  status?: FunnelStatus;
  resumeHref?: string;
}

export default function MarketingLanding({
  status = "fresh",
  resumeHref = "/quiz",
}: MarketingLandingProps) {
  return (
    <div className="landing-root">
      <LandingNav />
      <ResumeBanner status={status} resumeHref={resumeHref} />
      <main>
        <Hero />
        <ArchetypePreview />
        <HowItWorks />
        <ComparisonTable />
        <ProofStack />
        <TrustStrip />
        <MiniFAQ />
        <FinalCTA />
      </main>
      <LandingFooter />
      <StickyCTABar />
    </div>
  );
}
