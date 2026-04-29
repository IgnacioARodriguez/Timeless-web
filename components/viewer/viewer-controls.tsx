"use client"

interface ViewerControlsProps {
  isMuted: boolean
  isPlaying: boolean
  gyroEnabled: boolean
  onToggleMute: () => void
  onReplay: () => void
  onToggleHelp: () => void
  onRequestFullscreen: () => void
  supportsFullscreen: boolean
  showMute?: boolean
  showReplay?: boolean
}

export function ViewerControls({
  isMuted,
  isPlaying,
  gyroEnabled,
  onToggleMute,
  onReplay,
  onToggleHelp,
  onRequestFullscreen,
  supportsFullscreen,
  showMute = true,
  showReplay = true,
}: ViewerControlsProps) {
  return (
    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 rounded-2xl border border-white/10 bg-black/35 px-3 py-2 backdrop-blur-md">
      {showMute && (
        <button
          onClick={onToggleMute}
          className="h-10 px-3 rounded-xl text-white/80 text-xs border border-white/10 bg-white/5 active:opacity-70"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? "Unmute" : "Mute"}
        </button>
      )}

      {showReplay && (
        <button
          onClick={onReplay}
          className="h-10 px-3 rounded-xl text-white/80 text-xs border border-white/10 bg-white/5 active:opacity-70"
          aria-label="Replay"
        >
          Replay
        </button>
      )}
    </div>
  )
}