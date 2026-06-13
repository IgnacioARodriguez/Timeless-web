"use client"

import { useState } from "react"
import type { Scene } from "@/types/scene"
import { IntroStep } from "@/components/experience/intro-step"
import { ViewerStep } from "@/components/experience/viewer-step"
import { BackButton } from "@/components/navigation/back-button"
import { LanguageSwitch } from "@/components/i18n/language-switch"
import { useLanguage } from "@/components/i18n/language-provider"
import { getLocalizedScene } from "@/lib/localized-scene"
import { requestOrientationPermission } from "@/lib/device-orientation"

interface SceneExperienceShellProps {
  scene: Scene
}

export function SceneExperienceShell({ scene }: SceneExperienceShellProps) {
  const { language, t } = useLanguage()
  const localizedScene = getLocalizedScene(scene, language)
  const [step, setStep] = useState<"intro" | "viewer">("intro")
  const [motionEnabled, setMotionEnabled] = useState(false)
  const [autoStartAmbientAudio, setAutoStartAmbientAudio] = useState(false)
  const [requestingPermissions, setRequestingPermissions] = useState(false)

  async function handleBeginExperience() {
    if (requestingPermissions) return

    setRequestingPermissions(true)

    // iOS requires this call to happen directly inside the user's tap/click flow.
    const orientationState = await requestOrientationPermission()

    setMotionEnabled(orientationState === "granted")
    setRequestingPermissions(false)
    setAutoStartAmbientAudio(true)
    setStep("viewer")
  }

  function handleRestart() {
    setMotionEnabled(false)
    setAutoStartAmbientAudio(false)
    setRequestingPermissions(false)
    setStep("intro")
  }

  const showShellControls = step !== "viewer"

  return (
    <div className="relative w-full min-h-svh overflow-hidden">
      {showShellControls && (
        <>
          <BackButton
            href="/"
            label={t("mapBack")}
            variant="dark"
            className="absolute left-4 top-4 z-50 sm:left-6 sm:top-6"
          />

          <LanguageSwitch
            variant="dark"
            className="absolute right-4 top-4 z-50 sm:right-6 sm:top-6"
          />
        </>
      )}

      {step === "intro" && (
        <IntroStep
          scene={localizedScene}
          onBegin={handleBeginExperience}
          isStarting={requestingPermissions}
        />
      )}

      {step === "viewer" && (
        <ViewerStep
          scene={localizedScene}
          motionEnabled={motionEnabled}
          autoStartAmbientAudio={autoStartAmbientAudio}
          onExit={handleRestart}
        />
      )}
    </div>
  )
}
