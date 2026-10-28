import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  ScreenWrapper,
  AppHeader,
  AppText,
  AppTextInput,
  AppCard,
  AppBadge,
} from '@components/common';
import { spacing } from '@theme';

export const ExploreScreen: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <ScreenWrapper
      scrollable
      header={<AppHeader title="Khám phá Địa điểm" />}
    >
      <AppTextInput
        placeholder="Tìm kiếm điểm tham quan, khách sạn, nhà hàng..."
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      <View style={styles.categoriesRow}>
        {(['Tất cả', 'Tham quan', 'Khách sạn', 'Ẩm thực', 'Quán Cafe'] as const).map(
          (cat, idx) => (
            <AppBadge
              key={cat}
              label={cat}
              variant={idx === 0 ? 'primary' : 'slate'}
              size="md"
              style={styles.categoryBadge}
            />
          ),
        )}
      </View>

      <View style={styles.list}>
        <AppCard style={styles.placeCard}>
          <AppText variant="h3" color="main">
            Bà Nà Hills - Cầu Vàng
          </AppText>
          <AppText variant="caption" color="sub" style={styles.address}>
            Hòa Ninh, Hòa Vang, Đà Nẵng
          </AppText>
          <View style={styles.cardFooter}>
            <AppBadge label="Vé tham quan: 900.000 ₫" variant="teal" size="sm" />
            <AppText variant="captionMedium" color="sand">
              ★ 4.9
            </AppText>
          </View>
        </AppCard>

        <AppCard style={styles.placeCard}>
          <AppText variant="h3" color="main">
            Khách sạn Furama Resort
          </AppText>
          <AppText variant="caption" color="sub" style={styles.address}>
            Đường Võ Nguyên Giáp, Ngũ Hành Sơn, Đà Nẵng
          </AppText>
          <View style={styles.cardFooter}>
            <AppBadge label="3.200.000 ₫ / đêm" variant="primary" size="sm" />
            <AppText variant="captionMedium" color="sand">
              ★ 4.8 (5 sao)
            </AppText>
          </View>
        </AppCard>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  categoriesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.lg,
  },
  categoryBadge: {
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  list: {
    gap: spacing.md,
  },
  placeCard: {
    marginBottom: spacing.xs,
  },
  address: {
    marginTop: spacing.xxs,
    marginBottom: spacing.md,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

