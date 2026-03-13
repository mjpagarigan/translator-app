import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  FlatList,
} from "react-native";
import { useAudioRecorder } from "../hooks/useAudioRecorder";
import { AudioWaveform } from "./AudioWaveform";
import { apiClient } from "../services/api";
import { useTranslationStore } from "../stores/translationStore";
import { VoiceInfo } from "../types";

const SAMPLE_TEXT = `The quick brown fox jumps over the lazy dog.
In a world where technology bridges language barriers, communication becomes universal.
Every person deserves to be understood, regardless of the language they speak.
The beauty of human connection lies in our ability to share thoughts, feelings, and ideas across cultures.
Let us build bridges, not walls, through the power of translation and understanding.`;

export function VoiceCloneSetup() {
  const recorder = useAudioRecorder();
  const { voices, setVoices, setSelectedVoiceId } = useTranslationStore();
  const [voiceName, setVoiceName] = useState("");
  const [recordings, setRecordings] = useState<string[]>([]);
  const [isCloning, setIsCloning] = useState(false);

  const handleStartRecording = async () => {
    await recorder.startRecording();
  };

  const handleStopRecording = async () => {
    const uri = await recorder.stopRecording();
    if (uri) {
      setRecordings((prev) => [...prev, uri]);
    }
  };

  const handleCloneVoice = async () => {
    if (!voiceName.trim()) {
      Alert.alert("Error", "Please enter a name for your voice");
      return;
    }
    if (recordings.length === 0) {
      Alert.alert("Error", "Please record at least one audio sample");
      return;
    }

    setIsCloning(true);
    try {
      const result = await apiClient.cloneVoice(voiceName, recordings);
      setSelectedVoiceId(result.voice_id);

      // Refresh voices list
      const updatedVoices = await apiClient.listVoices();
      setVoices(updatedVoices);

      Alert.alert("Success", `Voice "${voiceName}" created successfully!`);
      setVoiceName("");
      setRecordings([]);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Voice cloning failed");
    } finally {
      setIsCloning(false);
    }
  };

  const handleDeleteVoice = async (voice: VoiceInfo) => {
    try {
      await apiClient.deleteVoice(voice.voice_id);
      const updatedVoices = await apiClient.listVoices();
      setVoices(updatedVoices);
    } catch (err: any) {
      Alert.alert("Error", "Failed to delete voice");
    }
  };

  const clonedVoices = voices.filter((v) => v.is_cloned);

  return (
    <View style={styles.container}>
      {/* Instructions */}
      <View style={styles.section}>
        <Text style={styles.description}>
          Record your voice to create a personalized voice clone. The translated
          audio will sound like you!
        </Text>

        <View style={styles.tips}>
          <Text style={styles.tipTitle}>Tips:</Text>
          <Text style={styles.tip}>- Speak clearly for 1-2 minutes</Text>
          <Text style={styles.tip}>- Use a quiet environment</Text>
          <Text style={styles.tip}>- Speak naturally at normal pace</Text>
          <Text style={styles.tip}>- Read the sample text below</Text>
        </View>
      </View>

      {/* Sample text */}
      <View style={styles.sampleBox}>
        <Text style={styles.sampleLabel}>Sample text to read:</Text>
        <Text style={styles.sampleText}>{SAMPLE_TEXT}</Text>
      </View>

      {/* Voice name input */}
      <TextInput
        style={styles.input}
        placeholder="Voice name (e.g., My Voice)"
        value={voiceName}
        onChangeText={setVoiceName}
      />

      {/* Recording status */}
      <View style={styles.recordingStatus}>
        <Text style={styles.recordingCount}>
          {recordings.length} recording{recordings.length !== 1 ? "s" : ""} captured
        </Text>
        {recorder.isRecording && (
          <Text style={styles.recordingTime}>{recorder.duration}s</Text>
        )}
      </View>

      {/* Waveform */}
      <AudioWaveform
        metering={recorder.metering}
        isActive={recorder.isRecording}
        color="#FF4444"
      />

      {/* Record button */}
      <TouchableOpacity
        style={[styles.recordBtn, recorder.isRecording && styles.recordBtnActive]}
        onPressIn={handleStartRecording}
        onPressOut={handleStopRecording}
      >
        <Text style={styles.recordBtnText}>
          {recorder.isRecording ? "Recording... Release to stop" : "Hold to Record"}
        </Text>
      </TouchableOpacity>

      {/* Clone button */}
      <TouchableOpacity
        style={[styles.cloneBtn, (isCloning || recordings.length === 0) && styles.cloneBtnDisabled]}
        onPress={handleCloneVoice}
        disabled={isCloning || recordings.length === 0}
      >
        <Text style={styles.cloneBtnText}>
          {isCloning ? "Cloning..." : "Create Voice Clone"}
        </Text>
      </TouchableOpacity>

      {/* Existing voices */}
      {clonedVoices.length > 0 && (
        <View style={styles.voicesList}>
          <Text style={styles.voicesTitle}>My Voices</Text>
          {clonedVoices.map((voice) => (
            <View key={voice.voice_id} style={styles.voiceRow}>
              <Text style={styles.voiceName}>{voice.name}</Text>
              <TouchableOpacity onPress={() => handleDeleteVoice(voice)}>
                <Text style={styles.deleteBtn}>Delete</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 16,
  },
  description: {
    fontSize: 15,
    color: "#555",
    lineHeight: 22,
    marginBottom: 12,
  },
  tips: {
    backgroundColor: "#F8F7FF",
    padding: 12,
    borderRadius: 10,
  },
  tipTitle: {
    fontWeight: "700",
    color: "#6C63FF",
    marginBottom: 4,
  },
  tip: {
    fontSize: 13,
    color: "#666",
    lineHeight: 20,
  },
  sampleBox: {
    backgroundColor: "#F9F9F9",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    maxHeight: 150,
  },
  sampleLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#999",
    marginBottom: 8,
  },
  sampleText: {
    fontSize: 14,
    color: "#444",
    lineHeight: 22,
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  recordingStatus: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  recordingCount: {
    fontSize: 13,
    color: "#666",
  },
  recordingTime: {
    fontSize: 13,
    color: "#FF4444",
    fontWeight: "600",
  },
  recordBtn: {
    backgroundColor: "#6C63FF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  recordBtnActive: {
    backgroundColor: "#FF4444",
  },
  recordBtnText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  cloneBtn: {
    backgroundColor: "#4CAF50",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
  },
  cloneBtnDisabled: {
    backgroundColor: "#CCC",
  },
  cloneBtnText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  voicesList: {
    marginTop: 24,
  },
  voicesTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
  },
  voiceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#F9F9F9",
    borderRadius: 10,
    marginBottom: 8,
  },
  voiceName: {
    fontSize: 15,
    color: "#333",
  },
  deleteBtn: {
    color: "#FF4444",
    fontWeight: "600",
    fontSize: 13,
  },
});
