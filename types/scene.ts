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

export type SceneAnimationType = "dust" | "smoke" | "birds" | "flame" | "water" | "cloth"

export interface SceneAnimationLayer {
  id: string
  type: SceneAnimationType
  yaw: number
  pitch: number
  width?: number
  height?: number
  opacity?: number
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
  animations?: SceneAnimationLayer[]
}