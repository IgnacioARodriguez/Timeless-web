import type { Language } from "@/components/i18n/language-provider"
import type { Scene } from "@/types/scene"

export function getLocalizedScene(scene: Scene, language: Language): Scene {
  if (language === "es") return scene

  const sceneTranslation = scene.i18n?.[language]

  return {
    ...scene,
    title: sceneTranslation?.title ?? scene.title,
    subtitle: sceneTranslation?.subtitle ?? scene.subtitle,
    description: sceneTranslation?.description ?? scene.description,
    ambientAudio: scene.ambientAudio
      ? {
          ...scene.ambientAudio,
          label: scene.ambientAudio.i18n?.[language]?.label ?? scene.ambientAudio.label,
        }
      : undefined,
    hotspots: scene.hotspots?.map((hotspot) => {
      const hotspotTranslation = hotspot.i18n?.[language]
      return {
        ...hotspot,
        label: hotspotTranslation?.label ?? hotspot.label,
        title: hotspotTranslation?.title ?? hotspot.title,
        description: hotspotTranslation?.description ?? hotspot.description,
        audio: hotspot.audio
          ? {
              ...hotspot.audio,
              label: hotspot.audio.i18n?.[language]?.label ?? hotspot.audio.label,
            }
          : undefined,
      }
    }),
  }
}
