use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Config {
    pub base_wpm: u32,
    pub wpm_variance: f64,
    pub mistake_rate: f64,
    pub correction_rate: f64,
    pub punctuation_pause: u64,
    pub paragraph_pause: u64,
    pub thinking_pause_chance: f64,
    pub thinking_pause_duration: u64,
    pub burst_typing: bool,
    pub countdown_seconds: u32,
}

impl Default for Config {
    fn default() -> Self {
        Self {
            base_wpm: 60,
            wpm_variance: 0.3,
            mistake_rate: 0.03,
            correction_rate: 0.7,
            punctuation_pause: 300,
            paragraph_pause: 800,
            thinking_pause_chance: 0.02,
            thinking_pause_duration: 1500,
            burst_typing: true,
            countdown_seconds: 3,
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum TypingStatus {
    Idle,
    Ready,
    Countdown,
    Typing,
    Paused,
    Done,
    Error,
}

impl Default for TypingStatus {
    fn default() -> Self {
        Self::Idle
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TypingProgress {
    pub current: u32,
    pub total: u32,
    pub percent: f32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct StatePayload {
    pub status: TypingStatus,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CountdownPayload {
    pub remaining: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ErrorPayload {
    pub message: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FileInfo {
    pub name: String,
    pub content: String,
    pub char_count: u32,
}
