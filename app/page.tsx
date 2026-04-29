import { BrandLockup } from "@/components/brand/brand-lockup"
import { CityAtlas } from "@/components/cities/city-atlas"

export default function HomePage() {
  return (
    <main className="relative min-h-dvh overflow-x-hidden bg-[#f3eadb] text-foreground">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(218,178,110,0.28),transparent_34%),linear-gradient(180deg,#f8f0e3_0%,#efe2cf_48%,#e5d2b9_100%)]" />
        <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-white/45 to-transparent" />
      </div>

      <header className="mx-auto max-w-6xl px-4 pt-6 pb-4 sm:px-6 sm:pt-10 sm:pb-7">
        <div className="flex justify-center sm:justify-start">
          <BrandLockup />
        </div>
      </header>

      <CityAtlas />
    </main>
  )
}
