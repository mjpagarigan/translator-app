import { Audio } from "expo-av";
import { Platform } from "react-native";

/**
 * Play audio from base64-encoded MP3 data.
 */
export async function playBase64Audio(base64Data: string): Promise<void> {
  const uri = `data:audio/mp3;base64,${base64Data}`;

  const { sound } = await Audio.Sound.createAsync(
    { uri },
    { shouldPlay: true }
  );

  // Wait for playback to finish, then unload
  sound.setOnPlaybackStatusUpdate((status) => {
    if (status.isLoaded && status.didJustFinish) {
      sound.unloadAsync();
    }
  });
}

/**
 * Configure audio mode for recording and playback.
 */
export async function configureAudio(): Promise<void> {
  await Audio.setAudioModeAsync({
    allowsRecordingIOS: true,
    playsInSilentModeIOS: true,
    staysActiveInBackground: false,
    shouldDuckAndroid: true,
  });
}

/**
 * Request microphone permission.
 */
export async function requestMicPermission(): Promise<boolean> {
  const { status } = await Audio.requestPermissionsAsync();
  return status === "granted";
}

/**
 * Recording preset optimized for speech (16kHz mono WAV).
 */
export const RECORDING_OPTIONS: Audio.RecordingOptions = {
  isMeteringEnabled: true,
  android: {
    extension: ".wav",
    outputFormat: Audio.AndroidOutputFormat.DEFAULT,
    audioEncoder: Audio.AndroidAudioEncoder.DEFAULT,
    sampleRate: 16000,
    numberOfChannels: 1,
    bitRate: 256000,
  },
  ios: {
    extension: ".wav",
    outputFormat: Audio.IOSOutputFormat.LINEARPCM,
    audioQuality: Audio.IOSAudioQuality.HIGH,
    sampleRate: 16000,
    numberOfChannels: 1,
    bitRate: 256000,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
  web: {
    mimeType: "audio/wav",
    bitsPerSecond: 256000,
  },
};
