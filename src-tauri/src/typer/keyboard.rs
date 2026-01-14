use enigo::{Enigo, Keyboard, Settings};
use std::thread;
use std::time::Duration;

/// Wrapper around enigo for keyboard simulation
pub struct KeyboardSimulator {
    enigo: Enigo,
}

impl KeyboardSimulator {
    pub fn new() -> Result<Self, String> {
        let enigo = Enigo::new(&Settings::default())
            .map_err(|e| format!("Failed to create keyboard simulator: {}", e))?;
        Ok(Self { enigo })
    }
    
    /// Type a single character
    pub fn type_char(&mut self, c: char) -> Result<(), String> {
        self.enigo
            .text(&c.to_string())
            .map_err(|e| format!("Failed to type character '{}': {}", c, e))
    }
    
    /// Type a string of characters
    pub fn type_text(&mut self, text: &str) -> Result<(), String> {
        self.enigo
            .text(text)
            .map_err(|e| format!("Failed to type text: {}", e))
    }
    
    /// Press backspace
    pub fn backspace(&mut self) -> Result<(), String> {
        use enigo::Key;
        self.enigo
            .key(Key::Backspace, enigo::Direction::Click)
            .map_err(|e| format!("Failed to press backspace: {}", e))
    }
    
    /// Press backspace multiple times
    pub fn backspace_n(&mut self, n: usize, delay_ms: u64) -> Result<(), String> {
        for _ in 0..n {
            self.backspace()?;
            if delay_ms > 0 {
                thread::sleep(Duration::from_millis(delay_ms));
            }
        }
        Ok(())
    }
}

impl Default for KeyboardSimulator {
    fn default() -> Self {
        Self::new().expect("Failed to create default KeyboardSimulator")
    }
}
