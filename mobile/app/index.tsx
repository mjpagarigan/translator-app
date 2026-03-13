import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { apiClient } from "../services/api";

export default function HomeScreen() {
  const router = useRouter();
  const [serverStatus, setServerStatus] = useState<string>("checking...");

  useEffect(() => {
    async function checkHealth() {
      try {
        const health = await apiClient.health();
        if (health.status === "ok") {
          setServerStatus("connected");
        } else {
          setServerStatus("error");
        }
      } catch {
        setServerStatus("offline");
      }
    }
    checkHealth();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.logo}>VoiceBridge</Text>
        <Text style={styles.tagline}>
          Real-time voice translation{"\n"}with voice cloning
        </Text>
      </View>

      <View style={styles.features}>
        <FeatureItem
          icon="99+"
          title="Speech Recognition"
          description="Languages supported via Whisper"
        />
        <FeatureItem
          icon="200+"
          title="Text Translation"
          description="Languages via Meta NLLB-200"
        />
        <FeatureItem
          icon="29+"
          title="Voice Cloning"
          description="Languages with your cloned voice"
        />
      </View>

      <TouchableOpacity
        style={styles.startButton}
        onPress={() => router.push("/translate")}
      >
        <Text style={styles.startButtonText}>Start Translating</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.setupButton}
        onPress={() => router.push("/voice-setup")}
      >
        <Text style={styles.setupButtonText}>Set Up Voice Clone</Text>
      </TouchableOpacity>

      <View style={styles.statusRow}>
        <View
          style={[
            styles.statusDot,
            {
              backgroundColor:
                serverStatus === "connected"
                  ? "#4CAF50"
                  : serverStatus === "checking..."
                  ? "#FFC107"
                  : "#F44336",
            },
          ]}
        />
        <Text style={styles.statusText}>
          Server: {serverStatus}
        </Text>
      </View>
    </View>
  );
}

function FeatureItem({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <View style={styles.featureItem}>
      <Text style={styles.featureIcon}>{icon}</Text>
      <View>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDesc}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  hero: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    fontSize: 36,
    fontWeight: "800",
    color: "#6C63FF",
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    lineHeight: 24,
  },
  features: {
    marginBottom: 40,
    gap: 16,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    backgroundColor: "#F8F7FF",
    padding: 16,
    borderRadius: 12,
  },
  featureIcon: {
    fontSize: 20,
    fontWeight: "800",
    color: "#6C63FF",
    width: 50,
    textAlign: "center",
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#333",
  },
  featureDesc: {
    fontSize: 13,
    color: "#888",
    marginTop: 2,
  },
  startButton: {
    backgroundColor: "#6C63FF",
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 12,
    elevation: 4,
    shadowColor: "#6C63FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  startButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
  },
  setupButton: {
    borderWidth: 2,
    borderColor: "#6C63FF",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 24,
  },
  setupButtonText: {
    color: "#6C63FF",
    fontSize: 16,
    fontWeight: "700",
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 13,
    color: "#AAA",
  },
});
