"use client"

import { useLanguage, type Language } from "@/components/i18n/language-provider"
import { cn } from "@/lib/utils"

interface LanguageSwitchProps {
  variant?: "light" | "dark"
  className?: string
}

export function LanguageSwitch({ variant = "light", className }: LanguageSwitchProps) {
  const { language, setLanguage, t } = useLanguage()
  const isDark = variant === "dark"

  const base = isDark
    ? "border-white/15 bg-black/35 text-white/75"
    : "border-black/10 bg-white/35 text-[#5f4b37]"

  return (
    <div
      className={cn("inline-flex items-center rounded-full border p-1 text-[10px] font-bold uppercase tracking-[0.16em] backdrop-blur-md", base, className)}
      aria-label={t("languageLabel")}
    >
      {(["es", "en"] as Language[]).map((option) => {
        const active = language === option
        return (
          <button
            key={option}
            type="button"
            onClick={() => setLanguage(option)}
            className={cn(
              "rounded-full px-2.5 py-1 transition-colors active:opacity-70",
              active
                ? isDark
                  ? "bg-white text-black"
                  : "bg-[#241b12] text-[#f7ead6]"
                : "opacity-70 hover:opacity-100",
            )}
            aria-pressed={active}
          >
            {option.toUpperCase()}
          </button>
        )
      })}
    </div>
  )
}
