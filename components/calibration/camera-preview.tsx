"use client"

import { useEffect, useRef } from "react"

interface CameraPreviewProps {
  stream: MediaStream | null
}

export function CameraPreview({ stream }: CameraPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (stream) {
      video.srcObject = stream
      video.play().catch(() => {
        // autoplay might be blocked; silently ignore
      })
    } else {
      video.srcObject = null
    }
  }, [stream])

  return (
    <video
      ref={videoRef}
      className="absolute inset-0 w-full h-full object-cover"
      autoPlay
      muted
      playsInline
      aria-hidden="true"
    />
  )
}
