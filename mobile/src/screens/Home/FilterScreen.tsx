import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { ScreenWrapper, AppText, AppIcon } from '@components/common';
import { colors, fontFamilies } from '@theme';
import { cityService } from '@services';
import type { City } from '@appTypes';
import {
  FilterState,
  DEFAULT_FILTER_STATE,
  POPULAR_CUISINE_TYPES,
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

export const FilterScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<FilterScreenRouteProp>();

  const initialFilters: FilterState =
    route.params?.currentFilters || DEFAULT_FILTER_STATE;
  const onApply = route.params?.onApply;

  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [cities, setCities] = useState<City[]>([]);

  // Tải danh sách thành phố từ API GET /cities
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

      {/* 2. Nội dung cuộn các tiêu chí lọc tương thích 1-1 với Swagger GET /places/{type} */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Phân loại địa điểm (type: attraction | hotel | restaurant | cafe) */}
        <View style={styles.section}>
          <AppText style={styles.sectionTitle}>Loại hình địa điểm (type)</AppText>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsRow}
          >
              {
                PLACE_TYPES.map((typeItem) => {
                  const isSelected = filters.type === typeItem.id;
                  return (
                    <TouchableOpacity
                      key={typeItem.id}
                      style={[styles.chip, isSelected && styles.chipActive]}
                      activeOpacity={0.8}
                      onPress={() =>
                        setFilters((p) => ({
                          ...p,
                          type: typeItem.id as any,
                        }))
                      }
                    >
                      <AppText
                        style={[
                          styles.chipText,
                          isSelected && styles.chipTextActive,
                        ]}
                      >
                        {typeItem.label}
                      </AppText>
                    </TouchableOpacity>
                  );
                })
              }
          </ScrollView>
        </View>

        {/* Khoảng giá (minPrice / maxPrice cho hotel, restaurant, cafe; minFee / maxFee cho attraction) */}
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

        {/* Thành phố (city ID) */}
        <View style={styles.section}>
          <AppText style={styles.sectionTitle}>Thành phố (city)</AppText>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsRow}
          >
              <TouchableOpacity
                style={[
                  styles.chip,
                  filters.city === null && styles.chipActive,
                ]}
                activeOpacity={0.8}
                onPress={() => setFilters((p) => ({ ...p, city: null }))}
              >
                <AppText
                  style={[
                    styles.chipText,
                    filters.city === null && styles.chipTextActive,
                  ]}
                >
                  Tất cả thành phố
                </AppText>
              </TouchableOpacity>

              {
                cities.map((cityItem) => {
                  const isSelected = filters.city === cityItem._id;
                  return (
                    <TouchableOpacity
                      key={cityItem._id}
                      style={[styles.chip, isSelected && styles.chipActive]}
                      activeOpacity={0.8}
                      onPress={() =>
                        setFilters((p) => ({
                          ...p,
                          city: isSelected ? null : cityItem._id,
                        }))
                      }
                    >
                      <AppText
                        style={[
                          styles.chipText,
                          isSelected && styles.chipTextActive,
                        ]}
                      >
                        {cityItem.name}
                      </AppText>
                    </TouchableOpacity>
                  );
                })
              }
          </ScrollView>
        </View>

          {/* Số sao khách sạn (stars: chỉ cho hotel theo Swagger) */ }
        {(filters.type === 'all' || filters.type === 'hotel') && (
          <View style={styles.section}>
            <AppText style={styles.sectionTitle}>Hạng sao khách sạn (stars)</AppText>
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

                  {/* Loại ẩm thực (cuisineType: chỉ cho restaurant theo Swagger) */}
                  {(filters.type === 'all' || filters.type === 'restaurant') && (
                    <View style={styles.section}>
                      <AppText style={styles.sectionTitle}>Loại ẩm thực (cuisineType)</AppText>
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.chipsRow}
                      >
                        <TouchableOpacity
                          style={[
                            styles.chip,
                            filters.cuisineType === null && styles.chipActive,
                          ]}
                          activeOpacity={0.8}
                          onPress={() => setFilters((p) => ({ ...p, cuisineType: null }))}
                        >
                          <AppText
                            style={[
                              styles.chipText,
                              filters.cuisineType === null && styles.chipTextActive,
                            ]}
                          >
                              Tất cả ẩm thực
                </AppText>
                        </TouchableOpacity>

                        {POPULAR_CUISINE_TYPES.map((cuisine) => {
                          const isSelected = filters.cuisineType === cuisine;
                          return (
                            <TouchableOpacity
                              key={cuisine}
                              style={[styles.chip, isSelected && styles.chipActive]}
                              activeOpacity={0.8}
                              onPress={() =>
                                setFilters((p) => ({
                                  ...p,
                                  cuisineType: isSelected ? null : cuisine,
                                }))
                              }
                            >
        <AppText
          style={[
            styles.chipText,
            isSelected && styles.chipTextActive,
          ]}
        >
          {cuisine}
        </AppText>
      </TouchableOpacity>
      );
              })}
    </ScrollView>
          </View >
        )}
      </ScrollView >

{/* 3. Nút Áp dụng cố định đáy màn hình */ }
<View style={styles.bottomContainer}>
  <TouchableOpacity
    style={styles.applyButton}
    activeOpacity={0.88}
    onPress={handleApply}
  >
    <AppText style={styles.applyText}>Áp dụng</AppText>
  </TouchableOpacity>
</View>
    </ScreenWrapper >
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
    marginBottom: 20,
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
  },
  applyButton: {
    backgroundColor: colors.primary.main,
    borderRadius: 26,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyText: {
    fontFamily: fontFamilies.sfProText.bold,
    fontSize: 16,
    color: '#FFFFFF',
  },
});
