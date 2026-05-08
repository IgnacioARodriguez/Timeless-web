export type PoiStatus = "available" | "coming-soon"

export interface MapPoiTranslation {
  title?: string
  period?: string
  shortDescription?: string
  locationLabel?: string
  directionsLabel?: string
}

export interface MapPoi {
  id: string
  title: string
  period: string
  shortDescription: string
  locationLabel: string
  status: PoiStatus
  sceneId?: string
  previewImage?: string
  directions?: {
    latitude: number
    longitude: number
    label: string
  }
  mapPosition: {
    x: number
    y: number
  }
  i18n?: {
    en?: MapPoiTranslation
  }
}