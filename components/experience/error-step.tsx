"use client"

import { BrandLockup } from "@/components/brand/brand-lockup"
import { useLanguage } from "@/components/i18n/language-provider"

interface ErrorStepProps {
  message: string
  onRetry: () => void
}

export function ErrorStep({ message, onRetry }: ErrorStepProps) {
  const { t } = useLanguage()

  return (
    <div className="min-h-svh bg-background flex flex-col px-6">
      <header className="pt-10 pb-6">
        <BrandLockup variant="light" showByline={false} />
      </header>

      <div className="flex-1 flex flex-col justify-center pb-20">
        <p className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground font-sans mb-6">
          {t("somethingWrong")}
        </p>
        <h2 className="font-serif font-light text-3xl text-foreground mb-5 text-balance leading-snug">
          {t("unableContinue")}
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground text-pretty mb-10">
          {message}
        </p>

        <button
          onClick={onRetry}
          className="w-full bg-foreground text-background font-sans text-xs tracking-[0.2em] uppercase py-4 rounded-xl transition-opacity duration-200 active:opacity-70"
          aria-label={t("tryAgain")}
        >
          {t("tryAgain")}
        </button>
      </div>
    </div>
  )
}
