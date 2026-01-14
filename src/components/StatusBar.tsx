import type { TypingStatus } from "../lib/types";

interface StatusBarProps {
  status: TypingStatus;
  currentChar: number;
  totalChars: number;
  percent: number;
  errorMessage: string | null;
}

function getStatusInfo(status: TypingStatus): {
  label: string;
  color: string;
  pulse: boolean;
} {
  switch (status) {
    case "idle":
      return { label: "Idle", color: "bg-ghost-500", pulse: false };
    case "ready":
      return { label: "Ready", color: "bg-accent-info", pulse: false };
    case "countdown":
      return { label: "Starting...", color: "bg-accent-warning", pulse: true };
    case "typing":
      return { label: "Typing", color: "bg-accent-success", pulse: true };
    case "paused":
      return { label: "Paused", color: "bg-accent-warning", pulse: false };
    case "done":
      return { label: "Done", color: "bg-accent-success", pulse: false };
    case "error":
      return { label: "Error", color: "bg-accent-error", pulse: false };
    default:
      return { label: "Unknown", color: "bg-ghost-500", pulse: false };
  }
}

export function StatusBar({
  status,
  currentChar,
  totalChars,
  percent,
  errorMessage,
}: StatusBarProps) {
  const { label, color, pulse } = getStatusInfo(status);

  const formatTime = (chars: number, wpm: number = 60): string => {
    const charsPerMinute = wpm * 5;
    const minutes = chars / charsPerMinute;
    const mins = Math.floor(minutes);
    const secs = Math.round((minutes - mins) * 60);
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  const remainingChars = totalChars - currentChar;
  const eta = status === "typing" ? formatTime(remainingChars) : "--";

  return (
    <div className="space-y-3">
      {/* Status indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`w-2.5 h-2.5 rounded-full ${color} ${pulse ? "animate-pulse" : ""}`}
          />
          <span className="text-ghost-300 font-medium">{label}</span>
        </div>
        {totalChars > 0 && (
          <span className="text-ghost-400 text-sm font-mono">
            {currentChar.toLocaleString()}/{totalChars.toLocaleString()} chars
          </span>
        )}
      </div>

      {/* Progress bar */}
      {totalChars > 0 && (
        <div className="space-y-1.5">
          <div className="h-1.5 bg-ghost-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-accent-primary transition-all duration-200 rounded-full"
              style={{ width: `${percent}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-ghost-500">
            <span>{Math.round(percent)}%</span>
            {status === "typing" && <span>~{eta} remaining</span>}
          </div>
        </div>
      )}

      {/* Error message */}
      {errorMessage && (
        <div className="p-3 bg-accent-error/10 border border-accent-error/30 rounded-lg text-accent-error text-sm">
          {errorMessage}
        </div>
      )}
    </div>
  );
}
