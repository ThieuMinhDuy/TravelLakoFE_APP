import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faPlus,
  faRoute,
  faBookOpen,
} from '@fortawesome/free-solid-svg-icons';
import { ScreenWrapper, AppText, EmptyState } from '@components/common';
import { colors, spacing, radius, shadows } from '@theme';
import { QUERY_KEYS } from '@constants/queryKeys';
import { tripService } from '@services';
import type { Trip, TripCity } from '@appTypes';
import {
  TripDetailHeader,
  DaySelector,
  PlaceTimelineItem,
  AddPlaceModal,
  AIOptimizeModal,
  TripDiarySection,
} from './components';

export type DetailViewMode = 'schedule' | 'diary';

export const TripDetailScreen: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const queryClient = useQueryClient();

  const { tripId } = route.params || {};

  const [viewMode, setViewMode] = useState<DetailViewMode>('schedule');
  const [activeDay, setActiveDay] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isOptimizeModalOpen, setIsOptimizeModalOpen] = useState(false);
  const [isDeletingTrip, setIsDeletingTrip] = useState(false);

  // Fetch dữ liệu chuyến đi
  const {
    data: trip,
    isLoading,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: [QUERY_KEYS.TRIP_DETAIL(tripId)],
    queryFn: () => tripService.getTripDetail(tripId),
    enabled: !!tripId,
  });

  // Tự động gán activeDay khi tải được schedule
  useEffect(() => {
    if (trip?.schedule && trip.schedule.length > 0) {
      const dayExists = trip.schedule.some((s) => s.day === activeDay);
      if (!dayExists) {
        setActiveDay(trip.schedule[0].day);
      }
    }
  }, [trip]);

  const schedule = trip?.schedule || [];
  const currentDaySchedule = schedule.find((s) => s.day === activeDay) || schedule[0];
  const places = currentDaySchedule?.places || [];
  const totalDays = schedule.length || 1;

  const cityId =
    trip?.city && typeof trip.city === 'object'
      ? (trip.city as TripCity)._id
      : (trip?.city as string);

  // Xóa chuyến đi
  const handleDeleteTrip = async () => {
    try {
      setIsDeletingTrip(true);
      await tripService.deleteTrip(tripId);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER_TRIPS] });
      Alert.alert('Thành công', 'Đã xóa chuyến đi.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err: any) {
      Alert.alert('Lỗi', err?.message || 'Không thể xóa chuyến đi.');
    } finally {
      setIsDeletingTrip(false);
    }
  };

  // Sắp xếp lại thứ tự (Di chuyển Lên / Xuống)
  const handleReorder = async (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex || toIndex < 0 || toIndex >= places.length) return;

    const newPlaces = [...places];
    const [movedPlace] = newPlaces.splice(fromIndex, 1);
    newPlaces.splice(toIndex, 0, movedPlace);

    const placesOrder = newPlaces.map((p) => p._id);

    try {
      // Optimistic update query cache
      queryClient.setQueryData([QUERY_KEYS.TRIP_DETAIL(tripId)], (oldTrip: Trip | undefined) => {
        if (!oldTrip) return oldTrip;
        const newSchedule = oldTrip.schedule.map((dayItem) => {
          if (dayItem.day === activeDay) {
            return { ...dayItem, places: newPlaces };
          }
          return dayItem;
        });
        return { ...oldTrip, schedule: newSchedule };
      });

      await tripService.reorderSchedule(tripId, {
        day: activeDay,
        placesOrder,
      });
      refetch();
    } catch (err: any) {
      Alert.alert('Lỗi', err?.message || 'Không thể sắp xếp lại thứ tự.');
      refetch();
    }
  };

  // Xóa địa điểm khỏi ngày
  const handleDeletePlace = async (subId: string) => {
    try {
      await tripService.deletePlace(tripId, subId);
      refetch();
    } catch (err: any) {
      Alert.alert('Lỗi', err?.message || 'Không thể xóa địa điểm này.');
    }
  };

  if (isLoading && !isRefetching) {
    return (
      <ScreenWrapper style={styles.loaderCenter}>
        <ActivityIndicator size="large" color={colors.primary.main} />
        <AppText variant="body" color="muted" style={styles.loaderText}>
          Đang tải lịch trình...
        </AppText>
      </ScreenWrapper>
    );
  }

  if (!trip) {
    return (
      <ScreenWrapper style={styles.loaderCenter}>
        <EmptyState
          title="Không tìm thấy chuyến đi"
          description="Chuyến đi này có thể đã bị xóa hoặc không tồn tại."
          actionTitle="Quay lại"
          onAction={() => navigation.goBack()}
        />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      header={
        <View>
          <TripDetailHeader
            trip={trip}
            onBack={() => navigation.goBack()}
            onDelete={handleDeleteTrip}
            onOpenAIOptimize={() => setIsOptimizeModalOpen(true)}
            isDeleting={isDeletingTrip}
          />

          {/* Segmented Tab Switcher: Lịch trình vs Nhật ký */}
          <View style={styles.viewModeSwitcher}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setViewMode('schedule')}
              style={[
                styles.switchBtn,
                viewMode === 'schedule' && styles.switchBtnActive,
              ]}
            >
              <FontAwesomeIcon
                icon={faRoute}
                size={14}
                color={viewMode === 'schedule' ? colors.primary.main : colors.text.muted}
                style={styles.switchIcon}
              />
              <AppText
                variant={viewMode === 'schedule' ? 'captionMedium' : 'caption'}
                color={viewMode === 'schedule' ? 'primary' : 'muted'}
              >
                Lịch Trình Chi Tiết
              </AppText>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setViewMode('diary')}
              style={[
                styles.switchBtn,
                viewMode === 'diary' && styles.switchBtnActive,
              ]}
            >
              <FontAwesomeIcon
                icon={faBookOpen}
                size={14}
                color={viewMode === 'diary' ? colors.primary.main : colors.text.muted}
                style={styles.switchIcon}
              />
              <AppText
                variant={viewMode === 'diary' ? 'captionMedium' : 'caption'}
                color={viewMode === 'diary' ? 'primary' : 'muted'}
              >
                Nhật Ký & Kỷ Niệm
              </AppText>
            </TouchableOpacity>
          </View>

          {/* Day Selector (chỉ hiện khi xem tab Lịch trình) */}
          {viewMode === 'schedule' && schedule.length > 0 && (
            <DaySelector
              schedule={schedule}
              activeDay={activeDay}
              onSelectDay={setActiveDay}
            />
          )}
        </View>
      }
      scrollable={false}
      style={styles.wrapper}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => {
              refetch();
            }}
            tintColor={colors.primary.main}
            colors={[colors.primary.main]}
          />
        }
      >
        {viewMode === 'schedule' ? (
          /* TAB 1: LỊCH TRÌNH THEO NGÀY */
          places.length === 0 ? (
            <EmptyState
              title={`Ngày ${activeDay} chưa có địa điểm`}
              description="Hãy thêm các điểm tham quan, khách sạn hoặc quán ăn để hoàn thiện lịch trình khám phá của bạn!"
              actionTitle="Thêm địa điểm ngay"
              onAction={() => setIsAddModalOpen(true)}
              style={styles.emptyContainer}
            />
          ) : (
            <View style={styles.timelineList}>
              {places.map((place, index) => (
                <PlaceTimelineItem
                  key={place._id || index}
                  tripId={tripId}
                  place={place}
                  index={index}
                  totalPlaces={places.length}
                  onMoveUp={() => handleReorder(index, index - 1)}
                  onMoveDown={() => handleReorder(index, index + 1)}
                  onDelete={() => handleDeletePlace(place._id)}
                  onCheckInSuccess={() => refetch()}
                />
              ))}
            </View>
          )
        ) : (
          /* TAB 2: NHẬT KÝ & ẢNH KỶ NIỆM */
          <TripDiarySection
            tripId={tripId}
            diary={trip.diary}
            onDiaryUpdated={() => refetch()}
          />
        )}
      </ScrollView>

      {/* FAB Thêm địa điểm (chỉ hiện khi ở tab Lịch trình) */}
      {viewMode === 'schedule' && (
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => setIsAddModalOpen(true)}
          style={styles.fab}
        >
          <FontAwesomeIcon icon={faPlus} size={20} color={colors.text.inverse} />
        </TouchableOpacity>
      )}

      {/* Modal Thêm Địa Điểm */}
      <AddPlaceModal
        visible={isAddModalOpen}
        tripId={tripId}
        cityId={cityId}
        activeDay={activeDay}
        totalDays={totalDays}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => refetch()}
      />

      {/* Modal Tối Ưu Lộ Trình Bằng AI */}
      <AIOptimizeModal
        visible={isOptimizeModalOpen}
        tripId={tripId}
        onClose={() => setIsOptimizeModalOpen(false)}
        onSuccess={() => refetch()}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background.app,
  },
  loaderCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderText: {
    marginTop: spacing.sm,
  },
  viewModeSwitcher: {
    flexDirection: 'row',
    backgroundColor: colors.background.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
    gap: spacing.sm,
  },
  switchBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.pill,
    backgroundColor: colors.background.subtle,
  },
  switchBtnActive: {
    backgroundColor: colors.primary.soft,
    borderWidth: 1,
    borderColor: colors.primary.border,
  },
  switchIcon: {
    marginRight: spacing.xs,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: 90,
    flexGrow: 1,
  },
  timelineList: {
    paddingTop: spacing.xs,
  },
  emptyContainer: {
    marginTop: spacing.xl,
  },
  fab: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
    zIndex: 99,
  },
});
