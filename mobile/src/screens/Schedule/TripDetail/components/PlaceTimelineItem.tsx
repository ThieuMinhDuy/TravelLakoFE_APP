import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  PermissionsAndroid,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
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
  faLocationCrosshairs,
} from '@fortawesome/free-solid-svg-icons';
import { AppText, AppBadge, AppCard } from '@components/common';
import { colors, spacing, radius } from '@theme';
import { formatDate, calculateDistanceInMeters, isWithinCheckInRadius } from '@utils';
import { tripService } from '@services';
import type { PlaceInSchedule, PlacePopulated } from '@appTypes';

export interface PlaceTimelineItemProps {
  tripId: string;
  place: PlaceInSchedule;
  index: number;
  totalPlaces: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
  onCheckInSuccess?: () => void;
}

export const PlaceTimelineItem: React.FC<PlaceTimelineItemProps> = ({
  tripId,
  place,
  index,
  totalPlaces,
  onMoveUp,
  onMoveDown,
  onDelete,
  onCheckInSuccess,
}) => {
  const [isCheckingIn, setIsCheckingIn] = useState(false);

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

  // Xin quyền GPS trên Android
  const requestLocationPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Quyền truy cập GPS',
            message: 'Ứng dụng cần quyền vị trí để kiểm tra khoảng cách check-in (< 200m).',
            buttonNeutral: 'Hỏi lại sau',
            buttonNegative: 'Từ chối',
            buttonPositive: 'Đồng ý',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn('Lỗi xin quyền vị trí:', err);
        return false;
      }
    }
    return true;
  };

  // Thực hiện gọi API Check-in
  const performCheckIn = async (distance?: number) => {
    try {
      await tripService.checkInPlace(tripId, place._id, true);
      Alert.alert(
        'Check-in Thành Công! 🎉',
        `Bạn đã check-in thành công tại "${placeName}"${
          distance !== undefined ? ` (khoảng cách: ${distance}m)` : ''
        }.`,
      );
      onCheckInSuccess?.();
    } catch (err: any) {
      Alert.alert('Lỗi', err?.message || 'Không thể check-in lúc này. Vui lòng thử lại.');
    } finally {
      setIsCheckingIn(false);
    }
  };

  // Xử lý GPS Check-in với bán kính 200m
  const handleGPSCheckIn = async () => {
    if (place.visited) {
      Alert.alert('Thông báo', `Bạn đã check-in tại "${placeName}" rồi.`);
      return;
    }

    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      Alert.alert('Cảnh báo', 'Bạn cần cấp quyền truy cập vị trí GPS để có thể check-in.');
      return;
    }

    setIsCheckingIn(true);

    Geolocation.getCurrentPosition(
      async (position) => {
        const userCoords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        const placeCoords = populated?.coordinates;

        // Nếu địa điểm chưa có tọa độ trong DB
        if (
          !placeCoords ||
          typeof placeCoords.lat !== 'number' ||
          typeof placeCoords.lng !== 'number'
        ) {
          setIsCheckingIn(false);
          Alert.alert(
            'Xác nhận Check-in',
            `Địa điểm "${placeName}" chưa có dữ liệu tọa độ GPS trên hệ thống. Bạn có muốn xác nhận đã đến địa điểm này không?`,
            [
              { text: 'Hủy', style: 'cancel' },
              { text: 'Xác nhận đã đến', onPress: () => performCheckIn() },
            ],
          );
          return;
        }

        // Tính khoảng cách Haversine (đơn vị: mét)
        const distance = calculateDistanceInMeters(userCoords, placeCoords);
        const withinRadius = isWithinCheckInRadius(userCoords, placeCoords, 200);

        if (withinRadius) {
          await performCheckIn(distance);
        } else {
          setIsCheckingIn(false);
          Alert.alert(
            'Chưa Đến Địa Điểm',
            `Khoảng cách hiện tại của bạn đến "${placeName}" là ${distance}m.\n\nTheo quy định, bạn cần ở trong bán kính 200m để có thể check-in thực tế.`,
          );
        }
      },
      (error) => {
        setIsCheckingIn(false);
        Alert.alert(
          'Lỗi định vị',
          'Không thể lấy tọa độ vị trí hiện tại của thiết bị: ' + error.message,
        );
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
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

          {/* Nút Check-in GPS chân thẻ */}
          <View style={styles.cardFooter}>
            {place.visited ? (
              <View style={styles.checkedInBox}>
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  size={13}
                  color={colors.status.success}
                  style={styles.footerIcon}
                />
                <AppText variant="captionMedium" color="main" style={styles.checkedInText}>
                  Đã Check-in thành công
                </AppText>
              </View>
            ) : (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleGPSCheckIn}
                disabled={isCheckingIn}
                style={styles.checkInBtn}
              >
                {isCheckingIn ? (
                  <ActivityIndicator size="small" color={colors.primary.main} />
                ) : (
                  <>
                    <FontAwesomeIcon
                      icon={faLocationCrosshairs}
                      size={13}
                      color={colors.primary.main}
                      style={styles.footerIcon}
                    />
                    <AppText variant="captionMedium" color="primary">
                      Check-in GPS (&lt; 200m)
                    </AppText>
                  </>
                )}
              </TouchableOpacity>
            )}
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
  cardFooter: {
    marginTop: spacing.sm,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.border.subtle,
  },
  checkInBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs,
    borderRadius: radius.md,
    backgroundColor: colors.primary.soft,
    borderWidth: 1,
    borderColor: colors.primary.border,
  },
  checkedInBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs,
    borderRadius: radius.md,
    backgroundColor: colors.nature.light,
  },
  checkedInText: {
    color: colors.status.success,
  },
  footerIcon: {
    marginRight: spacing.xs,
  },
});
