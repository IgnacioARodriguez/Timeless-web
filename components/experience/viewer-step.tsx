"use client"

import { Viewer180 } from "@/components/viewer/viewer-180"
import type { Scene } from "@/types/scene"
import type { CalibrationOffset } from "@/types/experience"

interface ViewerStepProps {
  scene: Scene
  calibration: CalibrationOffset
  onExit: () => void
  onError: (message: string) => void
}

export function ViewerStep({ scene, calibration, onExit }: ViewerStepProps) {
  return (
    <div className="w-full h-svh overflow-hidden bg-black">
      <Viewer180 scene={scene} calibration={calibration} onExit={onExit} />
    </div>
  )
}
