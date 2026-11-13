import React, { useState } from 'react';
import {
  View,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faXmark,
  faCompass,
  faHotel,
  faUtensils,
  faMugSaucer,
  faCalendarDays,
  faCoins,
  faLocationDot,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { AppText, AppButton, AppBadge, AppCard } from '@components/common';
import { colors, radius, spacing, shadows } from '@theme';
import { formatCurrency } from '@utils';
import type { AISuggestResponse, AISuggestPlace } from '@appTypes';
import { tripService } from '@services/trip.service';

interface PlanPreviewModalProps {
  visible: boolean;
  onClose: () => void;
  isLoading: boolean;
  planData: AISuggestResponse | null;
  onTripCreated?: () => void;
}

const getPlaceTypeIcon = (type: string): IconDefinition => {
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

const getPlaceTypeBadgeVariant = (
  type: string,
): 'primary' | 'teal' | 'sand' | 'outline' => {
  switch (type?.toLowerCase()) {
    case 'hotel':
      return 'primary';
    case 'restaurant':
      return 'sand';
    case 'cafe':
      return 'outline';
    case 'attraction':
    default:
      return 'teal';
  }
};

export const PlanPreviewModal: React.FC<PlanPreviewModalProps> = ({
  visible,
  onClose,
  isLoading,
  planData,
  onTripCreated,
}) => {
  const [isCreatingTrip, setIsCreatingTrip] = useState(false);

  const handleCreateTrip = async () => {
    if (!planData) return;

    try {
      setIsCreatingTrip(true);

      // Default start date is today, end date calculated from schedule length
      const startDate = new Date();
      const totalDays = Math.max(planData.schedule?.length || 1, 1);
      const endDate = new Date();
      endDate.setDate(startDate.getDate() + totalDays - 1);

      await tripService.createTrip({
        title: planData.suggestedTitle || 'Chuyến đi gợi ý từ AI',
        city: planData.city?._id || 'unknown',
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        budget: planData.estimatedTotalCost || 0,
        schedule: planData.schedule as any,
      });

      Alert.alert(
        'Tạo chuyến đi thành công!',
        'Lịch trình đã được lưu vào danh sách chuyến đi của bạn.',
        [
          {
            text: 'Tuyệt vời',
            onPress: () => {
              onClose();
              onTripCreated?.();
            },
          },
        ],
      );
    } catch (err: any) {
      Alert.alert('Không thể tạo chuyến đi', err?.message || 'Vui lòng thử lại sau.');
    } finally {
      setIsCreatingTrip(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.sheetHeader}>
            <View style={styles.headerTitleRow}>
              <View style={styles.headerIcon}>
                <FontAwesomeIcon
                  icon={faCompass}
                  size={18}
                  color={colors.primary.main}
                />
              </View>
              <AppText variant="h3" color="main" style={styles.headerTitle}>
                Xem trước lịch trình AI
              </AppText>
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onClose}
              style={styles.closeBtn}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <FontAwesomeIcon icon={faXmark} size={18} color={colors.text.sub} />
            </TouchableOpacity>
          </View>

          {/* Body */}
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary.main} />
              <AppText variant="body" color="main" style={styles.loadingTitle}>
                Đang bóc tách lịch trình...
              </AppText>
              <AppText variant="caption" color="sub" style={styles.loadingSubtitle}>
                AI đang nhận diện địa điểm và dự tính chi phí từ đoạn chat.
              </AppText>
            </View>
          ) : planData ? (
            <ScrollView
              style={styles.scrollArea}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Trip Overview Card */}
              <AppCard style={styles.summaryCard}>
                <AppText variant="h2" color="main" style={styles.tripTitle}>
                  {planData.suggestedTitle}
                </AppText>

                <View style={styles.metaRow}>
                  {planData.city?.name && (
                    <View style={styles.metaItem}>
                      <FontAwesomeIcon
                        icon={faLocationDot}
                        size={14}
                        color={colors.primary.main}
                      />
                      <AppText variant="bodyBold" color="primary" style={styles.metaText}>
                        {planData.city.name}
                      </AppText>
                    </View>
                  )}

                  <View style={styles.metaItem}>
                    <FontAwesomeIcon
                      icon={faCalendarDays}
                      size={14}
                      color={colors.text.sub}
                    />
                    <AppText variant="captionMedium" color="sub" style={styles.metaText}>
                      {planData.schedule?.length || 1} Ngày
                    </AppText>
                  </View>

                  <View style={styles.metaItem}>
                    <FontAwesomeIcon
                      icon={faCoins}
                      size={14}
                      color={colors.sand.main}
                    />
                    <AppText variant="captionMedium" color="sand" style={styles.metaText}>
                      {formatCurrency(planData.estimatedTotalCost || 0)}
                    </AppText>
                  </View>
                </View>
              </AppCard>

              {/* Day-by-Day Schedule */}
              <AppText variant="h3" color="main" style={styles.scheduleHeading}>
                Chi tiết các ngày
              </AppText>

              {planData.schedule?.map((dayItem) => (
                <View key={dayItem.day} style={styles.dayBlock}>
                  <View style={styles.dayHeader}>
                    <AppBadge
                      label={`Ngày ${dayItem.day}`}
                      variant="primary"
                      size="sm"
                    />
                    <AppText variant="caption" color="sub" style={styles.dayPlaceCount}>
                      {dayItem.places?.length || 0} địa điểm
                    </AppText>
                  </View>

                  {dayItem.places?.map((place: AISuggestPlace, pIndex: number) => {
                    const icon = getPlaceTypeIcon(place.placeType);
                    const badgeVariant = getPlaceTypeBadgeVariant(place.placeType);

                    return (
                      <View key={pIndex} style={styles.placeItem}>
                        <View style={styles.placeIconCol}>
                          <View style={styles.placeIconCircle}>
                            <FontAwesomeIcon
                              icon={icon}
                              size={14}
                              color={colors.primary.main}
                            />
                          </View>
                          {pIndex < (dayItem.places?.length || 0) - 1 && (
                            <View style={styles.placeTimelineLine} />
                          )}
                        </View>

                        <View style={styles.placeContentCol}>
                          <View style={styles.placeTypeRow}>
                            <AppBadge
                              label={place.placeType || 'Điểm đến'}
                              variant={badgeVariant}
                              size="sm"
                            />
                            {place.timeSlot && (
                              <AppText variant="tiny" color="muted" style={styles.timeSlot}>
                                {place.timeSlot}
                              </AppText>
                            )}
                          </View>

                          <AppText variant="bodyBold" color="main" style={styles.placeName}>
                            {place.name || `Địa điểm #${place.order + 1}`}
                          </AppText>

                          {place.note && (
                            <AppText variant="caption" color="sub" style={styles.placeNote}>
                              {place.note}
                            </AppText>
                          )}
                        </View>
                      </View>
                    );
                  })}
                </View>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.emptyContainer}>
              <AppText variant="body" color="sub">
                Không thể tải thông tin lịch trình.
              </AppText>
            </View>
          )}

          {/* Footer CTA */}
          {planData && !isLoading && (
            <View style={styles.sheetFooter}>
              <AppButton
                title="Xác nhận tạo chuyến đi"
                variant="primary"
                size="lg"
                onPress={handleCreateTrip}
                isLoading={isCreatingTrip}
              />
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay.backdrop,
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: colors.background.app,
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    maxHeight: '88%',
    minHeight: '40%',
    ...shadows.lg,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.background.surface,
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginRight: spacing.xs + 2,
  },
  headerTitle: {
    fontWeight: '700',
  },
  closeBtn: {
    padding: spacing.xs,
  },
  loadingContainer: {
    padding: spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingTitle: {
    fontWeight: '700',
    marginTop: spacing.md,
  },
  loadingSubtitle: {
    marginTop: 4,
    textAlign: 'center',
  },
  emptyContainer: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
  },
  summaryCard: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  tripTitle: {
    marginBottom: spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    marginLeft: 6,
  },
  scheduleHeading: {
    marginBottom: spacing.sm,
  },
  dayBlock: {
    backgroundColor: colors.background.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm + 2,
  },
  dayPlaceCount: {
    marginLeft: spacing.xs,
  },
  placeItem: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  placeIconCol: {
    alignItems: 'center',
    width: 32,
    marginRight: spacing.xs + 2,
  },
  placeIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary.soft,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.primary.border,
  },
  placeTimelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: colors.border.subtle,
    marginVertical: 2,
  },
  placeContentCol: {
    flex: 1,
    paddingBottom: spacing.sm,
  },
  placeTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  timeSlot: {
    marginLeft: spacing.xs,
  },
  placeName: {
    fontSize: 14,
  },
  placeNote: {
    marginTop: 2,
    lineHeight: 18,
  },
  sheetFooter: {
    padding: spacing.md,
    backgroundColor: colors.background.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border.subtle,
  },
});

