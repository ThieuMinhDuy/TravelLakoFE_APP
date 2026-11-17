import React from 'react';
import { View, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faArrowLeft,
  faTrashCan,
  faCity,
  faCalendarDays,
  faWallet,
  faWandMagicSparkles,
} from '@fortawesome/free-solid-svg-icons';
import { AppText } from '@components/common';
import { colors, spacing, radius } from '@theme';
import { formatDate, formatCurrency } from '@utils';
import type { Trip, TripCity } from '@appTypes';

export interface TripDetailHeaderProps {
  trip: Trip;
  onBack: () => void;
  onDelete: () => void;
  onOpenAIOptimize?: () => void;
  isDeleting?: boolean;
}

export const TripDetailHeader: React.FC<TripDetailHeaderProps> = ({
  trip,
  onBack,
  onDelete,
  onOpenAIOptimize,
  isDeleting = false,
}) => {
  const cityInfo =
    trip.city && typeof trip.city === 'object'
      ? (trip.city as TripCity)
      : null;

  const cityName = cityInfo?.name || 'Điểm đến du lịch';

  const confirmDelete = () => {
    Alert.alert(
      'Xóa chuyến đi',
      `Bạn có chắc chắn muốn xóa chuyến đi "${trip.title}" không? Hành động này không thể hoàn tác.`,
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Xóa vĩnh viễn', style: 'destructive', onPress: onDelete },
      ],
    );
  };

  return (
    <View style={styles.container}>
      {/* Top navigation row */}
      <View style={styles.topRow}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onBack}
          style={styles.iconBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <FontAwesomeIcon icon={faArrowLeft} size={18} color={colors.text.main} />
        </TouchableOpacity>

        <AppText variant="h3" color="main" style={styles.screenTitle}>
          Chi Tiết Lịch Trình
        </AppText>

        <View style={styles.rightActions}>
          {/* Nút Tối ưu lộ trình AI */}
          {onOpenAIOptimize && (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onOpenAIOptimize}
              style={[styles.iconBtn, styles.aiBtn]}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <FontAwesomeIcon
                icon={faWandMagicSparkles}
                size={15}
                color={colors.primary.main}
              />
            </TouchableOpacity>
          )}

          {/* Nút Xóa chuyến đi */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={confirmDelete}
            disabled={isDeleting}
            style={[styles.iconBtn, styles.deleteBtn]}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <FontAwesomeIcon icon={faTrashCan} size={15} color={colors.status.error} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Trip main info card banner */}
      <View style={styles.tripCard}>
        <AppText variant="h2" color="main" numberOfLines={2} style={styles.tripTitle}>
          {trip.title}
        </AppText>

        <View style={styles.metaWrap}>
          {/* Thành phố */}
          <View style={styles.metaItem}>
            <FontAwesomeIcon icon={faCity} size={13} color={colors.primary.main} style={styles.metaIcon} />
            <AppText variant="captionMedium" color="primary">
              {cityName}
            </AppText>
          </View>

          {/* Thời gian */}
          <View style={styles.metaItem}>
            <FontAwesomeIcon
              icon={faCalendarDays}
              size={13}
              color={colors.text.muted}
              style={styles.metaIcon}
            />
            <AppText variant="caption" color="sub">
              {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
            </AppText>
          </View>

          {/* Ngân sách */}
          <View style={styles.metaItem}>
            <FontAwesomeIcon
              icon={faWallet}
              size={13}
              color={colors.text.muted}
              style={styles.metaIcon}
            />
            <AppText variant="captionMedium" color="main">
              {formatCurrency(trip.budget)}
            </AppText>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.surface,
    paddingTop: spacing.xs,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.subtle,
  },
  aiBtn: {
    backgroundColor: colors.primary.soft,
    borderWidth: 1,
    borderColor: colors.primary.border,
  },
  deleteBtn: {
    backgroundColor: colors.status.errorBg,
  },
  screenTitle: {
    fontSize: 16,
  },
  tripCard: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
  },
  tripTitle: {
    marginBottom: spacing.xs,
  },
  metaWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginTop: spacing.xxs,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaIcon: {
    marginRight: spacing.xs,
  },
});
