import React from 'react';
import { View, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faHotel,
  faUtensils,
  faMugSaucer,
  faCompass,
  faArrowUp,
  faArrowDown,
  faTrashCan,
  faLocationDot,
  faCheckCircle,
  faNoteSticky,
  faClock,
} from '@fortawesome/free-solid-svg-icons';
import { AppText, AppBadge, AppCard } from '@components/common';
import { colors, spacing, radius } from '@theme';
import { formatDate } from '@utils';
import type { PlaceInSchedule, PlacePopulated } from '@appTypes';

export interface PlaceTimelineItemProps {
  place: PlaceInSchedule;
  index: number;
  totalPlaces: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
}

export const PlaceTimelineItem: React.FC<PlaceTimelineItemProps> = ({
  place,
  index,
  totalPlaces,
  onMoveUp,
  onMoveDown,
  onDelete,
}) => {
  // Lấy thông tin place khi được populate
  const populated =
    place.placeId && typeof place.placeId === 'object'
      ? (place.placeId as PlacePopulated)
      : null;

  const placeName = populated?.name || `Địa điểm #${index + 1}`;
  const address = populated?.address;
  const image = populated?.image || (populated?.images && populated.images[0]);

  const getPlaceIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'hotel':
        return faHotel;
      case 'restaurant':
        return faUtensils;
      case 'cafe':
        return faMugSaucer;
      case 'attraction':
      default:
        return faCompass;
    }
  };

  const getBadgeVariant = (type: string): 'primary' | 'teal' | 'sand' | 'slate' => {
    switch (type?.toLowerCase()) {
      case 'hotel':
        return 'primary';
      case 'restaurant':
        return 'sand';
      case 'cafe':
        return 'slate';
      case 'attraction':
      default:
        return 'teal';
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      'Xóa địa điểm',
      `Bạn có chắc chắn muốn xóa "${placeName}" khỏi lịch trình ngày này?`,
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Xóa', style: 'destructive', onPress: onDelete },
      ],
    );
  };

  const isFirst = index === 0;
  const isLast = index === totalPlaces - 1;

  return (
    <View style={styles.container}>
      {/* Cột trái: Icon vòng tròn và đường line timeline */}
      <View style={styles.timelineCol}>
        <View
          style={[
            styles.iconCircle,
            place.visited && styles.iconCircleVisited,
          ]}
        >
          <FontAwesomeIcon
            icon={getPlaceIcon(place.placeType)}
            size={14}
            color={place.visited ? colors.status.success : colors.primary.main}
          />
        </View>
        {!isLast && <View style={styles.timelineLine} />}
      </View>

      {/* Cột phải: Card chi tiết địa điểm */}
      <AppCard padding={0} style={styles.card}>
        <View style={styles.cardContent}>
          {/* Header hàng trên: Badge loại & Thứ tự & Check-in */}
          <View style={styles.cardHeader}>
            <View style={styles.headerBadges}>
              <AppBadge
                label={place.placeType || 'Điểm đến'}
                variant={getBadgeVariant(place.placeType)}
                size="sm"
              />
              <View style={styles.orderBadge}>
                <AppText variant="tiny" color="muted">
                  #{index + 1}
                </AppText>
              </View>

              {place.visited && (
                <View style={styles.visitedBadge}>
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    size={11}
                    color={colors.status.success}
                    style={styles.visitedIcon}
                  />
                  <AppText variant="tiny" color="main" style={styles.visitedText}>
                    Đã đến
                  </AppText>
                </View>
              )}
            </View>

            {/* Các nút điều khiển thứ tự và xóa */}
            <View style={styles.actionRow}>
              {/* Nút Lên */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={onMoveUp}
                disabled={isFirst}
                style={[styles.miniBtn, isFirst && styles.miniBtnDisabled]}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <FontAwesomeIcon
                  icon={faArrowUp}
                  size={11}
                  color={isFirst ? colors.border.subtle : colors.text.main}
                />
              </TouchableOpacity>

              {/* Nút Xuống */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={onMoveDown}
                disabled={isLast}
                style={[styles.miniBtn, isLast && styles.miniBtnDisabled]}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <FontAwesomeIcon
                  icon={faArrowDown}
                  size={11}
                  color={isLast ? colors.border.subtle : colors.text.main}
                />
              </TouchableOpacity>

              {/* Nút Xóa */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={confirmDelete}
                style={[styles.miniBtn, styles.deleteBtn]}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <FontAwesomeIcon icon={faTrashCan} size={11} color={colors.status.error} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Ảnh và thông tin chính */}
          <View style={styles.bodyRow}>
            {image && (
              <Image source={{ uri: image }} style={styles.placeThumb} resizeMode="cover" />
            )}

            <View style={styles.infoCol}>
              <AppText variant="bodyBold" color="main" numberOfLines={2}>
                {placeName}
              </AppText>

              {address && (
                <View style={styles.addressRow}>
                  <FontAwesomeIcon
                    icon={faLocationDot}
                    size={11}
                    color={colors.text.muted}
                    style={styles.infoIcon}
                  />
                  <AppText variant="caption" color="sub" numberOfLines={1}>
                    {address}
                  </AppText>
                </View>
              )}

              {place.note ? (
                <View style={styles.noteRow}>
                  <FontAwesomeIcon
                    icon={faNoteSticky}
                    size={11}
                    color={colors.sand.main}
                    style={styles.infoIcon}
                  />
                  <AppText variant="caption" color="sub" style={styles.noteText}>
                    {place.note}
                  </AppText>
                </View>
              ) : null}

              {place.visited && place.checkInTime && (
                <View style={styles.checkInTimeRow}>
                  <FontAwesomeIcon
                    icon={faClock}
                    size={10}
                    color={colors.status.success}
                    style={styles.infoIcon}
                  />
                  <AppText variant="tiny" color="muted">
                    Check-in lúc {formatDate(place.checkInTime)}
                  </AppText>
                </View>
              )}
            </View>
          </View>
        </View>
      </AppCard>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  timelineCol: {
    width: 32,
    alignItems: 'center',
    marginRight: spacing.xs,
  },
  iconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primary.soft,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.primary.border,
    zIndex: 2,
  },
  iconCircleVisited: {
    backgroundColor: colors.nature.light,
    borderColor: colors.status.success,
  },
  timelineLine: {
    flex: 1,
    width: 2,
    backgroundColor: colors.border.subtle,
    marginVertical: 2,
  },
  card: {
    flex: 1,
    marginBottom: spacing.sm,
  },
  cardContent: {
    padding: spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  headerBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  orderBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.xs,
    backgroundColor: colors.background.subtle,
  },
  visitedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.pill,
    backgroundColor: colors.nature.light,
  },
  visitedIcon: {
    marginRight: 3,
  },
  visitedText: {
    color: colors.status.success,
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  miniBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.background.subtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniBtnDisabled: {
    opacity: 0.3,
  },
  deleteBtn: {
    backgroundColor: colors.status.errorBg,
  },
  bodyRow: {
    flexDirection: 'row',
    marginTop: spacing.xxs,
  },
  placeThumb: {
    width: 60,
    height: 60,
    borderRadius: radius.md,
    marginRight: spacing.sm,
  },
  infoCol: {
    flex: 1,
    justifyContent: 'center',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    backgroundColor: colors.background.subtle,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: radius.xs,
  },
  noteText: {
    fontStyle: 'italic',
  },
  checkInTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  infoIcon: {
    marginRight: 4,
  },
});
