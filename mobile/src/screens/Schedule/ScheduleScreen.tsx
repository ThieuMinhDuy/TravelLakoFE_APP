import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from '@components/common';
import { colors } from '@theme';

/**
 * Base placeholder for Schedule screen.
 * Team members will implement the feature code for this screen.
 */
export const ScheduleScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <AppText variant="h2" color="main">
        Schedule
      </AppText>
      <AppText variant="body" color="sub" style={styles.subtitle}>
        Màn hình Lịch trình chuyến đi (Base Tab)
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.app,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    marginTop: 8,
  },
});

