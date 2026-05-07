"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { clamp } from "@/lib/calibration"
import { LoadingState } from "@/components/viewer/loading-state"
import { ViewerErrorState } from "@/components/viewer/error-state"
import { ViewerControls } from "@/components/viewer/viewer-controls"
import type { Scene } from "@/types/scene"
import type { CalibrationOffset } from "@/types/experience"

interface Viewer180Props {
  scene: Scene
  calibration: CalibrationOffset
  onExit?: () => void
}

type IOSPermissionDeviceOrientationEvent = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<"granted" | "denied">
}

const VIEWER_FOV = 125
const HORIZON_PITCH_OFFSET = 4

function getScreenAngle() {
  const screenOrientation = window.screen.orientation
  if (screenOrientation && typeof screenOrientation.angle === "number") {
    return screenOrientation.angle
  }

  const legacyWindow = window as Window & { orientation?: number }
  if (typeof legacyWindow.orientation === "number") {
    return legacyWindow.orientation
  }

  return 0
}

function deviceQuaternionFromOrientation(
  alphaDeg: number,
  betaDeg: number,
  gammaDeg: number,
  screenAngleDeg: number
) {
  const alpha = THREE.MathUtils.degToRad(alphaDeg)
  const beta = THREE.MathUtils.degToRad(betaDeg)
  const gamma = THREE.MathUtils.degToRad(gammaDeg)
  const orient = THREE.MathUtils.degToRad(screenAngleDeg)

  const euler = new THREE.Euler(beta, alpha, -gamma, "YXZ")
  const quaternion = new THREE.Quaternion().setFromEuler(euler)

  // Ajuste estándar para cámara en mobile.
  const q1 = new THREE.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5))
  const q0 = new THREE.Quaternion().setFromAxisAngle(
    new THREE.Vector3(0, 0, 1),
    -orient
  )

  quaternion.multiply(q1)
  quaternion.multiply(q0)

  return quaternion
}

export function Viewer180({ scene, calibration, onExit }: Viewer180Props) {
  const isImage = scene.media.type === "image"
  const isVideo = scene.media.type === "video"

  const [gyroEnabled, setGyroEnabled] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isEntered, setIsEntered] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [isPlaying, setIsPlaying] = useState(isImage)
  const [isMuted, setIsMuted] = useState(isVideo ? scene.media.muted : false)

  const containerRef = useRef<HTMLDivElement>(null)

  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const threeSceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const meshRef = useRef<THREE.Mesh | null>(null)
  const textureRef = useRef<THREE.Texture | null>(null)
  const frameRef = useRef<number | null>(null)

  const hiddenVideoRef = useRef<HTMLVideoElement | null>(null)

  const calibrationYaw = calibration?.yawOffset ?? 0
  const calibrationPitch = calibration?.pitchOffset ?? 0

  // Orientación renderizada actual.
  const yawRef = useRef(scene.camera.initialYaw + calibrationYaw)
  const pitchRef = useRef(scene.camera.initialPitch + calibrationPitch)

  // Objetivo suavizado dentro del loop de render.
  const targetYawRef = useRef(yawRef.current)
  const targetPitchRef = useRef(pitchRef.current)

  // Base del gyro en espacio 3D real.
  const baselineDeviceQuaternionRef = useRef<THREE.Quaternion | null>(null)
  const motionAnchorYawRef = useRef(yawRef.current)
  const motionAnchorPitchRef = useRef(pitchRef.current)

  // Drag fallback.
  const dragRef = useRef({
    active: false,
    startX: 0,
    startY: 0,
    startYaw: 0,
    startPitch: 0,
  })

  const setMediaReady = useCallback(() => {
    setIsLoading(false)
    setIsEntered(true)
    setHasError(false)
  }, [])

  const setMediaError = useCallback(() => {
    setIsLoading(false)
    setHasError(true)
  }, [])

  const enableGyro = useCallback(async () => {
    try {
      baselineDeviceQuaternionRef.current = null

      // Ancla visual actual. Así no “salta” al activar motion.
      motionAnchorYawRef.current = targetYawRef.current
      motionAnchorPitchRef.current = targetPitchRef.current

      const maybeIOS = DeviceOrientationEvent as IOSPermissionDeviceOrientationEvent

      if (typeof maybeIOS.requestPermission === "function") {
        const result = await maybeIOS.requestPermission()
        setGyroEnabled(result === "granted")
      } else {
        setGyroEnabled(true)
      }
    } catch {
      setGyroEnabled(false)
    }
  }, [])

  const disableGyro = useCallback(() => {
    setGyroEnabled(false)
    baselineDeviceQuaternionRef.current = null
  }, [])

  useEffect(() => {
    const onChange = () => {
      console.log("fullscreenElement:", document.fullscreenElement)
    }

    const onError = () => {
      console.error("fullscreenerror fired")
    }

    document.addEventListener("fullscreenchange", onChange)
    document.addEventListener("fullscreenerror", onError)

    return () => {
      document.removeEventListener("fullscreenchange", onChange)
      document.removeEventListener("fullscreenerror", onError)
    }
  }, [])

  // Gyro 3D relativo con quaternion.
  useEffect(() => {
    function handleOrientation(e: DeviceOrientationEvent) {
      if (!gyroEnabled) return
      if (e.alpha == null || e.beta == null || e.gamma == null) return

      const currentDeviceQuaternion = deviceQuaternionFromOrientation(
        e.alpha,
        e.beta,
        e.gamma,
        getScreenAngle()
      )

      if (baselineDeviceQuaternionRef.current === null) {
        baselineDeviceQuaternionRef.current = currentDeviceQuaternion.clone()
        return
      }

      const deltaQuaternion = baselineDeviceQuaternionRef.current
        .clone()
        .invert()
        .multiply(currentDeviceQuaternion)

      const anchorQuaternion = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(
          THREE.MathUtils.degToRad(motionAnchorPitchRef.current),
          THREE.MathUtils.degToRad(motionAnchorYawRef.current),
          0,
          "YXZ"
        )
      )

      const targetQuaternion = anchorQuaternion.clone().multiply(deltaQuaternion)

      const targetEuler = new THREE.Euler().setFromQuaternion(
        targetQuaternion,
        "YXZ"
      )

      const nextYaw = clamp(
        THREE.MathUtils.radToDeg(targetEuler.y),
        scene.camera.minYaw + calibrationYaw,
        scene.camera.maxYaw + calibrationYaw
      )

      const nextPitch = clamp(
        THREE.MathUtils.radToDeg(targetEuler.x),
        scene.camera.minPitch + calibrationPitch,
        scene.camera.maxPitch + calibrationPitch
      )

      targetYawRef.current = nextYaw
      targetPitchRef.current = nextPitch
    }

    window.addEventListener("deviceorientation", handleOrientation, true)
    return () =>
      window.removeEventListener("deviceorientation", handleOrientation, true)
  }, [gyroEnabled, scene.camera, calibrationYaw, calibrationPitch])

  // Si rota portrait <-> landscape, reseteá baseline para evitar saltos.
  useEffect(() => {
    function handleOrientationChange() {
      if (!gyroEnabled) return

      baselineDeviceQuaternionRef.current = null
      motionAnchorYawRef.current = targetYawRef.current
      motionAnchorPitchRef.current = targetPitchRef.current
    }

    window.addEventListener("orientationchange", handleOrientationChange)
    return () =>
      window.removeEventListener("orientationchange", handleOrientationChange)
  }, [gyroEnabled])

  // Three.js setup.
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let disposed = false
    let localVideo: HTMLVideoElement | null = null
    let onVideoCanPlay: (() => void) | null = null
    let onVideoError: (() => void) | null = null
    let onVideoEnded: (() => void) | null = null

    setIsLoading(true)
    setHasError(false)

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    container.appendChild(renderer.domElement)
    rendererRef.current = renderer

    const threeScene = new THREE.Scene()
    threeScene.background = new THREE.Color(0x000000)
    threeSceneRef.current = threeScene

    const camera = new THREE.PerspectiveCamera(
      VIEWER_FOV,
      container.clientWidth / container.clientHeight,
      0.1,
      1100
    )
    camera.rotation.order = "YXZ"
    cameraRef.current = camera

    // 180° reales en horizontal.
    const geometry = new THREE.SphereGeometry(
      500,
      64,
      40,
      -Math.PI / 2,
      Math.PI,
      0,
      Math.PI
    )
    geometry.scale(-1, 1, 1)

    const createMesh = (texture: THREE.Texture) => {
      if (disposed) {
        texture.dispose()
        return
      }

      texture.colorSpace = THREE.SRGBColorSpace
      texture.minFilter = THREE.LinearFilter
      texture.magFilter = THREE.LinearFilter
      texture.generateMipmaps = false

      const material = new THREE.MeshBasicMaterial({
        map: texture,
      })

      const sphere = new THREE.Mesh(geometry, material)

      // Corrige la orientación base del hemisferio:
      // el centro útil del panorama debe quedar justo enfrente
      // de la cámara al iniciar.
      sphere.rotation.y = Math.PI / 2

      meshRef.current = sphere
      textureRef.current = texture
      threeScene.add(sphere)
      setMediaReady()
    }

    if (isImage) {
      const loader = new THREE.TextureLoader()

      loader.load(
        scene.media.src,
        (texture) => {
          createMesh(texture)
        },
        undefined,
        () => {
          if (disposed) return
          geometry.dispose()
          setMediaError()
        }
      )
    } else if (isVideo) {
      const video = document.createElement("video")
      hiddenVideoRef.current = video
      localVideo = video

      video.src = scene.media.src
      video.crossOrigin = "anonymous"
      video.loop = scene.media.loop
      video.muted = scene.media.muted
      video.playsInline = true
      video.preload = "auto"
      video.setAttribute("playsinline", "true")
      video.setAttribute("webkit-playsinline", "true")

      onVideoCanPlay = () => {
        const videoTexture = new THREE.VideoTexture(video)
        createMesh(videoTexture)

        video
          .play()
          .then(() => {
            if (!disposed) setIsPlaying(true)
          })
          .catch(() => {
            if (!disposed) setIsPlaying(false)
          })
      }

      onVideoError = () => {
        if (disposed) return
        geometry.dispose()
        setMediaError()
      }

      onVideoEnded = () => {
        if (!scene.media.loop && !disposed) {
          setIsPlaying(false)
        }
      }

      video.addEventListener("canplay", onVideoCanPlay, { once: true })
      video.addEventListener("error", onVideoError, { once: true })
      video.addEventListener("ended", onVideoEnded)
      video.load()
    }

    const handleResize = () => {
      const el = containerRef.current
      const currentRenderer = rendererRef.current
      const currentCamera = cameraRef.current
      if (!el || !currentRenderer || !currentCamera) return

      const width = el.clientWidth
      const height = el.clientHeight

      currentRenderer.setSize(width, height)
      currentCamera.aspect = width / height
      currentCamera.updateProjectionMatrix()
    }

    window.addEventListener("resize", handleResize)

    const animate = () => {
      frameRef.current = window.requestAnimationFrame(animate)

      // Suavizado para quitar jitter del sensor.
      yawRef.current = THREE.MathUtils.lerp(
        yawRef.current,
        targetYawRef.current,
        0.08
      )
      pitchRef.current = THREE.MathUtils.lerp(
        pitchRef.current,
        targetPitchRef.current,
        0.08
      )

      const currentCamera = cameraRef.current
      const currentRenderer = rendererRef.current
      const currentThreeScene = threeSceneRef.current

      if (!currentCamera || !currentRenderer || !currentThreeScene) return

      currentCamera.rotation.y = THREE.MathUtils.degToRad(yawRef.current)
      currentCamera.rotation.x = THREE.MathUtils.degToRad(
        pitchRef.current + HORIZON_PITCH_OFFSET
      )

      currentRenderer.render(currentThreeScene, currentCamera)
    }

    animate()

    return () => {
      disposed = true

      window.removeEventListener("resize", handleResize)

      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current)
      }

      if (localVideo) {
        if (onVideoCanPlay) localVideo.removeEventListener("canplay", onVideoCanPlay)
        if (onVideoError) localVideo.removeEventListener("error", onVideoError)
        if (onVideoEnded) localVideo.removeEventListener("ended", onVideoEnded)

        localVideo.pause()
        localVideo.removeAttribute("src")
        localVideo.load()
      }

      hiddenVideoRef.current = null

      if (meshRef.current) {
        const material = meshRef.current.material
        if (Array.isArray(material)) {
          material.forEach((m) => m.dispose())
        } else {
          material.dispose()
        }
        meshRef.current.geometry.dispose()
        threeSceneRef.current?.remove(meshRef.current)
        meshRef.current = null
      } else {
        geometry.dispose()
      }

      if (textureRef.current) {
        textureRef.current.dispose()
        textureRef.current = null
      }

      if (rendererRef.current) {
        rendererRef.current.dispose()
        if (rendererRef.current.domElement.parentNode === container) {
          container.removeChild(rendererRef.current.domElement)
        }
        rendererRef.current = null
      }

      threeSceneRef.current = null
      cameraRef.current = null
    }
  }, [scene, isImage, isVideo, setMediaError, setMediaReady])

  // Drag fallback solo cuando gyro está desactivado.
  function onPointerDown(e: React.PointerEvent) {
    if (gyroEnabled) return

    dragRef.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      startYaw: targetYawRef.current,
      startPitch: targetPitchRef.current,
    }
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragRef.current.active) return

    const dx = e.clientX - dragRef.current.startX
    const dy = e.clientY - dragRef.current.startY
    const sensitivity = 0.12

    const nextYaw = clamp(
      dragRef.current.startYaw - dx * sensitivity,
      scene.camera.minYaw + calibrationYaw,
      scene.camera.maxYaw + calibrationYaw
    )

    const nextPitch = clamp(
      dragRef.current.startPitch + dy * sensitivity,
      scene.camera.minPitch + calibrationPitch,
      scene.camera.maxPitch + calibrationPitch
    )

    targetYawRef.current = nextYaw
    targetPitchRef.current = nextPitch
  }

  function onPointerUp() {
    dragRef.current.active = false
  }

  const toggleMute = useCallback(() => {
    if (!isVideo || !hiddenVideoRef.current) return
    hiddenVideoRef.current.muted = !hiddenVideoRef.current.muted
    setIsMuted(hiddenVideoRef.current.muted)
  }, [isVideo])

  const replay = useCallback(() => {
    if (!isVideo || !hiddenVideoRef.current) return

    hiddenVideoRef.current.currentTime = 0
    hiddenVideoRef.current
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false))
  }, [isVideo])

  const requestFullscreen = useCallback(async () => {
    const el = document.documentElement as HTMLElement & {
      webkitRequestFullscreen?: () => Promise<void> | void
    }

    try {
      if (el.requestFullscreen) {
        await el.requestFullscreen()
        console.log("Document fullscreen entered")
        return
      }

      if (el.webkitRequestFullscreen) {
        await el.webkitRequestFullscreen()
        console.log("Document fullscreen entered via webkit")
        return
      }

      console.error("Fullscreen API not available")
    } catch (err) {
      console.error("Fullscreen request failed:", err)
    }
  }, [])

  const supportsFullscreen =
    typeof document !== "undefined" &&
    (!!document.documentElement.requestFullscreen ||
      // @ts-expect-error iOS Safari
      !!document.documentElement.webkitRequestFullscreen)

  return (
    <div
      className="relative w-full h-svh overflow-hidden bg-black select-none touch-none"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      <div ref={containerRef} className="absolute inset-0" />

      {isLoading && <LoadingState />}

      {hasError && (
        <ViewerErrorState
          message={
            isVideo
              ? "Unable to load the experience video."
              : "Unable to load the panoramic image."
          }
          onRetry={() => {
            window.location.reload()
          }}
        />
      )}

      {isEntered && !hasError && (
        <div className="absolute top-0 left-0 right-0 z-10 px-5 pt-8 pointer-events-none bg-gradient-to-b from-black/60 to-transparent pb-10">
          <p className="text-[10px] tracking-[0.25em] uppercase text-white/30 font-sans mb-0.5">
            Now viewing
          </p>
          <p className="text-sm font-serif font-light text-white/70 leading-snug">
            {scene.title}
          </p>
        </div>
      )}

      {showHelp && (
        <div className="absolute inset-0 z-20 bg-black/70 flex flex-col items-center justify-center px-8 text-center">
          <p className="text-xs tracking-[0.2em] uppercase text-white/40 font-sans mb-4">
            Help
          </p>
          <p className="text-sm leading-relaxed text-white/70 text-pretty mb-2">
            {gyroEnabled
              ? "Rotate your device to look around the scene."
              : "Drag across the screen to look around the scene."}
          </p>
          <p className="text-sm leading-relaxed text-white/50 text-pretty mb-8">
            The view is anchored to your calibration alignment.
          </p>
          <button
            onClick={() => setShowHelp(false)}
            className="font-sans text-xs tracking-[0.2em] uppercase text-white/60 border border-white/20 px-6 py-3 rounded-xl"
            aria-label="Close help"
          >
            Got it
          </button>
        </div>
      )}

      {isEntered && !hasError && (
        <>
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20">
            <button
              onClick={gyroEnabled ? disableGyro : enableGyro}
              className="font-sans text-[10px] tracking-[0.2em] uppercase text-white/70 border border-white/15 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full"
            >
              {gyroEnabled ? "Deshabilitar movimiento" : "Habilitar movimiento"}
            </button>
          </div>

          <ViewerControls
            isMuted={isMuted}
            isPlaying={isPlaying}
            gyroEnabled={gyroEnabled}
            onToggleMute={toggleMute}
            onReplay={replay}
            onToggleHelp={() => setShowHelp((s) => !s)}
            onRequestFullscreen={requestFullscreen}
            supportsFullscreen={supportsFullscreen}
            showMute={isVideo}
            showReplay={isVideo}
          />
        </>
      )}

      {isEntered && !hasError && onExit && (
        <button
          onClick={onExit}
          className="absolute top-6 right-5 z-20 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white/60 border border-white/10 transition-opacity active:opacity-50"
          aria-label="Exit experience"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path
              d="M2 2l10 10M12 2L2 12"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
        </button>
      )}
    </div>
  )
}