import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Dimensions,
  FlatList,
  Alert,
  StatusBar,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText, AppButton, AppIcon, AppTextInput } from '@components/common';
import { colors, fontFamilies, radius, spacing } from '@theme';
import { RootStackParamList } from '@navigation/types';
import { SCREEN_NAMES } from '@constants/screenNames';
import { placeService, reviewService, tripService, favoriteService } from '@services';
import { useAuthStore } from '@store/useAuthStore';
import type { Place, Review, Trip, PlaceItemType } from '@appTypes';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Ảnh mặc định chất lượng cao khi địa điểm chưa có ảnh
const DEFAULT_COVER_IMAGE =
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80';
const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80';

export const PlaceDetailScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<RootStackParamList, 'PlaceDetailScreen'>>();
  const insets = useSafeAreaInsets();
  const currentUser = useAuthStore((state) => state.user);

  const { placeId, placeType, initialPlace } = route.params;

  // State dữ liệu
  const [place, setPlace] = useState<Place | null>(initialPlace || null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(!initialPlace);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isFavorite, setIsFavorite] = useState<boolean>(initialPlace?.isFavorite || false);
  const [favoriteId, setFavoriteId] = useState<string | null>(null);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState<boolean>(false);

  // Gallery & UI states
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState<boolean>(false);
  const [isPhotoViewerVisible, setIsPhotoViewerVisible] = useState<boolean>(false);

  // Add to plan modal state
  const [isPlanModalVisible, setIsPlanModalVisible] = useState<boolean>(false);
  const [myTrips, setMyTrips] = useState<Trip[]>([]);
  const [isLoadingTrips, setIsLoadingTrips] = useState<boolean>(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [planNote, setPlanNote] = useState<string>('');
  const [isAddingToPlan, setIsAddingToPlan] = useState<boolean>(false);

  // Write review modal state
  const [isReviewModalVisible, setIsReviewModalVisible] = useState<boolean>(false);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>('');
  const [isSubmittingReview, setIsSubmittingReview] = useState<boolean>(false);

  // Danh sách hình ảnh
  const images = useMemo(() => {
    if (place?.images && place.images.length > 0) {
      return place.images;
    }
    return [DEFAULT_COVER_IMAGE];
  }, [place?.images]);

  // Tải chi tiết địa điểm từ API GET /api/places/:type/:id
  const loadPlaceDetail = useCallback(async () => {
    try {
      const typeLower = placeType.toLowerCase();
      const detail = await placeService.getPlaceById(typeLower, placeId);
      if (detail) {
        setPlace(detail);
      }
    } catch (error) {
      console.warn('Lỗi khi tải chi tiết địa điểm:', error);
    }
  }, [placeId, placeType]);

  // Tải danh sách đánh giá từ API GET /api/reviews/:itemType/:itemId
  const loadReviews = useCallback(async () => {
    try {
      const res = await reviewService.getPlaceReviews(placeType, placeId);
      setReviews(res.reviews || []);
    } catch (error) {
      console.warn('Lỗi khi tải đánh giá địa điểm:', error);
    }
  }, [placeId, placeType]);

  // Kiểm tra trạng thái yêu thích từ API GET /api/favorites
  const checkFavoriteStatus = useCallback(async () => {
    try {
      const favList = await favoriteService.getFavorites();
      const found = favList.find((f) => {
        const itemId = typeof f.itemId === 'object' ? (f.itemId as any)?._id : f.itemId;
        return itemId === placeId;
      });
      if (found) {
        setIsFavorite(true);
        setFavoriteId(found._id);
      } else {
        setIsFavorite(false);
        setFavoriteId(null);
      }
    } catch {
      // Bỏ qua lỗi favorite nếu chưa đăng nhập
    }
  }, [placeId]);

  // Khởi tạo dữ liệu
  const initData = useCallback(async () => {
    setIsLoading(true);
    await Promise.all([loadPlaceDetail(), loadReviews(), checkFavoriteStatus()]);
    setIsLoading(false);
  }, [loadPlaceDetail, loadReviews, checkFavoriteStatus]);

  useEffect(() => {
    initData();
  }, [initData]);

  // Pull to refresh
  const onRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([loadPlaceDetail(), loadReviews(), checkFavoriteStatus()]);
    setIsRefreshing(false);
  };

  /**
   * Tính toán điểm đánh giá sao:
   * Ưu tiên tính trực tiếp từ mảng reviews được gọi từ API GET /api/reviews/:itemType/:itemId
   */
  const calculatedRating = useMemo(() => {
    if (reviews.length > 0) {
      const sum = reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
      return (sum / reviews.length).toFixed(1);
    }
    if (place?.rating && place.rating > 0) {
      return place.rating.toFixed(1);
    }
    return '5.0';
  }, [reviews, place?.rating]);

  // Tổng số lượng đánh giá
  const totalReviewsCount = useMemo(() => {
    if (reviews.length > 0) return reviews.length;
    return place?.numReviews || 0;
  }, [reviews.length, place?.numReviews]);

  // Xử lý Toggle Favorite
  const handleToggleFavorite = async () => {
    if (isTogglingFavorite) return;
    setIsTogglingFavorite(true);

    try {
      if (isFavorite && favoriteId) {
        setIsFavorite(false);
        const success = await favoriteService.removeFavorite(favoriteId);
        if (!success) setIsFavorite(true);
        else setFavoriteId(null);
      } else {
        setIsFavorite(true);
        const success = await favoriteService.addFavorite(placeType, placeId);
        if (!success) {
          setIsFavorite(false);
        } else {
          await checkFavoriteStatus();
        }
      }
    } catch (error) {
      console.warn('Lỗi khi toggle favorite:', error);
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  // Định dạng hiển thị giá theo loại địa điểm
  const formattedPrice = useMemo(() => {
    if (!place) return '';
    if (place.pricePerNight) {
      return `${place.pricePerNight.toLocaleString('vi-VN')} đ/đêm`;
    }
    if (place.admissionFee !== undefined) {
      return place.admissionFee > 0
        ? `${place.admissionFee.toLocaleString('vi-VN')} đ/vé`
        : 'Miễn phí';
    }
    if (place.price) {
      return `~${place.price.toLocaleString('vi-VN')} đ`;
    }
    return 'Liên hệ';
  }, [place]);

  // Tên thành phố
  const cityName = useMemo(() => {
    if (!place?.city) return '';
    if (typeof place.city === 'object') {
      return (place.city as any)?.name || '';
    }
    return '';
  }, [place?.city]);

  // Tiện ích thứ 2 tùy theo loại địa điểm
  const secondHighlight = useMemo(() => {
    if (placeType === 'Hotel') return { icon: 'cafe', label: 'Free Breakfast' };
    if (placeType === 'Restaurant') {
      return {
        icon: 'utensils',
        label: place?.cuisineType || 'Ẩm thực đặc sản',
      };
    }
    if (placeType === 'Cafe') return { icon: 'cafe', label: 'Cafe & Đồ uống' };
    return { icon: 'compass', label: 'Điểm tham quan' };
  }, [placeType, place?.cuisineType]);

  // Mở modal Add to Plan
  const handleOpenPlanModal = async () => {
    setIsPlanModalVisible(true);
    setIsLoadingTrips(true);
    try {
      const tripsData = await tripService.getMyTrips();
      const combined = [...tripsData.upcoming, ...tripsData.ongoing];
      setMyTrips(combined);
      if (combined.length > 0) {
        setSelectedTrip(combined[0]);
        setSelectedDay(1);
      }
    } catch (error) {
      console.warn('Lỗi khi tải danh sách chuyến đi:', error);
    } finally {
      setIsLoadingTrips(false);
    }
  };

  // Xác nhận thêm địa điểm vào lịch trình
  const handleConfirmAddToPlan = async () => {
    if (!selectedTrip) {
      Alert.alert('Thông báo', 'Vui lòng chọn chuyến đi để thêm địa điểm.');
      return;
    }

    setIsAddingToPlan(true);
    try {
      await tripService.addPlaceToSchedule(selectedTrip._id, {
        day: selectedDay,
        placeType,
        placeId,
        note: planNote.trim() || undefined,
      });

      setIsPlanModalVisible(false);
      setPlanNote('');
      Alert.alert(
        'Thành công 🎉',
        `Đã thêm "${place?.name}" vào Ngày ${selectedDay} của chuyến đi "${selectedTrip.title}".`,
        [
          {
            text: 'Đóng',
            style: 'cancel',
          },
          {
            text: 'Xem lịch trình',
            onPress: () => {
              navigation.navigate(SCREEN_NAMES.SCHEDULE_TAB);
            },
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Lỗi', error?.message || 'Không thể thêm địa điểm vào lịch trình.');
    } finally {
      setIsAddingToPlan(false);
    }
  };

  // Gửi đánh giá mới
  const handleSubmitReview = async () => {
    if (!reviewComment.trim()) {
      Alert.alert('Thông báo', 'Vui lòng nhập nội dung đánh giá của bạn.');
      return;
    }

    setIsSubmittingReview(true);
    try {
      await reviewService.createReview({
        itemType: placeType,
        itemId: placeId,
        rating: reviewRating,
        comment: reviewComment.trim(),
      });

      setIsReviewModalVisible(false);
      setReviewComment('');
      setReviewRating(5);
      Alert.alert('Thành công', 'Cảm ơn bạn đã gửi đánh giá!');
      await loadReviews();
      await loadPlaceDetail();
    } catch (error: any) {
      Alert.alert('Lỗi', error?.message || 'Không thể gửi đánh giá.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Xóa đánh giá của chính mình
  const handleDeleteReview = (reviewId: string) => {
    Alert.alert('Xác nhận', 'Bạn có chắc chắn muốn xóa đánh giá này không?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          const success = await reviewService.deleteReview(reviewId);
          if (success) {
            await loadReviews();
            await loadPlaceDetail();
          } else {
            Alert.alert('Lỗi', 'Không thể xóa đánh giá này.');
          }
        },
      },
    ]);
  };

  if (isLoading && !place) {
    return (
      <View style={[styles.loadingContainer, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color={colors.primary.main} />
        <AppText variant="body" color="sub" style={styles.loadingText}>
          Đang tải thông tin địa điểm...
        </AppText>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" />

      {/* 1. Top Navigation Bar (Header) */}
      <View style={[styles.headerBar, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <AppIcon name="chevronLeft" size={18} color="#0F172A" />
        </TouchableOpacity>

        <AppText variant="h3" color="main" style={styles.headerTitle}>
          Details
        </AppText>

        <View style={styles.headerRightPlaceholder} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 90 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* 2. Hero Cover Image with Rounded Corners */}
        <View style={styles.heroContainer}>
          <Image
            source={{ uri: images[selectedPhotoIndex] || DEFAULT_COVER_IMAGE }}
            style={styles.heroImage}
            resizeMode="cover"
          />
        </View>

        {/* 3. Amenities & Highlights Row (Wifi, Breakfast, Star Rating) */}
        <View style={styles.highlightsRow}>
          {/* Free Wifi */}
          <View style={styles.highlightItem}>
            <AppIcon name="wifi" size={16} color="#0F172A" />
            <AppText variant="captionBold" color="main" style={styles.highlightLabel}>
              Free Wifi
            </AppText>
          </View>

          {/* Secondary Amenity (Free Breakfast / Cuisine / Sightseeing) */}
          <View style={styles.highlightItem}>
            <AppIcon
              name={secondHighlight.icon as any}
              size={16}
              color="#0F172A"
            />
            <AppText
              variant="captionBold"
              color="main"
              style={styles.highlightLabel}
              numberOfLines={1}
            >
              {secondHighlight.label}
            </AppText>
          </View>

          {/* Star Rating from Reviews */}
          <View style={styles.highlightItem}>
            <AppIcon name="star" size={16} color="#FBBF24" />
            <AppText variant="captionBold" color="main" style={styles.highlightLabel}>
              {calculatedRating}
            </AppText>
          </View>
        </View>

        {/* 4. Title & Price Row */}
        <View style={styles.titlePriceRow}>
          <AppText variant="h2" color="main" style={styles.placeName}>
            {place?.name || 'Chi tiết địa điểm'}
          </AppText>

          <AppText variant="h3" color="main" style={styles.priceText}>
            {formattedPrice}
          </AppText>
        </View>

        {/* 5. Location Row */}
        <View style={styles.locationRow}>
          <AppIcon name="location" size={15} color="#0284C7" />
          <AppText variant="body" color="sub" style={styles.locationText}>
            {place?.address}
            {cityName ? `, ${cityName}` : ''}
          </AppText>
        </View>

        {/* 6. Description Section with Read more toggle */}
        <View style={styles.sectionContainer}>
          <AppText variant="h3" color="main" style={styles.sectionTitle}>
            Description
          </AppText>

          <AppText
            variant="body"
            color="sub"
            style={styles.descriptionText}
            numberOfLines={isDescriptionExpanded ? undefined : 3}
          >
            {place?.description || 'Chưa có thông tin mô tả chi tiết cho địa điểm này.'}
          </AppText>

          {Boolean(place?.description && place.description.length > 120) && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setIsDescriptionExpanded((p) => !p)}
              style={styles.readMoreButton}
            >
              <AppText variant="bodyMedium" color="primary" style={styles.readMoreText}>
                {isDescriptionExpanded ? 'Thu gọn' : 'Read more'}
              </AppText>
            </TouchableOpacity>
          )}
        </View>

        {/* 7. Photos Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <AppText variant="h3" color="main" style={styles.sectionTitle}>
              Photos
            </AppText>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setIsPhotoViewerVisible(true)}
            >
              <AppText variant="bodyMedium" color="primary" style={styles.seeAllText}>
                See all
              </AppText>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.photosScroll}
          >
            {images.map((imgUri, index) => {
              const isSelected = index === selectedPhotoIndex;
              return (
                <TouchableOpacity
                  key={`thumb-${index}`}
                  activeOpacity={0.8}
                  onPress={() => setSelectedPhotoIndex(index)}
                  style={[
                    styles.thumbnailContainer,
                    isSelected && styles.thumbnailSelected,
                  ]}
                >
                  <Image source={{ uri: imgUri }} style={styles.thumbnailImage} />
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* 8. Reviews Section from Backend API */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.reviewsTitleGroup}>
              <AppText variant="h3" color="main" style={styles.sectionTitle}>
                Reviews
              </AppText>
              <AppText variant="body" color="sub" style={styles.reviewsSubtitle}>
                ⭐ {calculatedRating} ({totalReviewsCount} đánh giá)
              </AppText>
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.writeReviewButton}
              onPress={() => setIsReviewModalVisible(true)}
            >
              <AppText variant="bodyBold" color="primary">
                + Viết đánh giá
              </AppText>
            </TouchableOpacity>
          </View>

          {reviews.length === 0 ? (
            <View style={styles.emptyReviewsCard}>
              <AppIcon name="starRegular" size={28} color="#94A3B8" />
              <AppText variant="body" color="muted" style={styles.emptyReviewsText}>
                Chưa có đánh giá nào. Hãy là người đầu tiên trải nghiệm và để lại nhận xét!
              </AppText>
            </View>
          ) : (
            reviews.map((rev) => {
              const isMine =
                currentUser?._id &&
                typeof rev.user === 'object' &&
                rev.user?._id === currentUser._id;

              return (
                <View key={rev._id} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <Image
                      source={{ uri: rev.user?.avatar || DEFAULT_AVATAR }}
                      style={styles.reviewAvatar}
                    />
                    <View style={styles.reviewUserInfo}>
                      <AppText variant="bodyBold" color="main">
                        {rev.user?.name || 'Du khách'}
                      </AppText>
                      <AppText variant="caption" color="muted">
                        {new Date(rev.createdAt).toLocaleDateString('vi-VN')}
                      </AppText>
                    </View>

                    {/* Star Rating Badge */}
                    <View style={styles.reviewStarsRow}>
                      {[1, 2, 3, 4, 5].map((starIdx) => (
                        <AppIcon
                          key={starIdx}
                          name={starIdx <= rev.rating ? 'star' : 'starRegular'}
                          size={12}
                          color="#FBBF24"
                        />
                      ))}
                    </View>

                    {isMine && (
                      <TouchableOpacity
                        onPress={() => handleDeleteReview(rev._id)}
                        style={styles.deleteReviewBtn}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      >
                        <AppIcon name="close" size={14} color="#EF4444" />
                      </TouchableOpacity>
                    )}
                  </View>

                  <AppText variant="body" color="main" style={styles.reviewComment}>
                    {rev.comment}
                  </AppText>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* 9. Bottom CTA Button ("Add to plan") */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <AppButton
          title="Add to plan"
          variant="primary"
          size="lg"
          fullWidth
          onPress={handleOpenPlanModal}
          style={styles.addToPlanButton}
        />
      </View>

      {/* ================= MODAL 1: ADD TO PLAN ================= */}
      <Modal
        visible={isPlanModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsPlanModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { paddingBottom: insets.bottom + 16 }]}>
            <View style={styles.modalHeader}>
              <AppText variant="h3" color="main">
                Thêm vào lịch trình chuyến đi
              </AppText>
              <TouchableOpacity
                onPress={() => setIsPlanModalVisible(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <AppIcon name="close" size={18} color="#64748B" />
              </TouchableOpacity>
            </View>

            {isLoadingTrips ? (
              <View style={styles.modalLoading}>
                <ActivityIndicator size="small" color={colors.primary.main} />
                <AppText variant="body" color="sub" style={{ marginTop: 8 }}>
                  Đang tải danh sách chuyến đi...
                </AppText>
              </View>
            ) : myTrips.length === 0 ? (
              <View style={styles.modalEmptyTrips}>
                <AppIcon name="schedule" size={36} color="#94A3B8" />
                <AppText variant="bodyMedium" color="main" style={{ marginTop: 12 }}>
                  Bạn chưa có chuyến đi nào
                </AppText>
                <AppText variant="caption" color="sub" style={styles.emptyTripsSub}>
                  Hãy tạo một chuyến đi mới để bắt đầu thêm địa điểm vào lịch trình!
                </AppText>
                <AppButton
                  title="Khám phá Lịch trình"
                  variant="secondary"
                  size="sm"
                  onPress={() => {
                    setIsPlanModalVisible(false);
                    navigation.navigate(SCREEN_NAMES.SCHEDULE_TAB);
                  }}
                  style={{ marginTop: 16 }}
                />
              </View>
            ) : (
              <ScrollView showsVerticalScrollIndicator={false}>
                <AppText variant="captionBold" color="sub" style={styles.modalSectionLabel}>
                  1. CHỌN CHUYẾN ĐI
                </AppText>

                {myTrips.map((trip) => {
                  const isSelected = selectedTrip?._id === trip._id;
                  return (
                    <TouchableOpacity
                      key={trip._id}
                      style={[styles.tripItem, isSelected && styles.tripItemSelected]}
                      onPress={() => {
                        setSelectedTrip(trip);
                        setSelectedDay(1);
                      }}
                      activeOpacity={0.7}
                    >
                      <View style={styles.tripItemRadio}>
                        {isSelected && <View style={styles.tripItemRadioInner} />}
                      </View>
                      <View style={styles.tripItemInfo}>
                        <AppText variant="bodyBold" color="main">
                          {trip.title}
                        </AppText>
                        <AppText variant="caption" color="muted">
                          {new Date(trip.startDate).toLocaleDateString('vi-VN')} -{' '}
                          {new Date(trip.endDate).toLocaleDateString('vi-VN')}
                        </AppText>
                      </View>
                    </TouchableOpacity>
                  );
                })}

                {selectedTrip && (
                  <>
                    <AppText
                      variant="captionBold"
                      color="sub"
                      style={[styles.modalSectionLabel, { marginTop: 16 }]}
                    >
                      2. CHỌN NGÀY TRONG LỊCH TRÌNH
                    </AppText>

                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.daySelectorRow}
                    >
                      {(selectedTrip.schedule || [{ day: 1 }]).map((sch) => {
                        const isDaySelected = selectedDay === sch.day;
                        return (
                          <TouchableOpacity
                            key={`day-${sch.day}`}
                            style={[styles.dayChip, isDaySelected && styles.dayChipActive]}
                            onPress={() => setSelectedDay(sch.day)}
                          >
                            <AppText
                              variant="bodyBold"
                              color={isDaySelected ? 'white' : 'main'}
                            >
                              Ngày {sch.day}
                            </AppText>
                          </TouchableOpacity>
                        );
                      })}
                    </ScrollView>

                    <AppText
                      variant="captionBold"
                      color="sub"
                      style={[styles.modalSectionLabel, { marginTop: 16 }]}
                    >
                      3. GHI CHÚ (TÙY CHỌN)
                    </AppText>

                    <AppTextInput
                      placeholder="Ví dụ: Tham quan buổi sáng, ăn tối, check-in..."
                      value={planNote}
                      onChangeText={setPlanNote}
                      containerStyle={{ marginTop: 6 }}
                    />

                    <AppButton
                      title="Xác nhận thêm vào lịch trình"
                      variant="primary"
                      size="md"
                      isLoading={isAddingToPlan}
                      onPress={handleConfirmAddToPlan}
                      style={{ marginTop: 20 }}
                    />
                  </>
                )}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* ================= MODAL 2: WRITE REVIEW ================= */}
      <Modal
        visible={isReviewModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsReviewModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { paddingBottom: insets.bottom + 16 }]}>
            <View style={styles.modalHeader}>
              <AppText variant="h3" color="main">
                Viết đánh giá địa điểm
              </AppText>
              <TouchableOpacity
                onPress={() => setIsReviewModalVisible(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <AppIcon name="close" size={18} color="#64748B" />
              </TouchableOpacity>
            </View>

            <AppText variant="captionBold" color="sub" style={styles.modalSectionLabel}>
              CHỌN MỨC ĐỘ HÀI LÒNG
            </AppText>

            <View style={styles.starPickerRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={`rate-star-${star}`}
                  onPress={() => setReviewRating(star)}
                  style={styles.starPickerButton}
                  activeOpacity={0.7}
                >
                  <AppIcon
                    name={star <= reviewRating ? 'star' : 'starRegular'}
                    size={32}
                    color="#FBBF24"
                  />
                </TouchableOpacity>
              ))}
            </View>

            <AppText
              variant="captionBold"
              color="sub"
              style={[styles.modalSectionLabel, { marginTop: 16 }]}
            >
              NỘI DUNG NHẬN XÉT
            </AppText>

            <AppTextInput
              placeholder="Chia sẻ trải nghiệm thực tế, dịch vụ, cảnh quan, món ăn..."
              value={reviewComment}
              onChangeText={setReviewComment}
              multiline
              numberOfLines={4}
              containerStyle={{ marginTop: 6 }}
              style={{ minHeight: 90, textAlignVertical: 'top' }}
            />

            <AppButton
              title="Gửi đánh giá"
              variant="primary"
              size="md"
              isLoading={isSubmittingReview}
              onPress={handleSubmitReview}
              style={{ marginTop: 20 }}
            />
          </View>
        </View>
      </Modal>

      {/* ================= MODAL 3: PHOTO VIEWER ================= */}
      <Modal
        visible={isPhotoViewerVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsPhotoViewerVisible(false)}
      >
        <View style={styles.photoViewerOverlay}>
          <View style={[styles.photoViewerHeader, { paddingTop: insets.top + 8 }]}>
            <AppText variant="h3" color="white">
              Ảnh địa điểm ({images.length})
            </AppText>
            <TouchableOpacity
              onPress={() => setIsPhotoViewerVisible(false)}
              style={styles.photoViewerClose}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <AppIcon name="close" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={images}
            keyExtractor={(_, i) => `gallery-${i}`}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.photoViewerSlide}>
                <Image
                  source={{ uri: item }}
                  style={styles.photoViewerImage}
                  resizeMode="contain"
                />
              </View>
            )}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
  },

  // 1. Header Bar
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: fontFamilies.heading.bold,
    fontSize: 18,
  },
  headerRightPlaceholder: {
    width: 36,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },

  // 2. Hero Image
  heroContainer: {
    width: '100%',
    height: 310,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: colors.background.subtle,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },

  // 3. Highlights Bar
  highlightsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingHorizontal: 4,
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  highlightLabel: {
    marginLeft: 6,
    fontSize: 13,
  },

  // 4. Title & Price Row
  titlePriceRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  placeName: {
    flex: 1,
    fontFamily: fontFamilies.heading.bold,
    fontSize: 22,
    lineHeight: 28,
    marginRight: 12,
  },
  priceText: {
    fontFamily: fontFamilies.heading.bold,
    fontSize: 20,
    color: '#0F172A',
  },

  // 5. Location Row
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  locationText: {
    marginLeft: 6,
    fontSize: 14,
    flex: 1,
  },

  // 6. Section Container
  sectionContainer: {
    marginTop: 22,
  },
  sectionTitle: {
    fontFamily: fontFamilies.heading.bold,
    fontSize: 18,
    color: '#0F172A',
  },
  descriptionText: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 22,
    color: '#64748B',
  },
  readMoreButton: {
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  readMoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0284C7',
  },

  // 7. Photos Section
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0284C7',
  },
  photosScroll: {
    paddingVertical: 12,
    gap: 12,
  },
  thumbnailContainer: {
    width: 82,
    height: 82,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: colors.background.subtle,
  },
  thumbnailSelected: {
    borderWidth: 2.5,
    borderColor: '#0284C7',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },

  // 8. Reviews Section
  reviewsTitleGroup: {
    flex: 1,
  },
  reviewsSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  writeReviewButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  emptyReviewsCard: {
    marginTop: 12,
    padding: 20,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyReviewsText: {
    textAlign: 'center',
    marginTop: 8,
    fontSize: 13,
    lineHeight: 18,
  },
  reviewCard: {
    marginTop: 12,
    padding: 14,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.background.subtle,
  },
  reviewUserInfo: {
    marginLeft: 10,
    flex: 1,
  },
  reviewStarsRow: {
    flexDirection: 'row',
    gap: 2,
  },
  deleteReviewBtn: {
    marginLeft: 10,
    padding: 4,
  },
  reviewComment: {
    marginTop: 10,
    fontSize: 13.5,
    lineHeight: 19,
    color: '#334155',
  },

  // 9. Bottom CTA Bar
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  addToPlanButton: {
    borderRadius: 30, // Smooth pill shape
    backgroundColor: '#0284C7', // Ocean Sky Blue
    height: 52,
  },

  // Modals
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    marginBottom: 16,
  },
  modalLoading: {
    padding: 30,
    alignItems: 'center',
  },
  modalEmptyTrips: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyTripsSub: {
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 20,
  },
  modalSectionLabel: {
    fontSize: 12,
    marginBottom: 8,
  },
  tripItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 8,
  },
  tripItemSelected: {
    borderColor: '#0284C7',
    backgroundColor: '#F0F9FF',
  },
  tripItemRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#0284C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  tripItemRadioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#0284C7',
  },
  tripItemInfo: {
    flex: 1,
  },
  daySelectorRow: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 6,
  },
  dayChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  dayChipActive: {
    backgroundColor: '#0284C7',
  },

  // Star Picker
  starPickerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  starPickerButton: {
    padding: 4,
  },

  // Photo Viewer
  photoViewerOverlay: {
    flex: 1,
    backgroundColor: '#000000',
  },
  photoViewerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  photoViewerClose: {
    padding: 6,
  },
  photoViewerSlide: {
    width: SCREEN_WIDTH,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoViewerImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 1.2,
  },
});
