import { notFound } from "next/navigation"
import { MalagaCenterMap } from "@/components/map/malaga-center-map"
import { BackButton } from "@/components/navigation/back-button"
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

      <BackButton
        href="/"
        label="Volver al atlas de ciudades"
        variant="light"
        className="absolute left-4 top-4 z-40 sm:left-6 sm:top-6"
      />

      <section className="mx-auto max-w-5xl px-4 pt-7 pb-1 text-center sm:px-6 sm:pt-9 sm:pb-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-accent">
          {city.country} · {city.regionLabel}
        </p>

        <h1 className="mt-2 font-serif text-[2.45rem] font-light leading-none tracking-[-0.055em] text-foreground sm:text-5xl">
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