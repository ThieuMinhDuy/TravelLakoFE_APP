import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from '@components/common';
import { colors } from '@theme';

/**
 * Base placeholder for Home screen.
 * Team members will implement the feature code for this screen.
 */
export const HomeScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <AppText variant="h2" color="main">
        Home
      </AppText>
      <AppText variant="body" color="sub" style={styles.subtitle}>
        Màn hình Trang chủ (Base Tab)
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

