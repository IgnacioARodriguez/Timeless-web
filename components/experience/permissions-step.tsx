"use client"

import { useState } from "react"
import { BrandLockup } from "@/components/brand/brand-lockup"
import { useLanguage } from "@/components/i18n/language-provider"
import { requestCameraStream } from "@/lib/camera"
import { requestOrientationPermission } from "@/lib/device-orientation"
import type { PermissionsState } from "@/types/experience"

interface PermissionsStepProps {
  onGranted: (permissions: PermissionsState) => void
  onError: (message: string) => void
}

export function PermissionsStep({ onGranted, onError }: PermissionsStepProps) {
  const { t } = useLanguage()
  const [permissions, setPermissions] = useState<PermissionsState>({
    camera: "idle",
    orientation: "idle",
  })
  const [requesting, setRequesting] = useState(false)

  async function handleGrantPermissions() {
    setRequesting(true)

    let cameraState: PermissionsState["camera"] = "idle"
    let orientationState: PermissionsState["orientation"] = "idle"

    // Orientation first: iOS requires this permission request to happen directly
    // from the user's tap/click gesture.
    const orientationResult = await requestOrientationPermission()
    orientationState = orientationResult

    // Camera
    try {
      const stream = await requestCameraStream()
      // Stop immediately — the calibration step will re-request it.
      stream.getTracks().forEach((track) => track.stop())
      cameraState = "granted"
    } catch {
      cameraState = "denied"
    }

    const updated: PermissionsState = {
      camera: cameraState,
      orientation: orientationState,
    }
    setPermissions(updated)
    setRequesting(false)

    if (cameraState === "denied") {
onError(t("cameraRequiredError"))
      return
    }

    // Orientation denied/unavailable is non-fatal: the viewer still supports finger drag.
    onGranted(updated)
  }

  return (
    <div className="min-h-svh bg-background flex flex-col px-6">
      {/* Header */}
      <header className="pt-20 pb-6 sm:pt-24">
        <BrandLockup variant="light" showByline={false} />
      </header>

      <div className="flex-1 flex flex-col justify-center pb-20">
        <p className="text-[10px] tracking-[0.25em] uppercase text-accent font-sans mb-6">
          {t("beforeStart")}
        </p>
        <h2 className="font-serif font-light text-3xl leading-snug text-foreground mb-6 text-balance">
          {t("permissionsTitle")}
        </h2>

        <button
          onClick={handleGrantPermissions}
          disabled={requesting}
          className="w-full bg-foreground text-background font-sans text-xs tracking-[0.2em] uppercase py-4 rounded-xl disabled:opacity-40 transition-opacity duration-200 active:opacity-70"
          aria-label={t("acceptPermissions")}
        >
          {requesting ? t("requesting") : t("acceptPermissions")}
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
