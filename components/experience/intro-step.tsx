"use client"

import Image from "next/image"
import { BrandLockup } from "@/components/brand/brand-lockup"
import type { Scene } from "@/types/scene"

interface IntroStepProps {
  scene: Scene
  onBegin: () => void
}

export function IntroStep({ scene, onBegin }: IntroStepProps) {
  return (
    <div className="relative min-h-svh flex flex-col bg-foreground text-background">
      {/* Poster background */}
      <div className="absolute inset-0 z-0">
        <Image
          src={scene.poster}
          alt={scene.title}
          fill
          className="object-cover opacity-40"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/60 via-foreground/30 to-foreground/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-svh px-6">
        {/* Header */}
        <header className="pt-10 pb-6">
          <BrandLockup variant="dark" showByline />
        </header>

        {/* Scene info */}
        <div className="flex-1 flex flex-col justify-end pb-10">
          <p className="text-[10px] tracking-[0.25em] uppercase text-accent font-sans mb-3">
            {scene.subtitle}
          </p>
          <h1 className="font-serif font-light text-3xl leading-snug text-balance text-background mb-4">
            {scene.title}
          </h1>
          <p className="font-sans text-sm leading-relaxed text-background/60 text-pretty max-w-xs mb-10">
            {scene.description}
          </p>

          <button
            onClick={onBegin}
            className="w-full bg-background text-foreground font-sans text-xs tracking-[0.2em] uppercase py-4 rounded-xl transition-opacity duration-200 active:opacity-70"
            aria-label="Begin this historical experience"
          >
            Comenzar la experiencia
          </button>

          <p className="text-center text-[10px] tracking-[0.15em] uppercase text-background/30 font-sans mt-5">
            Se requiere acceso para cámaras y detección de movimiento
          </p>
        </div>
      </div>
    </div>
  )
}
