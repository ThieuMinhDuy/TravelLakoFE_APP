import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenWrapper } from '@components/common';
import { colors } from '@theme';
import {
  HomeHeader,
  HomeHero,
  HomeSearchBar,
  WhereToVisitSection,
  PopularDestinationsSection,
  AITripBanner,
  FeaturedHotelsSection,
  CulinarySection,
  TravelTipsSection,
} from './components';
import { cityService, placeService, favoriteService } from '@services';
import { SCREEN_NAMES } from '@constants/screenNames';
import type { City, Place, FilterState } from '@appTypes';
import { DEFAULT_FILTER_STATE } from '@appTypes';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  // State quản lý dữ liệu từ các API
  const [cities, setCities] = useState<City[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [hotels, setHotels] = useState<Place[]>([]);
  const [restaurants, setRestaurants] = useState<Place[]>([]);
  const [cafes, setCafes] = useState<Place[]>([]);
  // Map: placeId -> favoriteId (_id bản ghi favorite, cần để gọi DELETE /favorites/:id)
  const [favoriteMap, setFavoriteMap] = useState<Map<string, string>>(new Map());
  const favoriteIds = useMemo(() => new Set(favoriteMap.keys()), [favoriteMap]);
  // Các placeId đang chờ API favorite (chặn bấm liên tục)
  const pendingFavoriteRef = useRef<Set<string>>(new Set());

  // Đếm số lần tải danh sách địa điểm: chỉ áp dụng kết quả của request mới nhất
  const placesRequestIdRef = useRef(0);

  // State bộ lọc và tìm kiếm
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<FilterState>(DEFAULT_FILTER_STATE);

  // State loading & pull-to-refresh
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlacesLoading, setIsPlacesLoading] = useState(false);

    /**
     * Tải dữ liệu địa điểm bằng 2 API theo đúng chuẩn docs/API_ENDPOINTS.md:
     * 1. GET /places/search?q={search}&city={cityId} -> Global Search
     * 2. GET /places/{type}?city=...&search=...&stars=...&minPrice=...&maxPrice=...&minFee=...&maxFee=...&cuisineType=... -> Filtered list
     */
    const loadPlacesWithFilters = useCallback(async (filters: FilterState, keyword: string) => {
      const requestId = ++placesRequestIdRef.current;
      const isStale = () => requestId !== placesRequestIdRef.current;
      setIsPlacesLoading(true);
      try {
          const cityId = filters.city || undefined;
          const q = keyword.trim() || undefined;
          const minPrice = filters.minPrice > 0 ? filters.minPrice : undefined;
          const maxPrice = filters.maxPrice < 10000000 ? filters.maxPrice : undefined;

          // 1. Trường hợp tìm kiếm từ khóa thuần túy hoặc chọn thành phố nhanh không kèm bộ lọc giá/sao/loại:
          // Gọi API GET /places/search?q={q}&city={city} (Global Search)
          const hasSpecificFilter =
            filters.stars !== null ||
            minPrice !== undefined ||
            maxPrice !== undefined ||
            filters.cuisineType !== null ||
            filters.type !== 'all';

          if (!hasSpecificFilter && (cityId || q)) {
            const categorized = await placeService.searchPlacesCategorized({
              q,
              city: cityId,
            });
            if (isStale()) return;
            setPlaces(categorized.attractions);
            setHotels(categorized.hotels);
            setRestaurants(categorized.restaurants);
            setCafes(categorized.cafes);
            return;
          }

        // 2. Trường hợp áp dụng bộ lọc: Gọi API GET /places/{type} kèm query params tương ứng theo Swagger
        const shouldFetchAttractions =
          filters.type === 'all' || filters.type === 'attraction';
        const shouldFetchHotels =
          filters.type === 'all' || filters.type === 'hotel';
        const shouldFetchRestaurants =
          filters.type === 'all' || filters.type === 'restaurant';
        const shouldFetchCafes =
          filters.type === 'all' || filters.type === 'cafe';

        const [fetchedAttractions, fetchedHotels, fetchedRestaurants, fetchedCafes] =
          await Promise.all([
            shouldFetchAttractions
              ? placeService.getPlaces('attraction', {
                city: cityId,
                search: q,
                minFee: minPrice,
                maxFee: maxPrice,
              })
              : Promise.resolve([]),
            shouldFetchHotels
              ? placeService.getHotels({
                city: cityId,
                search: q,
                stars: filters.stars || undefined,
                minPrice,
                maxPrice,
              })
              : Promise.resolve([]),
            shouldFetchRestaurants
              ? placeService.getRestaurants({
                city: cityId,
                search: q,
                cuisineType: filters.cuisineType || undefined,
                minPrice,
                maxPrice,
              })
              : Promise.resolve([]),
            shouldFetchCafes
              ? placeService.getCafes({
                city: cityId,
                search: q,
                minPrice,
                maxPrice,
              })
              : Promise.resolve([]),
          ]);

        if (isStale()) return;
        setPlaces(fetchedAttractions);
        setHotels(fetchedHotels);
        setRestaurants(fetchedRestaurants);
        setCafes(fetchedCafes);
      } catch (error) {
        console.warn('Lỗi khi tải dữ liệu địa điểm:', error);
      } finally {
        if (!isStale()) {
          setIsPlacesLoading(false);
        }
      }
    }, []);

    // Tải dữ liệu ban đầu
    const loadInitialData = useCallback(async () => {
      // Huỷ hiệu lực các request lọc đang chạy dở để không ghi đè dữ liệu ban đầu
      const requestId = ++placesRequestIdRef.current;
      setIsPlacesLoading(false);
      try {
        const [
          fetchedCities,
          fetchedAttractions,
          fetchedHotels,
          fetchedRestaurants,
          fetchedCafes,
          fetchedFavorites,
        ] = await Promise.all([
          cityService.getCities(),
          placeService.getPlaces('attraction'),
          placeService.getHotels(),
          placeService.getRestaurants(),
          placeService.getCafes(),
          favoriteService.getFavorites(),
        ]);

        setCities(fetchedCities);
        if (requestId === placesRequestIdRef.current) {
          setPlaces(fetchedAttractions);
          setHotels(fetchedHotels);
          setRestaurants(fetchedRestaurants);
          setCafes(fetchedCafes);
        }

        // Lưu map placeId -> favoriteId để check nhanh O(1) và xoá đúng bản ghi
        const favMap = new Map<string, string>();
        fetchedFavorites.forEach((fav) => {
          const placeId =
            typeof fav.itemId === 'string' ? fav.itemId : fav.itemId?._id;
          if (placeId && fav._id) {
            favMap.set(placeId, fav._id);
          }
        });
        setFavoriteMap(favMap);
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
      setActiveFilters(DEFAULT_FILTER_STATE);
      setSearchQuery('');
      loadInitialData();
    }, [loadInitialData]);

    // Xử lý toggle yêu thích / bookmark
    const handleBookmarkPress = async (place: Place) => {
      const placeId = place._id;
      if (pendingFavoriteRef.current.has(placeId)) return;
      pendingFavoriteRef.current.add(placeId);

      const existingFavoriteId = favoriteMap.get(placeId);
      // Giá trị tạm trong lúc chờ API thêm mới trả về _id thật
      const PENDING_ID = '__pending__';

      try {
        if (existingFavoriteId) {
          // Optimistic: bỏ lưu ngay trên UI
          setFavoriteMap((prev) => {
            const next = new Map(prev);
            next.delete(placeId);
            return next;
          });
          const success =
            existingFavoriteId !== PENDING_ID &&
            (await favoriteService.removeFavorite(existingFavoriteId));
          if (!success) {
            // Rollback nếu API lỗi
            setFavoriteMap((prev) => new Map(prev).set(placeId, existingFavoriteId));
          }
        } else {
          // Optimistic: đánh dấu đã lưu ngay trên UI
          setFavoriteMap((prev) => new Map(prev).set(placeId, PENDING_ID));
          const itemType = place.itemType || 'Attraction';
          const newFavoriteId = await favoriteService.addFavorite(itemType, placeId);
          setFavoriteMap((prev) => {
            const next = new Map(prev);
            if (newFavoriteId) {
              next.set(placeId, newFavoriteId);
            } else {
              next.delete(placeId); // Rollback nếu API lỗi
            }
            return next;
          });
        }
      } finally {
        pendingFavoriteRef.current.delete(placeId);
      }
    };

    // Xử lý khi người dùng ấn vào 1 thành phố ở "Where would you like to visit?"
    const handleCityPress = (city: City) => {
      if (selectedCityId === city._id) {
        // Hủy chọn thành phố
        setSelectedCityId(null);
        const updated = { ...activeFilters, city: null };
        setActiveFilters(updated);
        loadPlacesWithFilters(updated, searchQuery);
      } else {
        // Chọn thành phố mới
        setSelectedCityId(city._id);
        const updated = { ...activeFilters, city: city._id };
        setActiveFilters(updated);
        loadPlacesWithFilters(updated, searchQuery);
      }
    };

    // Xử lý mở màn hình bộ lọc
    const handleOpenFilter = () => {
      navigation.navigate('FilterScreen', {
        currentFilters: {
          ...activeFilters,
          city: selectedCityId,
        },
        onApply: (newFilters: FilterState) => {
          setActiveFilters(newFilters);
          setSelectedCityId(newFilters.city);
          loadPlacesWithFilters(newFilters, searchQuery);
        },
      });
    };

    /**
     * Chuyển sang màn hình chi tiết địa điểm PlaceDetailScreen
     */
    const handlePlacePress = (place: Place) => {
      const placeType = (place.itemType || 'Attraction') as 'Attraction' | 'Hotel' | 'Restaurant' | 'Cafe';
      navigation.navigate(SCREEN_NAMES.PLACE_DETAIL as any, {
        placeId: place._id,
        placeType,
        initialPlace: place,
      });
    };

    // Xử lý reset tất cả bộ lọc khi ấn "See all"
    const handleResetFilters = () => {
      setSelectedCityId(null);
      setActiveFilters(DEFAULT_FILTER_STATE);
      setSearchQuery('');
      loadPlacesWithFilters(DEFAULT_FILTER_STATE, '');
    };

    // Lấy đối tượng thành phố đang chọn (để hiển thị tiêu đề động)
    const activeCity = useMemo(() => {
      return cities.find((c) => c._id === selectedCityId) || null;
    }, [cities, selectedCityId]);

    // Tiêu đề động của Popular Destinations theo thành phố hoặc loại địa điểm đang lọc
    const popularSectionTitle = useMemo(() => {
      const citySuffix = activeCity ? ` tại ${activeCity.name}` : '';
      if (activeFilters.type === 'hotel') {
        return `Khách sạn nổi bật${citySuffix}`;
      }
      if (activeFilters.type === 'restaurant') {
        return `Nhà hàng nổi bật${citySuffix}`;
      }
      if (activeFilters.type === 'cafe') {
        return `Quán cafe nổi bật${citySuffix}`;
      }
      if (activeCity) {
        return `Nổi bật tại ${activeCity.name}`;
      }
      return 'Điểm đến thịnh hành';
  }, [activeCity, activeFilters.type]);

      // Danh sách hiển thị ở Popular Destinations
      const displayedPlaces = useMemo(() => {
        let baseList = places;
        // Nếu lọc riêng Khách sạn / Nhà hàng / Quán Cafe thì Popular Destinations hiển thị luôn danh sách đó
        if (baseList.length === 0) {
          if (activeFilters.type === 'hotel') baseList = hotels;
          else if (activeFilters.type === 'restaurant') baseList = restaurants;
          else if (activeFilters.type === 'cafe') baseList = cafes;
        }

        return baseList;
      }, [places, hotels, restaurants, cafes, activeFilters.type]);

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

      {/* 3. Search & Filter Bar: Gọi API GET /places/search hoặc mở FilterScreen */}
      <HomeSearchBar
        value={searchQuery}
        onChangeText={(text) => {
          setSearchQuery(text);
          if (text.trim().length === 0) {
            loadPlacesWithFilters(activeFilters, '');
          }
        }}
        onSubmitEditing={() => {
          loadPlacesWithFilters(activeFilters, searchQuery);
        }}
        onFilterPress={handleOpenFilter}
      />

      {/* 4. Section 1 theo chuẩn Figma: "Where would you like to visit?" */}
      <WhereToVisitSection
        cities={cities}
        selectedCityId={selectedCityId}
        onCityPress={handleCityPress}
      />

      {/* 5. Section 2 theo chuẩn Figma: "Popular Destinations" */}
      <PopularDestinationsSection
        places={displayedPlaces}
        title={popularSectionTitle}
        isLoading={isPlacesLoading}
        favoriteIds={favoriteIds}
        onPlacePress={handlePlacePress}
        onBookmarkPress={handleBookmarkPress}
        onSeeAllPress={handleResetFilters}
        onResetCityFilter={handleResetFilters}
      />

      {/* 6. [MỚI] AI Trip Planner Banner: Chuyển thẳng sang tab AIChatTab */}
      <AITripBanner />

      {/* 8. [MỚI] Featured Hotels & Resorts (GET /api/places/hotel) */}
      {(activeFilters.type === 'all' || activeFilters.type === 'hotel') && (
        <FeaturedHotelsSection
          hotels={hotels}
          title={activeCity ? `Khách sạn tại ${activeCity.name}` : 'Khách sạn & Khu nghỉ dưỡng'}
          isLoading={isPlacesLoading}
          favoriteIds={favoriteIds}
          onHotelPress={handlePlacePress}
          onBookmarkPress={handleBookmarkPress}
          onSeeAllPress={handleResetFilters}
        />
      )}

      {/* 9. [MỚI] Culinary & Coffee Spots (GET /api/places/restaurant & cafe) */}
      {(activeFilters.type === 'all' ||
        activeFilters.type === 'restaurant' ||
        activeFilters.type === 'cafe') && (
          <CulinarySection
            restaurants={restaurants}
            cafes={cafes}
            title={activeCity ? `Ẩm thực tại ${activeCity.name}` : 'Ẩm thực & Quán Cafe'}
            isLoading={isPlacesLoading}
            favoriteIds={favoriteIds}
            onPlacePress={handlePlacePress}
            onBookmarkPress={handleBookmarkPress}
            onSeeAllPress={handleResetFilters}
          />
        )}

      {/* 10. [MỚI] Travel Tips & Safety (Cẩm nang du lịch hữu ích) */}
      <TravelTipsSection />
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
