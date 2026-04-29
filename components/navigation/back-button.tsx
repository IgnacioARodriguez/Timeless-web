import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"

interface BackButtonProps {
  href?: string
  label?: string
  variant?: "light" | "dark"
  className?: string
  onClick?: () => void
}

export function BackButton({
  href,
  label = "Volver",
  variant = "light",
  className,
  onClick,
}: BackButtonProps) {
  const isDark = variant === "dark"

  const classes = cn(
    "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border shadow-sm backdrop-blur-md transition-transform active:scale-[0.98]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
    isDark
      ? "border-white/15 bg-black/35 text-white/82 shadow-black/20 focus-visible:ring-offset-black"
      : "border-white/70 bg-background/72 text-foreground shadow-black/5 focus-visible:ring-offset-background",
    className,
  )

  const icon = <ArrowLeft className="h-4 w-4" />

  if (href) {
    return (
      <Link href={href} aria-label={label} className={classes}>
        {icon}
      </Link>
    )
  }

  return (
    <button type="button" onClick={onClick} aria-label={label} className={classes}>
      {icon}
    </button>
  )
}
