import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  ScreenWrapper,
  AppHeader,
  AppText,
  AppButton,
  AppTextInput,
  AppCard,
  AppBadge,
} from '@components/common';
import { colors, spacing } from '@theme';
import { useAppNavigation } from '@hooks/useAppNavigation';

/**
 * ============================================================================
 * SCREEN DESIGN PATTERN / REFERENCE TEMPLATE
 * ============================================================================
 * Quy chuẩn thiết kế màn hình dành cho tất cả các Developer:
 *
 * 1. Bọc toàn bộ nội dung bằng <ScreenWrapper>
 *    - Dùng scrollable={true} nếu màn hình có danh sách / cuộn được
 *    - Dùng header={<AppHeader ... />} cho thanh tiêu đề trên cùng
 *    - Dùng footer={<AppButton ... />} cho các nút hành động cố định ở đáy
 * 2. Sử dụng các Atomic Components:
 *    - <AppText> với các variant (h1, h2, h3, body, caption...)
 *    - <AppButton> với các variant (primary, secondary, outline, ghost)
 *    - <AppTextInput> cho form nhập liệu (có sẵn focus border và error)
 *    - <AppCard> cho thẻ hiển thị nội dung (nền trắng surface, border subtle)
 *    - <AppBadge> cho nhãn danh mục, trạng thái
 * 3. Tuyệt đối không hardcode mã màu hex (#xxx) hoặc spacing tự do
 * ============================================================================
 */

export const TemplateScreen: React.FC = () => {
  const navigation = useAppNavigation();

  // Local state
  const [keyword, setKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1200);
  };

  return (
    <ScreenWrapper
      scrollable
      isLoading={isLoading}
      loadingMessage="Đang xử lý dữ liệu..."
      header={
        <AppHeader
          title="Màn Hình Chuẩn Mẫu"
          subtitle="TravelLako Design System"
          showBack
          onBack={() => navigation.goBack()}
        />
      }
      footer={
        <AppButton
          title="Hành Động Chính (Footer CTA)"
          onPress={() => console.log('Footer action triggered')}
          variant="primary"
          size="lg"
        />
      }
    >
      {/* Section 1: Tiêu đề & Giới thiệu */}
      <View style={styles.section}>
        <AppText variant="h2" color="main">
          Khám phá Đà Nẵng
        </AppText>
        <AppText variant="body" color="sub" style={styles.sectionSubtitle}>
          Thành phố đáng sống với biển xanh, núi non và ẩm thực tuyệt hảo.
        </AppText>
      </View>

      {/* Section 2: Form nhập liệu chuẩn */}
      <View style={styles.section}>
        <AppTextInput
          label="Từ khóa tìm kiếm"
          placeholder="Ví dụ: Khách sạn ven biển Mỹ Khê..."
          value={keyword}
          onChangeText={setKeyword}
          helperText="Gõ tên địa điểm hoặc loại hình du lịch"
        />
        <AppButton
          title="Tìm kiếm"
          onPress={handleSearch}
          variant="secondary"
          size="md"
        />
      </View>

      {/* Section 3: Thẻ Card chuẩn */}
      <View style={styles.section}>
        <AppText variant="h3" color="main" style={styles.cardSectionTitle}>
          Địa điểm gợi ý
        </AppText>

        <AppCard onPress={() => console.log('Card clicked')}>
          <View style={styles.cardHeader}>
            <AppText variant="h3" color="main">
              Bán Đảo Sơn Trà
            </AppText>
            <AppBadge label="Attraction" variant="teal" size="sm" />
          </View>

          <AppText variant="caption" color="sub" style={styles.cardDescription}>
            Viên ngọc xanh của Đà Nẵng với hệ sinh thái phong phú và Chùa Linh Ứng uy nghiêm.
          </AppText>

          <View style={styles.cardFooter}>
            <AppText variant="bodyBold" color="primary">
              Miễn phí vé vào cổng
            </AppText>
            <AppBadge label="★ 4.8 (1,240 đánh giá)" variant="sand" size="sm" />
          </View>
        </AppCard>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: spacing.xl,
  },
  sectionSubtitle: {
    marginTop: spacing.xs,
  },
  cardSectionTitle: {
    marginBottom: spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  cardDescription: {
    marginBottom: spacing.md,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.border.subtle,
  },
});

