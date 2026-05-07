export type SceneMedia =
  | {
    type: "image"
    src: string
    projection: "180" | "flat"
  }
  | {
    type: "video"
    src: string
    projection: "180" | "flat"
    loop: boolean
    muted: boolean
  }

export interface SceneCamera {
  initialYaw: number
  initialPitch: number
  minYaw: number
  maxYaw: number
  minPitch: number
  maxPitch: number
}

export interface SceneHotspot {
  id: string
  label: string
  title: string
  description: string
  yaw: number
  pitch: number
  audio?: {
    src: string
    label?: string
  }
}

export interface Scene {
  id: string
  title: string
  subtitle: string
  description: string
  poster: string
  overlay?: string
  media: SceneMedia
  camera: SceneCamera
  hotspots?: SceneHotspot[]
}