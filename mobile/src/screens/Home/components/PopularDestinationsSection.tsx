import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { AppText, AppIcon } from '@components/common';
import { shadows, fontFamilies } from '@theme';
import { IMAGES } from '@assets';
import type { Place } from '@appTypes';

const CARD_WIDTH = 230;
const CARD_HEIGHT = 315;

export interface PopularDestinationsSectionProps {
  places: Place[];
  title?: string;
  isLoading?: boolean;
  onPlacePress: (place: Place) => void;
  onBookmarkPress: (place: Place) => void;
  onSeeAllPress?: () => void;
  onResetCityFilter?: () => void;
  favoriteIds?: Set<string>;
}

// Map ảnh local chuẩn Figma
const FIGMA_DEST_IMAGES: Record<string, any> = {
  'The Nautilus Maldives': IMAGES.destNautilus,
  'Erin-Ijesha Falls': IMAGES.destErinIjesha,
};

export const PopularDestinationsSection: React.FC<PopularDestinationsSectionProps> = ({
  places,
  title = 'Popular Destinations',
  isLoading = false,
  onPlacePress,
  onBookmarkPress,
  onSeeAllPress,
  onResetCityFilter,
  favoriteIds = new Set(),
}) => {
  const renderItem = ({ item }: { item: Place }) => {
    const isSaved = favoriteIds.has(item._id);
    const localImg = FIGMA_DEST_IMAGES[item.name];
    const imageSource = localImg
      ? localImg
      : item.images?.[0]
      ? { uri: item.images[0] }
      : IMAGES.destNautilus;

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.9}
        onPress={() => onPlacePress(item)}
      >
        {/* Cover Image */}
        <Image source={imageSource} style={styles.cardImage} resizeMode="cover" />

        {/* Top-Right Action Button: Export / Share or Bookmark button */}
        <TouchableOpacity
          style={styles.exportButton}
          activeOpacity={0.8}
          onPress={() => onBookmarkPress(item)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <AppIcon
            name={isSaved ? 'bookmarkSolid' : 'export'}
            size={14}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        {/* Bottom Content Card - Chuẩn Figma Frosted Glass Pill */}
        <View style={styles.bottomPill}>
          {/* Destination Name */}
          <AppText style={styles.placeName} numberOfLines={1}>
            {item.name}
          </AppText>

          {/* Location Pin & Address */}
          <View style={styles.locationRow}>
            <AppIcon name="location" size={10} color="#FFFFFF" style={styles.locationIcon} />
            <AppText style={styles.locationText} numberOfLines={1}>
              {item.address}
            </AppText>
          </View>

          {/* 5 Stars Rating Row */}
          <View style={styles.ratingRow}>
            <View style={styles.starsWrapper}>
              {[1, 2, 3, 4, 5].map((starIndex) => {
                const isFilled = starIndex <= Math.round(item.rating || 4.6);
                return (
                  <AppIcon
                    key={starIndex}
                    name="star"
                    size={9}
                    color={isFilled ? '#FCD240' : 'rgba(255, 255, 255, 0.4)'}
                    style={styles.starIcon}
                  />
                );
              })}
            </View>
            <AppText style={styles.ratingText}>
              {item.rating?.toFixed(1) || '4.6'}
            </AppText>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.headerRow}>
        <AppText style={styles.sectionTitle}>{title}</AppText>
        <TouchableOpacity activeOpacity={0.7} onPress={onSeeAllPress}>
          <AppText style={styles.seeAllText}>See all</AppText>
        </TouchableOpacity>
      </View>

      {/* Content Area with Loading & Empty State Handling */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#005BBF" />
          <AppText style={styles.loadingText}>Đang tải địa điểm...</AppText>
        </View>
      ) : places.length === 0 ? (
        <View style={styles.emptyContainer}>
          <AppIcon name="location" size={24} color="#94A3B8" />
          <AppText style={styles.emptyTitle}>Chưa có địa điểm nào</AppText>
          <AppText style={styles.emptySubtitle}>
            Thành phố này đang được cập nhật thêm các địa điểm hấp dẫn.
          </AppText>
          {onResetCityFilter && (
            <TouchableOpacity style={styles.resetButton} onPress={onResetCityFilter}>
              <AppText style={styles.resetButtonText}>Xem tất cả địa điểm</AppText>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={places}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 26,
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
    gap: 16,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 30, // Chuẩn Figma radius 30
    overflow: 'hidden',
    backgroundColor: '#0F172A',
    position: 'relative',
    ...shadows.md,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  exportButton: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomPill: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: 'rgba(21, 17, 17, 0.65)',
    borderRadius: 22,
  },
  placeName: {
    fontFamily: fontFamilies.sfProText.bold,
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 18,
    marginBottom: 3,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  locationIcon: {
    marginRight: 4,
  },
  locationText: {
    fontFamily: fontFamilies.sfProText.regular,
    fontSize: 10.5,
    color: '#FFFFFF',
    flex: 1,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  starsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    marginRight: 2,
  },
  ratingText: {
    fontFamily: fontFamilies.sfProText.medium,
    fontSize: 10.5,
    color: '#FFFFFF',
    lineHeight: 12,
  },
  loadingContainer: {
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 8,
    fontFamily: fontFamilies.sfProText.regular,
    fontSize: 13,
    color: '#64748B',
  },
  emptyContainer: {
    marginHorizontal: 20,
    padding: 24,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyTitle: {
    fontFamily: fontFamilies.sfProText.bold,
    fontSize: 14,
    color: '#151111',
    marginTop: 8,
  },
  emptySubtitle: {
    fontFamily: fontFamilies.sfProText.regular,
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 12,
  },
  resetButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  resetButtonText: {
    fontFamily: fontFamilies.sfProText.medium,
    fontSize: 12,
    color: '#005BBF',
  },
});
