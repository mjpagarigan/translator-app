import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "../hooks/useTranslation";
import { useTranslationStore } from "../stores/translationStore";
import { LanguageSelector } from "../components/LanguageSelector";
import { RecordButton } from "../components/RecordButton";
import { AudioWaveform } from "../components/AudioWaveform";
import { TranslationCard } from "../components/TranslationCard";
import { useEffect } from "react";

export default function TranslateScreen() {
  const router = useRouter();
  const {
    isRecording,
    metering,
    duration,
    hasPermission,
    status,
    result,
    error,
    startRecording,
    stopAndTranslate,
    playResult,
    requestPermission,
  } = useTranslation();

  const {
    sourceLanguage,
    targetLanguage,
    setSourceLanguage,
    setTargetLanguage,
    swapLanguages,
  } = useTranslationStore();

  // Request mic permission on mount
  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  return (
    <View style={styles.container}>
      {/* Header actions */}
      <View style={styles.headerActions}>
        <TouchableOpacity onPress={() => router.push("/voice-setup")}>
          <Text style={styles.headerLink}>Voice Setup</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/settings")}>
          <Text style={styles.headerLink}>Settings</Text>
        </TouchableOpacity>
      </View>

      {/* Language selectors */}
      <View style={styles.languageRow}>
        <LanguageSelector
          label="From"
          selected={sourceLanguage}
          onSelect={setSourceLanguage}
          showAutoDetect
        />

        <TouchableOpacity style={styles.swapButton} onPress={swapLanguages}>
          <Text style={styles.swapIcon}>{"\u21C4"}</Text>
        </TouchableOpacity>

        <LanguageSelector
          label="To"
          selected={targetLanguage}
          onSelect={setTargetLanguage}
        />
      </View>

      {/* Translation results */}
      <TranslationCard
        result={result}
        status={status}
        error={error}
        onPlayAgain={playResult}
      />

      {/* Waveform */}
      <AudioWaveform
        metering={metering}
        isActive={isRecording}
        color={isRecording ? "#FF4444" : "#6C63FF"}
      />

      {/* Record button */}
      <RecordButton
        isRecording={isRecording}
        onPressIn={startRecording}
        onPressOut={stopAndTranslate}
        disabled={!hasPermission}
      />

      {/* Footer controls */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {isRecording ? `Recording: ${duration}s` : "Auto-detect source language"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  headerActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  headerLink: {
    color: "#6C63FF",
    fontSize: 14,
    fontWeight: "600",
  },
  languageRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  swapButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
  },
  swapIcon: {
    fontSize: 18,
    color: "#6C63FF",
  },
  footer: {
    alignItems: "center",
    paddingVertical: 16,
    paddingBottom: 32,
  },
  footerText: {
    fontSize: 13,
    color: "#AAA",
  },
});
