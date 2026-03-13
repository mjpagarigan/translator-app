import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { apiClient } from "../services/api";
import { useTranslationStore } from "../stores/translationStore";

export default function RootLayout() {
  const { setLanguages, setVoices } = useTranslationStore();

  useEffect(() => {
    // Load languages and voices on app start
    async function init() {
      try {
        const [languages, voices] = await Promise.all([
          apiClient.getLanguages(),
          apiClient.listVoices(),
        ]);
        setLanguages(languages);
        setVoices(voices);
      } catch (err) {
        console.log("Failed to load initial data:", err);
        // Will use offline defaults from constants
      }
    }
    init();
  }, [setLanguages, setVoices]);

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#FFF" },
          headerTintColor: "#333",
          headerTitleStyle: { fontWeight: "700" },
          contentStyle: { backgroundColor: "#FFF" },
        }}
      >
        <Stack.Screen
          name="index"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="translate"
          options={{ title: "VoiceBridge", headerBackTitle: "Home" }}
        />
        <Stack.Screen
          name="settings"
          options={{ title: "Settings", presentation: "modal" }}
        />
        <Stack.Screen
          name="voice-setup"
          options={{ title: "Voice Setup", presentation: "modal" }}
        />
      </Stack>
    </>
  );
}
