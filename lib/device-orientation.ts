/**
 * Device orientation helpers for reading gyroscope/compass data.
 * Uses the DeviceOrientationEvent API.
 */

export interface OrientationReading {
  alpha: number // compass heading (z-axis) — maps to yaw
  beta: number  // front-to-back tilt (x-axis) — maps to pitch
  gamma: number // left-to-right tilt (y-axis) — maps to roll
}

type IOSPermissionDeviceOrientationEvent = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<"granted" | "denied">
}

export function isOrientationSupported(): boolean {
  return typeof window !== "undefined" && "DeviceOrientationEvent" in window
}

/**
 * On iOS 13+ DeviceOrientationEvent requires explicit permission.
 * Returns "granted", "denied", or "unavailable".
 */
export async function requestOrientationPermission(): Promise<
  "granted" | "denied" | "unavailable"
> {
  if (typeof window === "undefined") return "unavailable"

  const OrientationEvent = window.DeviceOrientationEvent as
    | IOSPermissionDeviceOrientationEvent
    | undefined

  if (!OrientationEvent) return "unavailable"

  if (typeof OrientationEvent.requestPermission === "function") {
    try {
      const result = await OrientationEvent.requestPermission()
      return result === "granted" ? "granted" : "denied"
    } catch {
      return "denied"
    }
  }

  // Android / desktop — orientation events fire without a permission prompt.
  return "granted"
}

export function getCurrentOrientation(): OrientationReading | null {
  // Snapshot is not available synchronously; listeners are needed.
  // This is a placeholder for future use.
  return null
}
