import type { Language } from "@/components/i18n/language-provider"
import type { TimelessCity } from "@/types/city"
import type { MapPoi } from "@/types/poi"

export function getLocalizedCity(city: TimelessCity, language: Language): TimelessCity {
  if (language === "es") return city
  const translation = city.i18n?.[language]
  return {
    ...city,
    country: translation?.country ?? city.country,
    regionLabel: translation?.regionLabel ?? city.regionLabel,
    description: translation?.description ?? city.description,
    highlights: translation?.highlights ?? city.highlights,
    accentLabel: translation?.accentLabel ?? city.accentLabel,
  }
}

export function getLocalizedPoi(poi: MapPoi, language: Language): MapPoi {
  if (language === "es") return poi
  const translation = poi.i18n?.[language]
  return {
    ...poi,
    title: translation?.title ?? poi.title,
    period: translation?.period ?? poi.period,
    shortDescription: translation?.shortDescription ?? poi.shortDescription,
    locationLabel: translation?.locationLabel ?? poi.locationLabel,
    directions: poi.directions
      ? {
          ...poi.directions,
          label: translation?.directionsLabel ?? poi.directions.label,
        }
      : undefined,
  }
}
