import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import {
  ScreenWrapper,
  AppHeader,
  AppText,
  AppCard,
  AppBadge,
} from '@components/common';
import { colors, spacing } from '@theme';
import { useAuthStore } from '@store/useAuthStore';

export const HomeScreen: React.FC = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <ScreenWrapper
      scrollable
      header={
        <AppHeader
          title="TravelLako"
          subtitle="Khám phá điểm đến"
          rightAction={
            <AppBadge
              label={user?.name ? user.name.split(' ')[0] : 'Khách'}
              variant="teal"
              size="sm"
            />
          }
        />
      }
    >
      <View style={styles.welcomeBanner}>
        <AppText variant="h2" color="main">
          Chào {user?.name || 'bạn'},
        </AppText>
        <AppText variant="body" color="sub" style={styles.bannerSubtitle}>
          Hôm nay bạn muốn du lịch và tối ưu hóa lịch trình ở đâu?
        </AppText>
      </View>

      {/* Featured Cities Section */}
      <View style={styles.section}>
        <AppText variant="h3" color="main" style={styles.sectionTitle}>
          Thành phố nổi bật
        </AppText>

        <View style={styles.citiesGrid}>
          {['Đà Nẵng', 'Hà Nội', 'TP. Hồ Chí Minh', 'Hội An'].map((cityName) => (
            <AppCard key={cityName} style={styles.cityCard}>
              <AppText variant="bodyBold" color="main">
                {cityName}
              </AppText>
              <AppBadge label="Khám phá" variant="primary" size="sm" style={styles.cityBadge} />
            </AppCard>
          ))}
        </View>
      </View>

      {/* AI Assistant Promo Card */}
      <View style={styles.section}>
        <AppCard style={styles.aiCard}>
          <AppBadge label="Trợ lý Gemini AI" variant="teal" size="sm" />
          <AppText variant="h3" color="main" style={styles.aiTitle}>
            Lập lịch trình thông minh trong 1 chạm
          </AppText>
          <AppText variant="caption" color="sub">
            Chỉ cần nhập số ngày đi và sở thích, AI sẽ tự động chọn lọc địa điểm và tối ưu quãng đường ngắn nhất.
          </AppText>
        </AppCard>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  welcomeBanner: {
    paddingVertical: spacing.md,
  },
  bannerSubtitle: {
    marginTop: spacing.xs,
  },
  section: {
    marginTop: spacing.lg,
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  citiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  cityCard: {
    width: '47%',
    padding: spacing.md,
    alignItems: 'flex-start',
  },
  cityBadge: {
    marginTop: spacing.sm,
  },
  aiCard: {
    backgroundColor: colors.primary.soft,
    borderColor: colors.primary.border,
  },
  aiTitle: {
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
  },
});

