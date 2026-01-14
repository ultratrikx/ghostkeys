import type { TypingStatus } from "../../lib/types";

interface WidgetControlsProps {
  status: TypingStatus;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
}

export function WidgetControls({
  status,
  onPause,
  onResume,
  onStop,
}: WidgetControlsProps) {
  const isTyping = status === "typing";
  const isPaused = status === "paused";
  const showControls = isTyping || isPaused || status === "countdown";

  if (!showControls) return null;

  return (
    <div className="flex items-center gap-1">
      {/* Pause/Resume */}
      <button
        onClick={isPaused ? onResume : onPause}
        disabled={status === "countdown"}
        className="w-6 h-6 flex items-center justify-center rounded
                   hover:bg-ghost-700/50 transition-colors disabled:opacity-50"
        title={isPaused ? "Resume" : "Pause"}
      >
        {isPaused ? (
          <svg className="w-4 h-4 text-ghost-300" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        ) : (
          <svg className="w-4 h-4 text-ghost-300" fill="currentColor" viewBox="0 0 24 24">
            <rect x="6" y="5" width="4" height="14" rx="1" />
            <rect x="14" y="5" width="4" height="14" rx="1" />
          </svg>
        )}
      </button>

      {/* Stop */}
      <button
        onClick={onStop}
        className="w-6 h-6 flex items-center justify-center rounded
                   hover:bg-ghost-700/50 transition-colors"
        title="Stop"
      >
        <svg className="w-4 h-4 text-ghost-300" fill="currentColor" viewBox="0 0 24 24">
          <rect x="6" y="6" width="12" height="12" rx="1" />
        </svg>
      </button>
    </div>
  );
}
