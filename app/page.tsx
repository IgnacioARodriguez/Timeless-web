"use client"

import { LanguageSwitch } from "@/components/i18n/language-switch"
import { MalagaCenterMap } from "@/components/map/malaga-center-map"

export default function HomePage() {
  return (
    <main className="timeless-app-viewport bg-[#ded2bf]">
      <MalagaCenterMap fullscreen />

      <LanguageSwitch className="absolute bottom-4 left-1/2 z-30 -translate-x-1/2 bg-[#f8efe1]/92 shadow-[0_10px_30px_rgba(42,29,18,0.14)] sm:bottom-auto sm:left-auto sm:right-4 sm:top-4 sm:translate-x-0" />
    </main>
  )
}
