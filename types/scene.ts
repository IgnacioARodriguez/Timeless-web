export type SceneMedia =
  | {
    type: "image"
    src: string
    projection: "180"
  }
  | {
    type: "video"
    src: string
    projection: "180"
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

export interface Scene {
  id: string
  title: string
  subtitle: string
  description: string
  poster: string
  overlay?: string
  media: SceneMedia
  camera: SceneCamera
}