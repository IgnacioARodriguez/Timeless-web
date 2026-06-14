"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Viewer180 } from "@/components/viewer/viewer-180"
import type { Scene, SceneMediaSource } from "@/types/scene"

interface ViewerStepProps {
  scene: Scene
  motionEnabled: boolean
  autoStartAmbientAudio?: boolean
  onExit: () => void
}

function pickBestVideoSource(
  video: HTMLVideoElement,
  src: string,
  sources?: SceneMediaSource[]
) {
  const playableSource = sources?.find((source) => {
    if (!source.type) return true
    return video.canPlayType(source.type) !== ""
  })

  return playableSource?.src ?? src
}

export function ViewerStep({
  scene,
  motionEnabled,
  autoStartAmbientAudio = false,
  onExit,
}: ViewerStepProps) {
  const [isPrerollVisible, setIsPrerollVisible] = useState(
    scene.media.type === "video" && Boolean(scene.media.preroll)
  )
  const [isPrerollFadingOut, setIsPrerollFadingOut] = useState(false)
  const prerollVideoRef = useRef<HTMLVideoElement | null>(null)

  const prerollMedia = useMemo(
    () =>
      scene.media.type === "video" ? scene.media.preroll : undefined,
    [scene.media]
  )

  useEffect(() => {
    setIsPrerollVisible(
      scene.media.type === "video" && Boolean(scene.media.preroll)
    )
  }, [scene.id, scene.media.type, prerollMedia?.src])

  useEffect(() => {
    if (!isPrerollVisible) {
      setIsPrerollFadingOut(false)
    }
  }, [isPrerollVisible])

  useEffect(() => {
    if (!isPrerollVisible || !prerollVideoRef.current || !prerollMedia) {
      return
    }

    const video = prerollVideoRef.current
    const source = pickBestVideoSource(video, prerollMedia.src, prerollMedia.sources)

    const handleTimeUpdate = () => {
      // No-op: just let the video play
    }

    video.src = source
    video.poster = prerollMedia.poster ?? ""
    video.muted = prerollMedia.muted ?? false
    video.loop = prerollMedia.loop ?? false
    video.playsInline = true
    video.preload = "auto"
    video.controls = false
    video.setAttribute("playsinline", "true")
    video.setAttribute("webkit-playsinline", "true")
    video.setAttribute("controlslist", "nodownload noplaybackrate noremoteplayback")
    video.setAttribute("disableremoteplayback", "true")

    const handleEnded = () => {
      // Start fade-out animation
      setIsPrerollFadingOut(true)
      // After fade animation completes (800ms), hide the preroll
      const timer = setTimeout(() => {
        setIsPrerollVisible(false)
      }, 800)
      return () => clearTimeout(timer)
    }

    video.addEventListener("timeupdate", handleTimeUpdate)
    video.addEventListener("ended", handleEnded)

    video
      .play()
      .catch(() => {
        // Some browsers may still block autoplay; the user gesture should
        // normally allow playback after the experience start button tap.
      })

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate)
      video.removeEventListener("ended", handleEnded)
    }
  }, [isPrerollVisible, prerollMedia])

  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      <Viewer180
        scene={scene}
        motionEnabled={motionEnabled}
        autoStartAmbientAudio={autoStartAmbientAudio}
        onExit={onExit}
      />

      {isPrerollVisible && prerollMedia && (
        <div
          className={`absolute inset-0 z-30 bg-black flex items-center justify-center ${
            isPrerollFadingOut ? "timeless-fade-out" : ""
          }`}
        >
          <video
            ref={prerollVideoRef}
            className="w-full h-full"
            style={{ objectFit: "contain" }}
            playsInline
            autoPlay
          />
        </div>
      )}
    </div>
  )
}
