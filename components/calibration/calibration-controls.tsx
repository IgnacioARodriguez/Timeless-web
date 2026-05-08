"use client"

import { OpacitySlider } from "@/components/calibration/opacity-slider"
import { useLanguage } from "@/components/i18n/language-provider"

interface CalibrationControlsProps {
  overlayOpacity: number
  onOpacityChange: (value: number) => void
  onReady: () => void
  isCapturing?: boolean
  hasOverlay?: boolean
}

export function CalibrationControls({
  overlayOpacity,
  onOpacityChange,
  onReady,
  isCapturing = false,
  hasOverlay = true,
}: CalibrationControlsProps) {
  const { t } = useLanguage()

  return (
    <div className="absolute bottom-0 left-0 right-0 z-20 px-5 pb-10 pt-6 flex flex-col gap-5 bg-gradient-to-t from-black/70 to-transparent">
      <p className="text-[11px] leading-relaxed text-background/70 font-sans tracking-wide text-center text-balance">
        {hasOverlay ? t("calibrationWithOverlay") : t("calibrationWithoutOverlay")}
      </p>

      {hasOverlay && <OpacitySlider value={overlayOpacity} onChange={onOpacityChange} />}

      <button
        onClick={onReady}
        disabled={isCapturing}
        className="w-full bg-background text-foreground font-sans text-xs tracking-[0.2em] uppercase py-4 rounded-xl disabled:opacity-40 transition-opacity duration-200 active:opacity-70"
        aria-label={t("ready")}
      >
        {isCapturing ? t("preparing") : t("ready")}
      </button>
    </div>
  )
}
