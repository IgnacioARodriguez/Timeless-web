"use client"

import Image from "next/image"

interface AlignmentOverlayProps {
  src: string
  opacity: number
}

export function AlignmentOverlay({ src, opacity }: AlignmentOverlayProps) {
  return (
    <div
      className="absolute inset-0 pointer-events-none select-none"
      style={{ opacity }}
      aria-hidden="true"
    >
      <Image
        src={src}
        alt="Historical alignment overlay"
        fill
        className="object-cover mix-blend-screen"
        priority
      />
    </div>
  )
}
