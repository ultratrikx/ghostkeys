import { invoke } from "@tauri-apps/api/core";
import type { Config, FileInfo } from "./types";

export async function loadFile(path: string): Promise<FileInfo> {
  return invoke<FileInfo>("load_file", { path });
}

export async function startTyping(): Promise<void> {
  return invoke("start_typing");
}

export async function stopTyping(): Promise<void> {
  return invoke("stop_typing");
}

export async function pauseTyping(): Promise<void> {
  return invoke("pause_typing");
}

export async function resumeTyping(): Promise<void> {
  return invoke("resume_typing");
}

export async function getConfig(): Promise<Config> {
  return invoke<Config>("get_config");
}

export async function setConfig(config: Config): Promise<void> {
  return invoke("set_config", { config });
}

export async function getState(): Promise<{
  status: string;
  current_char: number;
  total_chars: number;
  file_name: string | null;
}> {
  return invoke("get_state");
}

export async function setFileContent(
  content: string,
  fileName: string
): Promise<void> {
  return invoke("set_file_content", { content, fileName });
}
