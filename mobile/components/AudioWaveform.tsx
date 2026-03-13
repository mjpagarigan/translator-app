import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

interface AudioWaveformProps {
  metering: number; // dB value from -160 to 0
  isActive: boolean;
  color?: string;
  barCount?: number;
}

const BAR_COUNT = 30;

export function AudioWaveform({
  metering,
  isActive,
  color = "#6C63FF",
  barCount = BAR_COUNT,
}: AudioWaveformProps) {
  // Normalize metering from [-160, 0] to [0, 1]
  const normalizedLevel = Math.max(0, Math.min(1, (metering + 160) / 160));

  return (
    <View style={styles.container}>
      {Array.from({ length: barCount }, (_, i) => (
        <WaveBar
          key={i}
          index={i}
          barCount={barCount}
          level={normalizedLevel}
          isActive={isActive}
          color={color}
        />
      ))}
    </View>
  );
}

interface WaveBarProps {
  index: number;
  barCount: number;
  level: number;
  isActive: boolean;
  color: string;
}

function WaveBar({ index, barCount, level, isActive, color }: WaveBarProps) {
  const height = useSharedValue(4);

  useEffect(() => {
    if (isActive) {
      // Create wave pattern - center bars are tallest
      const centerDistance = Math.abs(index - barCount / 2) / (barCount / 2);
      const maxHeight = 40 * level * (1 - centerDistance * 0.5);
      const targetHeight = Math.max(4, maxHeight + Math.random() * 10 * level);
      height.value = withSpring(targetHeight, {
        damping: 8,
        stiffness: 200,
      });
    } else {
      height.value = withSpring(4, { damping: 15 });
    }
  }, [isActive, level, index, barCount, height]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value,
  }));

  return (
    <Animated.View
      style={[
        styles.bar,
        { backgroundColor: isActive ? color : "#E0E0E0" },
        animatedStyle,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 60,
    gap: 2,
    paddingHorizontal: 16,
  },
  bar: {
    width: 3,
    borderRadius: 2,
    minHeight: 4,
  },
});
