import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface BadgeProps {
  children: ReactNode
  glow?: boolean
  className?: string
}

export function LandingBadge({ children, glow, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold tracking-wide text-primary",
        glow && "shadow-[0_0_20px_oklch(0.85_0.25_155/0.15)]",
        className
      )}
    >
      {children}
    </span>
  )
}
