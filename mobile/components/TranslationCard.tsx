import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { TranslationResult, TranslationStatus } from "../types";

interface TranslationCardProps {
  result: TranslationResult | null;
  status: TranslationStatus;
  error: string | null;
  onPlayAgain?: () => void;
}

const STATUS_MESSAGES: Record<string, string> = {
  recording: "Listening...",
  transcribing: "Transcribing...",
  translating: "Translating...",
  synthesizing: "Generating voice...",
};

export function TranslationCard({
  result,
  status,
  error,
  onPlayAgain,
}: TranslationCardProps) {
  const isProcessing = ["transcribing", "translating", "synthesizing"].includes(status);
  const statusMessage = STATUS_MESSAGES[status];

  if (status === "idle" && !result && !error) {
    return (
      <View style={styles.container}>
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>
            Hold the record button and speak to translate
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Processing indicator */}
      {isProcessing && (
        <View style={styles.statusBar}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>{statusMessage}</Text>
        </View>
      )}

      {/* Error */}
      {error && (
        <View style={styles.errorCard}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Source text */}
      {result && (
        <>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>
              Source ({result.source_language})
            </Text>
            <Text style={styles.cardText}>{result.source_text}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.card}>
            <Text style={styles.cardLabel}>
              Translation ({result.target_language})
            </Text>
            <Text style={styles.translatedText}>{result.translated_text}</Text>
          </View>

          {/* Metadata */}
          <View style={styles.meta}>
            <Text style={styles.metaText}>
              {result.processing_time_ms}ms
              {result.voice_cloned ? " | Cloned voice" : ""}
              {!result.audio_base64 ? " | Text only" : ""}
            </Text>
            {result.audio_base64 && onPlayAgain && (
              <TouchableOpacity style={styles.playButton} onPress={onPlayAgain}>
                <Text style={styles.playButtonText}>Play again</Text>
              </TouchableOpacity>
            )}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  placeholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  placeholderText: {
    fontSize: 16,
    color: "#AAA",
    textAlign: "center",
    lineHeight: 24,
  },
  statusBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#6C63FF",
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    color: "#6C63FF",
    fontWeight: "600",
  },
  errorCard: {
    backgroundColor: "#FFF0F0",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  errorText: {
    color: "#D32F2F",
    fontSize: 14,
  },
  card: {
    backgroundColor: "#F9F9F9",
    borderRadius: 12,
    padding: 16,
    marginBottom: 4,
  },
  cardLabel: {
    fontSize: 12,
    color: "#999",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  cardText: {
    fontSize: 18,
    color: "#333",
    lineHeight: 26,
  },
  divider: {
    height: 8,
  },
  translatedText: {
    fontSize: 20,
    color: "#6C63FF",
    fontWeight: "600",
    lineHeight: 28,
  },
  meta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  metaText: {
    fontSize: 12,
    color: "#BBB",
  },
  playButton: {
    backgroundColor: "#6C63FF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  playButtonText: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "600",
  },
});
