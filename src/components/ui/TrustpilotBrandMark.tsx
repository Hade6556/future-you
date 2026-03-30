"use client";

import Image from "next/image";

type TrustpilotBrandMarkProps = {
  className?: string;
  height?: number;
};

export function TrustpilotBrandMark({ className = "", height = 14 }: TrustpilotBrandMarkProps) {
  const width = Math.round((height * 512) / 126);

  return (
    <Image
      src="/brand/trustpilot-logo.svg"
      alt="Trustpilot"
      width={width}
      height={height}
      className={className}
      style={{ height, width: "auto" }}
    />
  );
}
