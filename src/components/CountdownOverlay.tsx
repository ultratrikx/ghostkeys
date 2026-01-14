interface CountdownOverlayProps {
  countdown: number;
  visible: boolean;
}

export function CountdownOverlay({ countdown, visible }: CountdownOverlayProps) {
  if (!visible || countdown <= 0) return null;

  return (
    <div className="fixed inset-0 bg-ghost-950/95 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="text-9xl font-light text-ghost-300 animate-pulse-fast">
          {countdown}
        </div>
        <p className="text-ghost-400 text-lg mt-4">
          Click into your target application...
        </p>
      </div>
    </div>
  );
}
