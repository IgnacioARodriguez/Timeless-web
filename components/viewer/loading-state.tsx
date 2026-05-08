"use client"

import { useLanguage } from "@/components/i18n/language-provider"

export function LoadingState() {
  const { t } = useLanguage()

  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black">
      {/* Minimal spinner */}
      <div
        className="w-8 h-8 rounded-full border border-white/20 border-t-white/80 mb-6"
        aria-hidden="true"
      />
      <p className="text-[10px] tracking-[0.25em] uppercase text-white/40 font-sans">
        {t("preparingExperience")}
      </p>
    </div>
  )
}
