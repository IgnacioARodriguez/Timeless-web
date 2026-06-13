"use client"

import { BrandLockup } from "@/components/brand/brand-lockup"
import { LanguageSwitch } from "@/components/i18n/language-switch"
import { MalagaCenterMap } from "@/components/map/malaga-center-map"

export default function HomePage() {
  return (
    <main className="timeless-app-viewport bg-[#ded2bf]">
      <MalagaCenterMap fullscreen />

      <div className="pointer-events-none absolute left-1/2 top-4 z-30 hidden -translate-x-1/2 rounded-full border border-white/70 bg-[#f8efe1]/92 px-5 py-2 shadow-[0_12px_36px_rgba(42,29,18,0.16)] backdrop-blur-xl md:block">
        <BrandLockup variant="light" showByline={false} />
      </div>

      <LanguageSwitch className="absolute bottom-4 left-1/2 z-30 -translate-x-1/2 bg-[#f8efe1]/92 shadow-[0_10px_30px_rgba(42,29,18,0.14)] sm:bottom-auto sm:left-auto sm:right-4 sm:top-4 sm:translate-x-0" />
    </main>
  )
}
