import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import { AppText, AppIcon } from '@components/common';
import { colors, fontFamilies, shadows } from '@theme';
import type { Place } from '@appTypes';

interface CulinarySectionProps {
  restaurants: Place[];
  cafes: Place[];
  title?: string;
  isLoading?: boolean;
  favoriteIds?: Set<string>;
  onPlacePress: (place: Place) => void;
  onBookmarkPress?: (place: Place) => void;
  onSeeAllPress?: () => void;
}

const CARD_WIDTH = 190;
const CARD_HEIGHT = 235;

export const CulinarySection: React.FC<CulinarySectionProps> = ({
  restaurants,
  cafes,
  title = 'Ẩm thực & Quán Cafe',
  isLoading = false,
  favoriteIds,
  onPlacePress,
  onBookmarkPress,
  onSeeAllPress,
}) => {
  const [activeTab, setActiveTab] = useState<'restaurant' | 'cafe'>('restaurant');

  const displayedList = activeTab === 'restaurant' ? restaurants : cafes;

  const renderCulinaryItem = ({ item }: { item: Place }) => {
    const isBookmarked = favoriteIds?.has(item._id) ?? false;
    const imageUrl = item.images && item.images.length > 0 ? item.images[0] : null;
    const tagText =
      item.cuisineType ||
      (activeTab === 'restaurant' ? 'Ẩm thực' : 'Cafe & Chill');

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.88}
        onPress={() => onPlacePress(item)}
      >
        {/* Cover Image */}
        <View style={styles.imageContainer}>
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              style={styles.cardImage}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.cardImage, styles.placeholderImage]}>
              <AppIcon
                name={activeTab === 'restaurant' ? 'utensils' : 'cafe'}
                size={28}
                color={colors.text.muted}
              />
            </View>
          )}

          {/* Floating Tag */}
          <View style={styles.tagBadge}>
            <AppText style={styles.tagText} numberOfLines={1}>
              {tagText}
            </AppText>
          </View>

          {/* Bookmark Button */}
          {onBookmarkPress && (
            <TouchableOpacity
              style={styles.bookmarkButton}
              activeOpacity={0.7}
              onPress={() => onBookmarkPress(item)}
            >
              <AppIcon
                name={isBookmarked ? 'bookmarkSolid' : 'bookmark'}
                size={13}
                color={isBookmarked ? colors.primary.main : '#FFFFFF'}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Content */}
        <View style={styles.infoContainer}>
          <AppText style={styles.placeName} numberOfLines={1}>
            {item.name}
          </AppText>

          <View style={styles.addressRow}>
            <AppIcon
              name="location"
              size={11}
              color={colors.text.muted}
              style={styles.locationIcon}
            />
            <AppText style={styles.addressText} numberOfLines={1}>
              {item.address || 'Việt Nam'}
            </AppText>
          </View>

          <View style={styles.bottomRow}>
            <View style={styles.ratingRow}>
              <AppIcon name="star" size={11} color="#F59E0B" />
              <AppText style={styles.ratingText}>
                {item.rating ? item.rating.toFixed(1) : '4.6'}
              </AppText>
              {item.numReviews ? (
                <AppText style={styles.reviewCountText}>
                  ({item.numReviews})
                </AppText>
              ) : null}
            </View>

            {item.price ? (
              <AppText style={styles.priceText}>
                ~{item.price.toLocaleString('vi-VN')} đ
              </AppText>
            ) : null}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.titleGroup}>
          <AppText style={styles.sectionTitle}>{title}</AppText>
          <AppText style={styles.sectionSubtitle}>
            Hương vị bản địa & không gian thư giãn
          </AppText>
        </View>

        {onSeeAllPress && (
          <TouchableOpacity activeOpacity={0.7} onPress={onSeeAllPress}>
            <AppText style={styles.seeAllText}>Xem tất cả</AppText>
          </TouchableOpacity>
        )}
      </View>

      {/* Tab Switcher */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'restaurant' && styles.tabButtonActive,
          ]}
          activeOpacity={0.8}
          onPress={() => setActiveTab('restaurant')}
        >
          <AppIcon
            name="utensils"
            size={13}
            color={activeTab === 'restaurant' ? '#FFFFFF' : '#64748B'}
            style={styles.tabIcon}
          />
          <AppText
            style={[
              styles.tabText,
              activeTab === 'restaurant' && styles.tabTextActive,
            ]}
          >
            Nhà hàng ({restaurants.length})
          </AppText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'cafe' && styles.tabButtonActive,
          ]}
          activeOpacity={0.8}
          onPress={() => setActiveTab('cafe')}
        >
          <AppIcon
            name="cafe"
            size={13}
            color={activeTab === 'cafe' ? '#FFFFFF' : '#64748B'}
            style={styles.tabIcon}
          />
          <AppText
            style={[
              styles.tabText,
              activeTab === 'cafe' && styles.tabTextActive,
            ]}
          >
            Quán Cafe ({cafes.length})
          </AppText>
        </TouchableOpacity>
      </View>

      {/* List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <View style={[styles.card, styles.skeletonCard]} />
          <View style={[styles.card, styles.skeletonCard]} />
        </View>
      ) : displayedList.length === 0 ? (
        <View style={styles.emptyContainer}>
          <AppText style={styles.emptyText}>
            Chưa có địa điểm {activeTab === 'restaurant' ? 'nhà hàng' : 'quán cafe'} tại khu vực này.
          </AppText>
        </View>
      ) : (
        <FlatList
          data={displayedList}
          keyExtractor={(item) => item._id}
          renderItem={renderCulinaryItem}
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
    marginBottom: 28,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  titleGroup: {
    flex: 1,
  },
  sectionTitle: {
    fontFamily: fontFamilies.sfProDisplay.bold,
    fontSize: 20,
    color: '#0F172A',
    lineHeight: 24,
  },
  sectionSubtitle: {
    fontFamily: fontFamilies.sfProText.regular,
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  seeAllText: {
    fontFamily: fontFamilies.sfProText.medium,
    fontSize: 13,
    color: '#005BBF',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 14,
    gap: 10,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
  },
  tabButtonActive: {
    backgroundColor: '#005BBF',
  },
  tabIcon: {
    marginRight: 6,
  },
  tabText: {
    fontFamily: fontFamilies.sfProText.medium,
    fontSize: 12,
    color: '#64748B',
  },
  tabTextActive: {
    fontFamily: fontFamilies.sfProText.bold,
    color: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: 20,
    gap: 14,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    ...shadows.sm,
  },
  imageContainer: {
    width: '100%',
    height: 125,
    position: 'relative',
    backgroundColor: '#F1F5F9',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.72)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
    maxWidth: CARD_WIDTH - 55,
  },
  tagText: {
    fontFamily: fontFamilies.sfProText.medium,
    fontSize: 10,
    color: '#FFFFFF',
  },
  bookmarkButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContainer: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  placeName: {
    fontFamily: fontFamilies.sfProDisplay.bold,
    fontSize: 14,
    color: '#0F172A',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  locationIcon: {
    marginRight: 4,
  },
  addressText: {
    flex: 1,
    fontFamily: fontFamilies.sfProText.regular,
    fontSize: 11,
    color: '#64748B',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingText: {
    fontFamily: fontFamilies.sfProText.bold,
    fontSize: 11,
    color: '#0F172A',
  },
  reviewCountText: {
    fontFamily: fontFamilies.sfProText.regular,
    fontSize: 10,
    color: '#94A3B8',
  },
  priceText: {
    fontFamily: fontFamilies.sfProText.medium,
    fontSize: 11,
    color: '#005BBF',
  },
  loadingContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 14,
  },
  skeletonCard: {
    backgroundColor: '#E2E8F0',
  },
  emptyContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: fontFamilies.sfProText.regular,
    fontSize: 13,
    color: '#94A3B8',
  },
});

