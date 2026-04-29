import type { CalibrationOffset } from "@/types/experience"

/**
 * Captures the current device yaw (alpha) and pitch (beta) as calibration offsets.
 * Call this when the user taps "Ready" at the end of the calibration step.
 *
 * The returned offsets are later subtracted from live orientation readings inside
 * the viewer to keep the camera anchored to the user's chosen alignment point.
 */
export function captureCalibrationOffset(
  currentAlpha: number,
  currentBeta: number
): CalibrationOffset {
  return {
    yaw: currentAlpha,
    pitch: currentBeta,
  }
}

/**
 * Applies the stored calibration offsets to a live orientation reading,
 * returning the viewer-space yaw and pitch.
 */
export function applyCalibrationOffset(
  liveAlpha: number,
  liveBeta: number,
  offset: CalibrationOffset
): { yaw: number; pitch: number } {
  return {
    yaw: liveAlpha - offset.yaw,
    pitch: liveBeta - offset.pitch,
  }
}

/**
 * Clamps a value between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}
