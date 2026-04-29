/**
 * Camera utility helpers for accessing the device camera stream.
 */

export async function requestCameraStream(
  constraints: MediaStreamConstraints = {
    video: { facingMode: "environment" },
    audio: false,
  }
): Promise<MediaStream> {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error("Camera API not supported on this device.")
  }
  return navigator.mediaDevices.getUserMedia(constraints)
}

export function stopCameraStream(stream: MediaStream | null): void {
  if (!stream) return
  stream.getTracks().forEach((track) => track.stop())
}
