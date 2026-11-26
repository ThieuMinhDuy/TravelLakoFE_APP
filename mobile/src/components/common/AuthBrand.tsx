import React from 'react';
import { Image, View, StyleSheet } from 'react-native';
import { IMAGES } from '@assets';
import { AppText } from './AppText';

export const AuthBrand = () => (
  <View style={styles.brand}>
    <AppText style={styles.name}>TravelLako</AppText>
    <Image
      source={IMAGES.logo}
      style={styles.logo}
      resizeMode="contain"
      accessibilityLabel="Logo TravelLako"
    />
  </View>
);
const styles = StyleSheet.create({
  brand: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    gap: 6,
  },
  name: { fontSize: 27, fontWeight: '700', color: '#111111' },
  logo: { width: 32, height: 40 },
});
