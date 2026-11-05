import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import { ScreenWrapper } from '@components/common';
import { colors } from '@theme';
import {
  HomeHeader,
  HomeHero,
  HomeSearchBar,
  WhereToVisitSection,
  PopularDestinationsSection,
  CategorySection,
} from './components';
import { cityService, placeService, favoriteService } from '@services';
import type { City, Place } from '@appTypes';

export const HomeScreen: React.FC = () => {
  // State quản lý dữ liệu từ các API
  const [cities, setCities] = useState<City[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  // State bộ lọc và tìm kiếm
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);

  // State loading & pull-to-refresh
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlacesLoading, setIsPlacesLoading] = useState(false);

  // Hàm tải địa điểm linh hoạt theo thành phố qua GET /api/places/search?city={cityId}
  const fetchPlaces = useCallback(async (cityId?: string | null, keyword?: string) => {
    setIsPlacesLoading(true);
    try {
      if (cityId) {
        // Gọi API GET /places/search?city={cityId} theo đúng backend
        const results = await placeService.searchPlaces({
          city: cityId,
          q: keyword?.trim() || undefined,
        });
        setPlaces(results);
      } else if (keyword && keyword.trim().length > 0) {
        const results = await placeService.searchPlaces({
          q: keyword.trim(),
        });
        setPlaces(results);
      } else {
        // Mặc định tải các địa điểm nổi bật chung
        const results = await placeService.getPlaces('attraction');
        setPlaces(results);
      }
    } catch (error) {
      console.warn('Lỗi khi tải địa điểm theo thành phố:', error);
    } finally {
      setIsPlacesLoading(false);
    }
  }, []);

  // Tải dữ liệu ban đầu
  const loadInitialData = useCallback(async () => {
    try {
      const [fetchedCities, fetchedPlaces, fetchedFavorites] = await Promise.all([
        cityService.getCities(),
        placeService.getPlaces('attraction'),
        favoriteService.getFavorites(),
      ]);

      setCities(fetchedCities);
      setPlaces(fetchedPlaces);

      // Lưu tập hợp ID yêu thích để check nhanh O(1)
      const favIds = new Set<string>();
      fetchedFavorites.forEach((fav) => {
        if (typeof fav.itemId === 'string') {
          favIds.add(fav.itemId);
        } else if (fav.itemId && typeof fav.itemId === 'object' && fav.itemId._id) {
          favIds.add(fav.itemId._id);
        }
      });
      setFavoriteIds(favIds);
    } catch (error) {
      console.warn('Lỗi khi tải dữ liệu Trang chủ:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Xử lý kéo thả làm mới (Pull-to-refresh)
  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    setSelectedCityId(null);
    setSelectedCategoryId(null);
    setSearchQuery('');
    loadInitialData();
  }, [loadInitialData]);

  // Xử lý toggle yêu thích / bookmark
  const handleBookmarkPress = async (place: Place) => {
    const isSaved = favoriteIds.has(place._id);
    const newFavorites = new Set(favoriteIds);

    // Optimistic UI Update
    if (isSaved) {
      newFavorites.delete(place._id);
      setFavoriteIds(newFavorites);
      await favoriteService.removeFavorite(place._id);
    } else {
      newFavorites.add(place._id);
      setFavoriteIds(newFavorites);
      const itemType = place.itemType || 'Attraction';
      await favoriteService.addFavorite(itemType, place._id);
    }
  };

  // Xử lý khi người dùng ấn vào 1 thành phố ở "Where would you like to visit?"
  const handleCityPress = (city: City) => {
    if (selectedCityId === city._id) {
      // Ấn lại vào thành phố đang chọn -> Hủy chọn và tải lại toàn bộ địa điểm
      setSelectedCityId(null);
      fetchPlaces(null, searchQuery);
    } else {
      // Chọn thành phố mới -> Gọi API tải địa điểm của thành phố đó
      setSelectedCityId(city._id);
      fetchPlaces(city._id, searchQuery);
    }
  };

  // Xử lý chọn danh mục để lọc (Beach, Mountain, Hotel, Dining, Cafe...)
  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategoryId((prev) => (prev === categoryId ? null : categoryId));
  };

  // Xử lý reset tất cả bộ lọc khi ấn "See all"
  const handleResetFilters = () => {
    setSelectedCityId(null);
    setSelectedCategoryId(null);
    setSearchQuery('');
    fetchPlaces(null, '');
  };

  // Lấy đối tượng thành phố đang chọn (để hiển thị tiêu đề động)
  const activeCity = useMemo(() => {
    return cities.find((c) => c._id === selectedCityId) || null;
  }, [cities, selectedCityId]);

  // Tiêu đề động của Popular Destinations
  const popularSectionTitle = useMemo(() => {
    if (activeCity) {
      return `Popular in ${activeCity.name}`;
    }
    return 'Popular Destinations';
  }, [activeCity]);

  // Lọc địa điểm hiển thị theo danh mục và tìm kiếm nội bộ
  const filteredPlaces = useMemo(() => {
    return places.filter((place) => {
      // 1. Lọc theo danh mục
      if (selectedCategoryId) {
        const placeCategory = place.category?.toLowerCase() || '';
        const placeType = place.itemType?.toLowerCase() || '';
        const cat = selectedCategoryId.toLowerCase();

        if (cat === 'beach' && !placeCategory.includes('beach') && !place.name.toLowerCase().includes('beach')) {
          return false;
        }
        if (cat === 'mountain' && !placeCategory.includes('mountain') && !place.name.toLowerCase().includes('hill')) {
          return false;
        }
        if (cat === 'hotel' && placeType !== 'hotel') {
          return false;
        }
        if (cat === 'food' && placeType !== 'restaurant') {
          return false;
        }
        if (cat === 'cafe' && placeType !== 'cafe') {
          return false;
        }
      }

      return true;
    });
  }, [places, selectedCategoryId]);

  return (
    <ScreenWrapper
      scrollable
      noPadding
      backgroundColor="#FFFFFF"
      safeAreaEdges={['top']}
      isLoading={isLoading}
      loadingMessage="Đang tải dữ liệu khám phá..."
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          colors={[colors.primary.main]}
          tintColor={colors.primary.main}
        />
      }
    >
      {/* 1. Header: Avatar User (từ /auth/profile) & Cài đặt, Thông báo */}
      <HomeHeader
        onNotificationPress={() => {
          Alert.alert('Thông báo', 'Bạn có 5 thông báo mới.');
        }}
      />

      {/* 2. Hero Headline: "Explore Amazing Destinations !" */}
      <HomeHero />

      {/* 3. Search & Filter Bar: Pill shape với viền xanh + nút filter tròn */}
      <HomeSearchBar
        value={searchQuery}
        onChangeText={(text) => {
          setSearchQuery(text);
          if (text.trim().length === 0) {
            fetchPlaces(selectedCityId, '');
          }
        }}
        onSubmitEditing={() => {
          fetchPlaces(selectedCityId, searchQuery);
        }}
        onFilterPress={() => {
          Alert.alert(
            'Bộ lọc',
            'Chọn mức giá, đánh giá sao hoặc khoảng cách để tinh chỉnh kết quả.'
          );
        }}
      />

      {/* 4. Section 1 theo chuẩn Figma: "Where would you like to visit?" */}
      <WhereToVisitSection
        cities={cities}
        selectedCityId={selectedCityId}
        onCityPress={handleCityPress}
      />

      {/* 5. Section 2 theo chuẩn Figma: "Popular Destinations" (Lọc theo thành phố khi được chọn) */}
      <PopularDestinationsSection
        places={filteredPlaces}
        title={popularSectionTitle}
        isLoading={isPlacesLoading}
        favoriteIds={favoriteIds}
        onPlacePress={(place) => {
          Alert.alert(
            place.name,
            `${place.description}\n\nĐịa chỉ: ${place.address}\nĐánh giá: ${place.rating || 4.6}★`
          );
        }}
        onBookmarkPress={handleBookmarkPress}
        onSeeAllPress={handleResetFilters}
        onResetCityFilter={handleResetFilters}
      />

      {/* 6. Section 3 theo chuẩn Figma: "Choose Category" (Beach, Mountain...) */}
      <CategorySection
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={handleSelectCategory}
        onSeeAllPress={() => {
          setSelectedCategoryId(null);
        }}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    paddingBottom: 120, // Chừa không gian cho floating Bottom Navigation Bar
  },
});
