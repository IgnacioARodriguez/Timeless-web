"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import {
  ArrowRight,
  Clock,
  LocateFixed,
  MapPin,
  Search,
  Sparkles,
  X,
} from "lucide-react"
import type { Map as MapLibreMap, Marker } from "maplibre-gl"
import { useLanguage } from "@/components/i18n/language-provider"
import { malagaCenterPois } from "@/data/malaga-pois"
import { getLocalizedPoi } from "@/lib/localized-city"
import { cn } from "@/lib/utils"
import { requestAppFullscreen } from "@/lib/app-fullscreen"
import type { MapPoi } from "@/types/poi"

const MALAGA_CENTER: [number, number] = [-4.4214, 36.7212]

interface MalagaCenterMapProps {
  embedded?: boolean
  fullscreen?: boolean
}

function getPoiCoordinates(poi: MapPoi): [number, number] {
  return [poi.coordinates.longitude, poi.coordinates.latitude]
}

function getPoiMarkerIcon(poiId: string) {
  const iconClass = "timeless-map-marker__icon"

  if (poiId === "muralla-carreteria") {
    return `
      <img
        class="${iconClass} timeless-map-marker__icon--carreteria"
        src="/assets/carreteria/poi-muralla.png"
        alt=""
        draggable="false"
      />
    `
  }

  if (poiId === "atarazanas") {
    return `
      <img
        class="${iconClass} timeless-map-marker__icon--landmark timeless-map-marker__icon--atarazanas"
        src="/assets/atarazanas/poi-atarazanas.png"
        alt=""
        draggable="false"
      />
    `
  }

  if (poiId === "teatro-romano") {
    return `
      <img
        class="${iconClass} timeless-map-marker__icon--landmark"
        src="/assets/teatro-romano/poi-teatro.png"
        alt=""
        draggable="false"
      />
    `
  }

  if (poiId === "calle-larios") {
    return `
      <img
        class="${iconClass} timeless-map-marker__icon--landmark timeless-map-marker__icon--larios"
        src="/assets/calle-larios/poi-calle-larios.png"
        alt=""
        draggable="false"
      />
    `
  }

  if (poiId === "plaza-merced") {
    return `
      <svg class="${iconClass}" viewBox="0 0 64 64" aria-hidden="true">
        <path class="poi-shadow" d="m12 45 20-12 20 12-20 12Z"/>
        <path class="poi-side" d="m16 43 16-9 16 9v8l-16 9-16-9Z"/>
        <path class="poi-top" d="m16 43 16-9 16 9-16 9Z"/>
        <path class="poi-front" d="m28 17 4-9 4 9v26l-4 3-4-3Z"/>
        <path class="poi-light" d="m28 17 4-9v38l-4-3Z"/>
        <path class="poi-accent" d="m24 39 8-5 8 5-8 5Z"/>
      </svg>
    `
  }

  return `
    <svg class="${iconClass}" viewBox="0 0 64 64" aria-hidden="true">
      <path class="poi-shadow" d="m10 40 22-13 22 13-22 13Z"/>
      <path class="poi-side" d="m13 35 19-11 19 11v14L32 60 13 49Z"/>
      <path class="poi-top" d="m13 35 19-11 19 11-19 11Z"/>
      <path class="poi-accent" d="m23 35 9-5 9 5-9 5Z"/>
      <path class="poi-light" d="M28 19h8v17l-4 3-4-3Z"/>
      <circle class="poi-cutout" cx="32" cy="16" r="5"/>
    </svg>
  `
}

function applyTimelessMapStyle(map: MapLibreMap) {
  const style = map.getStyle()
  const layers = style.layers ?? []

  layers.forEach((layer) => {
    const id = layer.id.toLowerCase()

    if (layer.type === "background") {
      map.setPaintProperty(layer.id, "background-color", "#efe1cc")
      return
    }

    if (layer.type === "fill") {
      if (id.includes("water")) {
        map.setPaintProperty(layer.id, "fill-color", "#8fa9a8")
        map.setPaintProperty(layer.id, "fill-opacity", 0.88)
      } else if (id.includes("park") || id.includes("wood")) {
        map.setPaintProperty(layer.id, "fill-color", "#c5c29e")
        map.setPaintProperty(layer.id, "fill-opacity", 0.72)
      } else if (id.includes("residential") || id.includes("landuse")) {
        map.setPaintProperty(layer.id, "fill-color", "#e5d2b8")
        map.setPaintProperty(layer.id, "fill-opacity", 0.72)
      } else if (id === "building") {
        map.setPaintProperty(layer.id, "fill-color", "#d3b991")
        map.setPaintProperty(layer.id, "fill-outline-color", "#b99569")
        map.setPaintProperty(layer.id, "fill-opacity", 0.28)
      } else if (id.includes("pier")) {
        map.setPaintProperty(layer.id, "fill-color", "#ead8bf")
      }
      return
    }

    if (layer.type === "line") {
      if (id.includes("waterway")) {
        map.setPaintProperty(layer.id, "line-color", "#789796")
      } else if (id.includes("casing")) {
        map.setPaintProperty(layer.id, "line-color", "#c09a69")
      } else if (
        id.includes("highway") ||
        id.includes("road") ||
        id.includes("motorway")
      ) {
        map.setPaintProperty(
          layer.id,
          "line-color",
          id.includes("major") || id.includes("motorway")
            ? "#f8eddb"
            : "#e8d4b8",
        )
      } else if (id.includes("railway")) {
        map.setPaintProperty(layer.id, "line-color", "#9b8064")
      } else if (id.includes("boundary")) {
        map.setPaintProperty(layer.id, "line-color", "#a98054")
      }
      return
    }

    if (layer.type === "symbol" && layer.layout?.["text-field"]) {
      const isWaterLabel = id.includes("water")
      const isMajorPlace =
        id.includes("city") ||
        id.includes("country") ||
        id.includes("state")

      map.setLayoutProperty(
        layer.id,
        "text-font",
        isMajorPlace ? ["Noto Sans Bold"] : ["Noto Sans Regular"],
      )
      map.setPaintProperty(
        layer.id,
        "text-color",
        isWaterLabel ? "#496f70" : isMajorPlace ? "#35261b" : "#6b5743",
      )
      map.setPaintProperty(layer.id, "text-halo-color", "#f6ead8")
      map.setPaintProperty(layer.id, "text-halo-width", 1.25)
      map.setPaintProperty(layer.id, "text-halo-blur", 0.35)
    }
  })

  if (!map.getLayer("timeless-buildings-3d")) {
    const firstLabelLayer = layers.find((layer) => layer.type === "symbol")?.id

    map.addLayer(
      {
        id: "timeless-buildings-3d",
        type: "fill-extrusion",
        source: "openmaptiles",
        "source-layer": "building",
        minzoom: 14,
        paint: {
          "fill-extrusion-color": [
            "interpolate",
            ["linear"],
            ["zoom"],
            14,
            "#d8c19e",
            17,
            "#c9a777",
          ],
          "fill-extrusion-height": [
            "interpolate",
            ["linear"],
            ["zoom"],
            14,
            0,
            15,
            [
              "coalesce",
              ["get", "render_height"],
              ["*", ["coalesce", ["get", "levels"], 2], 3],
              6,
            ],
          ],
          "fill-extrusion-base": [
            "coalesce",
            ["get", "render_min_height"],
            0,
          ],
          "fill-extrusion-opacity": 0.78,
          "fill-extrusion-vertical-gradient": true,
        },
      },
      firstLabelLayer,
    )
  }
}

export function MalagaCenterMap({
  embedded = false,
  fullscreen = false,
}: MalagaCenterMapProps) {
  const { language, t } = useLanguage()
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<MapLibreMap | null>(null)
  const markersRef = useRef<Map<string, Marker>>(new Map())
  const localizedPois = useMemo(
    () => malagaCenterPois.map((poi) => getLocalizedPoi(poi, language)),
    [language],
  )
  const availablePois = useMemo(
    () => localizedPois.filter((poi) => poi.status === "available"),
    [localizedPois],
  )
  const [selectedPoiId, setSelectedPoiId] = useState<string | null>(
    embedded
      ? (availablePois[0]?.id ?? null)
      : null,
  )
  const [query, setQuery] = useState("")
  const [mapReady, setMapReady] = useState(false)
  const [mapError, setMapError] = useState(false)
  const [geolocationIssue, setGeolocationIssue] = useState<
    "insecure" | "denied" | "unavailable" | null
  >(null)

  const selectedPoi =
    availablePois.find((poi) => poi.id === selectedPoiId) ?? null
  const filteredPois = availablePois.filter((poi) => {
    const normalizedQuery = query.trim().toLocaleLowerCase(language)
    if (!normalizedQuery) return true

    return [poi.title, poi.period, poi.locationLabel].some((value) =>
      value.toLocaleLowerCase(language).includes(normalizedQuery),
    )
  })

  useEffect(() => {
    let cancelled = false

    async function initializeMap() {
      if (!mapContainerRef.current || mapRef.current) return

      try {
        const maplibregl = (await import("maplibre-gl")).default
        if (cancelled || !mapContainerRef.current) return

        const map = new maplibregl.Map({
          container: mapContainerRef.current,
          style: "https://tiles.openfreemap.org/styles/positron",
          center: MALAGA_CENTER,
          zoom: fullscreen ? 14.8 : embedded ? 14.25 : 14.65,
          pitch: fullscreen ? 42 : 34,
          bearing: -12,
          minZoom: 11,
          maxZoom: 19,
          maxPitch: 60,
          attributionControl: false,
          cooperativeGestures: false,
        })

        map.addControl(
          new maplibregl.NavigationControl({
            showCompass: true,
            visualizePitch: true,
          }),
          "bottom-right",
        )
        const geolocateControl = new maplibregl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true,
            timeout: 12000,
            maximumAge: 5000,
          },
          fitBoundsOptions: { maxZoom: 17 },
          trackUserLocation: true,
          showUserLocation: true,
          showAccuracyCircle: true,
        })

        map.addControl(geolocateControl, "bottom-right")
        geolocateControl.on("geolocate", () => setGeolocationIssue(null))
        geolocateControl.on("error", (event) => {
          const error = "error" in event ? event.error : null
          setGeolocationIssue(error?.code === 1 ? "denied" : "unavailable")
        })
        map.addControl(
          new maplibregl.AttributionControl({ compact: true }),
          "bottom-left",
        )

        const collapseAttribution = () => {
          const attribution = map
            .getContainer()
            .querySelector<HTMLElement>(".maplibregl-ctrl-attrib")

          attribution?.classList.remove("maplibregl-compact-show")
        }

        availablePois.forEach((poi) => {
          const markerButton = document.createElement("button")
          markerButton.type = "button"
          markerButton.className = "timeless-map-marker"
          markerButton.dataset.status = poi.status
          markerButton.dataset.selected = String(poi.id === selectedPoiId)
          markerButton.setAttribute("aria-label", `${t("selectPoi")} ${poi.title}`)
          markerButton.innerHTML = `
            <span class="timeless-map-marker__shadow"></span>
            <span class="timeless-map-marker__tap-pulse"></span>
            <span class="timeless-map-marker__badge">
              ${getPoiMarkerIcon(poi.id)}
            </span>
            <span class="timeless-map-marker__label">${poi.title}</span>
          `
          markerButton.addEventListener("click", () => {
            setSelectedPoiId(poi.id)
            map.flyTo({
              center: getPoiCoordinates(poi),
              zoom: Math.max(map.getZoom(), 16),
              offset: [0, 0],
              duration: 900,
            })
          })

          const marker = new maplibregl.Marker({
            element: markerButton,
            anchor: "bottom",
            rotationAlignment: "viewport",
            pitchAlignment: "viewport",
            subpixelPositioning: true,
          })
            .setLngLat(getPoiCoordinates(poi))
            .addTo(map)

          markersRef.current.set(poi.id, marker)
        })

        map.on("load", () => {
          applyTimelessMapStyle(map)
          collapseAttribution()
          if (window.isSecureContext) {
            geolocateControl.trigger()
          } else {
            setGeolocationIssue("insecure")
          }
          if (!cancelled) setMapReady(true)
        })
        window.requestAnimationFrame(collapseAttribution)
        map.on("error", () => {
          if (!cancelled) setMapError(true)
        })
        mapRef.current = map
      } catch {
        if (!cancelled) setMapError(true)
      }
    }

    initializeMap()

    return () => {
      cancelled = true
      markersRef.current.clear()
      mapRef.current?.remove()
      mapRef.current = null
    }
  }, [availablePois, embedded, fullscreen, language, t])

  useEffect(() => {
    markersRef.current.forEach((marker, poiId) => {
      marker.getElement().dataset.selected = String(poiId === selectedPoiId)
    })
  }, [selectedPoiId])

  useEffect(() => {
    const container = mapContainerRef.current
    if (!container) return

    const resizeMap = () => {
      mapRef.current?.resize()
    }
    const resizeObserver = new ResizeObserver(resizeMap)

    resizeObserver.observe(container)
    window.addEventListener("resize", resizeMap)
    const frameId = window.requestAnimationFrame(resizeMap)

    return () => {
      window.cancelAnimationFrame(frameId)
      window.removeEventListener("resize", resizeMap)
      resizeObserver.disconnect()
    }
  }, [fullscreen])

  function selectPoi(poi: MapPoi) {
    setSelectedPoiId(poi.id)
    setQuery("")
    mapRef.current?.flyTo({
      center: getPoiCoordinates(poi),
      zoom: 16.35,
      offset: [0, 0],
      duration: 900,
    })
  }

  function resetView() {
    setSelectedPoiId(null)
    mapRef.current?.flyTo({
      center: MALAGA_CENTER,
      zoom: fullscreen ? 14.8 : embedded ? 14.25 : 14.65,
      offset: [0, 0],
      duration: 850,
    })
  }

  return (
    <section
      className={cn(
        "relative w-full overflow-hidden border border-black/10 bg-[#ded2bf] shadow-[0_28px_90px_rgba(43,31,20,0.18)]",
        selectedPoi && "timeless-map--poi-open",
        fullscreen
          ? "h-dvh border-0 shadow-none"
          : embedded
            ? "h-[76dvh] min-h-[38rem] max-h-[54rem] rounded-[2rem]"
            : "h-[calc(100dvh-7.25rem)] min-h-[39rem] rounded-[1.75rem]",
      )}
    >
      <div className="absolute inset-0">
        <div ref={mapContainerRef} className="h-full w-full" />
      </div>
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(180deg,rgba(35,24,16,0.06),transparent_20%,transparent_80%,rgba(35,24,16,0.08))]" />

      {!mapReady && !mapError && (
        <div className="absolute inset-0 z-30 grid place-items-center bg-[#eee3d1]">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#9a6a2c]/25 border-t-[#9a6a2c]" />
            <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#6f4a1f]">
              {t("loadingMap")}
            </p>
          </div>
        </div>
      )}

      {mapError && (
        <div className="absolute inset-0 z-30 grid place-items-center bg-[#eee3d1] px-6 text-center">
          <div className="max-w-sm">
            <MapPin className="mx-auto h-8 w-8 text-[#9a6a2c]" />
            <h3 className="mt-4 font-serif text-2xl text-[#241b12]">
              {t("mapLoadError")}
            </h3>
            <p className="mt-3 text-sm leading-6 text-[#6d5841]">
              {t("mapLoadErrorDescription")}
            </p>
          </div>
        </div>
      )}

      <div className="absolute left-3 right-3 top-3 z-20 flex items-start gap-2 sm:left-4 sm:right-auto sm:top-4 sm:w-[24rem]">
        <div className="min-w-0 flex-1 rounded-[1.4rem] border border-white/70 bg-[#f8efe1]/92 p-2 shadow-[0_12px_36px_rgba(42,29,18,0.18)] backdrop-blur-xl">
          <div className="flex items-center gap-2 px-2">
            <Search className="h-4 w-4 shrink-0 text-[#9a6a2c]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("searchPlaces")}
              className="h-10 min-w-0 flex-1 bg-transparent text-sm text-[#241b12] outline-none placeholder:text-[#7b6a58]/70"
              suppressHydrationWarning
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="grid h-8 w-8 place-items-center rounded-full text-[#6d5841] hover:bg-black/5"
                aria-label={t("clearSearch")}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {query && (
            <div className="mt-2 max-h-56 overflow-y-auto border-t border-black/8 pt-2">
              {filteredPois.length > 0 ? (
                filteredPois.map((poi) => (
                  <button
                    key={poi.id}
                    type="button"
                    onClick={() => selectPoi(poi)}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left hover:bg-white/70"
                  >
                    <span
                      className={cn(
                        "grid h-8 w-8 shrink-0 place-items-center rounded-full",
                        poi.status === "available"
                          ? "bg-[#9a6a2c] text-white"
                          : "bg-black/7 text-[#6d5841]",
                      )}
                    >
                      {poi.status === "available" ? (
                        <Sparkles className="h-3.5 w-3.5" />
                      ) : (
                        <MapPin className="h-3.5 w-3.5" />
                      )}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-xs font-bold text-[#241b12]">
                        {poi.title}
                      </span>
                      <span className="mt-0.5 block truncate text-[10px] text-[#7b6a58]">
                        {poi.period}
                      </span>
                    </span>
                  </button>
                ))
              ) : (
                <p className="px-3 py-4 text-center text-xs text-[#7b6a58]">
                  {t("noPlacesFound")}
                </p>
              )}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={resetView}
          className={cn(
            "grid h-12 w-12 shrink-0 place-items-center rounded-full border border-white/70 bg-[#f8efe1]/92 text-[#6f4a1f] shadow-[0_12px_36px_rgba(42,29,18,0.18)] backdrop-blur-xl transition-all duration-300",
            selectedPoi && "pointer-events-none translate-y-2 opacity-0",
          )}
          aria-label={t("centerMap")}
          title={t("centerMap")}
        >
          <LocateFixed className="h-5 w-5" />
        </button>
      </div>

      {geolocationIssue && (
        <div className="absolute left-3 right-3 top-[9.5rem] z-20 rounded-2xl border border-[#9a6a2c]/20 bg-[#f8efe1]/94 px-4 py-3 text-xs leading-5 text-[#5f4b37] shadow-[0_10px_30px_rgba(42,29,18,0.14)] backdrop-blur-xl sm:left-4 sm:right-auto sm:top-[9.5rem] sm:w-[20rem]">
          {geolocationIssue === "insecure"
            ? t("geolocationNeedsHttps")
            : geolocationIssue === "denied"
              ? t("geolocationDenied")
              : t("geolocationUnavailable")}
        </div>
      )}

      {selectedPoi && (
        <article
          className="timeless-poi-sheet absolute inset-x-0 bottom-0 z-30 max-h-[52dvh] overflow-y-auto rounded-t-[1.75rem] border-x-0 border-b-0 border-t border-white/15 bg-[#241b12]/97 text-[#f7ead6] shadow-[0_-24px_70px_rgba(25,16,10,0.38)] backdrop-blur-xl"
        >
          <div className="absolute left-1/2 top-2 z-20 h-1 w-10 -translate-x-1/2 rounded-full bg-white/30" />

          <button
            type="button"
            onClick={() => setSelectedPoiId(null)}
            className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-black/25 text-white backdrop-blur-md"
            aria-label={t("closeHistoricalPoint")}
          >
            <X className="h-4 w-4" />
          </button>

          <div
            className={cn(
              selectedPoi.previewImage &&
                "sm:grid sm:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)]",
            )}
          >
            {selectedPoi.previewImage && (
              <div className="relative aspect-[16/7] overflow-hidden sm:aspect-auto sm:min-h-[13rem]">
                <img
                  src={selectedPoi.previewImage}
                  alt={selectedPoi.title}
                  className="h-full w-full object-cover"
                  draggable={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#241b12] via-transparent to-black/15 sm:bg-gradient-to-r sm:from-transparent sm:to-[#241b12]/35" />
              </div>
            )}

            <div className="flex flex-col justify-center p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:p-7">
              <h3 className="pr-10 font-serif text-2xl font-light leading-none tracking-[-0.045em] sm:text-3xl">
                {selectedPoi.title}
              </h3>

              {selectedPoi.status === "available" && selectedPoi.sceneId ? (
                <Link
                  href={`/scene/${selectedPoi.sceneId}`}
                  onClick={() => {
                    void requestAppFullscreen()
                  }}
                  className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#f7ead6] px-5 py-3 text-[11px] font-bold uppercase tracking-[0.16em] text-[#241b12] sm:mt-5 sm:py-3.5"
                >
                  {t("respawnHere")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <div className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-white/12 bg-white/5 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-white/45 sm:mt-5 sm:py-3.5">
                  <Clock className="h-4 w-4" />
                  {t("sceneInDevelopment")}
                </div>
              )}
            </div>
          </div>
        </article>
      )}
    </section>
  )
}
