import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from '@components/common';
import { colors } from '@theme';

/**
 * Base placeholder for AI Chat screen.
 * Team members will implement the feature code for this screen.
 */
export const AIChatScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <AppText variant="h2" color="main">
        AI Chat
      </AppText>
      <AppText variant="body" color="sub" style={styles.subtitle}>
        Màn hình Trợ lý du lịch AI (Base Tab)
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

