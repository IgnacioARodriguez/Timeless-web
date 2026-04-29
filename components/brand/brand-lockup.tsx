import { cn } from "@/lib/utils"

interface BrandLockupProps {
  className?: string
  /** Whether to render the secondary "by Rocket Development" line */
  showByline?: boolean
  /** Light variant for dark backgrounds */
  variant?: "dark" | "light"
}

export function BrandLockup({
  className,
  showByline = true,
  variant = "dark",
}: BrandLockupProps) {
  const isLight = variant === "light"

  return (
    <div className={cn("flex flex-col gap-0.5", className)}>
      <span
        className={cn(
          "font-serif text-2xl font-light tracking-[0.12em] uppercase",
          isLight ? "text-foreground" : "text-background"
        )}
      >
        Timeless
      </span>
      {showByline && (
        <span
          className={cn(
            "text-[10px] tracking-[0.2em] uppercase font-sans",
            isLight
              ? "text-muted-foreground"
              : "text-background/50"
          )}
        >
          by Rocket Development
        </span>
      )}
    </div>
  )
}
