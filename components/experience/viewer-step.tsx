"use client"

import { Viewer180 } from "@/components/viewer/viewer-180"
import type { Scene } from "@/types/scene"

interface ViewerStepProps {
  scene: Scene
  motionEnabled: boolean
  autoStartAmbientAudio?: boolean
  onExit: () => void
}

export function ViewerStep({
  scene,
  motionEnabled,
  autoStartAmbientAudio = false,
  onExit,
}: ViewerStepProps) {
  return (
    <div className="w-full h-svh overflow-hidden bg-black">
      <Viewer180
        scene={scene}
        motionEnabled={motionEnabled}
        autoStartAmbientAudio={autoStartAmbientAudio}
        onExit={onExit}
      />
    </div>
  )
}
