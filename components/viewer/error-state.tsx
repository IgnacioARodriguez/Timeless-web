interface ViewerErrorStateProps {
  message: string
  onRetry?: () => void
}

export function ViewerErrorState({ message, onRetry }: ViewerErrorStateProps) {
  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black px-8 text-center">
      <p className="text-[10px] tracking-[0.25em] uppercase text-white/30 font-sans mb-4">
        Playback error
      </p>
      <p className="text-sm leading-relaxed text-white/60 text-pretty mb-8">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="font-sans text-xs tracking-[0.2em] uppercase text-white/80 border border-white/20 px-6 py-3 rounded-xl transition-opacity duration-200 active:opacity-60"
          aria-label="Retry loading the viewer"
        >
          Retry
        </button>
      )}
    </div>
  )
}
