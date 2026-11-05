import React from 'react';
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

interface FeaturedHotelsSectionProps {
  hotels: Place[];
  title?: string;
  isLoading?: boolean;
  favoriteIds?: Set<string>;
  onHotelPress: (hotel: Place) => void;
  onBookmarkPress?: (hotel: Place) => void;
  onSeeAllPress?: () => void;
}

const CARD_WIDTH = 230;
const CARD_HEIGHT = 285;

export const FeaturedHotelsSection: React.FC<FeaturedHotelsSectionProps> = ({
  hotels,
  title = 'Khách sạn & Khu nghỉ dưỡng',
  isLoading = false,
  favoriteIds,
  onHotelPress,
  onBookmarkPress,
  onSeeAllPress,
}) => {
  const renderHotelItem = ({ item }: { item: Place }) => {
    const isBookmarked = favoriteIds?.has(item._id) ?? false;
    const imageUrl = item.images && item.images.length > 0 ? item.images[0] : null;
    const formattedPrice = item.pricePerNight
      ? `${item.pricePerNight.toLocaleString('vi-VN')} đ`
      : 'Liên hệ';

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.88}
        onPress={() => onHotelPress(item)}
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
              <AppIcon name="hotel" size={32} color={colors.text.muted} />
            </View>
          )}

          {/* Floating Star Badge on top-left */}
          <View style={styles.starBadge}>
            <AppIcon name="star" size={11} color="#F59E0B" />
            <AppText style={styles.starBadgeText}>
              {item.stars ? `${item.stars} ★` : '5 ★'}
            </AppText>
          </View>

          {/* Floating Bookmark Button on top-right */}
          {onBookmarkPress && (
            <TouchableOpacity
              style={styles.bookmarkButton}
              activeOpacity={0.7}
              onPress={() => onBookmarkPress(item)}
            >
              <AppIcon
                name={isBookmarked ? 'bookmarkSolid' : 'bookmark'}
                size={14}
                color={isBookmarked ? colors.primary.main : '#FFFFFF'}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Card Content Info */}
        <View style={styles.infoContainer}>
          {/* Hotel Name */}
          <AppText style={styles.hotelName} numberOfLines={1}>
            {item.name}
          </AppText>

          {/* Address */}
          <View style={styles.addressRow}>
            <AppIcon
              name="location"
              size={12}
              color={colors.text.muted}
              style={styles.locationIcon}
            />
            <AppText style={styles.addressText} numberOfLines={1}>
              {item.address || 'Việt Nam'}
            </AppText>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Price & Rating */}
          <View style={styles.priceRow}>
            <View style={styles.priceCol}>
              <AppText style={styles.priceValue}>{formattedPrice}</AppText>
              <AppText style={styles.priceUnit}>/ đêm</AppText>
            </View>

            {item.rating !== undefined && (
              <View style={styles.ratingBadge}>
                <AppIcon name="star" size={11} color="#F59E0B" />
                <AppText style={styles.ratingText}>
                  {item.rating.toFixed(1)}
                </AppText>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.headerRow}>
        <View style={styles.titleGroup}>
          <AppText style={styles.sectionTitle}>{title}</AppText>
          <AppText style={styles.sectionSubtitle}>
            Không gian nghỉ dưỡng đẳng cấp
          </AppText>
        </View>

        {onSeeAllPress && (
          <TouchableOpacity activeOpacity={0.7} onPress={onSeeAllPress}>
            <AppText style={styles.seeAllText}>Xem tất cả</AppText>
          </TouchableOpacity>
        )}
      </View>

      {/* Horizontal List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <View style={[styles.card, styles.skeletonCard]} />
          <View style={[styles.card, styles.skeletonCard]} />
        </View>
      ) : hotels.length === 0 ? (
        <View style={styles.emptyContainer}>
          <AppText style={styles.emptyText}>
            Chưa có khách sạn nào tại khu vực đã chọn.
          </AppText>
        </View>
      ) : (
        <FlatList
          data={hotels}
          keyExtractor={(item) => item._id}
          renderItem={renderHotelItem}
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
    marginBottom: 16,
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
  listContent: {
    paddingHorizontal: 20,
    gap: 16,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
    ...shadows.md,
  },
  imageContainer: {
    width: '100%',
    height: 155,
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
  starBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    gap: 4,
  },
  starBadgeText: {
    fontFamily: fontFamilies.sfProText.bold,
    fontSize: 11,
    color: '#FFFFFF',
  },
  bookmarkButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContainer: {
    flex: 1,
    padding: 14,
    justifyContent: 'space-between',
  },
  hotelName: {
    fontFamily: fontFamilies.sfProDisplay.bold,
    fontSize: 15,
    color: '#0F172A',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  locationIcon: {
    marginRight: 4,
  },
  addressText: {
    flex: 1,
    fontFamily: fontFamilies.sfProText.regular,
    fontSize: 12,
    color: '#64748B',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceCol: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  priceValue: {
    fontFamily: fontFamilies.sfProDisplay.bold,
    fontSize: 15,
    color: '#005BBF',
  },
  priceUnit: {
    fontFamily: fontFamilies.sfProText.regular,
    fontSize: 11,
    color: '#94A3B8',
    marginLeft: 3,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: 8,
    gap: 3,
  },
  ratingText: {
    fontFamily: fontFamilies.sfProText.bold,
    fontSize: 11,
    color: '#92400E',
  },
  loadingContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 16,
  },
  skeletonCard: {
    backgroundColor: '#E2E8F0',
  },
  emptyContainer: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: fontFamilies.sfProText.regular,
    fontSize: 13,
    color: '#94A3B8',
  },
});

