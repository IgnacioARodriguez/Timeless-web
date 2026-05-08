"use client"

import { useState } from "react"
import type { Scene } from "@/types/scene"
import type { ExperienceStep, CalibrationOffset, PermissionsState } from "@/types/experience"
import { IntroStep } from "@/components/experience/intro-step"
import { CalibrationStep } from "@/components/experience/calibration-step"
import { ViewerStep } from "@/components/experience/viewer-step"
import { ErrorStep } from "@/components/experience/error-step"
import { BackButton } from "@/components/navigation/back-button"
import { LanguageSwitch } from "@/components/i18n/language-switch"
import { useLanguage } from "@/components/i18n/language-provider"
import { getLocalizedScene } from "@/lib/localized-scene"
import { requestCameraStream } from "@/lib/camera"
import { requestOrientationPermission } from "@/lib/device-orientation"

interface SceneExperienceShellProps {
  scene: Scene
}

export function SceneExperienceShell({ scene }: SceneExperienceShellProps) {
  const { language, t } = useLanguage()
  const localizedScene = getLocalizedScene(scene, language)
  const [step, setStep] = useState<ExperienceStep>("intro")
  const [calibration, setCalibration] = useState<CalibrationOffset | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [permissions, setPermissions] = useState<PermissionsState | null>(null)
  const [autoStartAmbientAudio, setAutoStartAmbientAudio] = useState(false)
  const [requestingPermissions, setRequestingPermissions] = useState(false)

  function handleError(message: string) {
    setRequestingPermissions(false)
    setErrorMessage(message)
    setStep("error")
  }

  async function handleBeginExperience() {
    if (requestingPermissions) return

    setRequestingPermissions(true)
    setErrorMessage(null)

    let cameraState: PermissionsState["camera"] = "idle"
    let orientationState: PermissionsState["orientation"] = "idle"

    // iOS requires this call to happen directly inside the user's tap/click flow.
    orientationState = await requestOrientationPermission()

    try {
      const stream = await requestCameraStream()
      // The calibration step owns its own camera stream, so release this one immediately.
      stream.getTracks().forEach((track) => track.stop())
      cameraState = "granted"
    } catch {
      cameraState = "denied"
    }

    const updatedPermissions: PermissionsState = {
      camera: cameraState,
      orientation: orientationState,
    }

    setPermissions(updatedPermissions)
    setRequestingPermissions(false)

    if (cameraState === "denied") {
      handleError(t("cameraRequiredError"))
      return
    }

    // Orientation denied/unavailable is non-fatal: the viewer still supports finger drag.
    setAutoStartAmbientAudio(true)
    setStep("calibration")
  }

  function handleCalibrationComplete(offset: CalibrationOffset) {
    setCalibration(offset)
    setStep("viewer")
  }

  function handleRestart() {
    setCalibration(null)
    setErrorMessage(null)
    setPermissions(null)
    setAutoStartAmbientAudio(false)
    setRequestingPermissions(false)
    setStep("intro")
  }

  function handleBack() {
    if (step === "viewer") {
      setCalibration(null)
      setErrorMessage(null)
      setStep("calibration")
      return
    }

    if (step === "calibration" || step === "error") {
      setCalibration(null)
      setErrorMessage(null)
      setPermissions(null)
      setAutoStartAmbientAudio(false)
      setRequestingPermissions(false)
      setStep("intro")
    }
  }

  const backButtonVariant = step === "error" ? "light" : "dark"
  const switchVariant = step === "error" ? "light" : "dark"
  const showShellControls = step !== "viewer"

  return (
    <div className="relative w-full min-h-svh overflow-hidden">
      {showShellControls && (
        <>
          {step === "intro" ? (
            <BackButton
              href="/cities/malaga"
              label={t("backToMalagaMap")}
              variant="dark"
              className="absolute left-4 top-4 z-50 sm:left-6 sm:top-6"
            />
          ) : (
            <BackButton
              onClick={handleBack}
              label={t("backPrevious")}
              variant={backButtonVariant}
              className="absolute left-4 top-4 z-50 sm:left-6 sm:top-6"
            />
          )}

          <LanguageSwitch
            variant={switchVariant}
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

      {step === "calibration" && (
        <CalibrationStep
          scene={localizedScene}
          onReady={handleCalibrationComplete}
          onError={handleError}
        />
      )}

      {step === "viewer" && calibration && (
        <ViewerStep
          scene={localizedScene}
          calibration={calibration}
          motionEnabled={permissions?.orientation === "granted"}
          cameraPassthroughEnabled={permissions?.camera === "granted"}
          autoStartAmbientAudio={autoStartAmbientAudio}
          onExit={handleRestart}
          onError={handleError}
        />
      )}

      {step === "error" && (
        <ErrorStep
          message={errorMessage ?? t("unexpectedError")}
          onRetry={handleRestart}
        />
      )}
    </div>
  )
}
