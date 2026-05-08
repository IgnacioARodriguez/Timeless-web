 import { notFound } from "next/navigation"
import { getCityById, timelessCities } from "@/data/cities"
import { CityPageShell } from "@/components/cities/city-page-shell"
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

  return <CityPageShell city={city} />
}
