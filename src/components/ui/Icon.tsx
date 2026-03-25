"use client"

import Image from "next/image"
import { ICON_REGISTRY, type IconName } from "./icons"
import { cn } from "@/lib/utils"

export type { IconName }

interface IconProps {
  /** Icon identifier, e.g. "healthtech/icon_042" */
  name: IconName
  /** Size in pixels (applied to both width and height). Default: 24 */
  size?: number
  /** Additional CSS classes */
  className?: string
  /** Alt text for accessibility */
  alt?: string
}

/**
 * Renders a Freud design-kit SVG icon from the public/icons directory.
 *
 * Usage:
 *   <Icon name="healthtech/icon_042" size={32} />
 *   <Icon name="arrows-directions/icon_010" className="opacity-50" />
 */
export function Icon({ name, size = 24, className, alt }: IconProps) {
  const entry = ICON_REGISTRY[name]
  if (!entry) {
    console.warn(`[Icon] Unknown icon: "${name}"`)
    return null
  }

  return (
    <Image
      src={`/${entry.file}`}
      width={size}
      height={size}
      alt={alt ?? name.split("/").pop()?.replace(/_/g, " ") ?? name}
      className={cn("inline-block shrink-0", className)}
      // Unoptimised so Next.js serves the SVG as-is (no rasterisation)
      unoptimized
    />
  )
}
