import React, { useState } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faSuitcaseRolling,
  faPlus,
  faWandMagicSparkles,
} from '@fortawesome/free-solid-svg-icons';
import { ScreenWrapper, AppText, EmptyState } from '@components/common';
import { colors, spacing, radius, shadows } from '@theme';
import { QUERY_KEYS } from '@constants/queryKeys';
import { SCREEN_NAMES } from '@constants/screenNames';
import { tripService } from '@services';
import type { Trip } from '@appTypes';
import {
  TripStatusTabs,
  TripCard,
  CreateTripModal,
  type TripStatusType,
} from './components';

export const ScheduleScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<TripStatusType>('upcoming');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Fetch dữ liệu các chuyến đi của người dùng
  const {
    data,
    isLoading,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: [QUERY_KEYS.USER_TRIPS],
    queryFn: () => tripService.getMyTrips(),
  });

  const counts = {
    upcoming: data?.upcoming?.length || 0,
    ongoing: data?.ongoing?.length || 0,
    past: data?.past?.length || 0,
  };

  const currentTrips: Trip[] = data ? data[activeTab] || [] : [];

  const handleTripPress = (trip: Trip) => {
    navigation.navigate(SCREEN_NAMES.TRIP_DETAIL, { tripId: trip._id });
  };

  const handleNavigateAIChat = () => {
    navigation.navigate(SCREEN_NAMES.AI_CHAT_TAB);
  };

  const handleCreateSuccess = () => {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER_TRIPS] });
    refetch();
  };

  // Header cố định của màn hình
  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View style={styles.headerTitleGroup}>
          <AppText variant="h2" color="main">
            Lịch Trình
          </AppText>
          <AppText variant="caption" color="sub">
            Quản lý và theo dõi các chuyến đi của bạn
          </AppText>
        </View>

        {/* Nút gợi ý AI chat nhanh */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleNavigateAIChat}
          style={styles.aiShortcutBtn}
        >
          <FontAwesomeIcon icon={faWandMagicSparkles} size={15} color={colors.primary.main} />
          <AppText variant="captionMedium" color="primary" style={styles.aiShortcutText}>
            Hỏi AI
          </AppText>
        </TouchableOpacity>
      </View>

      {/* Bộ 3 tabs trạng thái chuyến đi */}
      <TripStatusTabs
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        counts={counts}
      />
    </View>
  );

  return (
    <ScreenWrapper
      header={renderHeader()}
      scrollable={false}
      style={styles.wrapper}
    >
      {isLoading && !isRefetching ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary.main} />
          <AppText variant="body" color="muted" style={styles.loadingText}>
            Đang tải danh sách chuyến đi...
          </AppText>
        </View>
      ) : (
        <FlatList
          data={currentTrips}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TripCard
              trip={item}
              status={activeTab}
              onPress={() => handleTripPress(item)}
            />
          )}
          contentContainerStyle={styles.listContent}
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
          ListEmptyComponent={
            <EmptyState
              title={
                activeTab === 'upcoming'
                  ? 'Chưa có chuyến đi sắp tới'
                  : activeTab === 'ongoing'
                  ? 'Không có chuyến đi đang diễn ra'
                  : 'Chưa có chuyến đi nào đã hoàn thành'
              }
              description={
                activeTab === 'upcoming'
                  ? 'Bạn có thể tự tạo chuyến đi mới hoặc để AI thiết kế lịch trình hoàn hảo cho bạn chỉ trong vài giây!'
                  : activeTab === 'ongoing'
                  ? 'Hiện tại bạn không có chuyến đi nào trong khoảng thời gian này.'
                  : 'Những chuyến đi đã kết thúc sẽ được lưu trữ tại đây kèm theo nhật ký hành trình.'
              }
              actionTitle={activeTab === 'upcoming' ? 'Gợi ý lịch trình cùng AI' : undefined}
              onAction={activeTab === 'upcoming' ? handleNavigateAIChat : undefined}
              style={styles.emptyContainer}
            />
          }
        />
      )}

      {/* Nút Tạo chuyến đi nổi (FAB) */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => setIsCreateModalOpen(true)}
        style={styles.fab}
      >
        <FontAwesomeIcon icon={faPlus} size={20} color={colors.text.inverse} />
      </TouchableOpacity>

      {/* Modal tạo chuyến đi mới */}
      <CreateTripModal
        visible={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background.app,
  },
  header: {
    backgroundColor: colors.background.surface,
    paddingTop: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xs,
  },
  headerTitleGroup: {
    flex: 1,
  },
  aiShortcutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary.soft,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.primary.main,
  },
  aiShortcutText: {
    marginLeft: spacing.xs,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
  },
  loadingText: {
    marginTop: spacing.sm,
  },
  listContent: {
    paddingVertical: spacing.md,
    flexGrow: 1,
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
