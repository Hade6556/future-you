"use client";

import Image from "next/image";

type OrbImageProps = {
  size?: number;
  className?: string;
  alt?: string;
};

export function OrbImage({
  size = 120,
  className = "",
  alt = "Behavio mascot",
}: OrbImageProps) {
  return (
    <Image
      src="/orb.png"
      alt={alt}
      width={size}
      height={size}
      className={`object-contain ${className}`}
      priority
    />
  );
}
