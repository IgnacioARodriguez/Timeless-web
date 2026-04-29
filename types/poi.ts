export type MapPoiStatus = "available" | "coming-soon"

export interface MapPoi {
  id: string
  title: string
  period: string
  shortDescription: string
  locationLabel: string
  status: MapPoiStatus
  sceneId?: string
  mapPosition: {
    x: number
    y: number
  }
  directions?: {
    latitude: number
    longitude: number
    label: string
  }
}
