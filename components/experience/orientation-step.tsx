"use client"

import Image from "next/image"
import type { Scene } from "@/types/scene"
import { useLanguage } from "@/components/i18n/language-provider"

interface OrientationStepProps {
  scene: Scene
  onContinue: () => void
}

export function OrientationStep({ scene, onContinue }: OrientationStepProps) {
  const { t } = useLanguage()

  return (
    <div className="absolute inset-0 flex flex-col overflow-y-auto bg-foreground text-background">
      <div className="absolute inset-0 z-0">
        <Image
          src={scene.poster}
          alt={scene.title}
          fill
          className="object-cover opacity-20"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/85 via-foreground/80 to-foreground/95" />
      </div>

      <div className="relative z-10 flex min-h-full flex-col px-6 py-16">
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-7">
          <div className="flex h-28 w-28 items-center justify-center rounded-3xl border border-current/10 bg-background/10 text-5xl">
            ↔️
          </div>
          <div className="max-w-xs">
            <p className="text-[10px] tracking-[0.25em] uppercase text-accent font-sans mb-3">
              {t("rotatePhoneTitle")}
            </p>
            <h1 className="font-serif font-light text-3xl leading-tight text-balance text-background">
              {t("rotatePhoneMessage")}
            </h1>
          </div>
          <button
            type="button"
            onClick={onContinue}
            className="w-full max-w-xs bg-background text-foreground font-sans text-xs tracking-[0.2em] uppercase py-4 rounded-xl transition duration-200 active:opacity-70"
          >
            {t("rotatePhoneAction")}
          </button>
        </div>
      </div>
    </div>
  )
}
