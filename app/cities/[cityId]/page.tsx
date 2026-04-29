import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { BrandLockup } from "@/components/brand/brand-lockup"
import { MalagaCenterMap } from "@/components/map/malaga-center-map"
import { getCityById, timelessCities } from "@/data/cities"
import type { Metadata } from "next"

interface CityPageProps {
  params: Promise<{ cityId: string }>
}

export function generateStaticParams() {
  return timelessCities
    .filter((city) => city.status === "available")
    .map((city) => ({ cityId: city.id }))
}

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const { cityId } = await params
  const city = getCityById(cityId)

  if (!city || city.status !== "available") {
    return { title: "Ciudad no disponible — Timeless" }
  }

  return {
    title: `${city.name} — Timeless`,
    description: city.description,
  }
}

export default async function CityPage({ params }: CityPageProps) {
  const { cityId } = await params
  const city = getCityById(cityId)

  if (!city || city.status !== "available") notFound()

  if (city.id !== "malaga") notFound()

  return (
    <main className="relative min-h-dvh overflow-x-hidden bg-[#f3eadb] text-foreground">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(218,178,110,0.24),transparent_34%),linear-gradient(180deg,#f8f0e3_0%,#efe2cf_48%,#e5d2b9_100%)]" />
        <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-white/45 to-transparent" />
      </div>

      <header className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 pt-5 pb-3 sm:px-6 sm:pt-8 sm:pb-5">
        <Link
          href="/"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/70 bg-background/68 text-foreground shadow-sm backdrop-blur-md transition-transform active:scale-[0.98]"
          aria-label="Volver al atlas de ciudades"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>

        <BrandLockup />

        <div className="h-10 w-10" aria-hidden="true" />
      </header>

      <section className="mx-auto max-w-5xl px-4 pb-1 text-center sm:px-6 sm:pb-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-accent">
          {city.country} · {city.regionLabel}
        </p>
        <h1 className="mt-2 font-serif text-[2.15rem] font-light leading-none tracking-[-0.05em] text-foreground sm:text-5xl">
          {city.name}
        </h1>
      </section>

      <div className="px-4 sm:px-6">
        <MalagaCenterMap />
      </div>

      <footer className="px-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
        <p className="text-center font-sans text-[10px] uppercase tracking-[0.15em] text-[#7b6a58]/55">
          Carretería · Atarazanas · Teatro Romano
        </p>
      </footer>
    </main>
  )
}
