"use client"

import { useState } from "react"
import { BrandLockup } from "@/components/brand/brand-lockup"
import { requestCameraStream } from "@/lib/camera"
import { requestOrientationPermission } from "@/lib/device-orientation"
import type { PermissionsState } from "@/types/experience"

interface PermissionsStepProps {
  onGranted: () => void
  onError: (message: string) => void
}

export function PermissionsStep({ onGranted, onError }: PermissionsStepProps) {
  const [permissions, setPermissions] = useState<PermissionsState>({
    camera: "idle",
    orientation: "idle",
  })
  const [requesting, setRequesting] = useState(false)

  async function handleGrantPermissions() {
    setRequesting(true)

    let cameraState: PermissionsState["camera"] = "idle"
    let orientationState: PermissionsState["orientation"] = "idle"

    // Camera
    try {
      const stream = await requestCameraStream()
      // Stop immediately — the calibration step will re-request it
      stream.getTracks().forEach((t) => t.stop())
      cameraState = "granted"
    } catch {
      cameraState = "denied"
    }

    // Orientation
    const orientationResult = await requestOrientationPermission()
    orientationState = orientationResult

    const updated: PermissionsState = {
      camera: cameraState,
      orientation: orientationState,
    }
    setPermissions(updated)
    setRequesting(false)

    if (cameraState === "denied") {
      onError(
        "Camera access is required for the calibration step. Please allow camera access in your browser settings and try again."
      )
      return
    }

    // Orientation unavailable is non-fatal — gyro fallback will kick in
    onGranted()
  }

  return (
    <div className="min-h-svh bg-background flex flex-col px-6">
      {/* Header */}
      <header className="pt-10 pb-6">
        <BrandLockup variant="light" showByline={false} />
      </header>

      <div className="flex-1 flex flex-col justify-center pb-20">
        <p className="text-[10px] tracking-[0.25em] uppercase text-accent font-sans mb-6">
          Antes de empezar
        </p>
        <h2 className="font-serif font-light text-3xl leading-snug text-foreground mb-6 text-balance">
          Se necesitan permisos
        </h2>

        <div className="flex flex-col gap-5 mb-10">
          <PermissionRow
            label="Cámara"
            description="Para superponer la imagen histórica en la vista en directo"
            state={permissions.camera}
          />
          <PermissionRow
            label="Movimiento y orientación"
            description="Para que puedas explorar usando el giroscopio de tu dispositivo"
            state={permissions.orientation}
          />
        </div>

        <p className="text-sm leading-relaxed text-muted-foreground text-pretty mb-10">
          La señal de tu cámara nunca se almacena ni se transmite. Todo el procesamiento se realiza
          en tu dispositivo.
        </p>

        <button
          onClick={handleGrantPermissions}
          disabled={requesting}
          className="w-full bg-foreground text-background font-sans text-xs tracking-[0.2em] uppercase py-4 rounded-xl disabled:opacity-40 transition-opacity duration-200 active:opacity-70"
          aria-label="Grant camera and orientation permissions"
        >
          {requesting ? "Solicitando..." : "Permitir acceso"}
        </button>
      </div>
    </div>
  )
}

// ─── Sub-component ────────────────────────────────────────────────────────────

type PermissionState = "idle" | "granted" | "denied" | "unavailable"

function PermissionRow({
  label,
  description,
  state,
}: {
  label: string
  description: string
  state: PermissionState
}) {
  return (
    <div className="flex items-start gap-4">
      <div
        className="mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center shrink-0"
        style={{
          borderColor:
            state === "granted"
              ? "var(--color-accent)"
              : "var(--color-border)",
          backgroundColor:
            state === "granted" ? "var(--color-accent)" : "transparent",
        }}
        aria-hidden="true"
      >
        {state === "granted" && (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path
              d="M2 5l2.5 2.5L8 3"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
        {state === "denied" && (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path
              d="M3 3l4 4M7 3l-4 4"
              stroke="var(--color-destructive)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        )}
      </div>
      <div>
        <p className="text-sm font-sans text-foreground leading-snug">{label}</p>
        <p className="text-xs font-sans text-muted-foreground leading-relaxed mt-0.5">
          {description}
        </p>
      </div>
    </div>
  )
}
