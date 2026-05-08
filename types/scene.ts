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

export interface SceneTranslation {
  title?: string
  subtitle?: string
  description?: string
}

export interface SceneAudioTranslation {
  label?: string
}

export interface SceneAmbientAudio {
  src: string
  label?: string
  volume?: number
  loop?: boolean
  i18n?: {
    en?: SceneAudioTranslation
  }
}

export interface SceneCamera {
  initialYaw: number
  initialPitch: number
  minYaw: number
  maxYaw: number
  minPitch: number
  maxPitch: number
}

export interface SceneHotspotFocus {
  shape?: "ellipse" | "rect"
  width: number
  height: number
  offsetX?: number
  offsetY?: number
  strokeColor?: string
  strokeWidth?: number
}

export interface SceneHotspotTranslation {
  label?: string
  title?: string
  description?: string
}

export interface SceneHotspot {
  id: string
  label: string
  title: string
  description: string
  yaw: number
  pitch: number
  focus?: SceneHotspotFocus
  i18n?: {
    en?: SceneHotspotTranslation
  }
  audio?: {
    src: string
    label?: string
    i18n?: {
      en?: SceneAudioTranslation
    }
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
  ambientAudio?: SceneAmbientAudio
  hotspots?: SceneHotspot[]
  i18n?: {
    en?: SceneTranslation
  }
}