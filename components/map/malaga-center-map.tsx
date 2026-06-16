"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import {
  ArrowRight,
  CalendarDays,
  Clock,
  ExternalLink,
  LocateFixed,
  MapPin,
  Navigation,
  Search,
  Sparkles,
  X,
} from "lucide-react"
import type {
  GeolocateControl,
  Map as MapLibreMap,
  Marker,
} from "maplibre-gl"
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

type PoiFilter = "all" | "available" | "future"
type PoiKind = "wall" | "market" | "theatre" | "street" | "civic"

interface UserLocation {
  latitude: number
  longitude: number
}

function getPoiCoordinates(poi: MapPoi): [number, number] {
  return [poi.coordinates.longitude, poi.coordinates.latitude]
}

function getPoiKind(poi: MapPoi): PoiKind {
  if (poi.id.includes("muralla")) return "wall"
  if (poi.id.includes("atarazanas")) return "market"
  if (poi.id.includes("teatro")) return "theatre"
  if (poi.id.includes("larios")) return "street"
  return "civic"
}

function getPoiMarkerSvg(kind: PoiKind) {
  const common = `
    <ellipse class="poi-ink poi-shadow" cx="32" cy="52" rx="19" ry="7" />
    <path class="poi-paper" d="M12 44 32 32l20 12-20 12-20-12Z" />
  `

  const icons: Record<PoiKind, string> = {
    wall: `
      ${common}
      <path class="poi-mid" d="M17 27 32 18l15 9v18l-15 9-15-9V27Z" />
      <path class="poi-dark" d="M32 18v36l15-9V27L32 18Z" />
      <path class="poi-light" d="M17 27 32 18v36l-15-9V27Z" />
      <path class="poi-cut" d="M20 24h5v-6h5v6h5v-6h5v6h4v5H20v-5Z" />
      <path class="poi-line" d="M22 34h20M22 40h20M28 32v17M36 32v17" />
      <path class="poi-hole" d="M29 41c0-3 6-3 6 0v9h-6v-9Z" />
    `,
    market: `
      ${common}
      <path class="poi-mid" d="M14 35 32 23l18 12v12L32 57 14 47V35Z" />
      <path class="poi-dark" d="M32 23v34l18-10V35L32 23Z" />
      <path class="poi-light" d="M14 35 32 23v34L14 47V35Z" />
      <path class="poi-cut" d="M19 35c5-9 21-9 26 0v4H19v-4Z" />
      <path class="poi-paper" d="M23 39c0-6 18-6 18 0v11H23V39Z" />
      <path class="poi-hole" d="M27 41c0-4 10-4 10 0v10H27V41Z" />
      <path class="poi-line" d="M19 35h26M23 30h18M17 47l15 8 15-8" />
    `,
    theatre: `
      ${common}
      <path class="poi-mid" d="M13 43c3-14 35-14 38 0L32 56 13 43Z" />
      <path class="poi-dark" d="M32 31c10 0 18 4 19 12L32 56V31Z" />
      <path class="poi-light" d="M13 43c1-8 9-12 19-12v25L13 43Z" />
      <path class="poi-line" d="M20 42c2-7 22-7 24 0M24 46c2-4 14-4 16 0M32 32v23M16 44l16 10 16-10" />
      <path class="poi-cut" d="M27 40h10v5H27z" />
    `,
    street: `
      ${common}
      <path class="poi-mid" d="M16 45 32 22l16 23-16 11-16-11Z" />
      <path class="poi-light" d="M20 43 32 27v29L20 43Z" />
      <path class="poi-dark" d="M32 27 44 43 32 56V27Z" />
      <path class="poi-paper" d="M29 30h6l3 21-6 4-6-4 3-21Z" />
      <path class="poi-line" d="M24 39h16M21 44h22M18 49h28M32 31v23" />
      <path class="poi-cut" d="M19 32h6v9h-6zM39 32h6v9h-6z" />
    `,
    civic: `
      ${common}
      <path class="poi-mid" d="M16 38 32 24l16 14v11L32 57 16 49V38Z" />
      <path class="poi-dark" d="M32 24v33l16-8V38L32 24Z" />
      <path class="poi-light" d="M16 38 32 24v33l-16-8V38Z" />
      <path class="poi-cut" d="M32 29 36 38l9 1-7 6 2 9-8-5-8 5 2-9-7-6 9-1 4-9Z" />
      <path class="poi-line" d="M18 48 32 55l14-7M22 38l10-8 10 8" />
    `,
  }

  return `
    <svg class="timeless-map-marker__icon" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      ${icons[kind]}
    </svg>
  `
}

function getPoiCategoryLabel(poi: MapPoi, language: "es" | "en") {
  const kind = getPoiKind(poi)

  const labels: Record<PoiKind, { es: string; en: string }> = {
    wall: { es: "Defensa", en: "Defence" },
    market: { es: "Mercado", en: "Market" },
    theatre: { es: "Teatro", en: "Theatre" },
    street: { es: "Eje urbano", en: "Urban axis" },
    civic: { es: "Plaza", en: "Square" },
  }

  return labels[kind][language]
}

function getDirectionsHref(poi: MapPoi) {
  const point = poi.directions ?? {
    latitude: poi.coordinates.latitude,
    longitude: poi.coordinates.longitude,
  }

  return `https://www.google.com/maps/dir/?api=1&destination=${point.latitude},${point.longitude}`
}

function getDistanceInMeters(from: UserLocation, poi: MapPoi) {
  const earthRadius = 6371000
  const toRadians = (value: number) => (value * Math.PI) / 180
  const latitudeA = toRadians(from.latitude)
  const latitudeB = toRadians(poi.coordinates.latitude)
  const deltaLatitude = toRadians(poi.coordinates.latitude - from.latitude)
  const deltaLongitude = toRadians(poi.coordinates.longitude - from.longitude)
  const haversine =
    Math.sin(deltaLatitude / 2) ** 2 +
    Math.cos(latitudeA) *
      Math.cos(latitudeB) *
      Math.sin(deltaLongitude / 2) ** 2

  return earthRadius * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine))
}

function formatDistance(distance: number, language: "es" | "en") {
  const locale = language === "es" ? "es-ES" : "en-US"

  if (distance < 1000) {
    return `${Math.max(20, Math.round(distance / 10) * 10).toLocaleString(locale)} m`
  }

  return `${(distance / 1000).toLocaleString(locale, {
    maximumFractionDigits: 1,
  })} km`
}

function applyTimelessMapStyle(map: MapLibreMap) {
  const style = map.getStyle()
  const layers = style.layers ?? []

  layers.forEach((layer) => {
    const id = layer.id.toLowerCase()

    if (layer.type === "background") {
      map.setPaintProperty(layer.id, "background-color", "#eee6d8")
      return
    }

    if (layer.type === "fill") {
      if (id.includes("water")) {
        map.setPaintProperty(layer.id, "fill-color", "#638c94")
        map.setPaintProperty(layer.id, "fill-opacity", 0.86)
      } else if (id.includes("park") || id.includes("wood")) {
        map.setPaintProperty(layer.id, "fill-color", "#aab79b")
        map.setPaintProperty(layer.id, "fill-opacity", 0.62)
      } else if (id.includes("residential") || id.includes("landuse")) {
        map.setPaintProperty(layer.id, "fill-color", "#e6dac7")
        map.setPaintProperty(layer.id, "fill-opacity", 0.48)
      } else if (id === "building") {
        map.setPaintProperty(layer.id, "fill-color", "#cdbca5")
        map.setPaintProperty(layer.id, "fill-outline-color", "#b4a18a")
        map.setPaintProperty(layer.id, "fill-opacity", 0.24)
      } else if (id.includes("pier")) {
        map.setPaintProperty(layer.id, "fill-color", "#ded0bc")
      }
      return
    }

    if (layer.type === "line") {
      if (id.includes("waterway")) {
        map.setPaintProperty(layer.id, "line-color", "#47747b")
        map.setPaintProperty(layer.id, "line-opacity", 0.54)
      } else if (id.includes("casing")) {
        map.setPaintProperty(layer.id, "line-color", "#c8b89f")
        map.setPaintProperty(layer.id, "line-opacity", 0.42)
      } else if (
        id.includes("highway") ||
        id.includes("road") ||
        id.includes("motorway")
      ) {
        map.setPaintProperty(
          layer.id,
          "line-color",
          id.includes("major") || id.includes("motorway")
            ? "#f5eadc"
            : "#ded0bb",
        )
        map.setPaintProperty(
          layer.id,
          "line-opacity",
          id.includes("path") || id.includes("minor") ? 0.54 : 0.72,
        )
      } else if (id.includes("railway")) {
        map.setPaintProperty(layer.id, "line-color", "#8d8070")
        map.setPaintProperty(layer.id, "line-opacity", 0.34)
      } else if (id.includes("boundary")) {
        map.setPaintProperty(layer.id, "line-color", "#9a826a")
        map.setPaintProperty(layer.id, "line-opacity", 0.24)
      }
      return
    }

    if (layer.type === "symbol" && layer.layout?.["text-field"]) {
      const isWaterLabel = id.includes("water")
      const isPoiLabel =
        id.includes("poi") ||
        id.includes("place_of_worship") ||
        id.includes("shop") ||
        id.includes("housenumber")
      const isMajorPlace =
        id.includes("city") ||
        id.includes("country") ||
        id.includes("state")

      if (isPoiLabel) {
        map.setLayoutProperty(layer.id, "visibility", "none")
        return
      }

      map.setLayoutProperty(
        layer.id,
        "text-font",
        isMajorPlace ? ["Noto Sans Bold"] : ["Noto Sans Regular"],
      )
      map.setPaintProperty(
        layer.id,
        "text-color",
        isWaterLabel ? "#315f66" : isMajorPlace ? "#2a2118" : "#75695d",
      )
      map.setPaintProperty(layer.id, "text-halo-color", "#f3ecdf")
      map.setPaintProperty(layer.id, "text-halo-width", isMajorPlace ? 1.6 : 1.1)
      map.setPaintProperty(layer.id, "text-halo-blur", 0.45)
      map.setPaintProperty(layer.id, "text-opacity", isMajorPlace ? 0.86 : 0.58)
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
            "#c7b49a",
            17,
            "#a89278",
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
          "fill-extrusion-opacity": 0.48,
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
  const geolocateControlRef = useRef<GeolocateControl | null>(null)
  const markersRef = useRef<Map<string, Marker>>(new Map())
  const selectedPoiIdRef = useRef<string | null>(null)
  const filteredPoiIdsRef = useRef<Set<string>>(new Set())
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
  const [activeFilter, setActiveFilter] = useState<PoiFilter>("all")
  const [query, setQuery] = useState("")
  const [mapReady, setMapReady] = useState(false)
  const [mapError, setMapError] = useState(false)
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null)
  const [geolocationIssue, setGeolocationIssue] = useState<
    "insecure" | "denied" | "unavailable" | null
  >(null)

  const selectedPoi =
    localizedPois.find((poi) => poi.id === selectedPoiId) ?? null
  const filteredPois = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase(language)

    return localizedPois.filter((poi) => {
      const matchesFilter =
        activeFilter === "all" ||
        (activeFilter === "available" && poi.status === "available") ||
        (activeFilter === "future" && poi.status === "coming-soon")

      if (!matchesFilter) return false
      if (!normalizedQuery) return true

      return [poi.title, poi.period, poi.locationLabel].some((value) =>
        value.toLocaleLowerCase(language).includes(normalizedQuery),
      )
    })
  }, [activeFilter, language, localizedPois, query])
  const filteredPoiIds = useMemo(
    () => new Set(filteredPois.map((poi) => poi.id)),
    [filteredPois],
  )
  const availableCount = localizedPois.filter(
    (poi) => poi.status === "available",
  ).length
  const futureCount = localizedPois.length - availableCount
  const selectedDistance =
    selectedPoi && userLocation
      ? formatDistance(getDistanceInMeters(userLocation, selectedPoi), language)
      : null
  const selectedCategory = selectedPoi
    ? getPoiCategoryLabel(selectedPoi, language)
    : null

  useEffect(() => {
    selectedPoiIdRef.current = selectedPoiId
  }, [selectedPoiId])

  useEffect(() => {
    filteredPoiIdsRef.current = filteredPoiIds
  }, [filteredPoiIds])

  useEffect(() => {
    let cancelled = false
    const markers = markersRef.current

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
          pitch: fullscreen ? 46 : 38,
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
        geolocateControlRef.current = geolocateControl

        map.addControl(geolocateControl, "bottom-right")
        geolocateControl.on("geolocate", (event) => {
          setGeolocationIssue(null)
          setUserLocation({
            latitude: event.coords.latitude,
            longitude: event.coords.longitude,
          })
        })
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

        localizedPois.forEach((poi) => {
          const kind = getPoiKind(poi)
          const markerButton = document.createElement("button")
          markerButton.type = "button"
          markerButton.className = "timeless-map-marker"
          markerButton.dataset.kind = kind
          markerButton.dataset.status = poi.status
          markerButton.dataset.selected = String(
            poi.id === selectedPoiIdRef.current,
          )
          markerButton.dataset.visible = String(
            filteredPoiIdsRef.current.has(poi.id),
          )
          markerButton.setAttribute("aria-label", `${t("selectPoi")} ${poi.title}`)
          markerButton.innerHTML = `
            <span class="timeless-map-marker__halo"></span>
            <span class="timeless-map-marker__badge">
              ${getPoiMarkerSvg(kind)}
            </span>
            <span class="timeless-map-marker__pin"></span>
            <span class="timeless-map-marker__label"></span>
          `
          const label = markerButton.querySelector(".timeless-map-marker__label")
          if (label) label.textContent = poi.title
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

          markers.set(poi.id, marker)
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
      markers.clear()
      mapRef.current?.remove()
      mapRef.current = null
      geolocateControlRef.current = null
    }
  }, [embedded, fullscreen, language, localizedPois, t])

  useEffect(() => {
    markersRef.current.forEach((marker, poiId) => {
      const element = marker.getElement()
      element.dataset.selected = String(poiId === selectedPoiId)
      element.dataset.visible = String(filteredPoiIds.has(poiId))
    })
  }, [filteredPoiIds, selectedPoiId])

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

  function retryGeolocation() {
    if (!window.isSecureContext) {
      setGeolocationIssue("insecure")
      return
    }

    geolocateControlRef.current?.trigger()
  }

  function resetView() {
    setSelectedPoiId(null)
    setActiveFilter("all")
    setQuery("")
    mapRef.current?.flyTo({
      center: MALAGA_CENTER,
      zoom: fullscreen ? 14.8 : embedded ? 14.25 : 14.65,
      offset: [0, 0],
      duration: 850,
    })
  }

  const filterOptions: Array<{
    id: PoiFilter
    label: string
    count: number
  }> = [
    { id: "all", label: t("allPlaces"), count: localizedPois.length },
    { id: "available", label: t("respawnAvailable"), count: availableCount },
    { id: "future", label: t("futureScene"), count: futureCount },
  ]

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
      <div className="timeless-map-texture pointer-events-none absolute inset-0 z-[1]" />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(180deg,rgba(35,24,16,0.08),transparent_24%,transparent_76%,rgba(35,24,16,0.1))]" />

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

      <div className="absolute left-3 right-3 top-3 z-20 sm:left-4 sm:right-auto sm:top-4 sm:w-[25rem]">
        <div className="flex items-start gap-2">
          <div className="min-w-0 flex-1 overflow-hidden rounded-2xl border border-white/75 bg-[#fbf7ef]/95 shadow-[0_16px_42px_rgba(38,31,24,0.16)] backdrop-blur-xl">
            <div className="flex items-center gap-2 border-b border-[#2c2118]/10 px-3 py-2">
              <Search className="h-4 w-4 shrink-0 text-[#7a5330]" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t("searchPlaces")}
                className="h-9 min-w-0 flex-1 bg-transparent text-sm font-medium text-[#25201c] outline-none placeholder:text-[#6d6257]/70"
                suppressHydrationWarning
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[#66594c] transition-colors hover:bg-[#2c2118]/7"
                  aria-label={t("clearSearch")}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex gap-1.5 overflow-x-auto px-2.5 py-2">
              {filterOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setActiveFilter(option.id)}
                  className={cn(
                    "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3 text-[11px] font-bold uppercase tracking-[0.08em] transition-colors",
                    activeFilter === option.id
                      ? "bg-[#25201c] text-[#fbf7ef]"
                      : "bg-[#ece2d4] text-[#66594c] hover:bg-[#dfd0bf]",
                  )}
                >
                  {option.id === "all" ? (
                    <MapPin className="h-3.5 w-3.5" />
                  ) : option.id === "available" ? (
                    <Sparkles className="h-3.5 w-3.5" />
                  ) : (
                    <Clock className="h-3.5 w-3.5" />
                  )}
                  {option.label}
                  <span className="text-[10px] opacity-70">{option.count}</span>
                </button>
              ))}
            </div>

            <div className="hidden grid-cols-3 border-t border-[#2c2118]/8 bg-white/35 text-center sm:grid">
              <div className="px-2 py-2">
                <span className="block text-sm font-bold text-[#25201c]">
                  {localizedPois.length}
                </span>
                <span className="block text-[9px] font-semibold uppercase tracking-[0.16em] text-[#74685d]">
                  {t("allPlaces")}
                </span>
              </div>
              <div className="border-x border-[#2c2118]/8 px-2 py-2">
                <span className="block text-sm font-bold text-[#25201c]">
                  {availableCount}
                </span>
                <span className="block text-[9px] font-semibold uppercase tracking-[0.16em] text-[#74685d]">
                  {t("availableScenes")}
                </span>
              </div>
              <div className="px-2 py-2">
                <span className="block text-sm font-bold text-[#25201c]">
                  {futureCount}
                </span>
                <span className="block text-[9px] font-semibold uppercase tracking-[0.16em] text-[#74685d]">
                  {t("comingSoon")}
                </span>
              </div>
            </div>

            {(query || activeFilter !== "all") && (
              <div className="max-h-60 overflow-y-auto border-t border-[#2c2118]/10 bg-[#fbf7ef]/80 p-2">
                {filteredPois.length > 0 ? (
                  filteredPois.map((poi) => {
                    const distance = userLocation
                      ? formatDistance(getDistanceInMeters(userLocation, poi), language)
                      : null

                    return (
                      <button
                        key={poi.id}
                        type="button"
                        onClick={() => selectPoi(poi)}
                        className={cn(
                          "flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-white/85",
                          selectedPoiId === poi.id && "bg-white shadow-sm",
                        )}
                      >
                        <span
                          className="timeless-result-dot mt-0.5"
                          data-kind={getPoiKind(poi)}
                          data-status={poi.status}
                          aria-hidden="true"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="flex min-w-0 items-center gap-2">
                            <span className="truncate text-xs font-bold text-[#25201c]">
                              {poi.title}
                            </span>
                            <span className="shrink-0 rounded-full bg-[#25201c]/7 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.08em] text-[#6a5c50]">
                              {getPoiCategoryLabel(poi, language)}
                            </span>
                          </span>
                          <span className="mt-0.5 block truncate text-[10px] text-[#75685b]">
                            {distance ? `${distance} · ${poi.period}` : poi.period}
                          </span>
                        </span>
                      </button>
                    )
                  })
                ) : (
                  <p className="px-3 py-5 text-center text-xs text-[#74685d]">
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
              "grid h-12 w-12 shrink-0 place-items-center rounded-full border border-white/75 bg-[#fbf7ef]/95 text-[#4f4439] shadow-[0_16px_42px_rgba(38,31,24,0.16)] backdrop-blur-xl transition-all duration-300 hover:bg-white",
              selectedPoi && "sm:translate-x-1 sm:opacity-80",
            )}
            aria-label={t("centerMap")}
            title={t("centerMap")}
          >
            <LocateFixed className="h-5 w-5" />
          </button>
        </div>
      </div>

      {geolocationIssue && (
        <div className="absolute left-3 right-3 top-[13.75rem] z-20 rounded-2xl border border-[#8a6239]/20 bg-[#fbf7ef]/96 p-3 text-xs leading-5 text-[#5d5145] shadow-[0_12px_34px_rgba(38,31,24,0.14)] backdrop-blur-xl sm:left-4 sm:right-auto sm:top-[15.4rem] sm:w-[22rem]">
          <p>
            {geolocationIssue === "insecure"
              ? t("geolocationNeedsHttps")
              : geolocationIssue === "denied"
                ? t("geolocationDenied")
                : t("geolocationUnavailable")}
          </p>
          {geolocationIssue !== "insecure" && (
            <button
              type="button"
              onClick={retryGeolocation}
              className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#25201c] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#fbf7ef]"
            >
              <Navigation className="h-3.5 w-3.5" />
              {t("retry")}
            </button>
          )}
        </div>
      )}

      {selectedPoi && (
        <article className="timeless-poi-sheet absolute inset-x-3 bottom-3 z-30 max-h-[64dvh] overflow-y-auto rounded-2xl border border-white/14 bg-[#1f1a16]/97 text-[#fbf3e8] shadow-[0_22px_70px_rgba(18,14,10,0.36)] backdrop-blur-xl sm:inset-x-auto sm:bottom-4 sm:right-4 sm:top-20 sm:w-[25rem] sm:max-h-none">
          <div className="absolute left-1/2 top-2 z-20 h-1 w-10 -translate-x-1/2 rounded-full bg-white/25 sm:hidden" />

          <button
            type="button"
            onClick={() => setSelectedPoiId(null)}
            className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full border border-white/14 bg-black/30 text-white backdrop-blur-md transition-colors hover:bg-black/45"
            aria-label={t("closeHistoricalPoint")}
          >
            <X className="h-4 w-4" />
          </button>

          {selectedPoi.previewImage && (
            <div className="relative aspect-[16/9] overflow-hidden rounded-t-2xl">
              <img
                src={selectedPoi.previewImage}
                alt={selectedPoi.title}
                className="h-full w-full object-cover"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1f1a16] via-transparent to-black/15" />
            </div>
          )}

          <div className="p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:p-5">
            <div className="flex flex-wrap items-center gap-2 pr-10">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/8 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white/74">
                <span
                  className="timeless-result-dot"
                  data-kind={getPoiKind(selectedPoi)}
                  data-status={selectedPoi.status}
                  aria-hidden="true"
                />
                {selectedCategory}
              </span>
              <span className="rounded-full border border-white/12 bg-white/8 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white/74">
                {selectedPoi.status === "available"
                  ? t("available")
                  : t("comingSoon")}
              </span>
            </div>

            <h3 className="mt-3 pr-10 font-serif text-2xl font-light leading-none tracking-[-0.04em] sm:text-3xl">
              {selectedPoi.title}
            </h3>

            <p className="mt-3 text-sm leading-6 text-[#fbf3e8]/72">
              {selectedPoi.shortDescription}
            </p>

            <div className="mt-4 grid gap-3 border-y border-white/10 py-4 text-sm">
              <div className="flex gap-3">
                <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-[#d5a866]" />
                <span className="min-w-0">
                  <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-white/42">
                    {t("historicalPoint")}
                  </span>
                  <span className="mt-0.5 block text-[#fbf3e8]/82">
                    {selectedPoi.period}
                  </span>
                </span>
              </div>
              <div className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#d5a866]" />
                <span className="min-w-0">
                  <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-white/42">
                    {t("exactPoint")}
                  </span>
                  <span className="mt-0.5 block text-[#fbf3e8]/82">
                    {selectedPoi.locationLabel}
                  </span>
                </span>
              </div>
              {selectedDistance && (
                <div className="flex gap-3">
                  <Navigation className="mt-0.5 h-4 w-4 shrink-0 text-[#d5a866]" />
                  <span className="min-w-0">
                    <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-white/42">
                      {t("distanceFromYou")}
                    </span>
                    <span className="mt-0.5 block text-[#fbf3e8]/82">
                      {selectedDistance}
                    </span>
                  </span>
                </div>
              )}
            </div>

            <div className="mt-4 grid gap-2">
              {selectedPoi.status === "available" && selectedPoi.sceneId ? (
                <Link
                  href={`/scene/${selectedPoi.sceneId}`}
                  onClick={() => {
                    void requestAppFullscreen()
                  }}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#fbf3e8] px-5 py-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#1f1a16] transition-opacity active:opacity-80"
                >
                  {t("openViewer")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <div className="flex w-full items-center justify-center gap-2 rounded-full border border-white/12 bg-white/7 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-white/48">
                  <Clock className="h-4 w-4" />
                  {t("sceneInDevelopment")}
                </div>
              )}

              <a
                href={getDirectionsHref(selectedPoi)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/14 bg-white/7 px-5 py-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#fbf3e8] transition-colors hover:bg-white/12"
              >
                <Navigation className="h-4 w-4" />
                {t("howToArrive")}
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </article>
      )}
    </section>
  )
}
