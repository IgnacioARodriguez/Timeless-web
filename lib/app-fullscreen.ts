type WebkitFullscreenDocument = Document & {
  webkitFullscreenElement?: Element | null
}

type WebkitFullscreenElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void
}

export function isAppFullscreen() {
  if (typeof document === "undefined") return false

  const fullscreenDocument = document as WebkitFullscreenDocument
  return Boolean(
    document.fullscreenElement ||
      fullscreenDocument.webkitFullscreenElement ||
      window.matchMedia("(display-mode: standalone)").matches
  )
}

export async function requestAppFullscreen() {
  if (typeof document === "undefined" || isAppFullscreen()) return false

  const root = document.documentElement as WebkitFullscreenElement

  try {
    if (root.requestFullscreen) {
      await root.requestFullscreen({ navigationUI: "hide" })
      return true
    }

    if (root.webkitRequestFullscreen) {
      await root.webkitRequestFullscreen()
      return true
    }
  } catch {
    // Fullscreen is an enhancement; unsupported browsers keep their normal UI.
  }

  return false
}
