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
import { faPlus } from '@fortawesome/free-solid-svg-icons';
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
} from './components';

export const TripDetailScreen: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const queryClient = useQueryClient();

  const { tripId } = route.params || {};

  const [activeDay, setActiveDay] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
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
            isDeleting={isDeletingTrip}
          />
          {schedule.length > 0 && (
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
        {places.length === 0 ? (
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
                place={place}
                index={index}
                totalPlaces={places.length}
                onMoveUp={() => handleReorder(index, index - 1)}
                onMoveDown={() => handleReorder(index, index + 1)}
                onDelete={() => handleDeletePlace(place._id)}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* FAB Thêm địa điểm */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => setIsAddModalOpen(true)}
        style={styles.fab}
      >
        <FontAwesomeIcon icon={faPlus} size={20} color={colors.text.inverse} />
      </TouchableOpacity>

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

