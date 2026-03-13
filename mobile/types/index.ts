export interface LanguageInfo {
  code: string;
  name: string;
  native_name: string;
  whisper_supported: boolean;
  nllb_supported: boolean;
  tts_supported: boolean;
  voice_clone_supported: boolean;
}

export interface TranslationResult {
  source_text: string;
  source_language: string;
  source_language_code: string;
  translated_text: string;
  target_language: string;
  target_language_code: string;
  audio_base64: string | null;
  voice_cloned: boolean;
  processing_time_ms: number;
}

export interface VoiceInfo {
  voice_id: string;
  name: string;
  is_cloned: boolean;
}

export interface TranscriptionResult {
  text: string;
  language: string;
  language_code: string;
}

export type TranslationStatus =
  | "idle"
  | "recording"
  | "transcribing"
  | "translating"
  | "synthesizing"
  | "done"
  | "error";

export interface WSMessage {
  type: "status" | "translation" | "error";
  status?: string;
  source_text?: string;
  translated_text?: string;
  audio_base64?: string;
  source_language?: string;
  processing_time_ms?: number;
  message?: string;
}
