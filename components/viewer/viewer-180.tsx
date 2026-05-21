"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import * as THREE from "three"
import { clamp } from "@/lib/calibration"
import { LoadingState } from "@/components/viewer/loading-state"
import { ViewerErrorState } from "@/components/viewer/error-state"
import { ViewerControls } from "@/components/viewer/viewer-controls"
import { requestCameraStream, stopCameraStream } from "@/lib/camera"
import { useLanguage } from "@/components/i18n/language-provider"
import type { Scene, SceneHotspot } from "@/types/scene"
import type { CalibrationOffset } from "@/types/experience"

interface Viewer180Props {
  scene: Scene
  calibration: CalibrationOffset
  motionEnabled?: boolean
  cameraPassthroughEnabled?: boolean
  autoStartAmbientAudio?: boolean
  onExit?: () => void
}

type SceneVideoMedia = Extract<Scene["media"], { type: "video" }>

function pickBestVideoSource(video: HTMLVideoElement, media: SceneVideoMedia) {
  const playableSource = media.sources?.find((source) => {
    if (!source.type) return true
    return video.canPlayType(source.type) !== ""
  })

  return playableSource?.src ?? media.src
}

const VIEWER_FOV = 100
const HORIZON_PITCH_OFFSET = 0
const HOTSPOT_RADIUS = 420
const HOTSPOT_POSITION_LERP = 0.18
const HOTSPOT_UPDATE_EPSILON = 0.35
const HOTSPOT_ENTER_MARGIN = 1.04
const HOTSPOT_EXIT_MARGIN = 1.18
const GYRO_TARGET_DEADZONE_DEG = 0.08
const TEXTURE_EDGE_FADE_START = 0.92
const TEXTURE_EDGE_FADE_END = 1.05
const TEXTURE_EDGE_FADE_SHAPE_X = 0.92
const TEXTURE_EDGE_FADE_SHAPE_Y = 1.02
const TEXTURE_EDGE_FADE_POWER = 4.0
interface HotspotScreenPosition {
  id: string
  left: number
  top: number
  visible: boolean
  scale: number
}


function hotspotToWorldPosition(hotspot: SceneHotspot) {
  return new THREE.Vector3(0, 0, -HOTSPOT_RADIUS).applyEuler(
    new THREE.Euler(
      THREE.MathUtils.degToRad(hotspot.pitch),
      THREE.MathUtils.degToRad(hotspot.yaw),
      0,
      "YXZ"
    )
  )
}

function createEdgeFadeMaterial(texture: THREE.Texture) {
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide,
    transparent: true,
  })

  material.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace(
        "#include <common>",
        `
        #include <common>
        varying vec2 vFadeUv;
        `
      )
      .replace(
        "#include <uv_vertex>",
        `
        #include <uv_vertex>
        vFadeUv = uv;
        `
      )

    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `
        #include <common>
        varying vec2 vFadeUv;
        `
      )
      .replace(
        "vec4 diffuseColor = vec4( diffuse, opacity );",
        `
        vec4 diffuseColor = vec4( diffuse, opacity );

        vec2 centeredUv = abs((vFadeUv - 0.5) * 2.0);

        float dx = pow(centeredUv.x / ${TEXTURE_EDGE_FADE_SHAPE_X.toFixed(2)}, ${TEXTURE_EDGE_FADE_POWER.toFixed(1)});
        float dy = pow(centeredUv.y / ${TEXTURE_EDGE_FADE_SHAPE_Y.toFixed(2)}, ${TEXTURE_EDGE_FADE_POWER.toFixed(1)});
        float edgeDistance = pow(dx + dy, 1.0 / ${TEXTURE_EDGE_FADE_POWER.toFixed(1)});

        float edgeFade = 1.0 - smoothstep(
          ${TEXTURE_EDGE_FADE_START.toFixed(2)},
          ${TEXTURE_EDGE_FADE_END.toFixed(2)},
          edgeDistance
        );

        diffuseColor.a *= edgeFade;
        `
      )
  }

  material.needsUpdate = true
  return material
}

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

export function Viewer180({
  scene,
  calibration: _calibration,
  motionEnabled = false,
  cameraPassthroughEnabled = false,
  autoStartAmbientAudio = false,
  onExit,
}: Viewer180Props) {
  const { t } = useLanguage()
  const isImage = scene.media.type === "image"
  const isVideo = scene.media.type === "video"

  const [gyroEnabled, setGyroEnabled] = useState(motionEnabled)
  const [isLoading, setIsLoading] = useState(true)
  const [isEntered, setIsEntered] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [cameraPassthroughReady, setCameraPassthroughReady] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [isPlaying, setIsPlaying] = useState(isImage)
  const [isMuted, setIsMuted] = useState(isVideo ? scene.media.muted : false)
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null)
  const [hotspotPositions, setHotspotPositions] = useState<
    HotspotScreenPosition[]
  >([])

  const hotspots = useMemo(() => scene.hotspots ?? [], [scene.hotspots])
  const activeHotspot = useMemo(
    () => hotspots.find((hotspot) => hotspot.id === activeHotspotId) ?? null,
    [hotspots, activeHotspotId]
  )
  const activeHotspotPosition = useMemo(
    () => hotspotPositions.find((position) => position.id === activeHotspotId),
    [hotspotPositions, activeHotspotId]
  )
  const activeHotspotFocus = activeHotspot?.focus ?? null

  const containerRef = useRef<HTMLDivElement>(null)
  const cameraPassthroughVideoRef = useRef<HTMLVideoElement>(null)
  const cameraPassthroughStreamRef = useRef<MediaStream | null>(null)

  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const threeSceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const meshRef = useRef<THREE.Mesh | null>(null)
  const textureRef = useRef<THREE.Texture | null>(null)
  const frameRef = useRef<number | null>(null)
  const smoothedHotspotPositionsRef = useRef<Map<string, HotspotScreenPosition>>(new Map())
  const lastHotspotPositionsRef = useRef<HotspotScreenPosition[]>([])

  const hiddenVideoRef = useRef<HTMLVideoElement | null>(null)
  const ambientAudioRef = useRef<HTMLAudioElement | null>(null)
  const ambientAudioAutoStartedRef = useRef(false)

  const ambientAudio = scene.ambientAudio
  const hasAmbientAudio = Boolean(ambientAudio?.src)
  const [isAmbientAudioPlaying, setIsAmbientAudioPlaying] = useState(false)

  // The calibration step stores raw device sensor readings. Do not apply those
  // values directly as camera degrees: a phone held upright commonly reports
  // beta around 90°, which would make the viewer start by looking upward.
  // The immersive viewer must start from the scene-defined visual center.
  const calibrationYaw = 0
  const calibrationPitch = 0

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

  useEffect(() => {
    setGyroEnabled(motionEnabled)
    baselineDeviceQuaternionRef.current = null
    motionAnchorYawRef.current = targetYawRef.current
    motionAnchorPitchRef.current = targetPitchRef.current
  }, [motionEnabled])

  useEffect(() => {
    setActiveHotspotId(null)
    setHotspotPositions([])
    smoothedHotspotPositionsRef.current.clear()
    lastHotspotPositionsRef.current = []

    ambientAudioAutoStartedRef.current = false
    const audio = ambientAudioRef.current
    if (audio) {
      audio.pause()
      audio.currentTime = 0
    }
    setIsAmbientAudioPlaying(false)
  }, [scene.id])

  useEffect(() => {
    const audio = ambientAudioRef.current
    if (!audio || !ambientAudio) return

    audio.volume = clamp(ambientAudio.volume ?? 0.35, 0, 1)
    audio.loop = ambientAudio.loop ?? true
  }, [ambientAudio])

  useEffect(() => {
    const audio = ambientAudioRef.current

    if (
      !autoStartAmbientAudio ||
      !isEntered ||
      hasError ||
      !hasAmbientAudio ||
      !ambientAudio ||
      !audio ||
      isAmbientAudioPlaying ||
      ambientAudioAutoStartedRef.current
    ) {
      return
    }

    ambientAudioAutoStartedRef.current = true
    audio.volume = clamp(ambientAudio.volume ?? 0.35, 0, 1)
    audio.loop = ambientAudio.loop ?? true

    audio
      .play()
      .then(() => setIsAmbientAudioPlaying(true))
      .catch(() => {
        ambientAudioAutoStartedRef.current = false
        setIsAmbientAudioPlaying(false)
      })
  }, [ambientAudio, autoStartAmbientAudio, hasAmbientAudio, hasError, isAmbientAudioPlaying, isEntered])


  // Camera passthrough: render the real camera behind the WebGL canvas.
  // The WebGL renderer is transparent, so empty areas outside the historical
  // image show the live camera instead of a black background. This is not
  // full AR tracking; it is a practical MVP fallback for viewer edges.
  useEffect(() => {
    const video = cameraPassthroughVideoRef.current

    if (!cameraPassthroughEnabled || !video) {
      setCameraPassthroughReady(false)
      return
    }

    let cancelled = false

    async function startCameraPassthrough() {
      try {
        const stream = await requestCameraStream({
          video: { facingMode: { ideal: "environment" } },
          audio: false,
        })

        if (cancelled) {
          stopCameraStream(stream)
          return
        }

        cameraPassthroughStreamRef.current = stream
        video.srcObject = stream
        video.muted = true
        video.playsInline = true
        video.setAttribute("playsinline", "true")
        video.setAttribute("webkit-playsinline", "true")

        await video.play()

        if (!cancelled) {
          setCameraPassthroughReady(true)
        }
      } catch {
        // Non-fatal: if the camera cannot start, the viewer still works and
        // transparent areas fall back to black.
        setCameraPassthroughReady(false)
      }
    }

    startCameraPassthrough()

    return () => {
      cancelled = true
      setCameraPassthroughReady(false)
      stopCameraStream(cameraPassthroughStreamRef.current)
      cameraPassthroughStreamRef.current = null

      if (video) {
        video.pause()
        video.srcObject = null
      }
    }
  }, [cameraPassthroughEnabled])

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
      if (!gyroEnabled || dragRef.current.active) return
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

      if (Math.abs(nextYaw - targetYawRef.current) > GYRO_TARGET_DEADZONE_DEG) {
        targetYawRef.current = nextYaw
      }

      if (Math.abs(nextPitch - targetPitchRef.current) > GYRO_TARGET_DEADZONE_DEG) {
        targetPitchRef.current = nextPitch
      }
    }

    window.addEventListener("deviceorientation", handleOrientation, true)
    return () =>
      window.removeEventListener("deviceorientation", handleOrientation, true)
  }, [gyroEnabled, scene.camera, calibrationYaw, calibrationPitch])

  // Si rota portrait <-> landscape, reinicia la baseline para evitar saltos.
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
    let onInitialVideoReady: (() => void) | null = null
    let onVideoCanPlayFallback: (() => void) | null = null
    let onVideoError: (() => void) | null = null
    let onVideoEnded: (() => void) | null = null
    let onVideoWaiting: (() => void) | null = null
    let onVideoPlaying: (() => void) | null = null
    let onVideoStalled: (() => void) | null = null
    let initialVideoFrameReady = false

    setIsLoading(true)
    setHasError(false)

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.setClearColor(0x000000, 0)
    renderer.domElement.style.background = "transparent"
    container.appendChild(renderer.domElement)
    rendererRef.current = renderer

    const threeScene = new THREE.Scene()
    threeScene.background = null
    threeSceneRef.current = threeScene

    const camera = new THREE.PerspectiveCamera(
      VIEWER_FOV,
      container.clientWidth / container.clientHeight,
      0.1,
      1100
    )
    camera.rotation.order = "YXZ"
    cameraRef.current = camera

    const createGeometry = (texture: THREE.Texture) => {
      if (scene.media.projection === "flat") {
        const image = texture.image as
          | HTMLImageElement
          | HTMLCanvasElement
          | HTMLVideoElement
          | undefined

        const width = image instanceof HTMLVideoElement ? image.videoWidth : image?.width
        const height = image instanceof HTMLVideoElement ? image.videoHeight : image?.height
        const aspect = width && height ? width / height : 16 / 9

        // Flat mode is for normal rectilinear images, not real spherical panoramas.
        // It avoids the wall bending caused by wrapping a non-equirectangular image
        // onto a sphere. This is correct for the current Carretería test image.
        const distance = 500
        const planeHeight =
          2 * distance * Math.tan(THREE.MathUtils.degToRad(VIEWER_FOV / 2)) * 1.04
        const planeWidth = planeHeight * aspect
        const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight, 1, 1)

        return { geometry, positionZ: -distance, rotationY: 0 }
      }

      // Real 180° panoramas must be equirectangular/hemispherical assets.
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

      return { geometry, positionZ: 0, rotationY: Math.PI / 2 }
    }

    const createMesh = (texture: THREE.Texture) => {
      if (disposed) {
        texture.dispose()
        return
      }

      texture.colorSpace = THREE.SRGBColorSpace
      texture.minFilter = THREE.LinearFilter
      texture.magFilter = THREE.LinearFilter
      texture.generateMipmaps = false

      const material = createEdgeFadeMaterial(texture)

      const { geometry, positionZ, rotationY } = createGeometry(texture)
      const mesh = new THREE.Mesh(geometry, material)
      mesh.position.z = positionZ
      mesh.rotation.y = rotationY

      meshRef.current = mesh
      textureRef.current = texture
      threeScene.add(mesh)
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
          setMediaError()
        }
      )
    } else if (isVideo) {
      const media = scene.media as SceneVideoMedia
      const video = document.createElement("video")
      hiddenVideoRef.current = video
      localVideo = video

      video.src = pickBestVideoSource(video, media)
      video.crossOrigin = "anonymous"
      video.loop = media.loop
      video.muted = media.muted
      video.playsInline = true
      video.preload = "auto"
      video.controls = false
      video.setAttribute("playsinline", "true")
      video.setAttribute("webkit-playsinline", "true")
      video.setAttribute("controlslist", "nodownload noplaybackrate noremoteplayback")
      video.setAttribute("disableremoteplayback", "true")

      if (media.poster) {
        video.poster = media.poster
      }

      if ("disablePictureInPicture" in video) {
        video.disablePictureInPicture = true
      }

      onInitialVideoReady = () => {
        if (disposed || initialVideoFrameReady) return
        initialVideoFrameReady = true

        const videoTexture = new THREE.VideoTexture(video)
        createMesh(videoTexture)

        video
          .play()
          .then(() => {
            if (!disposed) {
              setIsLoading(false)
              setIsPlaying(true)
            }
          })
          .catch(() => {
            if (!disposed) {
              setIsLoading(false)
              setIsPlaying(false)
            }
          })
      }

      // loadeddata gives us the first decoded frame. canplay is kept as a
      // fallback because some mobile browsers are inconsistent with media events.
      onVideoCanPlayFallback = () => {
        onInitialVideoReady?.()
      }

      onVideoError = () => {
        if (disposed) return
        setMediaError()
      }

      onVideoEnded = () => {
        if (!media.loop && !disposed) {
          setIsPlaying(false)
        }
      }

      onVideoWaiting = () => {
        if (!disposed && initialVideoFrameReady) {
          setIsLoading(true)
        }
      }

      onVideoStalled = () => {
        if (!disposed && initialVideoFrameReady) {
          setIsLoading(true)
        }
      }

      onVideoPlaying = () => {
        if (!disposed) {
          setIsLoading(false)
          setIsPlaying(true)
        }
      }

      video.addEventListener("loadeddata", onInitialVideoReady, { once: true })
      video.addEventListener("canplay", onVideoCanPlayFallback, { once: true })
      video.addEventListener("error", onVideoError, { once: true })
      video.addEventListener("ended", onVideoEnded)
      video.addEventListener("waiting", onVideoWaiting)
      video.addEventListener("stalled", onVideoStalled)
      video.addEventListener("playing", onVideoPlaying)
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

    const renderLoop = () => {
      frameRef.current = window.requestAnimationFrame(renderLoop)

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

      if (hotspots.length > 0) {
        const width = currentRenderer.domElement.clientWidth
        const height = currentRenderer.domElement.clientHeight
        const previousPositions = smoothedHotspotPositionsRef.current

        const nextPositions = hotspots.map((hotspot) => {
          const previous = previousPositions.get(hotspot.id)
          const projected = hotspotToWorldPosition(hotspot).project(currentCamera)

          const edgeDistance = Math.max(
            Math.abs(projected.x),
            Math.abs(projected.y)
          )

          // Hysteresis: once a hotspot is visible, keep it visible a little
          // longer near the edge so it does not flicker when the gyro jitters.
          const margin = previous?.visible
            ? HOTSPOT_EXIT_MARGIN
            : HOTSPOT_ENTER_MARGIN

          const visible =
            projected.z > -1 &&
            projected.z < 1 &&
            projected.x > -margin &&
            projected.x < margin &&
            projected.y > -margin &&
            projected.y < margin

          const rawLeft = (projected.x * 0.5 + 0.5) * width
          const rawTop = (-projected.y * 0.5 + 0.5) * height
          const rawScale = THREE.MathUtils.clamp(1 - edgeDistance * 0.25, 0.7, 1)

          // Smooth the 2D overlay separately from the Three.js camera.
          // Without this, tiny sensor noise is very visible in HTML hotspots.
          const left = previous
            ? THREE.MathUtils.lerp(previous.left, rawLeft, HOTSPOT_POSITION_LERP)
            : rawLeft
          const top = previous
            ? THREE.MathUtils.lerp(previous.top, rawTop, HOTSPOT_POSITION_LERP)
            : rawTop
          const scale = previous
            ? THREE.MathUtils.lerp(previous.scale, rawScale, HOTSPOT_POSITION_LERP)
            : rawScale

          const nextPosition = {
            id: hotspot.id,
            // Round to half pixels to reduce sub-pixel shimmer on mobile.
            left: Math.round(left * 2) / 2,
            top: Math.round(top * 2) / 2,
            visible,
            scale: Math.round(scale * 1000) / 1000,
          }

          previousPositions.set(hotspot.id, nextPosition)
          return nextPosition
        })

        const previousState = lastHotspotPositionsRef.current
        const shouldPublish =
          previousState.length !== nextPositions.length ||
          nextPositions.some((nextPosition, index) => {
            const previous = previousState[index]
            if (!previous) return true
            return (
              previous.visible !== nextPosition.visible ||
              Math.abs(previous.left - nextPosition.left) > HOTSPOT_UPDATE_EPSILON ||
              Math.abs(previous.top - nextPosition.top) > HOTSPOT_UPDATE_EPSILON ||
              Math.abs(previous.scale - nextPosition.scale) > 0.01
            )
          })

        if (shouldPublish) {
          lastHotspotPositionsRef.current = nextPositions
          setHotspotPositions(nextPositions)
        }
      }

      currentRenderer.render(currentThreeScene, currentCamera)
    }

    renderLoop()

    return () => {
      disposed = true

      window.removeEventListener("resize", handleResize)

      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current)
      }

      if (localVideo) {
        if (onInitialVideoReady) localVideo.removeEventListener("loadeddata", onInitialVideoReady)
        if (onVideoCanPlayFallback) localVideo.removeEventListener("canplay", onVideoCanPlayFallback)
        if (onVideoError) localVideo.removeEventListener("error", onVideoError)
        if (onVideoEnded) localVideo.removeEventListener("ended", onVideoEnded)
        if (onVideoWaiting) localVideo.removeEventListener("waiting", onVideoWaiting)
        if (onVideoStalled) localVideo.removeEventListener("stalled", onVideoStalled)
        if (onVideoPlaying) localVideo.removeEventListener("playing", onVideoPlaying)

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
      }

      if (textureRef.current) {
        textureRef.current.dispose()
        textureRef.current = null
      }

      if (rendererRef.current) {
        rendererRef.current.dispose()
        rendererRef.current.forceContextLoss()
        if (rendererRef.current.domElement.parentNode === container) {
          container.removeChild(rendererRef.current.domElement)
        }
        rendererRef.current = null
      }

      threeSceneRef.current = null
      cameraRef.current = null
    }
  }, [scene, hotspots, isImage, isVideo, setMediaError, setMediaReady])

  // Finger drag is always available. If gyro is active, dragging temporarily
  // overrides sensor updates and re-anchors motion from the new view.
  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (activeHotspotId) {
      setActiveHotspotId(null)
    }

    e.currentTarget.setPointerCapture?.(e.pointerId)

    dragRef.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      startYaw: targetYawRef.current,
      startPitch: targetPitchRef.current,
    }
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
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
    const wasDragging = dragRef.current.active
    dragRef.current.active = false

    if (wasDragging && gyroEnabled) {
      baselineDeviceQuaternionRef.current = null
      motionAnchorYawRef.current = targetYawRef.current
      motionAnchorPitchRef.current = targetPitchRef.current
    }
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

  const toggleAmbientAudio = useCallback(() => {
    const audio = ambientAudioRef.current
    if (!audio || !ambientAudio) return

    audio.volume = clamp(ambientAudio.volume ?? 0.35, 0, 1)
    audio.loop = ambientAudio.loop ?? true

    if (isAmbientAudioPlaying) {
      audio.pause()
      setIsAmbientAudioPlaying(false)
      return
    }

    audio
      .play()
      .then(() => setIsAmbientAudioPlaying(true))
      .catch(() => setIsAmbientAudioPlaying(false))
  }, [ambientAudio, isAmbientAudioPlaying])

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
      onPointerCancel={onPointerUp}
    >
      {cameraPassthroughEnabled && (
        <video
          ref={cameraPassthroughVideoRef}
          className={`pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
            cameraPassthroughReady ? "opacity-100" : "opacity-0"
          }`}
          style={{
            filter: "saturate(0.75) contrast(0.88) brightness(0.9) blur(0.6px)",
            transform: "scale(1.01)",
          }}
          aria-hidden="true"
          muted
          playsInline
          autoPlay
        />
      )}

      <div ref={containerRef} className="absolute inset-0" />

      {isEntered && !hasError && (
        <style>{`
          @keyframes timeless-hotspot-ring {
            0% {
              transform: translate3d(-50%, -50%, 0) scale(0.72);
              opacity: 0;
            }
            18% {
              opacity: 0.34;
            }
            78% {
              opacity: 0;
            }
            100% {
              transform: translate3d(-50%, -50%, 0) scale(1.55);
              opacity: 0;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .timeless-hotspot-ring {
              animation: none !important;
              opacity: 0 !important;
            }
          }
        `}</style>
      )}

      {isLoading && <LoadingState />}

      {hasError && (
        <ViewerErrorState
          message={
isVideo ? t("videoLoadError") : t("imageLoadError")
          }
          onRetry={() => {
            window.location.reload()
          }}
        />
      )}

      {isEntered && !hasError && (
        <div className="absolute top-0 left-0 right-0 z-10 px-5 pr-20 pt-7 pointer-events-none bg-gradient-to-b from-black/60 to-transparent pb-10">
          <p className="text-[10px] tracking-[0.25em] uppercase text-white/30 font-sans mb-0.5">
            {t("nowViewing")}
          </p>
          <p className="text-sm font-serif font-light text-white/70 leading-snug">
            {scene.title}
          </p>
        </div>
      )}

      {isEntered && !hasError && hotspots.length > 0 && (
        <div className="absolute inset-0 z-20 pointer-events-none">
          {hotspots.map((hotspot) => {
            const position = hotspotPositions.find((p) => p.id === hotspot.id)
            if (!position?.visible) return null

            const isActive = activeHotspotId === hotspot.id

            return (
              <button
                key={hotspot.id}
                type="button"
                className="absolute pointer-events-auto will-change-transform active:scale-95"
                style={{
                  left: position.left,
                  top: position.top,
                  transform: `translate3d(-50%, -50%, 0) scale(${position.scale})`,
                }}
                aria-pressed={isActive}
                aria-label={`${t("openInfo")}: ${hotspot.title}`}
                onPointerDown={(event) => event.stopPropagation()}
                onPointerMove={(event) => event.stopPropagation()}
                onPointerUp={(event) => event.stopPropagation()}
                onClick={(event) => {
                  event.stopPropagation()
                  setActiveHotspotId((current) =>
                    current === hotspot.id ? null : hotspot.id
                  )
                }}
              >
                <span className="relative flex flex-col items-center pt-7">
                  <span
                    className={`pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] font-medium leading-none backdrop-blur-sm shadow-[0_0_10px_rgba(255,255,255,0.08)] transition-colors ${
                      isActive
                        ? "max-w-[9rem] border-white/28 bg-black/34 text-white/88"
                        : "max-w-[8rem] border-white/18 bg-black/18 text-white/60"
                    }`}
                  >
                    <span className="block truncate">{hotspot.label}</span>
                  </span>

                  <span className="relative flex h-4 w-4 items-center justify-center">
                    <span
                      className={`absolute inset-0 rounded-full border ${
                        isActive
                          ? "border-white/55 bg-white/18 shadow-[0_0_12px_rgba(255,255,255,0.16)]"
                          : "border-white/35 bg-black/16 shadow-[0_0_10px_rgba(255,255,255,0.10)]"
                      }`}
                    />
                    <span
                      className={`relative h-1.5 w-1.5 rounded-full ${
                        isActive ? "bg-white/90" : "bg-white/75"
                      }`}
                    />
                    {!isActive && (
                      <span
                        className="timeless-hotspot-ring pointer-events-none absolute left-1/2 top-1/2 -z-10 h-7 w-7 rounded-full border border-white/24"
                        style={{
                          transform: "translate(-50%, -50%)",
                          animation: "timeless-hotspot-ring 2.8s ease-out infinite",
                        }}
                        aria-hidden="true"
                      />
                    )}
                  </span>
                </span>
              </button>
            )
          })}
        </div>
      )}

      {isEntered && !hasError && activeHotspot && activeHotspotFocus && activeHotspotPosition?.visible && (
        <div className="absolute inset-0 z-[24] pointer-events-none">
          <div
            className="absolute border border-white/45 bg-white/[0.025] shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_0_14px_rgba(255,255,255,0.12)] backdrop-blur-[1px]"
            style={{
              left: activeHotspotPosition.left + (activeHotspotFocus.offsetX ?? 0),
              top: activeHotspotPosition.top + (activeHotspotFocus.offsetY ?? 0),
              width: activeHotspotFocus.width,
              height: activeHotspotFocus.height,
              borderWidth: activeHotspotFocus.strokeWidth ?? 2,
              borderColor: activeHotspotFocus.strokeColor ?? "rgba(255,255,255,0.45)",
              borderRadius: activeHotspotFocus.shape === "rect" ? "1rem" : "999px",
              transform: `translate3d(-50%, -50%, 0) scale(${activeHotspotPosition.scale})`,
            }}
            aria-hidden="true"
          >
            <div
              className="absolute inset-[6px] border border-white/15"
              style={{
                borderRadius: activeHotspotFocus.shape === "rect" ? "0.8rem" : "999px",
              }}
            />
          </div>
        </div>
      )}

      {isEntered && !hasError && activeHotspot && (
        <div
          className="absolute z-30 w-[min(20rem,calc(100vw-2rem))] rounded-2xl border border-white/10 bg-black/35 p-4 text-white shadow-[0_12px_42px_rgba(0,0,0,0.24)] backdrop-blur-lg pointer-events-auto will-change-transform"
          style={
            activeHotspotPosition?.visible
              ? {
                  left: activeHotspotPosition.left,
                  top: activeHotspotPosition.top,
                  transform: "translate3d(-50%, calc(-100% - 1.25rem), 0)",
                }
              : { left: 16, bottom: 96 }
          }
          onPointerDown={(event) => event.stopPropagation()}
          onPointerMove={(event) => event.stopPropagation()}
          onPointerUp={(event) => event.stopPropagation()}
        >
          <div className="mb-3 flex items-start justify-between gap-4">
            <div>
              <p className="mb-1 text-[10px] uppercase tracking-[0.22em] text-white/40">
                {t("historicalPoint")}
              </p>
              <h2 className="font-serif text-lg font-light leading-tight text-white">
                {activeHotspot.title}
              </h2>
            </div>
            <button
              type="button"
              className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-white/60 active:opacity-60"
              aria-label={t("closeHistoricalPoint")}
              onClick={() => setActiveHotspotId(null)}
            >
              ×
            </button>
          </div>

          <p className="mb-4 text-sm leading-relaxed text-white/70">
            {activeHotspot.description}
          </p>

          {activeHotspot.audio?.src && (
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-white/35">
                {activeHotspot.audio.label ?? t("explanatoryAudio")}
              </p>
              <audio
                className="w-full"
                src={activeHotspot.audio.src}
                controls
                preload="none"
              />
            </div>
          )}
        </div>
      )}

      {showHelp && (
        <div className="absolute inset-0 z-20 bg-black/70 flex flex-col items-center justify-center px-8 text-center">
          <p className="text-xs tracking-[0.2em] uppercase text-white/40 font-sans mb-4">
            {t("help")}
          </p>
          <p className="text-sm leading-relaxed text-white/70 text-pretty mb-2">
            {gyroEnabled ? t("helpGyro") : t("helpDrag")}
          </p>
          <p className="text-sm leading-relaxed text-white/50 text-pretty mb-8">
            {t("helpCalibrationAnchor")}
          </p>
          <button
            onClick={() => setShowHelp(false)}
            className="font-sans text-xs tracking-[0.2em] uppercase text-white/60 border border-white/20 px-6 py-3 rounded-xl"
            aria-label={t("closeHelp")}
          >
            {t("gotIt")}
          </button>
        </div>
      )}

      {hasAmbientAudio && ambientAudio?.src && (
        <audio
          ref={ambientAudioRef}
          src={ambientAudio.src}
          loop={ambientAudio.loop ?? true}
          preload="auto"
          aria-label={ambientAudio.label ?? t("ambientSound")}
        />
      )}

      {isEntered && !hasError && (
        <>
          <ViewerControls
            isMuted={isVideo ? isMuted : !isAmbientAudioPlaying}
            isPlaying={isPlaying}
            gyroEnabled={gyroEnabled}
            onToggleMute={isVideo ? toggleMute : toggleAmbientAudio}
            onReplay={replay}
            onToggleHelp={() => setShowHelp((s) => !s)}
            onRequestFullscreen={requestFullscreen}
            supportsFullscreen={supportsFullscreen}
            showMute={isVideo || hasAmbientAudio}
            showReplay={isVideo}
            muteLabel={isVideo ? t("mute") : t("soundOff")}
            unmuteLabel={isVideo ? t("unmute") : t("soundOn")}
            replayLabel={t("replay")}
          />
        </>
      )}

      {isEntered && !hasError && onExit && (
        <button
          onClick={onExit}
          className="absolute top-5 right-5 z-40 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white/60 border border-white/10 transition-opacity active:opacity-50"
          aria-label={t("exitExperience")}
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