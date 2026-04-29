/**
 * Device orientation helpers for reading gyroscope/compass data.
 * Uses the DeviceOrientationEvent API.
 */

export interface OrientationReading {
  alpha: number // compass heading (z-axis) — maps to yaw
  beta: number  // front-to-back tilt (x-axis) — maps to pitch
  gamma: number // left-to-right tilt (y-axis) — maps to roll
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

  // @ts-expect-error — requestPermission is iOS-only
  if (typeof DeviceOrientationEvent?.requestPermission === "function") {
    try {
      // @ts-expect-error
      const result = await DeviceOrientationEvent.requestPermission()
      return result === "granted" ? "granted" : "denied"
    } catch {
      return "denied"
    }
  }

  // Android / desktop — orientation events fire without a permission prompt
  if (isOrientationSupported()) return "granted"
  return "unavailable"
}

export function getCurrentOrientation(): OrientationReading | null {
  // Snapshot is not available synchronously; listeners are needed.
  // This is a placeholder for future use.
  return null
}
