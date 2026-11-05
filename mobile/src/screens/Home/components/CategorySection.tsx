import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';
import { AppText } from '@components/common';
import { colors, shadows, fontFamilies } from '@theme';
import { IMAGES } from '@assets';

export interface CategoryItem {
  id: string;
  name: string;
  image: any;
}

export const CATEGORIES: CategoryItem[] = [
  {
    id: 'beach',
    name: 'Biển đảo',
    image: IMAGES.categoryBeach,
  },
  {
    id: 'mountain',
    name: 'Núi non',
    image: IMAGES.categoryMountain,
  },
  {
    id: 'hotel',
    name: 'Khách sạn',
    image: { uri: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&auto=format&fit=crop&q=80' },
  },
  {
    id: 'food',
    name: 'Ẩm thực',
    image: { uri: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&auto=format&fit=crop&q=80' },
  },
  {
    id: 'cafe',
    name: 'Quán Cafe',
    image: { uri: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=200&auto=format&fit=crop&q=80' },
  },
];

export interface CategorySectionProps {
  selectedCategoryId?: string | null;
  onSelectCategory: (categoryId: string) => void;
  onSeeAllPress?: () => void;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  selectedCategoryId,
  onSelectCategory,
  onSeeAllPress,
}) => {
  const renderItem = ({ item }: { item: CategoryItem }) => {
    const isSelected = selectedCategoryId === item.id;

    return (
      <TouchableOpacity
        style={[styles.categoryPill, isSelected && styles.categoryPillActive]}
        activeOpacity={0.8}
        onPress={() => onSelectCategory(item.id)}
      >
        {/* 3D Category Image */}
        <View style={styles.imageWrapper}>
          <Image source={item.image} style={styles.categoryImage} resizeMode="contain" />
        </View>

        {/* Category Label */}
        <AppText style={styles.categoryLabel}>
          {item.name}
        </AppText>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <AppText style={styles.sectionTitle}>Danh mục khám phá</AppText>
        <TouchableOpacity activeOpacity={0.7} onPress={onSeeAllPress}>
          <AppText style={styles.seeAllText}>Xem tất cả</AppText>
        </TouchableOpacity>
      </View>

      {/* Horizontal List */}
      <FlatList
        data={CATEGORIES}
        keyExtractor={(item) => item.id}
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
    marginBottom: 32,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  sectionTitle: {
    fontFamily: fontFamilies.sfProDisplay.semiBold,
    fontSize: 18,
    color: '#151111',
    lineHeight: 22,
  },
  seeAllText: {
    fontFamily: fontFamilies.sfProText.regular,
    fontSize: 13,
    color: '#005BBF', // Chuẩn Figma blue
    lineHeight: 16,
  },
  listContent: {
    paddingHorizontal: 20,
    gap: 14,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 54,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    borderRadius: 27, // Oval Pill shape chuẩn Figma
    borderWidth: 1.5,
    borderColor: '#005BBF', // Viền xanh chuẩn Figma
    ...shadows.sm,
  },
  categoryPillActive: {
    backgroundColor: '#F0F9FF',
    borderColor: colors.primary.main,
    borderWidth: 2,
  },
  imageWrapper: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  categoryLabel: {
    fontFamily: fontFamilies.sfProText.bold,
    fontSize: 16,
    color: '#151111',
    lineHeight: 20,
  },
});
