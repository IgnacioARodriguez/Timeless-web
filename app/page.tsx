import Image from "next/image"
import Link from "next/link"
import type { ReactNode } from "react"
import { BrandLockup } from "@/components/brand/brand-lockup"

const pilotScenes = [
  {
    title: "Muralla medieval de Calle Carretería",
    description:
      "Reconstrucción 180° de un sector de la muralla occidental medieval de Málaga.",
    href: "/scene/carreteria-almohade",
  },
  {
    title: "Atarazanas medievales",
    description:
      "Visualización del antiguo espacio marítimo y defensivo asociado a las Atarazanas.",
    href: "/scene/atarazanas-nazari",
  },
  {
    title: "Teatro Romano de Málaga",
    description:
      "Reconstrucción visual del teatro en época romana para facilitar su comprensión histórica.",
    href: "/scene/teatro-romano-malaca",
  },
]

const differentiators = [
  "No requiere app nativa.",
  "No requiere gafas VR.",
  "Funciona desde navegador móvil.",
  "Se adapta a rutas culturales.",
  "Es escalable por escenas y ciudades.",
  "Está pensado para patrimonio perdido, fragmentado o difícil de imaginar.",
]

const finalUsers = [
  "Turistas culturales",
  "Residentes",
  "Estudiantes",
  "Visitantes de centros históricos",
  "Guías turísticos",
]

const potentialClients = [
  "Ayuntamientos",
  "Museos",
  "Oficinas de turismo",
  "Fundaciones patrimoniales",
  "Empresas de visitas guiadas",
  "Instituciones educativas",
]

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#9a6a2c]">
      {children}
    </p>
  )
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="mt-3 font-serif text-3xl font-light leading-tight tracking-[-0.04em] text-[#241b12] sm:text-4xl">
      {children}
    </h2>
  )
}

export default function HomePage() {
  return (
    <main className="min-h-dvh overflow-x-hidden bg-[#f4eadb] text-[#241b12]">
      <header className="sticky top-0 z-40 border-b border-black/10 bg-[#f4eadb]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-6">
          <BrandLockup variant="light" showByline={false} />
          <nav className="hidden items-center gap-5 text-xs font-semibold uppercase tracking-[0.16em] text-[#5f4b37] sm:flex">
            <a href="#demo" className="hover:text-[#241b12]">
              Demo
            </a>
            <a href="#piloto-malaga" className="hover:text-[#241b12]">
              Piloto Málaga
            </a>
            <a href="#contacto" className="hover:text-[#241b12]">
              Contacto
            </a>
          </nav>
        </div>
      </header>

      <section className="relative border-b border-black/10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_10%,rgba(170,114,44,0.22),transparent_28%),linear-gradient(180deg,#f8efe1_0%,#f1e0c9_100%)]" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
          <div>
            <SectionLabel>Piloto cultural · Málaga</SectionLabel>
            <h1 className="mt-5 max-w-3xl font-serif text-5xl font-light leading-[0.95] tracking-[-0.065em] text-[#1f170f] sm:text-7xl">
              Ver el pasado desde el lugar real
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#5f4b37] sm:text-xl">
              Timeless convierte puntos históricos de la ciudad en experiencias
              inmersivas 180° accesibles desde el móvil, permitiendo visualizar
              cómo pudieron haber sido en una época concreta.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#demo"
                className="inline-flex items-center justify-center rounded-full bg-[#241b12] px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-[#f7ead6] transition-opacity active:opacity-75"
              >
                Ver demo
              </a>
              <a
                href="#piloto-malaga"
                className="inline-flex items-center justify-center rounded-full border border-[#241b12]/25 px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-[#241b12] transition-colors active:bg-black/5"
              >
                Conocer el piloto Málaga
              </a>
            </div>
            <div className="mt-8 grid gap-3 text-sm text-[#6d5841] sm:grid-cols-3">
              <div className="rounded-2xl border border-black/10 bg-white/30 p-4">
                <strong className="block text-[#241b12]">Qué es</strong>
                Visualización histórica 180° en el lugar real.
              </div>
              <div className="rounded-2xl border border-black/10 bg-white/30 p-4">
                <strong className="block text-[#241b12]">Para quién</strong>
                Visitantes, guías, instituciones y rutas culturales.
              </div>
              <div className="rounded-2xl border border-black/10 bg-white/30 p-4">
                <strong className="block text-[#241b12]">Diferencial</strong>
                No solo explica el patrimonio: permite verlo.
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-black/10 bg-[#1f170f] shadow-2xl shadow-black/15">
            <div className="relative aspect-[4/3]">
              <Image
                src="/assets/teatro-romano/panorama.png"
                alt="Vista previa de la experiencia 180° del Teatro Romano de Málaga"
                fill
                priority
                className="object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/15" />
              <div className="absolute bottom-5 left-5 right-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">
                  Demo disponible
                </p>
                <p className="mt-1 font-serif text-2xl font-light text-white">
                  Teatro Romano de Málaga
                </p>
                <Link
                  href="/scene/teatro-romano-malaca"
                  className="mt-7 inline-flex w-full items-center justify-center rounded-full bg-[#241b12] px-6 py-4 text-sm font-bold uppercase tracking-[0.16em] text-[#f7ead6] sm:w-auto"
                >
                  Abrir experiencia 180°
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-5 px-5 py-14 sm:px-6 lg:grid-cols-2">
        <article className="rounded-[1.75rem] border border-black/10 bg-white/35 p-6 sm:p-8">
          <SectionLabel>Problema</SectionLabel>
          <SectionTitle>El patrimonio no siempre se entiende a simple vista.</SectionTitle>
          <p className="mt-5 text-base leading-8 text-[#5f4b37]">
            Muchos visitantes recorren restos arqueológicos, murallas, edificios
            transformados o espacios históricos parcialmente desaparecidos sin
            poder imaginar cómo eran originalmente ni qué papel tuvieron dentro
            de la ciudad. La información existe, pero la experiencia visual
            suele limitarse a carteles, audioguías o explicaciones abstractas.
          </p>
        </article>

        <article className="rounded-[1.75rem] border border-black/10 bg-[#241b12] p-6 text-[#f7ead6] sm:p-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#d7aa67]">
            Solución
          </p>
          <h2 className="mt-3 font-serif text-3xl font-light leading-tight tracking-[-0.04em] sm:text-4xl">
            Una reconstrucción inmersiva asociada a un punto real de la ciudad.
          </h2>
          <p className="mt-5 text-base leading-8 text-[#f7ead6]/75">
            Timeless permite acceder desde el móvil a una reconstrucción
            histórica inmersiva asociada a un punto real de la ciudad. La
            experiencia ayuda al visitante a comprender el patrimonio de forma
            visual, directa y contextualizada, sin necesidad de instalar una app
            ni utilizar gafas VR.
          </p>
        </article>
      </section>

      <section id="demo" className="border-y border-black/10 bg-[#ead8bf]">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-14 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <SectionLabel>Demo visible</SectionLabel>
            <SectionTitle>Abrí una experiencia 180° ahora.</SectionTitle>
            <p className="mt-5 text-base leading-8 text-[#5f4b37]">
              La demo muestra el flujo real del prototipo: entrada desde móvil,
              permisos de cámara y movimiento, alineación y visualización
              inmersiva de la escena histórica.
            </p>
            <Link
              href="/scene/carreteria-almohade"
              className="mt-7 inline-flex w-full items-center justify-center rounded-full bg-[#241b12] px-6 py-4 text-sm font-bold uppercase tracking-[0.16em] text-[#f7ead6] sm:w-auto"
            >
              Abrir experiencia 180°
            </Link>
          </div>
          <div className="overflow-hidden rounded-[2rem] border border-black/10 bg-black">
            <Image
              src="/assets/teatro-romano/panorama.png"
              alt="Captura de la reconstrucción del Teatro Romano de Málaga"
              width={1200}
              height={760}
              className="h-auto w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section id="piloto-malaga" className="mx-auto max-w-6xl px-5 py-14 sm:px-6">
        <SectionLabel>Caso piloto Málaga</SectionLabel>
        <SectionTitle>Tres escenas para demostrar valor cultural real.</SectionTitle>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {pilotScenes.map((scene) => (
            <Link
              key={scene.title}
              href={scene.href}
              className="group rounded-[1.5rem] border border-black/10 bg-white/35 p-5 transition-colors hover:bg-white/55"
            >
              <h3 className="font-serif text-2xl font-light leading-tight tracking-[-0.03em] text-[#241b12]">
                {scene.title}
              </h3>
              <p className="mt-4 text-sm leading-7 text-[#5f4b37]">
                {scene.description}
              </p>
              <span className="mt-5 inline-flex text-xs font-bold uppercase tracking-[0.16em] text-[#9a6a2c]">
                Ver escena
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-[#241b12] text-[#f7ead6]">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#d7aa67]">
            Diferencial
          </p>
          <h2 className="mt-3 max-w-4xl font-serif text-3xl font-light leading-tight tracking-[-0.04em] sm:text-5xl">
            A diferencia de una audioguía, una app cultural o una visita virtual
            tradicional, Timeless no solo explica el patrimonio: permite verlo
            desde el lugar real.
          </h2>
          <div className="mt-8 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {differentiators.map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-[#f7ead6]/80">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-5 py-14 sm:px-6 lg:grid-cols-2">
        <article>
          <SectionLabel>Tecnología</SectionLabel>
          <SectionTitle>Web mobile-first con visualización 180°.</SectionTitle>
          <p className="mt-5 text-base leading-8 text-[#5f4b37]">
            Timeless utiliza una arquitectura web mobile-first basada en React /
            Next.js y visualización inmersiva con Three.js / WebGL. El prototipo
            permite mostrar escenas históricas en formato 180° monoscópico
            equirectangular desde navegador móvil.
          </p>
        </article>

        <article className="rounded-[1.75rem] border border-black/10 bg-white/35 p-6 sm:p-8">
          <SectionLabel>Modelo de negocio</SectionLabel>
          <SectionTitle>B2B/B2G para rutas, instituciones y patrimonio.</SectionTitle>
          <p className="mt-5 text-base leading-8 text-[#5f4b37]">
            Timeless plantea un modelo B2B/B2G basado en pilotos por punto
            histórico, paquetes de rutas inmersivas y licencias anuales de
            mantenimiento, soporte y actualización de contenidos.
          </p>
        </article>
      </section>

      <section className="border-y border-black/10 bg-[#ead8bf]">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 py-14 sm:px-6 lg:grid-cols-2">
          <article className="rounded-[1.75rem] border border-black/10 bg-white/35 p-6 sm:p-8">
            <SectionLabel>Usuarios finales</SectionLabel>
            <ul className="mt-5 grid gap-3 text-base text-[#5f4b37]">
              {finalUsers.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </article>
          <article className="rounded-[1.75rem] border border-black/10 bg-white/35 p-6 sm:p-8">
            <SectionLabel>Clientes potenciales</SectionLabel>
            <ul className="mt-5 grid gap-3 text-base text-[#5f4b37]">
              {potentialClients.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section id="contacto" className="mx-auto max-w-6xl px-5 py-14 sm:px-6">
        <div className="rounded-[2rem] border border-black/10 bg-[#241b12] p-6 text-[#f7ead6] sm:p-8 lg:p-10">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#d7aa67]">
            Contacto
          </p>
          <h2 className="mt-3 font-serif text-4xl font-light leading-tight tracking-[-0.04em] sm:text-5xl">
            Timeless permite ver el pasado desde el lugar real.
          </h2>
          <div className="mt-8 grid gap-6 text-sm leading-7 text-[#f7ead6]/75 md:grid-cols-2">
            <div>
              <p className="text-lg text-[#f7ead6]">Ignacio Rodríguez</p>
              <p>Founder & Product Lead</p>
              <p>Timeless</p>
              <p>Málaga, España</p>
            </div>
            <div className="grid content-start gap-3">
              <a href="mailto:igrodriguez.ar@gmail.com" className="underline underline-offset-4">
                igrodriguez.ar@gmail.com
              </a>
              <a
                href="https://www.linkedin.com/in/ignacio-a-rodriguez/"
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-4"
              >
                linkedin.com/in/ignacio-a-rodriguez
              </a>
              <Link href="/cities/malaga" className="underline underline-offset-4">
                Ver mapa del piloto Málaga
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
