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
        Lịch trình
      </AppText>
      <AppText variant="body" color="sub" style={styles.subtitle}>
        Chức năng lịch trình chưa được tích hợp.
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
