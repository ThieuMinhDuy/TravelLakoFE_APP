import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faCalendarDays,
  faWallet,
  faLocationDot,
  faCheckCircle,
  faCity,
} from '@fortawesome/free-solid-svg-icons';
import { AppCard, AppText, AppBadge } from '@components/common';
import { colors, spacing, radius } from '@theme';
import { formatDate, formatCurrency } from '@utils';
import type { Trip, TripCity } from '@appTypes';
import type { TripStatusType } from './TripStatusTabs';

export interface TripCardProps {
  trip: Trip;
  status: TripStatusType;
  onPress: () => void;
}

export const TripCard: React.FC<TripCardProps> = ({ trip, status, onPress }) => {
  // Lấy thông tin thành phố nếu được populate
  const cityInfo =
    trip.city && typeof trip.city === 'object'
      ? (trip.city as TripCity)
      : null;

  const cityName = cityInfo?.name || 'Điểm đến du lịch';
  const cityImage = cityInfo?.image;

  // Tính toán số địa điểm đã tham quan
  let totalPlaces = 0;
  let visitedPlaces = 0;
  trip.schedule?.forEach((day) => {
    day.places?.forEach((place) => {
      totalPlaces++;
      if (place.visited) {
        visitedPlaces++;
      }
    });
  });

  const getStatusBadgeConfig = () => {
    switch (status) {
      case 'ongoing':
        return { label: 'Đang diễn ra', variant: 'primary' as const };
      case 'past':
        return { label: 'Đã hoàn thành', variant: 'slate' as const };
      case 'upcoming':
      default:
        return { label: 'Sắp tới', variant: 'teal' as const };
    }
  };

  const badgeConfig = getStatusBadgeConfig();
  const totalDays = trip.schedule?.length || 0;

  return (
    <AppCard onPress={onPress} padding={0} style={styles.card}>
      {/* Ảnh bìa thành phố / Header */}
      <View style={styles.imageContainer}>
        {cityImage ? (
          <Image source={{ uri: cityImage }} style={styles.coverImage} resizeMode="cover" />
        ) : (
          <View style={styles.placeholderCover}>
            <FontAwesomeIcon icon={faCity} size={36} color={colors.primary.main} />
          </View>
        )}
        <View style={styles.badgeOverlay}>
          <AppBadge label={badgeConfig.label} variant={badgeConfig.variant} size="sm" />
        </View>
      </View>

      {/* Nội dung chi tiết */}
      <View style={styles.content}>
        <AppText variant="h3" color="main" numberOfLines={1} style={styles.title}>
          {trip.title}
        </AppText>

        <View style={styles.metaRow}>
          <FontAwesomeIcon icon={faCity} size={12} color={colors.text.muted} style={styles.metaIcon} />
          <AppText variant="captionMedium" color="primary">
            {cityName}
          </AppText>
        </View>

        <View style={styles.divider} />

        {/* Thông số chuyến đi */}
        <View style={styles.detailsGrid}>
          {/* Ngày khởi hành */}
          <View style={styles.detailItem}>
            <FontAwesomeIcon
              icon={faCalendarDays}
              size={12}
              color={colors.text.muted}
              style={styles.detailIcon}
            />
            <AppText variant="caption" color="sub">
              {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
            </AppText>
          </View>

          {/* Ngân sách */}
          <View style={styles.detailItem}>
            <FontAwesomeIcon
              icon={faWallet}
              size={12}
              color={colors.text.muted}
              style={styles.detailIcon}
            />
            <AppText variant="captionMedium" color="main">
              {formatCurrency(trip.budget)}
            </AppText>
          </View>

          {/* Số ngày & Địa điểm */}
          <View style={styles.detailItem}>
            <FontAwesomeIcon
              icon={faLocationDot}
              size={12}
              color={colors.text.muted}
              style={styles.detailIcon}
            />
            <AppText variant="caption" color="sub">
              {totalDays > 0 ? `${totalDays} ngày` : 'Chưa xếp ngày'}
              {totalPlaces > 0 && ` (${totalPlaces} điểm)`}
            </AppText>
          </View>

          {/* Tiến độ Check-in (nếu có điểm) */}
          {totalPlaces > 0 && (
            <View style={styles.detailItem}>
              <FontAwesomeIcon
                icon={faCheckCircle}
                size={12}
                color={visitedPlaces > 0 ? colors.status.success : colors.text.muted}
                style={styles.detailIcon}
              />
              <AppText
                variant="caption"
                color={visitedPlaces > 0 ? 'main' : 'muted'}
              >
                Đã check-in: {visitedPlaces}/{totalPlaces}
              </AppText>
            </View>
          )}
        </View>
      </View>
    </AppCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  imageContainer: {
    height: 120,
    width: '100%',
    position: 'relative',
    backgroundColor: colors.background.subtle,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  placeholderCover: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary.soft,
  },
  badgeOverlay: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
  },
  content: {
    padding: spacing.md,
  },
  title: {
    marginBottom: spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  metaIcon: {
    marginRight: spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border.subtle,
    marginVertical: spacing.sm,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: '45%',
  },
  detailIcon: {
    marginRight: spacing.xs,
  },
});
