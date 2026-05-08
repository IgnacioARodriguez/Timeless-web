"use client"

import { useLanguage } from "@/components/i18n/language-provider"

interface OpacitySliderProps {
  value: number
  onChange: (value: number) => void
}

export function OpacitySlider({ value, onChange }: OpacitySliderProps) {
  const { t } = useLanguage()

  return (
    <div className="flex items-center gap-3 w-full">
      {/* Ghost icon */}
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        aria-hidden="true"
        className="shrink-0 text-background/50"
      >
        <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="7" cy="7" r="3" fill="currentColor" opacity="0.4" />
      </svg>

      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="flex-1 appearance-none h-px bg-background/30 rounded-full outline-none
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:w-4
          [&::-webkit-slider-thumb]:h-4
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-background
          [&::-webkit-slider-thumb]:shadow-sm
          [&::-moz-range-thumb]:w-4
          [&::-moz-range-thumb]:h-4
          [&::-moz-range-thumb]:rounded-full
          [&::-moz-range-thumb]:bg-background
          [&::-moz-range-thumb]:border-0"
        aria-label={t("calibration")}
        aria-valuenow={Math.round(value * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
      />

      {/* Eye icon */}
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        aria-hidden="true"
        className="shrink-0 text-background"
      >
        <ellipse
          cx="7"
          cy="7"
          rx="5.5"
          ry="3.5"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        <circle cx="7" cy="7" r="1.8" fill="currentColor" />
      </svg>
    </div>
  )
}
