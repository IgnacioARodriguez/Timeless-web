"use client"

import { useState, useEffect, useRef } from "react"
import { CameraPreview } from "@/components/calibration/camera-preview"
import { AlignmentOverlay } from "@/components/calibration/alignment-overlay"
import { CalibrationControls } from "@/components/calibration/calibration-controls"
import { useLanguage } from "@/components/i18n/language-provider"
import { requestCameraStream, stopCameraStream } from "@/lib/camera"
import { captureCalibrationOffset } from "@/lib/calibration"
import type { Scene } from "@/types/scene"
import type { CalibrationOffset } from "@/types/experience"

interface CalibrationStepProps {
  scene: Scene
  onReady: (offset: CalibrationOffset) => void
  onError: (message: string) => void
}

export function CalibrationStep({ scene, onReady, onError }: CalibrationStepProps) {
  const { t } = useLanguage()
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [overlayOpacity, setOverlayOpacity] = useState(0.55)
  const [isCapturing, setIsCapturing] = useState(false)

  const orientationRef = useRef({ alpha: 0, beta: 0 })

  useEffect(() => {
    let active = true
    requestCameraStream()
      .then((s) => {
        if (active) setStream(s)
      })
      .catch(() => {
        onError(t("cameraAccessError"))
      })

    return () => {
      active = false
    }
  }, [onError, t])

  useEffect(() => {
    return () => stopCameraStream(stream)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stream])

  useEffect(() => {
    function handleOrientation(e: DeviceOrientationEvent) {
      orientationRef.current = {
        alpha: e.alpha ?? 0,
        beta: e.beta ?? 0,
      }
    }

    window.addEventListener("deviceorientation", handleOrientation)
    return () => window.removeEventListener("deviceorientation", handleOrientation)
  }, [])

  function handleReady() {
    setIsCapturing(true)
    const { alpha, beta } = orientationRef.current
    const offset = captureCalibrationOffset(alpha, beta)
    stopCameraStream(stream)
    setStream(null)
    onReady(offset)
  }

  return (
    <div className="relative w-full h-svh overflow-hidden bg-black">
      <CameraPreview stream={stream} />
      {scene.overlay && <AlignmentOverlay src={scene.overlay} opacity={overlayOpacity} />}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/50 to-transparent z-10 pointer-events-none" />

      <div className="absolute top-0 left-0 right-0 z-10 px-5 pl-16 pt-8">
        <p className="text-[10px] tracking-[0.25em] uppercase text-background/40 font-sans mb-0.5">
          {t("calibration")}
        </p>
        <p className="text-sm font-serif font-light text-background/80 leading-snug">
          {scene.title}
        </p>
      </div>

      <CalibrationControls
        overlayOpacity={overlayOpacity}
        onOpacityChange={setOverlayOpacity}
        hasOverlay={Boolean(scene.overlay)}
        onReady={handleReady}
        isCapturing={isCapturing}
      />
    </div>
  )
}
