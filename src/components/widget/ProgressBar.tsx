import type { TypingStatus } from "../../lib/types";

interface ProgressBarProps {
  percent: number;
  status: TypingStatus;
}

export function ProgressBar({ percent, status }: ProgressBarProps) {
  const isActive = status === "typing";

  return (
    <div className="flex-1 h-1.5 bg-ghost-800 rounded-full overflow-hidden">
      <div
        className={`h-full transition-all duration-200 rounded-full ${
          isActive ? "bg-accent-primary" : "bg-ghost-500"
        }`}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
