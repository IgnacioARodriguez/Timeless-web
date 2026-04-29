"use client"

import { useMemo, useState, type MouseEvent } from "react"
import Link from "next/link"
import { ArrowRight, Clock, Lock, MapPin, Navigation, Route } from "lucide-react"
import { malagaCenterPois } from "@/data/malaga-pois"
import type { MapPoi } from "@/types/poi"
import { cn } from "@/lib/utils"

function PoiMarker({
  poi,
  selected,
  onSelect,
}: {
  poi: MapPoi
  selected: boolean
  onSelect: (poi: MapPoi) => void
}) {
  const isAvailable = poi.status === "available"

  return (
    <button
      type="button"
      onClick={() => onSelect(poi)}
      className="absolute -translate-x-1/2 -translate-y-1/2 group rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      style={{ left: `${poi.mapPosition.x}%`, top: `${poi.mapPosition.y}%` }}
      aria-label={`Seleccionar ${poi.title}`}
    >
      <span
        className={cn(
          "relative grid place-items-center rounded-full border shadow-lg transition-all duration-200",
          selected
            ? "h-10 w-10 scale-110 sm:h-12 sm:w-12"
            : "h-8 w-8 group-hover:scale-105 sm:h-10 sm:w-10",
          isAvailable
            ? "border-accent/20 bg-accent text-accent-foreground shadow-accent/25"
            : "border-border bg-background/90 text-muted-foreground backdrop-blur-sm",
        )}
      >
        {isAvailable ? (
          <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
        ) : (
          <Lock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        )}

        {isAvailable && (
          <span className="absolute inset-0 rounded-full border border-accent opacity-25 animate-ping" />
        )}
      </span>

      <span
        className={cn(
          "absolute left-1/2 top-[calc(100%+0.35rem)] z-20 -translate-x-1/2 whitespace-nowrap rounded-full px-2.5 py-1 text-[8.5px] font-semibold tracking-wide shadow-sm transition-opacity sm:text-[10px]",
          selected ? "opacity-100" : "opacity-0 group-hover:opacity-100",
          isAvailable
            ? "bg-foreground text-background"
            : "border border-border bg-background/95 text-muted-foreground",
        )}
      >
        {poi.title}
      </span>
    </button>
  )
}

function MapText({
  children,
  x,
  y,
  rotate,
  emphasis = false,
}: {
  children: string
  x: number
  y: number
  rotate?: number
  emphasis?: boolean
}) {
  return (
    <text
      x={x}
      y={y}
      transform={rotate ? `rotate(${rotate} ${x} ${y})` : undefined}
      textAnchor="middle"
      className={cn(
        "select-none font-sans uppercase tracking-[0.18em]",
        emphasis ? "fill-foreground/55 text-[2.6px]" : "fill-foreground/35 text-[2.2px]",
      )}
    >
      {children}
    </text>
  )
}

function getGoogleMapsDirectionsUrl(poi: MapPoi) {
  if (!poi.directions) return undefined

  const { latitude, longitude } = poi.directions
  return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=walking`
}

function getAppleMapsDirectionsUrl(poi: MapPoi) {
  if (!poi.directions) return undefined

  const { latitude, longitude, label } = poi.directions
  return `https://maps.apple.com/?daddr=${latitude},${longitude}&q=${encodeURIComponent(label)}&dirflg=w`
}

function shouldPreferAppleMaps() {
  if (typeof navigator === "undefined") return false

  const userAgent = navigator.userAgent || ""
  const platform = navigator.platform || ""
  const isIOS = /iPad|iPhone|iPod/.test(userAgent)
  const isTouchMac = platform === "MacIntel" && navigator.maxTouchPoints > 1

  return isIOS || isTouchMac
}

function openNativeDirections(event: MouseEvent<HTMLAnchorElement>, poi: MapPoi) {
  if (!shouldPreferAppleMaps()) return

  const appleMapsUrl = getAppleMapsDirectionsUrl(poi)
  if (!appleMapsUrl) return

  event.preventDefault()
  window.open(appleMapsUrl, "_blank", "noopener,noreferrer")
}

export function MalagaCenterMap() {
  const initialPoi = useMemo(
    () => malagaCenterPois.find((poi) => poi.status === "available") ?? malagaCenterPois[0],
    [],
  )

  const [selectedPoi, setSelectedPoi] = useState<MapPoi>(initialPoi)

  const availableCount = malagaCenterPois.filter((poi) => poi.status === "available").length

  return (
    <section className="mx-auto mt-4 w-full max-w-5xl pb-6 sm:mt-6 sm:pb-10">
      <div className="mb-3 rounded-[1.5rem] border border-white/70 bg-background/62 p-3 text-center shadow-[0_14px_45px_rgba(61,45,28,0.08)] backdrop-blur-xl sm:mb-4 sm:p-5 sm:text-left">
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.22em] text-accent/90 sm:text-[10px]">
              Mapa de experiencias
            </p>

            <h2 className="text-balance text-2xl font-semibold leading-tight tracking-[-0.04em] text-foreground sm:text-3xl">
              Centro histórico de Málaga
            </h2>

            <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-muted-foreground sm:mx-0 sm:text-sm">
              Selecciona una escena, entra al visor 180° o abre la ruta hasta el punto exacto de activación.
            </p>
          </div>

          <div className="inline-flex shrink-0 rounded-full border border-accent/15 bg-accent/8 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-accent shadow-sm sm:text-[10px]">
            {availableCount} escenas activas
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-background/70 p-1.5 shadow-[0_26px_90px_rgba(61,45,28,0.16)] backdrop-blur-xl sm:rounded-[2.3rem] sm:p-2">
        <div className="relative h-[clamp(360px,52dvh,560px)] overflow-hidden rounded-[1.55rem] border border-white/50 bg-[linear-gradient(180deg,rgba(246,240,228,1),rgba(229,219,196,1))] sm:h-[620px] sm:rounded-[1.9rem] lg:h-[680px]">
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <filter id="map-paper-noise">
                <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
                <feColorMatrix type="saturate" values="0" />
                <feComponentTransfer>
                  <feFuncA type="table" tableValues="0 0.08" />
                </feComponentTransfer>
              </filter>
            </defs>

            <rect width="100" height="100" className="fill-[#efe5d2]" />
            <rect width="100" height="100" filter="url(#map-paper-noise)" opacity="0.42" />

            <path
              d="M0 0 C8 10, 4 21, 10 32 C15 43, 9 54, 14 66 C18 76, 12 88, 17 100 L0 100 Z"
              className="fill-[#d8e5dd]"
            />
            <path
              d="M8 -2 C15 12, 7 23, 13 36 C19 49, 12 61, 18 75 C23 88, 16 96, 20 103"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.9"
              strokeDasharray="2 3"
              className="text-foreground/18"
            />

            <path
              d="M12 78 C29 74, 43 76, 57 75 C74 74, 87 70, 100 65 L100 100 L13 100 C17 92, 18 84, 12 78 Z"
              className="fill-[#d7e3d2]"
            />
            <path
              d="M26 89 C44 85, 62 85, 82 80 C91 77, 96 75, 100 73 L100 100 L24 100 Z"
              className="fill-[#cfdedc]"
            />
            <path
              d="M11 76 C30 72, 46 74, 63 72 C79 70, 90 65, 99 61"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.2"
              className="text-background/80"
            />
            <path
              d="M11 76 C30 72, 46 74, 63 72 C79 70, 90 65, 99 61"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.9"
              className="text-foreground/22"
            />

            <path
              d="M19 38 C28 27, 43 24, 56 24 C69 25, 76 33, 78 45 C80 58, 72 68, 58 72 C44 76, 29 73, 20 66 C13 58, 13 47, 19 38 Z"
              className="fill-[#eadcc2] stroke-foreground/10"
              strokeWidth="0.5"
            />

            <path
              d="M72 18 C86 18, 98 27, 100 41 L100 63 C92 62, 84 58, 78 50 C70 39, 66 28, 72 18 Z"
              className="fill-[#d8cfab]"
            />
            <path
              d="M74 25 C84 28, 91 33, 97 42 M72 34 C83 37, 91 44, 99 53 M74 44 C83 48, 90 55, 97 63"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.65"
              className="text-foreground/15"
            />

            <path
              d="M20 38 C31 31, 43 29, 57 26 C62 25, 66 24, 71 23"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              className="text-background/80"
            />
            <path
              d="M20 38 C31 31, 43 29, 57 26 C62 25, 66 24, 71 23"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="text-accent/55"
            />

            <path
              d="M48 51 C49 58, 48 65, 45 74"
              fill="none"
              stroke="currentColor"
              strokeWidth="4.5"
              className="text-background/85"
            />
            <path
              d="M48 51 C49 58, 48 65, 45 74"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="text-foreground/25"
            />

            <path
              d="M25 67 C36 65, 48 64, 63 62 C76 60, 88 56, 99 51"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.6"
              className="text-background/80"
            />
            <path
              d="M25 67 C36 65, 48 64, 63 62 C76 60, 88 56, 99 51"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.75"
              className="text-foreground/17"
            />

            <path
              d="M52 55 C59 53, 64 50, 69 46 C72 43, 75 40, 78 37"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              className="text-background/75"
            />
            <path
              d="M27 42 C35 45, 43 48, 51 52 M30 59 C39 56, 47 54, 56 50 M40 31 C44 38, 47 45, 48 52 M57 28 C55 37, 55 45, 58 53 M63 32 C60 39, 60 46, 64 52 M31 68 C34 58, 37 48, 42 39 M22 52 C32 52, 42 51, 52 48"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.85"
              className="text-foreground/13"
            />

            <path d="M26 43 L34 39 L39 45 L31 49 Z" className="fill-background/35 stroke-foreground/8" strokeWidth="0.3" />
            <path d="M40 34 L49 31 L53 38 L44 41 Z" className="fill-background/32 stroke-foreground/8" strokeWidth="0.3" />
            <path d="M53 40 L61 37 L66 44 L58 48 Z" className="fill-background/30 stroke-foreground/8" strokeWidth="0.3" />
            <path d="M33 55 L42 52 L46 60 L36 63 Z" className="fill-background/32 stroke-foreground/8" strokeWidth="0.3" />
            <path d="M52 58 L62 55 L67 61 L56 65 Z" className="fill-background/30 stroke-foreground/8" strokeWidth="0.3" />
            <path d="M28 30 L36 27 L39 33 L31 36 Z" className="fill-background/25 stroke-foreground/8" strokeWidth="0.3" />

            <circle cx="48" cy="51" r="3.4" className="fill-background/65 stroke-foreground/15" strokeWidth="0.55" />
            <circle cx="66" cy="28" r="3.1" className="fill-background/50 stroke-foreground/12" strokeWidth="0.45" />
            <circle
              cx="69"
              cy="47"
              r="4.6"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.7"
              strokeDasharray="1.6 2.4"
              className="text-accent/45"
            />

            <MapText x={9} y={48} rotate={82}>
              Guadalmedina
            </MapText>
            <MapText x={47} y={78} rotate={-6} emphasis>
              Alameda Principal
            </MapText>
            <MapText x={47} y={63} rotate={98}>
              Calle Larios
            </MapText>
            <MapText x={44} y={35} rotate={-11} emphasis>
              Calle Carretería
            </MapText>
            <MapText x={86} y={35} rotate={34}>
              Alcazaba / Gibralfaro
            </MapText>
            <MapText x={72} y={88} rotate={-11}>
              Parque / Puerto
            </MapText>
          </svg>

          <div className="absolute left-3 top-3 max-w-[11.5rem] rounded-2xl border border-white/70 bg-background/78 px-3 py-2.5 shadow-sm backdrop-blur-md sm:left-5 sm:top-5 sm:max-w-[17rem] sm:px-4 sm:py-3">
            <div className="flex items-center gap-2 text-[11px] font-semibold text-foreground sm:text-xs">
              <Route className="h-3.5 w-3.5 text-accent sm:h-4 sm:w-4" />
              Puntos de activación
            </div>

            <p className="mt-1.5 hidden text-xs leading-relaxed text-muted-foreground sm:block">
              Los marcadores activos abren una escena 180° y la ruta para verla in situ.
            </p>
          </div>

          <div
            className="absolute bottom-3 right-3 z-20 grid h-10 w-10 place-items-center rounded-full border border-white/70 bg-background/80 text-accent shadow-md backdrop-blur-md sm:bottom-5 sm:right-5 sm:h-11 sm:w-11"
            aria-label="Norte arriba"
            title="Norte arriba"
          >
            <Navigation className="h-5 w-5 -rotate-45" />
          </div>

          {malagaCenterPois.map((poi) => (
            <PoiMarker key={poi.id} poi={poi} selected={selectedPoi.id === poi.id} onSelect={setSelectedPoi} />
          ))}
        </div>

        <div className="border-t border-white/65 bg-background/96 pb-6 pt-1.5 sm:pb-7 sm:pt-2">
          {selectedPoi.previewImage && (
            <div className="mb-6 w-full overflow-hidden rounded-[1.55rem] border border-white/50 bg-muted shadow-sm sm:rounded-[1.9rem]">
              <div className="relative aspect-[16/7] w-full sm:aspect-[21/8]">
                <img
                  src={selectedPoi.previewImage}
                  alt={`Vista previa de ${selectedPoi.title}`}
                  className="h-full w-full object-cover"
                  draggable={false}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent" />

                <div className="absolute bottom-3 left-3 rounded-full border border-white/30 bg-black/40 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-white shadow-sm backdrop-blur-md sm:bottom-4 sm:left-4">
                  Preview reconstrucción
                </div>
              </div>
            </div>
          )}

          <div className="mx-auto flex max-w-md flex-col items-center px-4 text-center sm:px-6">
            <h3 className="max-w-sm text-center font-sans text-[1.75rem] font-bold leading-tight tracking-[-0.04em] text-foreground sm:text-3xl">
              {selectedPoi.title}
            </h3>

            <span
              className={cn(
                "mt-3 inline-flex rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em]",
                selectedPoi.status === "available" ? "bg-accent/12 text-accent" : "bg-muted text-muted-foreground",
              )}
            >
              {selectedPoi.status === "available" ? "Escena activa" : "Próximamente"}
            </span>

            <p className="mt-4 max-w-xs font-sans text-[11px] font-bold uppercase leading-relaxed tracking-[0.2em] text-muted-foreground sm:max-w-sm">
              {selectedPoi.locationLabel}
              {selectedPoi.period ? ` · ${selectedPoi.period}` : ""}
            </p>

            <p className="mt-4 max-w-sm text-center font-sans text-sm leading-relaxed text-muted-foreground sm:text-base">
              {selectedPoi.shortDescription}
            </p>

            <div className="mt-6 flex w-full max-w-sm flex-col items-center gap-3">
              {selectedPoi.status === "available" && selectedPoi.sceneId ? (
                <>
                  <Link
                    href={`/scene/${selectedPoi.sceneId}`}
                    className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-foreground px-5 py-4 text-xs font-bold uppercase tracking-[0.18em] text-background shadow-md transition-transform active:scale-[0.98]"
                  >
                    Ver escena 180°
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  {selectedPoi.directions && (
                    <a
                      href={getGoogleMapsDirectionsUrl(selectedPoi)}
                      onClick={(event) => openNativeDirections(event, selectedPoi)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex w-full items-center justify-center gap-3 rounded-full border border-border bg-background px-5 py-4 text-xs font-bold uppercase tracking-[0.18em] text-foreground shadow-sm transition-transform active:scale-[0.98]"
                    >
                      Cómo llegar
                      <Navigation className="h-4 w-4 -rotate-45" />
                    </a>
                  )}
                </>
              ) : (
                <div className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-border bg-muted/60 px-5 py-4 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Escena no disponible
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}