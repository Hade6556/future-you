"use client"

import { useState, useMemo } from "react"
import { Icon } from "./Icon"
import {
  ICON_CATEGORIES,
  ICON_REGISTRY,
  type IconName,
  type IconCategory,
} from "./icons"
import { cn } from "@/lib/utils"

interface IconGalleryProps {
  /** Initial category filter */
  defaultCategory?: IconCategory | "all"
  /** Icon size to display in the gallery */
  iconSize?: number
}

/**
 * Browsable gallery of all extracted Freud design-kit icons.
 * Supports filtering by category and search by name.
 */
export function IconGallery({
  defaultCategory = "all",
  iconSize = 48,
}: IconGalleryProps) {
  const [category, setCategory] = useState<IconCategory | "all">(defaultCategory)
  const [search, setSearch] = useState("")
  const [copied, setCopied] = useState<string | null>(null)

  const allIcons = useMemo<IconName[]>(() => Object.keys(ICON_REGISTRY) as IconName[], [])

  const filtered = useMemo(() => {
    return allIcons.filter((name) => {
      const entry = ICON_REGISTRY[name]
      if (category !== "all" && entry.category !== category) return false
      if (search && !name.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [allIcons, category, search])

  const handleCopy = (name: string) => {
    navigator.clipboard.writeText(`<Icon name="${name}" size={24} />`)
    setCopied(name)
    setTimeout(() => setCopied(null), 1500)
  }

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: allIcons.length }
    for (const cat of ICON_CATEGORIES) {
      counts[cat] = allIcons.filter((n) => ICON_REGISTRY[n].category === cat).length
    }
    return counts
  }, [allIcons])

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold">Freud Icon Gallery</h2>
        <p className="text-sm text-muted-foreground">
          {filtered.length} of {allIcons.length} icons
        </p>
      </div>

      {/* Search */}
      <input
        type="search"
        placeholder="Search icons..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-sm rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
      />

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2">
        {(["all", ...ICON_CATEGORIES] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition-colors",
              category === cat
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/70"
            )}
          >
            {cat === "all" ? "All" : cat.replace(/-/g, " ")}
            <span className="ml-1 opacity-60">({categoryCounts[cat] ?? 0})</span>
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">No icons match your filter.</p>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-2">
          {filtered.slice(0, 500).map((name) => (
            <button
              key={name}
              title={`${name}\nClick to copy JSX`}
              onClick={() => handleCopy(name)}
              className={cn(
                "group relative flex flex-col items-center gap-1 rounded-xl border border-border p-2 transition-colors hover:bg-secondary",
                copied === name && "border-green-500 bg-green-50"
              )}
            >
              <Icon name={name} size={iconSize} />
              <span className="w-full truncate text-center text-[10px] text-muted-foreground">
                {name.split("/").pop()}
              </span>
              {copied === name && (
                <span className="absolute inset-0 flex items-center justify-center rounded-xl bg-green-100/90 text-[10px] font-medium text-green-700">
                  Copied!
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {filtered.length > 500 && (
        <p className="text-xs text-muted-foreground">
          Showing first 500 of {filtered.length} icons. Refine your search to see more.
        </p>
      )}
    </div>
  )
}
