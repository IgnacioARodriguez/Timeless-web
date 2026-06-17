"use client"

import { useMemo } from "react"
import { useRouter } from "next/navigation"
import type { Scene } from "@/types/scene"
import { ViewerStep } from "@/components/experience/viewer-step"
import { useLanguage } from "@/components/i18n/language-provider"
import { getLocalizedScene } from "@/lib/localized-scene"

interface SceneExperienceShellProps {
  scene: Scene
}

const MOTION_PERMISSION_STORAGE_KEY = "timeless-motion-permission"

function getInitialMotionEnabled() {
  if (typeof window === "undefined") return false

  const permissionState = window.sessionStorage.getItem(
    MOTION_PERMISSION_STORAGE_KEY,
  )

  return permissionState !== "denied"
}

export function SceneExperienceShell({ scene }: SceneExperienceShellProps) {
  const router = useRouter()
  const { language } = useLanguage()
  const localizedScene = getLocalizedScene(scene, language)
  const motionEnabled = getInitialMotionEnabled()
  const sceneWithoutAmbientAudio = useMemo<Scene>(
    () => ({
      ...localizedScene,
      ambientAudio: undefined,
    }),
    [localizedScene],
  )

  function handleExit() {
    router.push("/")
  }

  return (
    <div className="timeless-app-viewport bg-black">
      <ViewerStep
        scene={sceneWithoutAmbientAudio}
        motionEnabled={motionEnabled}
        autoStartAmbientAudio={false}
        onExit={handleExit}
      />
    </div>
  )
}
