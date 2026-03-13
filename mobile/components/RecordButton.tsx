import React, { useEffect } from "react";
import { StyleSheet, Pressable, Text, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";

interface RecordButtonProps {
  isRecording: boolean;
  onPressIn: () => void;
  onPressOut: () => void;
  disabled?: boolean;
}

export function RecordButton({
  isRecording,
  onPressIn,
  onPressOut,
  disabled = false,
}: RecordButtonProps) {
  const scale = useSharedValue(1);
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0);

  useEffect(() => {
    if (isRecording) {
      scale.value = withSpring(1.1, { damping: 10 });
      pulseScale.value = withRepeat(
        withTiming(1.8, { duration: 1000, easing: Easing.out(Easing.ease) }),
        -1,
        false
      );
      pulseOpacity.value = withRepeat(
        withTiming(0, { duration: 1000, easing: Easing.out(Easing.ease) }),
        -1,
        false
      );
    } else {
      scale.value = withSpring(1);
      pulseScale.value = 1;
      pulseOpacity.value = 0;
    }
  }, [isRecording, scale, pulseScale, pulseOpacity]);

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));

  return (
    <View style={styles.wrapper}>
      {isRecording && (
        <Animated.View style={[styles.pulse, pulseStyle]} />
      )}
      <Animated.View style={[styles.container, buttonStyle]}>
        <Pressable
          style={[
            styles.button,
            isRecording && styles.buttonRecording,
            disabled && styles.buttonDisabled,
          ]}
          onPressIn={disabled ? undefined : onPressIn}
          onPressOut={disabled ? undefined : onPressOut}
        >
          <Text style={styles.icon}>{isRecording ? "\u23F9" : "\uD83C\uDF99"}</Text>
          <Text style={styles.label}>
            {isRecording ? "Release to translate" : "Hold to record"}
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    justifyContent: "center",
    height: 120,
  },
  pulse: {
    position: "absolute",
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#FF4444",
    opacity: 0.3,
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#6C63FF",
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowColor: "#6C63FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonRecording: {
    backgroundColor: "#FF4444",
  },
  buttonDisabled: {
    backgroundColor: "#CCC",
    shadowOpacity: 0,
    elevation: 0,
  },
  icon: {
    fontSize: 32,
  },
  label: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "600",
    marginTop: 4,
    textAlign: "center",
  },
});
