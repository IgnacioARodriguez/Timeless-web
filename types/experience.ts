export type ExperienceStep = "intro" | "calibration" | "viewer" | "error"

export interface CalibrationOffset {
  yaw: number
  pitch: number
}

export type CameraPermissionState = "idle" | "granted" | "denied"
export type OrientationPermissionState = "idle" | "granted" | "denied" | "unavailable"

export interface PermissionsState {
  camera: CameraPermissionState
  orientation: OrientationPermissionState
}
