"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Viewer180 } from "@/components/viewer/viewer-180"
import { useLanguage } from "@/components/i18n/language-provider"
import type { Scene, SceneMediaSource } from "@/types/scene"

const PREROLL_FADE_DURATION = 520
const SCENE_REVEAL_DURATION = 520

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
  const { t } = useLanguage()
  const prerollMedia = useMemo(
    () =>
      scene.media.type === "video" || scene.media.type === "image"
        ? scene.media.preroll
        : undefined,
    [scene.media]
  )
  const [isPrerollVisible, setIsPrerollVisible] = useState(
    Boolean(prerollMedia)
  )
  const [isPrerollFadingOut, setIsPrerollFadingOut] = useState(false)
  const [isPrerollPlaybackBlocked, setIsPrerollPlaybackBlocked] =
    useState(false)
  const [isSceneRevealVisible, setIsSceneRevealVisible] = useState(false)
  const [isSceneRevealActive, setIsSceneRevealActive] = useState(false)
  const prerollVideoRef = useRef<HTMLVideoElement | null>(null)
  const transitionTimeoutsRef = useRef<number[]>([])
  const isPrerollBlockingScene =
    Boolean(prerollMedia) &&
    (isPrerollVisible || isPrerollFadingOut || isSceneRevealVisible)

  useEffect(() => {
    let cancelled = false

    queueMicrotask(() => {
      if (cancelled) return

      transitionTimeoutsRef.current.forEach((timeoutId) => {
        window.clearTimeout(timeoutId)
      })
      transitionTimeoutsRef.current = []

      setIsPrerollVisible(Boolean(prerollMedia))
      setIsPrerollFadingOut(false)
      setIsPrerollPlaybackBlocked(false)
      setIsSceneRevealVisible(false)
      setIsSceneRevealActive(false)
    })

    return () => {
      cancelled = true
    }
  }, [scene.id, prerollMedia])

  useEffect(() => {
    return () => {
      transitionTimeoutsRef.current.forEach((timeoutId) => {
        window.clearTimeout(timeoutId)
      })
      transitionTimeoutsRef.current = []
    }
  }, [])

  useEffect(() => {
    if (!isPrerollVisible || !prerollVideoRef.current || !prerollMedia) {
      return
    }

    const video = prerollVideoRef.current
    const source = pickBestVideoSource(video, prerollMedia.src, prerollMedia.sources)
    let playbackCheckTimeout: number | null = null

    const handleTimeUpdate = () => {
      // No-op: just let the video play
    }

    const markPlaybackBlocked = () => {
      if (video.ended) return
      setIsPrerollPlaybackBlocked(true)
    }

    const clearPlaybackBlocked = () => {
      setIsPrerollPlaybackBlocked(false)
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
      transitionTimeoutsRef.current.forEach((timeoutId) => {
        window.clearTimeout(timeoutId)
      })
      transitionTimeoutsRef.current = []

      setIsPrerollFadingOut(true)

      const blackoutTimeout = window.setTimeout(() => {
        setIsPrerollVisible(false)
        setIsSceneRevealVisible(true)

        window.requestAnimationFrame(() => {
          setIsSceneRevealActive(true)
        })
      }, PREROLL_FADE_DURATION)

      const revealTimeout = window.setTimeout(() => {
        setIsSceneRevealVisible(false)
        setIsSceneRevealActive(false)
        setIsPrerollFadingOut(false)
      }, PREROLL_FADE_DURATION + SCENE_REVEAL_DURATION)

      transitionTimeoutsRef.current.push(blackoutTimeout, revealTimeout)
    }

    video.addEventListener("timeupdate", handleTimeUpdate)
    video.addEventListener("playing", clearPlaybackBlocked)
    video.addEventListener("ended", handleEnded)

    video
      .play()
      .then(clearPlaybackBlocked)
      .catch(() => {
        markPlaybackBlocked()
      })

    playbackCheckTimeout = window.setTimeout(() => {
      if (video.paused && video.currentTime < 0.08) {
        markPlaybackBlocked()
      }
    }, 1200)

    return () => {
      if (playbackCheckTimeout !== null) {
        window.clearTimeout(playbackCheckTimeout)
      }
      video.removeEventListener("timeupdate", handleTimeUpdate)
      video.removeEventListener("playing", clearPlaybackBlocked)
      video.removeEventListener("ended", handleEnded)
    }
  }, [isPrerollVisible, prerollMedia])

  function playBlockedPreroll() {
    const video = prerollVideoRef.current
    if (!video) return

    setIsPrerollPlaybackBlocked(false)
    video
      .play()
      .catch(() => {
        setIsPrerollPlaybackBlocked(true)
      })
  }

  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      <Viewer180
        scene={scene}
        motionEnabled={motionEnabled}
        sceneMediaPlaybackEnabled={!isPrerollBlockingScene}
        autoStartAmbientAudio={autoStartAmbientAudio && !isPrerollBlockingScene}
        onExit={onExit}
      />

      {isPrerollVisible && prerollMedia && (
        <div
          className={`timeless-preroll-bridge absolute inset-0 z-30 bg-black ${
            isPrerollFadingOut ? "timeless-preroll-bridge--exiting" : ""
          }`}
        >
          <video
            ref={prerollVideoRef}
            className="timeless-preroll-bridge__video"
            playsInline
            autoPlay
          />
          {isPrerollPlaybackBlocked && !isPrerollFadingOut && (
            <button
              type="button"
              className="timeless-preroll-bridge__play"
              onClick={playBlockedPreroll}
            >
              {t("playIntro")}
            </button>
          )}
        </div>
      )}

      {isSceneRevealVisible && (
        <div
          className={`timeless-scene-reveal absolute inset-0 z-30 ${
            isSceneRevealActive ? "timeless-scene-reveal--active" : ""
          }`}
          aria-hidden="true"
        />
      )}
    </div>
  )
}
