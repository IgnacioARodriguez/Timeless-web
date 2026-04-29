import Link from "next/link"
import { ArrowRight, Lock } from "lucide-react"
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
        <div className="absolute inset-0 bg-gradient-to-t from-[#211812]/88 via-[#211812]/38 to-[#211812]/8" />
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

function CityCard({ city }: { city: TimelessCity }) {
  const isAvailable = city.status === "available"

  const cardContent = (
    <article
      className={cn(
        "group relative overflow-hidden rounded-[1.55rem] border shadow-[0_16px_48px_rgba(61,45,28,0.13)] transition-transform duration-200 sm:rounded-[1.8rem]",
        isAvailable
          ? "border-white/70 bg-[#211812] active:scale-[0.99] sm:hover:-translate-y-0.5"
          : "border-white/55 bg-background/62 opacity-85",
      )}
    >
      <div className="relative h-[13.5rem] sm:h-[16.5rem] lg:h-[18rem]">
        <CityCover city={city} />

        <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-5">
          <div className="mb-auto flex items-center justify-between gap-3">
            <span
              className={cn(
                "rounded-full border px-3 py-1 text-[9px] font-bold uppercase tracking-[0.16em] backdrop-blur-md",
                isAvailable
                  ? "border-white/20 bg-white/12 text-white/82"
                  : "border-white/16 bg-white/8 text-white/62",
              )}
            >
              {isAvailable ? "Disponible" : "Próximamente"}
            </span>

            <span className="rounded-full border border-white/16 bg-white/10 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-white/72 backdrop-blur-md">
              {city.scenesCount} {city.scenesCount === 1 ? "escena" : "escenas"}
            </span>
          </div>

          <h2 className="text-center font-serif text-[2.75rem] font-light leading-none tracking-[-0.045em] text-white sm:text-left sm:text-[2.9rem]">
            {city.name}
          </h2>

          <p className="mx-auto mt-2 line-clamp-3 max-w-sm text-center text-xs leading-relaxed text-white/78 sm:mx-0 sm:text-left sm:text-sm">
            {city.description}
          </p>

          <div className="mt-3 hidden flex-wrap justify-center gap-2 sm:flex sm:justify-start">
            {city.highlights.slice(0, 3).map((highlight) => (
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
      <header className="mx-auto mb-7 flex w-full max-w-3xl flex-col items-center text-center sm:mb-9">
        <div className="flex flex-col items-center text-center">
          <p className="font-serif text-[2rem] font-light uppercase leading-none tracking-[0.28em] text-[#8A5A37] sm:text-[2.6rem]">
            Timeless
          </p>

          <div className="mt-2 h-px w-32 bg-gradient-to-r from-transparent via-[#B88954] to-transparent" />

          <p className="mt-3 font-sans text-[9px] font-semibold uppercase tracking-[0.28em] text-[#9B6139]/80 sm:text-[10px]">
            By Rocket Development
          </p>
        </div>

        <p className="mt-8 font-sans text-[10px] font-bold uppercase tracking-[0.26em] text-[#A6633A] sm:text-xs">
          Atlas Timeless
        </p>

        <h1 className="mt-4 max-w-[22rem] text-center font-serif text-[3rem] font-light leading-[0.95] tracking-[-0.055em] text-[#241811] sm:max-w-2xl sm:text-6xl">
          Elige una ciudad
        </h1>

        <p className="mt-5 max-w-[21rem] text-center font-sans text-base leading-relaxed text-[#6E5D4B] sm:max-w-xl sm:text-lg">
          Cada ciudad reúne escenas históricas de 180° vinculadas a puntos reales de activación.
        </p>

        <div className="mt-6 inline-flex rounded-full border border-[#B86B38]/20 bg-white/35 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#A6633A] shadow-sm backdrop-blur-sm">
          {availableCount} {availableCount === 1 ? "ciudad activa" : "ciudades activas"}
        </div>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        {timelessCities.map((city) => (
          <CityCard key={city.id} city={city} />
        ))}
      </div>
    </section>
  )
}