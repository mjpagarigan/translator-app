import { API_BASE_URL } from "../constants/config";
import {
  LanguageInfo,
  TranslationResult,
  TranscriptionResult,
  VoiceInfo,
} from "../types";

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  setBaseUrl(url: string) {
    this.baseUrl = url;
  }

  async health(): Promise<{
    status: string;
    whisper_loaded: boolean;
    nllb_loaded: boolean;
    elevenlabs_configured: boolean;
  }> {
    const res = await fetch(`${this.baseUrl}/health`);
    return res.json();
  }

  async getLanguages(): Promise<LanguageInfo[]> {
    const res = await fetch(`${this.baseUrl}/languages`);
    const data = await res.json();
    return data.languages;
  }

  async transcribe(audioUri: string): Promise<TranscriptionResult> {
    const formData = new FormData();
    formData.append("audio", {
      uri: audioUri,
      type: "audio/wav",
      name: "recording.wav",
    } as any);

    const res = await fetch(`${this.baseUrl}/transcribe`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Transcription failed");
    }

    return res.json();
  }

  async translate(
    audioUri: string,
    targetLanguage: string,
    voiceId?: string | null
  ): Promise<TranslationResult> {
    const formData = new FormData();
    formData.append("audio", {
      uri: audioUri,
      type: "audio/wav",
      name: "recording.wav",
    } as any);
    formData.append("target_language", targetLanguage);
    if (voiceId) {
      formData.append("voice_id", voiceId);
    }

    const res = await fetch(`${this.baseUrl}/translate`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Translation failed");
    }

    return res.json();
  }

  async translateText(
    text: string,
    sourceLanguage: string,
    targetLanguage: string
  ): Promise<{ translated_text: string }> {
    const res = await fetch(`${this.baseUrl}/translate/text`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        source_language: sourceLanguage,
        target_language: targetLanguage,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Text translation failed");
    }

    return res.json();
  }

  async tts(
    text: string,
    language: string,
    voiceId?: string | null
  ): Promise<ArrayBuffer> {
    const res = await fetch(`${this.baseUrl}/tts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, language, voice_id: voiceId }),
    });

    if (!res.ok) {
      throw new Error("TTS failed");
    }

    return res.arrayBuffer();
  }

  async cloneVoice(
    name: string,
    audioUris: string[]
  ): Promise<{ voice_id: string; name: string; status: string }> {
    const formData = new FormData();
    formData.append("name", name);
    audioUris.forEach((uri, i) => {
      formData.append("audio_files", {
        uri,
        type: "audio/wav",
        name: `sample_${i}.wav`,
      } as any);
    });

    const res = await fetch(`${this.baseUrl}/voice/clone`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Voice cloning failed");
    }

    return res.json();
  }

  async listVoices(): Promise<VoiceInfo[]> {
    const res = await fetch(`${this.baseUrl}/voice/list`);
    const data = await res.json();
    return data.voices;
  }

  async deleteVoice(voiceId: string): Promise<void> {
    await fetch(`${this.baseUrl}/voice/${voiceId}`, { method: "DELETE" });
  }
}

export const apiClient = new ApiClient();
