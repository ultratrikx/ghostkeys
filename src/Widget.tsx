import { useEffect, useState } from "react";
import { listen } from "@tauri-apps/api/event";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { ProgressBar } from "./components/widget/ProgressBar";
import { StatusIndicator } from "./components/widget/StatusIndicator";
import { WidgetControls } from "./components/widget/WidgetControls";
import type { TypingStatus, TypingProgress } from "./lib/types";
import * as commands from "./lib/commands";
import "./styles/globals.css";

interface WidgetState {
  status: TypingStatus;
  percent: number;
  current: number;
  total: number;
}

function Widget() {
  const [state, setState] = useState<WidgetState>({
    status: "idle",
    percent: 0,
    current: 0,
    total: 0,
  });
  const [isDragging, setIsDragging] = useState(false);

  // Listen for events from backend
  useEffect(() => {
    const unlistenProgress = listen<TypingProgress>(
      "typing-progress",
      (event) => {
        setState((prev) => ({
          ...prev,
          current: event.payload.current,
          total: event.payload.total,
          percent: event.payload.percent,
        }));
      }
    );

    const unlistenState = listen<{ status: string }>(
      "typing-state-changed",
      (event) => {
        setState((prev) => ({
          ...prev,
          status: event.payload.status as TypingStatus,
        }));
      }
    );

    return () => {
      unlistenProgress.then((fn) => fn());
      unlistenState.then((fn) => fn());
    };
  }, []);

  const handlePause = async () => {
    await commands.pauseTyping();
  };

  const handleResume = async () => {
    await commands.resumeTyping();
  };

  const handleStop = async () => {
    await commands.stopTyping();
  };

  const handleClose = async () => {
    const window = getCurrentWindow();
    await window.hide();
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      className={`w-[200px] h-[60px] rounded-lg overflow-hidden select-none
                  bg-ghost-950/95 backdrop-blur border border-ghost-800/50
                  ${isDragging ? "cursor-grabbing" : ""}`}
      onMouseUp={handleMouseUp}
    >
      {/* Drag handle / Header */}
      <div
        data-tauri-drag-region
        className="flex items-center justify-between px-2 py-1 bg-ghost-900/50 cursor-grab"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-1.5">
          <span className="text-sm opacity-70">&#128123;</span>
          <span className="text-xs font-medium text-ghost-200">ghostkeys</span>
        </div>
        <div className="flex items-center gap-1">
          <StatusIndicator status={state.status} />
          <button
            onClick={handleClose}
            className="w-4 h-4 flex items-center justify-center rounded
                       hover:bg-ghost-700/50 transition-colors text-ghost-400 hover:text-ghost-200"
            title="Hide widget"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Progress section */}
      <div className="flex items-center gap-2 px-2 py-1.5">
        <ProgressBar percent={state.percent} status={state.status} />
        <span className="text-xs text-ghost-400 font-mono w-8 text-right">
          {Math.round(state.percent)}%
        </span>
        <WidgetControls
          status={state.status}
          onPause={handlePause}
          onResume={handleResume}
          onStop={handleStop}
        />
      </div>
    </div>
  );
}

export default Widget;
