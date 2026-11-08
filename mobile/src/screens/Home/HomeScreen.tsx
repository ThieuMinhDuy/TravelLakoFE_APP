import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  CategorySection,
  AITripBanner,
  FeaturedHotelsSection,
  CulinarySection,
  TravelTipsSection,
} from './components';
import { cityService, placeService, favoriteService } from '@services';
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
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  // State bộ lọc và tìm kiếm
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<FilterState>(DEFAULT_FILTER_STATE);

  // State loading & pull-to-refresh
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlacesLoading, setIsPlacesLoading] = useState(false);

  // Hàm tải địa điểm linh hoạt theo thành phố qua GET /api/places/search?city={cityId}
  const fetchPlaces = useCallback(async (cityId?: string | null, keyword?: string) => {
    setIsPlacesLoading(true);
    try {
      if (cityId) {
        // Gọi API GET /places/search?city={cityId} phân loại trả về attractions, hotels, restaurants, cafes
        const categorized = await placeService.searchPlacesCategorized({
          city: cityId,
          q: keyword?.trim() || undefined,
        });

        // Điểm tham quan nổi bật
        setPlaces(categorized.attractions);
        // Khách sạn theo thành phố
        setHotels(categorized.hotels);
        // Nhà hàng theo thành phố
        setRestaurants(categorized.restaurants);
        // Quán cafe theo thành phố
        setCafes(categorized.cafes);
      } else if (keyword && keyword.trim().length > 0) {
        const categorized = await placeService.searchPlacesCategorized({
          q: keyword.trim(),
        });
        setPlaces(categorized.attractions);
        setHotels(categorized.hotels);
        setRestaurants(categorized.restaurants);
        setCafes(categorized.cafes);
      } else {
        // Tải lại toàn bộ dữ liệu đầy đủ
        const [fetchedAttractions, fetchedHotels, fetchedRestaurants, fetchedCafes] =
          await Promise.all([
            placeService.getPlaces('attraction'),
            placeService.getHotels(),
            placeService.getRestaurants(),
            placeService.getCafes(),
          ]);

        setPlaces(fetchedAttractions);
        setHotels(fetchedHotels);
        setRestaurants(fetchedRestaurants);
        setCafes(fetchedCafes);
      }
    } catch (error) {
      console.warn('Lỗi khi tải địa điểm theo bộ lọc:', error);
    } finally {
      setIsPlacesLoading(false);
    }
  }, []);

  // Tải dữ liệu ban đầu
  const loadInitialData = useCallback(async () => {
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
      setPlaces(fetchedAttractions);
      setHotels(fetchedHotels);
      setRestaurants(fetchedRestaurants);
      setCafes(fetchedCafes);

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
    setActiveFilters(DEFAULT_FILTER_STATE);
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

  // Xử lý mở màn hình bộ lọc
  const handleOpenFilter = () => {
    navigation.navigate('FilterScreen', {
      currentFilters: {
        ...activeFilters,
        cityId: selectedCityId,
      },
      onApply: (newFilters: FilterState) => {
        setActiveFilters(newFilters);
        setSelectedCityId(newFilters.cityId);
        fetchPlaces(newFilters.cityId, searchQuery);
      },
    });
  };

  // Xử lý chọn danh mục để lọc (Beach, Mountain, Hotel, Dining, Cafe...)
  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategoryId((prev) => (prev === categoryId ? null : categoryId));
  };

  // Xử lý reset tất cả bộ lọc khi ấn "See all"
  const handleResetFilters = () => {
    setSelectedCityId(null);
    setSelectedCategoryId(null);
    setActiveFilters(DEFAULT_FILTER_STATE);
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
      return `Nổi bật tại ${activeCity.name}`;
    }
    return 'Điểm đến thịnh hành';
  }, [activeCity]);

  // Lọc điểm tham quan hiển thị theo danh mục, tìm kiếm và bộ lọc nâng cao
  const filteredPlaces = useMemo(() => {
    return places.filter((place) => {
      // 1. Phân loại theo placeType của bộ lọc (nếu đã chọn lọc riêng nhóm khác thì ẩn ở đây)
      if (activeFilters.placeType !== 'all' && activeFilters.placeType !== 'attraction') {
        return false;
      }

      // 2. Lọc theo khoảng giá (nếu điểm có admissionFee)
      if (place.admissionFee !== undefined && place.admissionFee > 0) {
        if (
          place.admissionFee < activeFilters.minPrice ||
          place.admissionFee > activeFilters.maxPrice
        ) {
          return false;
        }
      }

      // 3. Lọc theo đánh giá tối thiểu
      if (
        activeFilters.minRating !== null &&
        (place.rating || 0) < activeFilters.minRating
      ) {
        return false;
      }

      // 4. Lọc theo hoạt động du lịch đã chọn
      if (activeFilters.selectedActivities.length > 0) {
        const textToMatch = `${place.name} ${place.description} ${place.category || ''}`.toLowerCase();
        const matchesAny = activeFilters.selectedActivities.some((actId) => {
          if (actId === 'beach') return textToMatch.includes('biển') || textToMatch.includes('beach') || textToMatch.includes('đảo');
          if (actId === 'trekking') return textToMatch.includes('núi') || textToMatch.includes('trekking') || textToMatch.includes('đỉnh');
          if (actId === 'food_tour') return textToMatch.includes('ẩm thực') || textToMatch.includes('ăn') || textToMatch.includes('đặc sản');
          if (actId === 'heritage') return textToMatch.includes('chùa') || textToMatch.includes('đền') || textToMatch.includes('cổ') || textToMatch.includes('di tích');
          if (actId === 'camping') return textToMatch.includes('cắm trại') || textToMatch.includes('camping') || textToMatch.includes('dã ngoại');
          if (actId === 'cafe_chill') return textToMatch.includes('cafe') || textToMatch.includes('cà phê') || textToMatch.includes('view');
          if (actId === 'nightlife') return textToMatch.includes('đêm') || textToMatch.includes('bar') || textToMatch.includes('phố đi bộ');
          if (actId === 'water_sport') return textToMatch.includes('thuyền') || textToMatch.includes('chèo') || textToMatch.includes('sup') || textToMatch.includes('lặn');
          return true;
        });
        if (!matchesAny) return false;
      }

      // 5. Lọc theo danh mục chọn nhanh
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
  }, [places, selectedCategoryId, activeFilters]);

  // Lọc danh sách khách sạn theo bộ lọc nâng cao
  const filteredHotels = useMemo(() => {
    return hotels.filter((hotel) => {
      if (activeFilters.placeType !== 'all' && activeFilters.placeType !== 'hotel') {
        return false;
      }
      if (hotel.pricePerNight !== undefined) {
        if (
          hotel.pricePerNight < activeFilters.minPrice ||
          hotel.pricePerNight > activeFilters.maxPrice
        ) {
          return false;
        }
      }
      if (activeFilters.stars !== null && hotel.stars !== activeFilters.stars) {
        return false;
      }
      if (
        activeFilters.minRating !== null &&
        (hotel.rating || 0) < activeFilters.minRating
      ) {
        return false;
      }
      return true;
    });
  }, [hotels, activeFilters]);

  // Lọc danh sách nhà hàng ẩm thực theo bộ lọc nâng cao
  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((res) => {
      if (activeFilters.placeType !== 'all' && activeFilters.placeType !== 'restaurant') {
        return false;
      }
      if (res.price !== undefined) {
        if (
          res.price < activeFilters.minPrice ||
          res.price > activeFilters.maxPrice
        ) {
          return false;
        }
      }
      if (
        activeFilters.minRating !== null &&
        (res.rating || 0) < activeFilters.minRating
      ) {
        return false;
      }
      return true;
    });
  }, [restaurants, activeFilters]);

  // Lọc danh sách quán cafe theo bộ lọc nâng cao
  const filteredCafes = useMemo(() => {
    return cafes.filter((cafe) => {
      if (activeFilters.placeType !== 'all' && activeFilters.placeType !== 'cafe') {
        return false;
      }
      if (cafe.price !== undefined) {
        if (
          cafe.price < activeFilters.minPrice ||
          cafe.price > activeFilters.maxPrice
        ) {
          return false;
        }
      }
      if (
        activeFilters.minRating !== null &&
        (cafe.rating || 0) < activeFilters.minRating
      ) {
        return false;
      }
      return true;
    });
  }, [cafes, activeFilters]);

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
        onFilterPress={handleOpenFilter}
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

      {/* 7. [MỚI] AI Trip Planner Banner: Chuyển thẳng sang tab AIChatTab */}
      <AITripBanner />

      {/* 8. [MỚI] Featured Hotels & Resorts (GET /api/places/hotel) */}
      <FeaturedHotelsSection
        hotels={filteredHotels}
        title={activeCity ? `Khách sạn tại ${activeCity.name}` : 'Khách sạn & Khu nghỉ dưỡng'}
        isLoading={isPlacesLoading}
        favoriteIds={favoriteIds}
        onHotelPress={(hotel) => {
          Alert.alert(
            hotel.name,
            `${hotel.description}\n\nĐịa chỉ: ${hotel.address}\nGiá: ${hotel.pricePerNight?.toLocaleString('vi-VN')} đ/đêm\nXếp hạng: ${hotel.stars || 5}★`
          );
        }}
        onBookmarkPress={handleBookmarkPress}
        onSeeAllPress={handleResetFilters}
      />

      {/* 9. [MỚI] Culinary & Coffee Spots (GET /api/places/restaurant & cafe) */}
      <CulinarySection
        restaurants={filteredRestaurants}
        cafes={filteredCafes}
        title={activeCity ? `Ẩm thực tại ${activeCity.name}` : 'Ẩm thực & Quán Cafe'}
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
      />

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
