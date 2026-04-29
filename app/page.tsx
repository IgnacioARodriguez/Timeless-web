import { BrandLockup } from "@/components/brand/brand-lockup"
import { MalagaCenterMap } from "@/components/map/malaga-center-map"

export default function HomePage() {
  return (
    <main className="relative min-h-dvh overflow-x-hidden bg-[#f3ecdf] text-foreground">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_15%_0%,rgba(181,95,45,0.18),transparent_34%),radial-gradient(circle_at_92%_12%,rgba(75,96,72,0.16),transparent_32%),linear-gradient(180deg,#f8f3ea_0%,#eee1cf_56%,#e5d4bc_100%)]" />
      <div className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-32 bg-gradient-to-b from-background/80 to-transparent" />

      <div className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col px-3 py-3 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:px-6 sm:py-8 lg:px-8">
        <section className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-background/72 px-4 py-5 text-center shadow-[0_24px_90px_rgba(61,45,28,0.14)] backdrop-blur-xl sm:rounded-[2.5rem] sm:px-8 sm:py-9 lg:px-10">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.76),transparent_44%),radial-gradient(circle_at_50%_110%,rgba(181,95,45,0.10),transparent_45%)]" />

          <div className="relative mx-auto flex max-w-3xl flex-col items-center">
            <BrandLockup className="items-center" variant="light" showByline />

            <div className="mt-4 inline-flex items-center rounded-full border border-accent/18 bg-accent/8 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.22em] text-accent sm:mt-6 sm:text-[10px]">
              Historical immersive experiences
            </div>

            <h1 className="mt-4 max-w-2xl text-balance font-serif text-[2rem] font-light leading-[1.02] tracking-[-0.04em] text-foreground sm:mt-6 sm:text-5xl lg:text-6xl">
              Elige un lugar. Mira su pasado.
            </h1>

            <p className="mt-4 max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
              Explora Málaga centro desde puntos reales de activación. Cada escena abre una reconstrucción inmersiva de 180° vinculada al lugar donde estás.
            </p>
          </div>
        </section>

        <MalagaCenterMap />

        <footer className="px-4 pb-4 pt-2 sm:pt-4">
          <p className="text-center text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground/60">
            Carretería · Atarazanas · Teatro Romano
          </p>
        </footer>
      </div>
    </main>
  )
}
