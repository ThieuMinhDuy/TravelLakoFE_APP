import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';
import { AppText } from '@components/common';
import { shadows, fontFamilies } from '@theme';
import type { City } from '@appTypes';

export interface WhereToVisitSectionProps {
  cities: City[];
  selectedCityId?: string | null;
  onCityPress: (city: City) => void;
}

export const WhereToVisitSection: React.FC<WhereToVisitSectionProps> = ({
  cities,
  selectedCityId,
  onCityPress,
}) => {
  const renderItem = ({ item }: { item: City }) => {
    const isSelected = selectedCityId === item._id;

    return (
      <TouchableOpacity
        style={styles.cityItem}
        activeOpacity={0.8}
        onPress={() => onCityPress(item)}
      >
        {/* City Circular Image - Chuẩn Figma radius 32 */}
        <View style={[styles.avatarWrapper, isSelected && styles.avatarWrapperActive]}>
          <Image
            source={{ uri: item.image }}
            style={styles.avatarImage}
            resizeMode="cover"
          />
        </View>

        {/* City Name */}
        <AppText
          style={[styles.cityName, isSelected && styles.cityNameActive]}
          numberOfLines={1}
        >
          {item.name}
        </AppText>

        {/* Active Indicator Dot */}
        {isSelected && <View style={styles.activeDot} />}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.headerRow}>
        <AppText style={styles.sectionTitle}>Where would you like to visit?</AppText>
      </View>

      {/* Horizontal List of Cities */}
      <FlatList
        data={cities}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  headerRow: {
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  sectionTitle: {
    fontFamily: fontFamilies.sfProDisplay.semiBold,
    fontSize: 18,
    color: '#151111',
    lineHeight: 22,
  },
  listContent: {
    paddingHorizontal: 20,
    gap: 16,
  },
  cityItem: {
    alignItems: 'center',
    width: 68,
  },
  avatarWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E2E8F0',
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    marginBottom: 8,
    ...shadows.sm,
  },
  avatarWrapperActive: {
    borderColor: '#005BBF', // Xanh đậm nhận diện active
    borderWidth: 3,
    transform: [{ scale: 1.05 }],
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  cityName: {
    fontFamily: fontFamilies.sfProText.regular,
    fontSize: 13,
    color: '#151111',
    textAlign: 'center',
    lineHeight: 16,
  },
  cityNameActive: {
    color: '#005BBF',
    fontFamily: fontFamilies.sfProText.bold,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#005BBF',
    marginTop: 3,
  },
});
