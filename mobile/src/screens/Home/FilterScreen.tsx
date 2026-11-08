import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { ScreenWrapper, AppText, AppIcon } from '@components/common';
import { colors, fontFamilies, shadows } from '@theme';
import { cityService } from '@services';
import type { City } from '@appTypes';
import {
  FilterState,
  DEFAULT_FILTER_STATE,
  TOURISM_ACTIVITIES,
} from '@appTypes';
import { PriceWaveSlider } from './components/PriceWaveSlider';
import type { RootStackParamList } from '@navigation/types';

type FilterScreenRouteProp = RouteProp<RootStackParamList, 'FilterScreen'>;

const PLACE_TYPES = [
  { id: 'all', label: 'Tất cả' },
  { id: 'attraction', label: 'Điểm tham quan' },
  { id: 'hotel', label: 'Khách sạn' },
  { id: 'restaurant', label: 'Nhà hàng' },
  { id: 'cafe', label: 'Quán Cafe' },
] as const;

const STAR_OPTIONS = [
  { value: null, label: 'Tất cả' },
  { value: 5, label: '5 ★' },
  { value: 4, label: '4 ★' },
  { value: 3, label: '3 ★' },
  { value: 2, label: '2 ★' },
  { value: 1, label: '1 ★' },
];

const RATING_OPTIONS = [
  { value: null, label: 'Tất cả' },
  { value: 4.5, label: '4.5 ★ trở lên' },
  { value: 4.0, label: '4.0 ★ trở lên' },
  { value: 3.5, label: '3.5 ★ trở lên' },
];

export const FilterScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<FilterScreenRouteProp>();

  const initialFilters: FilterState =
    route.params?.currentFilters || DEFAULT_FILTER_STATE;
  const onApply = route.params?.onApply;

  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [cities, setCities] = useState<City[]>([]);

  // Tải danh sách thành phố từ API backend
  useEffect(() => {
    let isMounted = true;
    const fetchCities = async () => {
      try {
        const fetched = await cityService.getCities();
        if (isMounted) {
          setCities(fetched);
        }
      } catch (error) {
        console.warn('Lỗi khi tải danh sách thành phố trong bộ lọc:', error);
      }
    };
    fetchCities();
    return () => {
      isMounted = false;
    };
  }, []);

  // Xóa toàn bộ bộ lọc
  const handleClearAll = () => {
    setFilters(DEFAULT_FILTER_STATE);
  };

  // Áp dụng bộ lọc
  const handleApply = () => {
    if (onApply) {
      onApply(filters);
    }
    navigation.goBack();
  };

  // Mở màn hình chọn hoạt động
  const handleOpenActivities = () => {
    navigation.navigate('SelectActivitiesScreen', {
      selectedActivities: filters.selectedActivities,
      onSelect: (newActivities: string[]) => {
        setFilters((prev) => ({
          ...prev,
          selectedActivities: newActivities,
        }));
      },
    });
  };

  // Tạo tóm tắt hoạt động đã chọn
  const getActivitiesSummary = () => {
    if (filters.selectedActivities.length === 0) {
      return 'Chọn hoạt động & trải nghiệm';
    }
    if (filters.selectedActivities.length <= 2) {
      const names = filters.selectedActivities
        .map((id) => TOURISM_ACTIVITIES.find((a) => a.id === id)?.name)
        .filter(Boolean);
      return names.join(', ');
    }
    return `Đã chọn ${filters.selectedActivities.length} hoạt động`;
  };

  return (
    <ScreenWrapper
      noPadding
      backgroundColor="#FFFFFF"
      safeAreaEdges={['top', 'bottom']}
    >
      {/* 1. Header chính */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <AppIcon name="arrowLeft" size={18} color="#0F172A" />
        </TouchableOpacity>

        <AppText style={styles.headerTitle}>Bộ lọc</AppText>

        <TouchableOpacity
          style={styles.clearAllButton}
          activeOpacity={0.7}
          onPress={handleClearAll}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <AppText style={styles.clearAllText}>Xóa tất cả</AppText>
        </TouchableOpacity>
      </View>

      {/* 2. Nội dung cuộn các tiêu chí lọc */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Khoảng giá với Biểu đồ sóng theo Figma */}
        <PriceWaveSlider
          minPrice={filters.minPrice}
          maxPrice={filters.maxPrice}
          onChange={(min, max) => {
            setFilters((prev) => ({
              ...prev,
              minPrice: min,
              maxPrice: max,
            }));
          }}
        />

        {/* Thành phố / Điểm đến */}
        <View style={styles.section}>
          <AppText style={styles.sectionTitle}>Thành phố / Điểm đến</AppText>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsRow}
          >
            <TouchableOpacity
              style={[
                styles.chip,
                filters.cityId === null && styles.chipActive,
              ]}
              activeOpacity={0.8}
              onPress={() => setFilters((p) => ({ ...p, cityId: null }))}
            >
              <AppText
                style={[
                  styles.chipText,
                  filters.cityId === null && styles.chipTextActive,
                ]}
              >
                Tất cả thành phố
              </AppText>
            </TouchableOpacity>

            {cities.map((city) => {
              const isSelected = filters.cityId === city._id;
              return (
                <TouchableOpacity
                  key={city._id}
                  style={[styles.chip, isSelected && styles.chipActive]}
                  activeOpacity={0.8}
                  onPress={() =>
                    setFilters((p) => ({
                      ...p,
                      cityId: isSelected ? null : city._id,
                    }))
                  }
                >
                  <AppText
                    style={[
                      styles.chipText,
                      isSelected && styles.chipTextActive,
                    ]}
                  >
                    {city.name}
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Phân loại địa điểm */}
        <View style={styles.section}>
          <AppText style={styles.sectionTitle}>Loại hình địa điểm</AppText>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsRow}
          >
            {PLACE_TYPES.map((type) => {
              const isSelected = filters.placeType === type.id;
              return (
                <TouchableOpacity
                  key={type.id}
                  style={[styles.chip, isSelected && styles.chipActive]}
                  activeOpacity={0.8}
                  onPress={() =>
                    setFilters((p) => ({
                      ...p,
                      placeType: type.id as any,
                    }))
                  }
                >
                  <AppText
                    style={[
                      styles.chipText,
                      isSelected && styles.chipTextActive,
                    ]}
                  >
                    {type.label}
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Hạng sao khách sạn (khi chọn Khách sạn hoặc Tất cả) */}
        {(filters.placeType === 'all' || filters.placeType === 'hotel') && (
          <View style={styles.section}>
            <AppText style={styles.sectionTitle}>Hạng sao khách sạn</AppText>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipsRow}
            >
              {STAR_OPTIONS.map((item, idx) => {
                const isSelected = filters.stars === item.value;
                return (
                  <TouchableOpacity
                    key={idx}
                    style={[styles.chip, isSelected && styles.chipActive]}
                    activeOpacity={0.8}
                    onPress={() =>
                      setFilters((p) => ({
                        ...p,
                        stars: item.value,
                      }))
                    }
                  >
                    <AppText
                      style={[
                        styles.chipText,
                        isSelected && styles.chipTextActive,
                      ]}
                    >
                      {item.label}
                    </AppText>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* Đánh giá tối thiểu */}
        <View style={styles.section}>
          <AppText style={styles.sectionTitle}>Đánh giá người dùng</AppText>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsRow}
          >
            {RATING_OPTIONS.map((item, idx) => {
              const isSelected = filters.minRating === item.value;
              return (
                <TouchableOpacity
                  key={idx}
                  style={[styles.chip, isSelected && styles.chipActive]}
                  activeOpacity={0.8}
                  onPress={() =>
                    setFilters((p) => ({
                      ...p,
                      minRating: item.value,
                    }))
                  }
                >
                  <AppText
                    style={[
                      styles.chipText,
                      isSelected && styles.chipTextActive,
                    ]}
                  >
                    {item.label}
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Hoạt động & Trải nghiệm (Dropdown kiểu dáng theo ảnh Figma) */}
        <View style={styles.section}>
          <AppText style={styles.sectionTitle}>Hoạt động & Trải nghiệm</AppText>
          <TouchableOpacity
            style={styles.dropdownBox}
            activeOpacity={0.85}
            onPress={handleOpenActivities}
          >
            <AppText
              style={[
                styles.dropdownText,
                filters.selectedActivities.length > 0 &&
                  styles.dropdownTextSelected,
              ]}
              numberOfLines={1}
            >
              {getActivitiesSummary()}
            </AppText>
            <AppIcon name="chevronDown" size={14} color="#64748B" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 4. Nút Áp dụng (Save) cố định đáy màn hình */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.applyButton}
          activeOpacity={0.88}
          onPress={handleApply}
        >
          <AppText style={styles.applyText}>Áp dụng</AppText>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    marginBottom: 8,
  },
  backButton: {
    minWidth: 70,
    height: 32,
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: fontFamilies.sfProDisplay.bold,
    fontSize: 18,
    color: '#0F172A',
  },
  clearAllButton: {
    minWidth: 70,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  clearAllText: {
    fontFamily: fontFamilies.sfProText.medium,
    fontSize: 14,
    color: colors.primary.main,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 110,
  },
  section: {
    marginBottom: 22,
  },
  sectionTitle: {
    fontFamily: fontFamilies.sfProDisplay.bold,
    fontSize: 15,
    color: '#0F172A',
    marginBottom: 10,
  },
  chipsRow: {
    gap: 8,
    paddingVertical: 2,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chipActive: {
    backgroundColor: '#E0F2FE',
    borderColor: colors.primary.main,
  },
  chipText: {
    fontFamily: fontFamilies.sfProText.medium,
    fontSize: 13,
    color: '#64748B',
  },
  chipTextActive: {
    fontFamily: fontFamilies.sfProText.bold,
    color: colors.primary.main,
  },
  dropdownBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  dropdownText: {
    flex: 1,
    fontFamily: fontFamilies.sfProText.regular,
    fontSize: 14,
    color: '#94A3B8',
    marginRight: 10,
  },
  dropdownTextSelected: {
    fontFamily: fontFamilies.sfProText.medium,
    color: '#0F172A',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    ...shadows.lg,
  },
  applyButton: {
    backgroundColor: colors.primary.main,
    borderRadius: 26,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  applyText: {
    fontFamily: fontFamilies.sfProText.bold,
    fontSize: 16,
    color: '#FFFFFF',
  },
});

