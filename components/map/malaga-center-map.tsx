"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ArrowRight, Clock, Lock, MapPin, Navigation } from "lucide-react"
import { malagaCenterPois } from "@/data/malaga-pois"
import { useLanguage } from "@/components/i18n/language-provider"
import { getLocalizedPoi } from "@/lib/localized-city"
import type { MapPoi } from "@/types/poi"
import { cn } from "@/lib/utils"

function getPoiMapLabel(poi: MapPoi) {
  if (poi.id.includes("carreteria") || poi.title.includes("Carretería")) return "Carretería"
  if (poi.id.includes("atarazanas") || poi.title.includes("Atarazanas")) return "Atarazanas"
  if (poi.id.includes("teatro") || poi.title.includes("Teatro")) return "Teatro Romano"

  return poi.title
}

function PoiMarker({
  poi,
  selected,
  onSelect,
  selectLabel,
}: {
  poi: MapPoi
  selected: boolean
  onSelect: (poi: MapPoi) => void
  selectLabel: string
}) {
  const isAvailable = poi.status === "available"
  const showLabel = isAvailable || selected

  return (
    <button
      type="button"
      onClick={() => onSelect(poi)}
      className={cn(
        "group absolute z-20 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        isAvailable ? "cursor-pointer" : "cursor-default",
      )}
      style={{ left: `${poi.mapPosition.x}%`, top: `${poi.mapPosition.y}%` }}
      aria-label={`${selectLabel} ${poi.title}`}
    >
      {selected && isAvailable && (
        <span className="absolute h-14 w-14 rounded-full border border-accent/35 bg-accent/10 shadow-[0_0_0_8px_rgba(184,107,56,0.08)]" />
      )}

      <span
        className={cn(
          "relative grid place-items-center rounded-full border shadow-lg transition-all duration-200",
          selected && isAvailable
            ? "h-12 w-12 scale-105 border-white/70 bg-accent text-accent-foreground shadow-[0_12px_28px_rgba(184,107,56,0.38)]"
            : isAvailable
              ? "h-10 w-10 border-white/65 bg-accent text-accent-foreground shadow-[0_10px_24px_rgba(184,107,56,0.28)] group-hover:scale-105"
              : "h-8 w-8 border-white/75 bg-background/86 text-muted-foreground/75 opacity-75 shadow-black/10 backdrop-blur-sm",
        )}
      >
        {isAvailable ? (
          <MapPin className={cn(selected ? "h-5 w-5" : "h-4 w-4")} />
        ) : (
          <Lock className="h-3.5 w-3.5" />
        )}

        {selected && isAvailable && (
          <span className="absolute inset-0 rounded-full border border-accent opacity-25" />
        )}
      </span>

      {showLabel && (
        <span
          className={cn(
            "absolute left-1/2 top-[calc(100%+0.28rem)] z-30 -translate-x-1/2 whitespace-nowrap rounded-full px-2.5 py-1 text-[8.5px] font-bold tracking-wide shadow-md transition-all sm:text-[10px]",
            selected && isAvailable
              ? "bg-foreground text-background"
              : isAvailable
                ? "border border-white/70 bg-background/90 text-foreground backdrop-blur-md"
                : "border border-border bg-background/85 text-muted-foreground opacity-0 group-hover:opacity-100",
          )}
        >
          {getPoiMapLabel(poi)}
        </span>
      )}
    </button>
  )
}

function SceneSelector({
  pois,
  selectedPoi,
  onSelect,
  availableScenesLabel,
  scenesLabel,
}: {
  pois: MapPoi[]
  selectedPoi: MapPoi
  onSelect: (poi: MapPoi) => void
  availableScenesLabel: string
  scenesLabel: string
}) {
  return (
    <div className="border-t border-white/65 bg-background/96 px-3 py-2.5 sm:px-4 sm:py-3">
      <div className="mx-auto max-w-3xl">
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="text-[8.5px] font-bold uppercase tracking-[0.22em] text-accent/85 sm:text-[9px]">
            {availableScenesLabel}
          </p>

          {pois.length > 3 && (
            <span className="text-[8px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/70">
              {pois.length} {scenesLabel}
            </span>
          )}
        </div>

        <div className="max-h-[8.9rem] overflow-y-auto pr-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-3">
            {pois.map((poi) => {
              const selected = selectedPoi.id === poi.id

              return (
                <button
                  key={poi.id}
                  type="button"
                  onClick={() => onSelect(poi)}
                  className={cn(
                    "flex w-full items-center justify-between gap-2 rounded-xl border px-2.5 py-2 text-left transition-all active:scale-[0.99]",
                    selected
                      ? "border-accent/20 bg-accent text-accent-foreground shadow-[0_6px_14px_rgba(184,107,56,0.18)]"
                      : "border-border bg-background/82 text-foreground shadow-sm hover:border-accent/30",
                  )}
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <span
                      className={cn(
                        "grid h-6 w-6 shrink-0 place-items-center rounded-full",
                        selected
                          ? "bg-accent-foreground/14 text-accent-foreground"
                          : "bg-accent/10 text-accent",
                      )}
                    >
                      <MapPin className="h-3 w-3" />
                    </span>

                    <span className="min-w-0">
                      <span className="block truncate text-[10px] font-bold uppercase tracking-[0.12em]">
                        {getPoiMapLabel(poi)}
                      </span>
                      <span
                        className={cn(
                          "mt-0.5 block truncate text-[9px] leading-tight",
                          selected ? "text-accent-foreground/75" : "text-muted-foreground",
                        )}
                      >
                        {poi.period}
                      </span>
                    </span>
                  </span>

                  <span
                    className={cn(
                      "h-1.5 w-1.5 shrink-0 rounded-full",
                      selected ? "bg-accent-foreground" : "bg-accent/50",
                    )}
                  />
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

function hasValidDirections(poi: MapPoi) {
  if (!poi.directions) return false

  const { latitude, longitude } = poi.directions
  return Number.isFinite(latitude) && Number.isFinite(longitude)
}

function getGoogleMapsDirectionsUrl(poi: MapPoi) {
  if (!hasValidDirections(poi) || !poi.directions) return "#"

  const { latitude, longitude } = poi.directions
  return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=walking`
}

function getAppleMapsDirectionsUrl(poi: MapPoi) {
  if (!hasValidDirections(poi) || !poi.directions) return "#"

  const { latitude, longitude } = poi.directions
  return `maps://?saddr=Current%20Location&daddr=${latitude},${longitude}&dirflg=w`
}

function getGoogleMapsIntentUrl(poi: MapPoi) {
  if (!hasValidDirections(poi) || !poi.directions) return "#"

  const { latitude, longitude } = poi.directions
  const fallbackUrl = encodeURIComponent(getGoogleMapsDirectionsUrl(poi))

  return `intent://maps.google.com/maps?daddr=${latitude},${longitude}&directionsmode=walking#Intent;scheme=https;package=com.google.android.apps.maps;S.browser_fallback_url=${fallbackUrl};end`
}

function isIOSDevice() {
  if (typeof navigator === "undefined") return false

  const userAgent = navigator.userAgent || ""
  const platform = navigator.platform || ""
  const isIOS = /iPad|iPhone|iPod/.test(userAgent)
  const isTouchMac = platform === "MacIntel" && navigator.maxTouchPoints > 1

  return isIOS || isTouchMac
}

function isAndroidDevice() {
  if (typeof navigator === "undefined") return false

  return /Android/i.test(navigator.userAgent || "")
}

function getPreferredDirectionsUrl(poi: MapPoi) {
  if (isIOSDevice()) return getAppleMapsDirectionsUrl(poi)
  if (isAndroidDevice()) return getGoogleMapsIntentUrl(poi)

  return getGoogleMapsDirectionsUrl(poi)
}

function openDirections(poi: MapPoi) {
  const directionsUrl = getPreferredDirectionsUrl(poi)
  if (!directionsUrl || directionsUrl === "#") return

  // Keep this as a button action, not an anchor/window.open flow.
  // Anchor target="_blank" and window.open commonly open Maps but leave a blank browser tab on mobile.
  window.location.href = directionsUrl
}

export function MalagaCenterMap() {
  const { language, t } = useLanguage()
  const localizedPois = useMemo(
    () => malagaCenterPois.map((poi) => getLocalizedPoi(poi, language)),
    [language],
  )
  const availablePois = useMemo(
    () => localizedPois.filter((poi) => poi.status === "available"),
    [localizedPois],
  )

  const initialPoi = useMemo(
    () => availablePois[0] ?? localizedPois[0],
    [availablePois, localizedPois],
  )

  const [selectedPoi, setSelectedPoi] = useState<MapPoi>(initialPoi)

  useEffect(() => {
    const refreshed = localizedPois.find((poi) => poi.id === selectedPoi.id)
    if (refreshed) setSelectedPoi(refreshed)
  }, [localizedPois, selectedPoi.id])

  return (
    <section className="mx-auto mt-2 w-full max-w-5xl pb-6 sm:mt-4 sm:pb-10">
      <div className="mb-3 rounded-[1.5rem] border border-white/70 bg-background/62 p-3 text-center shadow-[0_14px_45px_rgba(61,45,28,0.08)] backdrop-blur-xl sm:mb-4 sm:p-5 sm:text-left">
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.22em] text-accent/90 sm:text-[10px]">
              {t("mapLabel")}
            </p>

            <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-muted-foreground sm:mx-0 sm:text-sm">
              {t("mapDescription")}
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-background/70 p-1.5 shadow-[0_26px_90px_rgba(61,45,28,0.16)] backdrop-blur-xl sm:rounded-[2.3rem] sm:p-2">
        <div className="relative aspect-[1365/1024] w-full overflow-hidden rounded-[1.55rem] border border-white/50 bg-[#efe5d2] sm:rounded-[1.9rem]">
          <img
            src="/assets/maps/malaga-map-stylized.png"
            alt={t("mapLabel")}
            className="absolute inset-0 h-full w-full object-cover"
            draggable={false}
          />

          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,transparent_0%,transparent_64%,rgba(33,24,18,0.08)_100%)]" />

          <div
            className="absolute bottom-3 right-3 z-30 grid h-10 w-10 place-items-center rounded-full border border-white/70 bg-background/82 text-accent shadow-md backdrop-blur-md sm:bottom-5 sm:right-5 sm:h-11 sm:w-11"
            aria-label={t("northUp")}
            title={t("northUp")}
          >
            <Navigation className="h-5 w-5 -rotate-45" />
          </div>

          {localizedPois.map((poi) => (
            <PoiMarker
              key={poi.id}
              poi={poi}
              selected={selectedPoi.id === poi.id}
              onSelect={setSelectedPoi}
              selectLabel={t("selectPoi")}
            />
          ))}
        </div>

        <SceneSelector
          pois={availablePois}
          selectedPoi={selectedPoi}
          onSelect={setSelectedPoi}
          availableScenesLabel={t("availableScenes")}
          scenesLabel={t("scenes")}
        />

        <div className="border-t border-white/65 bg-background/96 pb-6 pt-1.5 sm:pb-7 sm:pt-2">
          {selectedPoi.previewImage && (
            <div className="mb-5 w-full overflow-hidden rounded-[1.55rem] border border-white/50 bg-muted shadow-sm sm:rounded-[1.9rem]">
              <div className="relative aspect-[16/7] w-full sm:aspect-[21/8]">
                <img
                  src={selectedPoi.previewImage}
                  alt={selectedPoi.title}
                  className="h-full w-full object-cover"
                  draggable={false}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent" />

                <div className="absolute bottom-3 left-3 rounded-full border border-white/30 bg-black/40 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-white shadow-sm backdrop-blur-md sm:bottom-4 sm:left-4">
                  Preview
                </div>
              </div>
            </div>
          )}

          <div className="mx-auto flex max-w-md flex-col items-center px-5 pb-1 text-center sm:px-6">
            <p className="text-[9px] font-bold uppercase tracking-[0.24em] text-accent/85 sm:text-[10px]">
              {t("exactPoint")}
            </p>

            <h3 className="mt-3 max-w-sm text-center font-serif text-[2.25rem] font-light leading-none tracking-[-0.055em] text-[#241811] sm:text-[2.8rem]">
              {selectedPoi.title}
            </h3>

            {selectedPoi.status !== "available" && (
              <span
                className="mt-4 inline-flex rounded-full border border-border bg-muted px-4 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground"
              >
                {t("comingSoon")}
              </span>
            )}

            <p className="mt-4 max-w-xs font-sans text-[9px] font-bold uppercase leading-relaxed tracking-[0.22em] text-[#7b6a58] sm:max-w-sm sm:text-[11px]">
              {selectedPoi.locationLabel}
              {selectedPoi.period ? ` · ${selectedPoi.period}` : ""}
            </p>

            <p className="mt-4 max-w-[19rem] text-center font-sans text-[0.85rem] leading-relaxed text-[#6f6255] sm:max-w-sm sm:text-base">
              {selectedPoi.shortDescription}
            </p>

            <div className="mt-6 flex w-full max-w-sm flex-col items-center gap-2.5">
              {selectedPoi.status === "available" && selectedPoi.sceneId ? (
                <>
                  <Link
                    href={`/scene/${selectedPoi.sceneId}`}
                    className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#17110d] px-5 py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#f8f0e3] shadow-[0_12px_28px_rgba(23,17,13,0.18)] transition-transform active:scale-[0.98]"
                  >
                    {t("openViewer")}
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  {hasValidDirections(selectedPoi) && (
                    <button
                      type="button"
                      onClick={() => openDirections(selectedPoi)}
                      className="inline-flex w-full items-center justify-center gap-3 rounded-full border border-[#d8c8b4] bg-white/58 px-5 py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#241811] shadow-sm backdrop-blur-sm transition-transform active:scale-[0.98]"
                    >
                      {t("howToArrive")}
                      <Navigation className="h-4 w-4 -rotate-45" />
                    </button>
                  )}
                </>
              ) : (
                <div className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-border bg-muted/60 px-5 py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {t("futureScene")}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}