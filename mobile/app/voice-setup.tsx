import { ScrollView, StyleSheet } from "react-native";
import { VoiceCloneSetup } from "../components/VoiceCloneSetup";

export default function VoiceSetupScreen() {
  return (
    <ScrollView style={styles.container}>
      <VoiceCloneSetup />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
});
