export type PoiStatus = "available" | "coming-soon"

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
    lat: number
    lng: number
    label: string
  }
  mapPosition: {
    x: number
    y: number
  }
}