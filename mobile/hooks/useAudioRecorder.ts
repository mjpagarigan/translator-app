import { useState, useRef, useCallback } from "react";
import { Audio } from "expo-av";
import { configureAudio, requestMicPermission, RECORDING_OPTIONS } from "../services/audio";

interface UseAudioRecorderReturn {
  isRecording: boolean;
  metering: number;
  recordingUri: string | null;
  duration: number;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<string | null>;
  hasPermission: boolean;
  requestPermission: () => Promise<boolean>;
}

export function useAudioRecorder(): UseAudioRecorderReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [metering, setMetering] = useState(-160);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [hasPermission, setHasPermission] = useState(false);

  const recordingRef = useRef<Audio.Recording | null>(null);
  const durationIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    const granted = await requestMicPermission();
    setHasPermission(granted);
    return granted;
  }, []);

  const startRecording = useCallback(async () => {
    try {
      if (!hasPermission) {
        const granted = await requestPermission();
        if (!granted) return;
      }

      // Stop and unload any existing recording before creating a new one
      if (recordingRef.current) {
        try {
          await recordingRef.current.stopAndUnloadAsync();
        } catch {
          // Already stopped — ignore
        }
        recordingRef.current = null;
      }

      await configureAudio();

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(RECORDING_OPTIONS);

      // Listen for metering updates
      recording.setOnRecordingStatusUpdate((status) => {
        if (status.isRecording && status.metering !== undefined) {
          setMetering(status.metering);
        }
      });

      await recording.startAsync();
      recordingRef.current = recording;
      setIsRecording(true);
      setDuration(0);
      setRecordingUri(null);

      // Track duration
      const start = Date.now();
      durationIntervalRef.current = setInterval(() => {
        setDuration(Math.floor((Date.now() - start) / 1000));
      }, 100);
    } catch (err) {
      console.error("Failed to start recording:", err);
    }
  }, [hasPermission, requestPermission]);

  const stopRecording = useCallback(async (): Promise<string | null> => {
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
      durationIntervalRef.current = null;
    }

    if (!recordingRef.current) {
      setIsRecording(false);
      return null;
    }

    try {
      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      recordingRef.current = null;
      setIsRecording(false);
      setMetering(-160);
      setRecordingUri(uri);
      return uri;
    } catch (err) {
      console.error("Failed to stop recording:", err);
      setIsRecording(false);
      return null;
    }
  }, []);

  return {
    isRecording,
    metering,
    recordingUri,
    duration,
    startRecording,
    stopRecording,
    hasPermission,
    requestPermission,
  };
}
