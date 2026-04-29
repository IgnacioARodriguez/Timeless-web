"use client"

import { useState, useEffect, useRef } from "react"
import { CameraPreview } from "@/components/calibration/camera-preview"
import { AlignmentOverlay } from "@/components/calibration/alignment-overlay"
import { CalibrationControls } from "@/components/calibration/calibration-controls"
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
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [overlayOpacity, setOverlayOpacity] = useState(0.55)
  const [isCapturing, setIsCapturing] = useState(false)

  // Live orientation values updated by DeviceOrientationEvent listener
  const orientationRef = useRef({ alpha: 0, beta: 0 })

  // Start camera on mount
  useEffect(() => {
    let active = true
    requestCameraStream()
      .then((s) => {
        if (active) setStream(s)
      })
      .catch(() => {
        onError(
          "Could not access the camera. Please allow camera access and try again."
        )
      })

    return () => {
      active = false
    }
  }, [onError])

  // Stop camera when unmounting
  useEffect(() => {
    return () => stopCameraStream(stream)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stream])

  // Track live orientation
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
    // Stop camera before handing control to viewer
    stopCameraStream(stream)
    setStream(null)
    onReady(offset)
  }

  return (
    <div className="relative w-full h-svh overflow-hidden bg-black">
      {/* Live camera feed */}
      <CameraPreview stream={stream} />

      {/* Historical alignment overlay, when the scene has one configured */}
      {scene.overlay && <AlignmentOverlay src={scene.overlay} opacity={overlayOpacity} />}

      {/* Subtle top gradient for instruction readability */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/50 to-transparent z-10 pointer-events-none" />

      {/* Scene label */}
      <div className="absolute top-0 left-0 right-0 z-10 px-5 pl-16 pt-8">
        <p className="text-[10px] tracking-[0.25em] uppercase text-background/40 font-sans mb-0.5">
          Calibration
        </p>
        <p className="text-sm font-serif font-light text-background/80 leading-snug">
          {scene.title}
        </p>
      </div>

      {/* Controls overlay */}
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
