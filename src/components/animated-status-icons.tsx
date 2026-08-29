import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';

export function AnimatedSuccessIcon({ size = 80 }: { size?: number }) {
  const scale = useSharedValue(0.3);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 300 });
    scale.value = withSpring(1, { damping: 12, stiffness: 100, mass: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={animatedStyle}>
        <Ionicons name="checkmark-circle" size={size} color="#4CAF50" />
      </Animated.View>
    </View>
  );
}

export function AnimatedErrorIcon({ size = 80 }: { size?: number }) {
  const translationX = useSharedValue(0);
  const scale = useSharedValue(0.3);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 300 });
    scale.value = withSpring(1, { damping: 12, stiffness: 100, mass: 1 });
    
    // Shake animation shortly after appearing
    setTimeout(() => {
      translationX.value = withSequence(
        withTiming(15, { duration: 60 }),
        withTiming(-15, { duration: 60 }),
        withTiming(15, { duration: 60 }),
        withTiming(0, { duration: 60 })
      );
    }, 200);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }, { translateX: translationX.value }],
      opacity: opacity.value,
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={animatedStyle}>
        <Ionicons name="close-circle" size={size} color={Colors.light.tintRed} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
});
