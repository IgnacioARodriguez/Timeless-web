import { BrandLockup } from "@/components/brand/brand-lockup"
import { MalagaCenterMap } from "@/components/map/malaga-center-map"

export default function HomePage() {
  return (
    <main className="min-h-svh bg-background">
      <header className="px-4 pt-6 pb-4 sm:px-6 sm:pt-10 sm:pb-6">
        <BrandLockup variant="light" showByline />
      </header>

      <section className="px-4 pb-5 sm:px-6 sm:pt-2 sm:pb-8">
        <p className="mb-4 font-sans text-[10px] uppercase tracking-[0.24em] text-accent sm:mb-6 sm:text-xs">
          Historical Immersive Experiences
        </p>
        <h1 className="mb-4 max-w-xl text-balance font-serif text-3xl font-light leading-[1.12] text-foreground sm:mb-6 sm:text-5xl">
          Elige un punto.<br />
          Entra en su pasado.
        </h1>
        <p className="max-w-md text-pretty font-sans text-sm leading-relaxed text-muted-foreground sm:text-base">
          Explora el centro histórico de Málaga desde un mapa interactivo. Cada punto abre una reconstrucción inmersiva de 180° vinculada a un lugar concreto.
        </p>
      </section>

      <MalagaCenterMap />

      <footer className="px-6 pb-8">
        <p className="text-center font-sans text-[10px] uppercase tracking-[0.15em] text-muted-foreground/50">
          Experiencias disponibles: Carretería, Atarazanas y Teatro Romano
        </p>
      </footer>
    </main>
  )
}
