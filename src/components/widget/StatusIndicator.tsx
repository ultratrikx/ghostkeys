import type { TypingStatus } from "../../lib/types";

interface StatusIndicatorProps {
  status: TypingStatus;
}

export function StatusIndicator({ status }: StatusIndicatorProps) {
  const getStatusConfig = () => {
    switch (status) {
      case "idle":
        return { color: "bg-ghost-500", label: "Idle", pulse: false };
      case "ready":
        return { color: "bg-accent-info", label: "Ready", pulse: false };
      case "countdown":
        return { color: "bg-accent-warning", label: "Starting", pulse: true };
      case "typing":
        return { color: "bg-accent-success", label: "Active", pulse: true };
      case "paused":
        return { color: "bg-accent-warning", label: "Paused", pulse: false };
      case "done":
        return { color: "bg-accent-success", label: "Done", pulse: false };
      case "error":
        return { color: "bg-accent-error", label: "Error", pulse: false };
      default:
        return { color: "bg-ghost-500", label: "---", pulse: false };
    }
  };

  const { color, label, pulse } = getStatusConfig();

  return (
    <div className="flex items-center gap-1.5">
      <span
        className={`w-2 h-2 rounded-full ${color} ${pulse ? "animate-pulse" : ""}`}
      />
      <span className="text-xs text-ghost-300">{label}</span>
    </div>
  );
}
