export type CityStatus = "available" | "coming-soon"

export interface TimelessCity {
  id: string
  name: string
  country: string
  regionLabel: string
  description: string
  highlights: string[]
  scenesCount: number
  status: CityStatus
  href?: string
  coverImage?: string
  accentLabel?: string
}
