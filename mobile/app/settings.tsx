import { View, Text, StyleSheet, TextInput, Switch, ScrollView } from "react-native";
import { useTranslationStore } from "../stores/translationStore";
import { apiClient } from "../services/api";
import { API_BASE_URL } from "../constants/config";
import { useState } from "react";

export default function SettingsScreen() {
  const { autoPlay, setAutoPlay, backendUrl, setBackendUrl } = useTranslationStore();
  const [urlInput, setUrlInput] = useState(backendUrl || API_BASE_URL);

  const handleUrlSave = () => {
    const url = urlInput.trim();
    if (url) {
      setBackendUrl(url);
      apiClient.setBaseUrl(url);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Server Configuration */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Server</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Backend URL</Text>
          <TextInput
            style={styles.input}
            value={urlInput}
            onChangeText={setUrlInput}
            onBlur={handleUrlSave}
            placeholder="http://localhost:8000"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
      </View>

      {/* Audio Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Audio</Text>
        <View style={styles.switchRow}>
          <View>
            <Text style={styles.label}>Auto-play translation</Text>
            <Text style={styles.sublabel}>
              Automatically play translated audio
            </Text>
          </View>
          <Switch
            value={autoPlay}
            onValueChange={setAutoPlay}
            trackColor={{ false: "#DDD", true: "#6C63FF80" }}
            thumbColor={autoPlay ? "#6C63FF" : "#F4F3F4"}
          />
        </View>
      </View>

      {/* About */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.aboutText}>
          VoiceBridge v1.0.0{"\n\n"}
          Real-time voice translation with voice cloning.{"\n\n"}
          Powered by:{"\n"}
          - OpenAI Whisper (Speech Recognition){"\n"}
          - Meta NLLB-200 (Translation){"\n"}
          - ElevenLabs (Voice Cloning & TTS)
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  section: {
    padding: 16,
    borderBottomWidth: 8,
    borderBottomColor: "#F5F5F5",
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#999",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  row: {
    marginBottom: 12,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 6,
  },
  sublabel: {
    fontSize: 13,
    color: "#999",
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    backgroundColor: "#F9F9F9",
    fontFamily: "monospace",
  },
  aboutText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 22,
  },
});
