import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from '@components/common';
import { fontFamilies } from '@theme';

export const HomeHero: React.FC = () => {
  return (
    <View style={styles.container}>
      <AppText style={styles.titleRegular}>Khám phá những</AppText>
      <AppText style={styles.titleAccent}>Điểm đến tuyệt vời !</AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 14,
    marginBottom: 16,
  },
  titleRegular: {
    fontFamily: fontFamilies.sfProDisplay.regular,
    fontSize: 26,
    color: '#151111',
    lineHeight: 32,
    letterSpacing: -0.3,
  },
  titleAccent: {
    fontFamily: fontFamilies.sfProDisplay.bold,
    fontSize: 28,
    color: '#D48B38', // Màu vàng cát hoàng hôn chuẩn Figma
    lineHeight: 34,
    letterSpacing: -0.3,
  },
});
