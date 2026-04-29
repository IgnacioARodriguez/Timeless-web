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
        <div className="absolute inset-0 bg-gradient-to-t from-[#211812]/88 via-[#211812]/36 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,244,220,0.28),transparent_34%)]" />
      </div>
    )
  }

  return (
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_12%,rgba(229,190,121,0.38),transparent_30%),linear-gradient(135deg,#d9c7aa_0%,#8f7658_48%,#33241a_100%)]">
      <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(90deg,rgba(255,255,255,.22)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,.18)_1px,transparent_1px)] [background-size:28px_28px]" />
      <div className="absolute left-5 top-5 h-20 w-20 rounded-full border border-white/20" />
      <div className="absolute bottom-6 right-6 h-28 w-28 rounded-full border border-white/10" />
    </div>
  )
}

function CityCard({ city, index }: { city: TimelessCity; index: number }) {
  const isAvailable = city.status === "available"

  const cardContent = (
    <article
      className={cn(
        "group relative overflow-hidden rounded-[2rem] border shadow-[0_24px_80px_rgba(61,45,28,0.16)] transition-transform duration-200",
        isAvailable
          ? "border-white/70 bg-[#211812] active:scale-[0.99] sm:hover:-translate-y-0.5"
          : "border-white/55 bg-background/62 opacity-82",
      )}
    >
      <div className="relative h-[20rem] sm:h-[24rem]">
        <CityCover city={city} />

        <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-3 p-5">
          <span
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] backdrop-blur-md",
              isAvailable
                ? "border-white/25 bg-white/12 text-white"
                : "border-white/25 bg-black/15 text-white/80",
            )}
          >
            {isAvailable ? <Sparkles className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
          </span>

        </div>

        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">

          <h2 className="text-center font-serif text-4xl font-light leading-none tracking-[-0.04em] text-white sm:text-left sm:text-5xl">
            {city.name}
          </h2>

          <p className="mx-auto mt-4 max-w-sm text-center text-sm leading-relaxed text-white/78 sm:mx-0 sm:text-left">
            {city.description}
          </p>

          <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
            {city.highlights.map((highlight) => (
              <span
                key={highlight}
                className="rounded-full border border-white/18 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/80 backdrop-blur-md"
              >
                {highlight}
              </span>
            ))}
          </div>

          <div className="mt-5">
            {isAvailable ? (
              <div className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-[#211812] shadow-lg shadow-black/20 sm:w-auto">
                Explorar {city.name}
                <ArrowRight className="h-4 w-4" />
              </div>
            ) : (
              <div className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/22 bg-white/8 px-5 py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-white/70 backdrop-blur-md sm:w-auto">
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
      <Link href={city.href} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-background">
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {timelessCities.map((city, index) => (
          <CityCard key={city.id} city={city} index={index} />
        ))}
      </div>
    </section>
  )
}
