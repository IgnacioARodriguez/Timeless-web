import Link from "next/link"
import { ArrowRight, Lock, MapPin, Sparkles } from "lucide-react"
import { timelessCities } from "@/data/cities"
import type { TimelessCity } from "@/types/city"
import { cn } from "@/lib/utils"

function CityCover({ city }: { city: TimelessCity }) {
  if (city.coverImage) {
    return (
      <div className="absolute inset-0">
        <img
          src={city.coverImage}
          alt={`Vista previa de ${city.name}`}
          className="h-full w-full object-cover"
          draggable={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#211812]/88 via-[#211812]/34 to-[#211812]/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,244,220,0.22),transparent_32%)]" />
      </div>
    )
  }

  return (
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_12%,rgba(229,190,121,0.34),transparent_30%),linear-gradient(135deg,#d9c7aa_0%,#8f7658_52%,#33241a_100%)]">
      <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(90deg,rgba(255,255,255,.2)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,.16)_1px,transparent_1px)] [background-size:28px_28px]" />
      <div className="absolute left-5 top-5 h-16 w-16 rounded-full border border-white/16" />
      <div className="absolute bottom-5 right-5 h-24 w-24 rounded-full border border-white/10" />
    </div>
  )
}

function CityCard({ city, index }: { city: TimelessCity; index: number }) {
  const isAvailable = city.status === "available"

  const cardContent = (
    <article
      className={cn(
        "group relative overflow-hidden rounded-[1.75rem] border shadow-[0_18px_55px_rgba(61,45,28,0.14)] transition-transform duration-200 sm:rounded-[2rem]",
        isAvailable
          ? "border-white/70 bg-[#211812] active:scale-[0.99] sm:hover:-translate-y-0.5"
          : "border-white/55 bg-background/62 opacity-85",
      )}
    >
      <div className="relative h-[12rem] sm:h-[16.5rem] lg:h-[18rem]">
        <CityCover city={city} />

        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">

          <h2 className="text-center font-serif text-4xl font-light leading-none tracking-[-0.04em] text-white sm:text-left sm:text-[2.7rem]">
            {city.name}
          </h2>

          <p className="mx-auto mt-2 max-w-sm text-center text-xs leading-relaxed text-white/78 sm:mx-0 sm:text-left sm:text-sm">
            {city.description}
          </p>

          <div className="mt-3 hidden flex-wrap justify-center gap-2 sm:flex sm:justify-start">
            {city.highlights.map((highlight) => (
              <span
                key={highlight}
                className="rounded-full border border-white/18 bg-white/10 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-white/80 backdrop-blur-md"
              >
                {highlight}
              </span>
            ))}
          </div>

          <div className="mt-4">
            {isAvailable ? (
              <div className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-[11px] font-bold uppercase tracking-[0.16em] text-[#211812] shadow-lg shadow-black/20 sm:w-auto sm:px-5">
                Explorar {city.name}
                <ArrowRight className="h-4 w-4" />
              </div>
            ) : (
              <div className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/22 bg-white/8 px-5 py-3 text-[11px] font-bold uppercase tracking-[0.16em] text-white/70 backdrop-blur-md sm:w-auto sm:px-5">
                Próximamente
                <Lock className="h-4 w-4" />
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  )

  if (isAvailable && city.href) {
    return (
      <Link
        href={city.href}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-background"
      >
        {cardContent}
      </Link>
    )
  }

  return cardContent
}

export function CityAtlas() {
  const availableCount = timelessCities.filter((city) => city.status === "available").length

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-[calc(2rem+env(safe-area-inset-bottom))] sm:px-6 sm:pb-12">
      <div className="mb-5 flex flex-col items-center gap-3 text-center sm:mb-7 sm:flex-row sm:items-end sm:justify-between sm:text-left">
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.24em] text-accent">
            Atlas Timeless
          </p>
          <h1 className="font-serif text-[2.45rem] font-light leading-[0.98] tracking-[-0.05em] text-foreground sm:text-6xl">
            Elige una ciudad
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground sm:mx-0 sm:text-base">
            Cada ciudad reúne escenas históricas de 180° vinculadas a puntos reales de activación.
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        {timelessCities.map((city, index) => (
          <CityCard key={city.id} city={city} index={index} />
        ))}
      </div>
    </section>
  )
}
