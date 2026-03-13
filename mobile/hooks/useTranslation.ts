import { useCallback } from "react";
import { useTranslationStore } from "../stores/translationStore";
import { useAudioRecorder } from "./useAudioRecorder";
import { apiClient } from "../services/api";
import { playBase64Audio } from "../services/audio";

interface UseTranslationReturn {
  // Recording
  isRecording: boolean;
  metering: number;
  duration: number;
  hasPermission: boolean;

  // Translation
  status: string;
  result: ReturnType<typeof useTranslationStore>["currentResult"];
  error: string | null;

  // Actions
  startRecording: () => Promise<void>;
  stopAndTranslate: () => Promise<void>;
  playResult: () => Promise<void>;
  requestPermission: () => Promise<boolean>;
}

export function useTranslation(): UseTranslationReturn {
  const store = useTranslationStore();
  const recorder = useAudioRecorder();

  const startRecording = useCallback(async () => {
    store.setError(null);
    store.setResult(null);
    store.setStatus("recording");
    await recorder.startRecording();
  }, [store, recorder]);

  const stopAndTranslate = useCallback(async () => {
    const uri = await recorder.stopRecording();
    if (!uri) {
      store.setError("No recording captured");
      return;
    }

    try {
      store.setStatus("transcribing");

      const result = await apiClient.translate(
        uri,
        store.targetLanguage.code,
        store.selectedVoiceId
      );

      store.setResult(result);

      // Auto-play if enabled
      if (store.autoPlay && result.audio_base64) {
        await playBase64Audio(result.audio_base64);
      }
    } catch (err: any) {
      store.setError(err.message || "Translation failed");
    }
  }, [recorder, store]);

  const playResult = useCallback(async () => {
    const audio = store.currentResult?.audio_base64;
    if (audio) {
      await playBase64Audio(audio);
    }
  }, [store.currentResult]);

  return {
    isRecording: recorder.isRecording,
    metering: recorder.metering,
    duration: recorder.duration,
    hasPermission: recorder.hasPermission,

    status: store.status,
    result: store.currentResult,
    error: store.error,

    startRecording,
    stopAndTranslate,
    playResult,
    requestPermission: recorder.requestPermission,
  };
}
