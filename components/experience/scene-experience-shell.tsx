"use client"

import { useState } from "react"
import type { Scene } from "@/types/scene"
import type { ExperienceStep, CalibrationOffset } from "@/types/experience"
import { IntroStep } from "@/components/experience/intro-step"
import { PermissionsStep } from "@/components/experience/permissions-step"
import { CalibrationStep } from "@/components/experience/calibration-step"
import { ViewerStep } from "@/components/experience/viewer-step"
import { ErrorStep } from "@/components/experience/error-step"
import { BackButton } from "@/components/navigation/back-button"

interface SceneExperienceShellProps {
  scene: Scene
}

export function SceneExperienceShell({ scene }: SceneExperienceShellProps) {
  const [step, setStep] = useState<ExperienceStep>("intro")
  const [calibration, setCalibration] = useState<CalibrationOffset | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  function handleError(message: string) {
    setErrorMessage(message)
    setStep("error")
  }

  function handleCalibrationComplete(offset: CalibrationOffset) {
    setCalibration(offset)
    setStep("viewer")
  }

  function handleRestart() {
    setCalibration(null)
    setErrorMessage(null)
    setStep("intro")
  }

  function handleBack() {
    if (step === "viewer") {
      setCalibration(null)
      setErrorMessage(null)
      setStep("calibration")
      return
    }

    if (step === "calibration") {
      setErrorMessage(null)
      setStep("permissions")
      return
    }

    if (step === "permissions" || step === "error") {
      setCalibration(null)
      setErrorMessage(null)
      setStep("intro")
    }
  }

  const backButtonVariant = step === "permissions" || step === "error" ? "light" : "dark"

  return (
    <div className="relative w-full min-h-svh overflow-hidden">
      {step === "intro" ? (
        <BackButton
          href="/cities/malaga"
          label="Volver al mapa de Málaga"
          variant="dark"
          className="absolute left-4 top-4 z-50 sm:left-6 sm:top-6"
        />
      ) : (
        <BackButton
          onClick={handleBack}
          label="Volver a la vista anterior"
          variant={backButtonVariant}
          className="absolute left-4 top-4 z-50 sm:left-6 sm:top-6"
        />
      )}
      {step === "intro" && (
        <IntroStep scene={scene} onBegin={() => setStep("permissions")} />
      )}

      {step === "permissions" && (
        <PermissionsStep
          onGranted={() => setStep("calibration")}
          onError={handleError}
        />
      )}

      {step === "calibration" && (
        <CalibrationStep
          scene={scene}
          onReady={handleCalibrationComplete}
          onError={handleError}
        />
      )}

      {step === "viewer" && calibration && (
        <ViewerStep
          scene={scene}
          calibration={calibration}
          onExit={handleRestart}
          onError={handleError}
        />
      )}

      {step === "error" && (
        <ErrorStep
          message={errorMessage ?? "An unexpected error occurred."}
          onRetry={handleRestart}
        />
      )}
    </div>
  )
}
