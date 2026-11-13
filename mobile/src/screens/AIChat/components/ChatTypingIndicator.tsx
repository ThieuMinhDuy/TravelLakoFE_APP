import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';
import { colors, radius, spacing, shadows } from '@theme';

export const ChatTypingIndicator: React.FC = () => {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createBounceAnim = (val: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(val, {
            toValue: -6,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(val, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.delay(600 - delay),
        ]),
      );
    };

    const anim1 = createBounceAnim(dot1, 0);
    const anim2 = createBounceAnim(dot2, 150);
    const anim3 = createBounceAnim(dot3, 300);

    anim1.start();
    anim2.start();
    anim3.start();

    return () => {
      anim1.stop();
      anim2.stop();
      anim3.stop();
    };
  }, [dot1, dot2, dot3]);

  return (
    <View style={styles.container}>
      <View style={styles.avatarMini}>
        <FontAwesomeIcon
          icon={faWandMagicSparkles}
          size={14}
          color={colors.primary.main}
        />
      </View>
      <View style={styles.bubble}>
        <Animated.View
          style={[styles.dot, { transform: [{ translateY: dot1 }] }]}
        />
        <Animated.View
          style={[styles.dot, { transform: [{ translateY: dot2 }] }]}
        />
        <Animated.View
          style={[styles.dot, { transform: [{ translateY: dot3 }] }]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  avatarMini: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary.soft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.xs,
    borderWidth: 1,
    borderColor: colors.primary.border,
  },
  bubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.xl,
    borderBottomLeftRadius: radius.xs,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    ...shadows.sm,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: colors.primary.light,
    marginHorizontal: 3,
  },
});
