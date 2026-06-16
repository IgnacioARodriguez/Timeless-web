"use client"

import {
  HelpCircle,
  Maximize2,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
} from "lucide-react"

interface ViewerControlsProps {
  isMuted: boolean
  isPlaying: boolean
  gyroEnabled: boolean
  onToggleMute: () => void
  onReplay: () => void
  onResetView: () => void
  onToggleHelp: () => void
  onRequestFullscreen: () => void
  supportsFullscreen: boolean
  showMute?: boolean
  showReplay?: boolean
  muteLabel?: string
  unmuteLabel?: string
  replayLabel?: string
  resetViewLabel?: string
  helpLabel?: string
  fullscreenLabel?: string
}

export function ViewerControls({
  isMuted,
  isPlaying,
  gyroEnabled,
  onToggleMute,
  onReplay,
  onResetView,
  onToggleHelp,
  onRequestFullscreen,
  supportsFullscreen,
  showMute = true,
  showReplay = true,
  muteLabel = "Mute",
  unmuteLabel = "Unmute",
  replayLabel = "Replay",
  resetViewLabel = "Reset view",
  helpLabel = "Help",
  fullscreenLabel = "Fullscreen",
}: ViewerControlsProps) {
  const iconButtonClass =
    "grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-white/78 transition active:scale-95 active:opacity-70 disabled:opacity-35"

  return (
    <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-black/35 px-2 py-2 shadow-[0_12px_34px_rgba(0,0,0,0.24)] backdrop-blur-md">
      {showMute && (
        <button
          type="button"
          onClick={onToggleMute}
          className={iconButtonClass}
          aria-label={isMuted ? unmuteLabel : muteLabel}
          title={isMuted ? unmuteLabel : muteLabel}
        >
          {isMuted ? (
            <VolumeX className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Volume2 className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      )}

      {showReplay && (
        <button
          type="button"
          onClick={onReplay}
          className={iconButtonClass}
          aria-label={replayLabel}
          title={replayLabel}
          disabled={!isPlaying}
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
        </button>
      )}

      <button
        type="button"
        onClick={onResetView}
        className={iconButtonClass}
        aria-label={resetViewLabel}
        title={resetViewLabel}
      >
        <RotateCw className="h-4 w-4" aria-hidden="true" />
      </button>

      <button
        type="button"
        onClick={onToggleHelp}
        className={iconButtonClass}
        aria-label={helpLabel}
        title={helpLabel}
        data-motion={gyroEnabled ? "on" : "off"}
      >
        <HelpCircle className="h-4 w-4" aria-hidden="true" />
      </button>

      {supportsFullscreen && (
        <button
          type="button"
          onClick={onRequestFullscreen}
          className={iconButtonClass}
          aria-label={fullscreenLabel}
          title={fullscreenLabel}
        >
          <Maximize2 className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </div>
  )
}
