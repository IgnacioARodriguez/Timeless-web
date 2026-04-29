"use client"

import { useState } from "react"
import type { Scene } from "@/types/scene"
import type { ExperienceStep, CalibrationOffset } from "@/types/experience"
import { IntroStep } from "@/components/experience/intro-step"
import { PermissionsStep } from "@/components/experience/permissions-step"
import { CalibrationStep } from "@/components/experience/calibration-step"
import { ViewerStep } from "@/components/experience/viewer-step"
import { ErrorStep } from "@/components/experience/error-step"

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

  return (
    <div className="relative w-full min-h-svh overflow-hidden">
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
