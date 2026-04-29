export type ExperienceStep = "intro" | "permissions" | "calibration" | "viewer" | "error"

export interface CalibrationOffset {
  yaw: number
  pitch: number
}

export interface PermissionsState {
  camera: "idle" | "granted" | "denied"
  orientation: "idle" | "granted" | "denied" | "unavailable"
}
