import React, { useState, useEffect } from 'react';
import {
  View,
  Modal,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faXmark,
  faPlus,
  faMagnifyingGlass,
  faLocationDot,
  faPen,
  faHotel,
  faUtensils,
  faMugSaucer,
  faCompass,
} from '@fortawesome/free-solid-svg-icons';
import { AppText, AppButton, AppTextInput } from '@components/common';
import { colors, spacing, radius, shadows } from '@theme';
import { tripService } from '@services';
import type { PlacePopulated, TripPlaceType } from '@appTypes';

export interface AddPlaceModalProps {
  visible: boolean;
  tripId: string;
  cityId?: string;
  activeDay: number;
  totalDays: number;
  onClose: () => void;
  onSuccess: () => void;
}

interface PlaceTypeConfig {
  type: TripPlaceType;
  label: string;
  icon: typeof faCompass;
}

const PLACE_TYPES: PlaceTypeConfig[] = [
  { type: 'Attraction', label: 'Điểm tham quan', icon: faCompass },
  { type: 'Hotel', label: 'Khách sạn', icon: faHotel },
  { type: 'Restaurant', label: 'Nhà hàng', icon: faUtensils },
  { type: 'Cafe', label: 'Quán cafe', icon: faMugSaucer },
];

export const AddPlaceModal: React.FC<AddPlaceModalProps> = ({
  visible,
  tripId,
  cityId,
  activeDay,
  totalDays,
  onClose,
  onSuccess,
}) => {
  const [selectedDay, setSelectedDay] = useState(activeDay);
  const [selectedType, setSelectedType] = useState<TripPlaceType>('Attraction');
  const [searchQuery, setSearchQuery] = useState('');
  const [note, setNote] = useState('');

  const [places, setPlaces] = useState<PlacePopulated[]>([]);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string>('');
  const [isLoadingPlaces, setIsLoadingPlaces] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (visible) {
      setSelectedDay(activeDay);
      loadPlaces(selectedType, searchQuery);
    }
  }, [visible, activeDay]);

  const loadPlaces = async (type: string, query: string) => {
    try {
      setIsLoadingPlaces(true);
      const data = await tripService.getPlacesByType(type, cityId, query);
      setPlaces(data);
      if (data.length > 0 && !selectedPlaceId) {
        setSelectedPlaceId(data[0]._id);
      }
    } catch (err) {
      console.warn('Lỗi tải danh sách địa điểm:', err);
    } finally {
      setIsLoadingPlaces(false);
    }
  };

  const handleTypeChange = (type: TripPlaceType) => {
    setSelectedType(type);
    setSelectedPlaceId('');
    loadPlaces(type, searchQuery);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    loadPlaces(selectedType, query);
  };

  const handleSubmit = async () => {
    if (!selectedPlaceId) {
      Alert.alert('Thông báo', 'Vui lòng chọn một địa điểm để thêm vào lịch trình.');
      return;
    }

    try {
      setIsSubmitting(true);
      await tripService.addPlace(tripId, {
        day: selectedDay,
        placeType: selectedType,
        placeId: selectedPlaceId,
        note: note.trim() || undefined,
      });

      Alert.alert('Thành công', 'Đã thêm địa điểm vào lịch trình thành công!', [
        {
          text: 'OK',
          onPress: () => {
            resetModal();
            onSuccess();
          },
        },
      ]);
    } catch (error: any) {
      Alert.alert('Lỗi', error?.message || 'Không thể thêm địa điểm. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetModal = () => {
    setNote('');
    setSearchQuery('');
    setSelectedPlaceId('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={resetModal}>
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <View style={styles.headerIcon}>
                <FontAwesomeIcon icon={faPlus} size={15} color={colors.primary.main} />
              </View>
              <AppText variant="h3" color="main">
                Thêm Địa Điểm Vào Ngày {selectedDay}
              </AppText>
            </View>

            <TouchableOpacity
              onPress={resetModal}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={styles.closeBtn}
            >
              <FontAwesomeIcon icon={faXmark} size={18} color={colors.text.muted} />
            </TouchableOpacity>
          </View>

          {/* Form Content */}
          <ScrollView
            style={styles.formScroll}
            contentContainerStyle={styles.formContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Chọn ngày nếu chuyến đi có nhiều ngày */}
            {totalDays > 1 && (
              <View style={styles.sectionWrap}>
                <AppText variant="captionMedium" color="main" style={styles.sectionTitle}>
                  Chọn ngày thêm vào:
                </AppText>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.daysRow}>
                  {Array.from({ length: totalDays }, (_, i) => i + 1).map((dayNum) => {
                    const isDayActive = dayNum === selectedDay;
                    return (
                      <TouchableOpacity
                        key={dayNum}
                        activeOpacity={0.8}
                        onPress={() => setSelectedDay(dayNum)}
                        style={[styles.dayChip, isDayActive && styles.dayChipActive]}
                      >
                        <AppText
                          variant={isDayActive ? 'captionMedium' : 'caption'}
                          color={isDayActive ? 'surface' : 'main'}
                        >
                          Ngày {dayNum}
                        </AppText>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            )}

            {/* Phân loại địa điểm */}
            <View style={styles.sectionWrap}>
              <AppText variant="captionMedium" color="main" style={styles.sectionTitle}>
                Loại địa điểm:
              </AppText>
              <View style={styles.typesRow}>
                {PLACE_TYPES.map((pt) => {
                  const isTypeActive = pt.type === selectedType;
                  return (
                    <TouchableOpacity
                      key={pt.type}
                      activeOpacity={0.8}
                      onPress={() => handleTypeChange(pt.type)}
                      style={[styles.typeChip, isTypeActive && styles.typeChipActive]}
                    >
                      <FontAwesomeIcon
                        icon={pt.icon}
                        size={12}
                        color={isTypeActive ? colors.primary.main : colors.text.muted}
                        style={styles.typeIcon}
                      />
                      <AppText
                        variant={isTypeActive ? 'captionMedium' : 'caption'}
                        color={isTypeActive ? 'primary' : 'muted'}
                      >
                        {pt.label}
                      </AppText>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Tìm kiếm địa điểm */}
            <AppTextInput
              placeholder="Tìm theo tên địa điểm..."
              value={searchQuery}
              onChangeText={handleSearchChange}
              leftIcon={<FontAwesomeIcon icon={faMagnifyingGlass} size={14} color={colors.text.muted} />}
              containerStyle={styles.searchBar}
            />

            {/* Danh sách địa điểm gợi ý */}
            <View style={styles.placesListContainer}>
              {isLoadingPlaces ? (
                <View style={styles.loaderWrap}>
                  <ActivityIndicator size="small" color={colors.primary.main} />
                  <AppText variant="caption" color="muted" style={styles.loaderText}>
                    Đang tìm địa điểm...
                  </AppText>
                </View>
              ) : places.length === 0 ? (
                <View style={styles.emptyWrap}>
                  <AppText variant="caption" color="muted">
                    Không tìm thấy địa điểm nào phù hợp.
                  </AppText>
                </View>
              ) : (
                places.slice(0, 10).map((place) => {
                  const isSelected = selectedPlaceId === place._id;
                  const thumb = place.image || (place.images && place.images[0]);

                  return (
                    <TouchableOpacity
                      key={place._id}
                      activeOpacity={0.8}
                      onPress={() => setSelectedPlaceId(place._id)}
                      style={[styles.placePickItem, isSelected && styles.placePickItemActive]}
                    >
                      {thumb ? (
                        <Image source={{ uri: thumb }} style={styles.placePickThumb} />
                      ) : (
                        <View style={styles.placePickPlaceholder}>
                          <FontAwesomeIcon icon={faLocationDot} size={14} color={colors.primary.main} />
                        </View>
                      )}

                      <View style={styles.placePickInfo}>
                        <AppText
                          variant={isSelected ? 'bodyBold' : 'body'}
                          color={isSelected ? 'primary' : 'main'}
                          numberOfLines={1}
                        >
                          {place.name}
                        </AppText>
                        {place.address && (
                          <AppText variant="caption" color="sub" numberOfLines={1}>
                            {place.address}
                          </AppText>
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                })
              )}
            </View>

            {/* Ghi chú */}
            <AppTextInput
              label="Ghi chú (tùy chọn)"
              placeholder="VD: Nhận phòng, Ăn tối, Chụp ảnh..."
              value={note}
              onChangeText={setNote}
              leftIcon={<FontAwesomeIcon icon={faPen} size={14} color={colors.text.muted} />}
              containerStyle={styles.noteInput}
            />
          </ScrollView>

          {/* Footer actions */}
          <View style={styles.footer}>
            <AppButton
              title="Thêm Vào Lịch Trình"
              onPress={handleSubmit}
              variant="primary"
              size="md"
              isLoading={isSubmitting}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: colors.background.app,
    borderTopLeftRadius: radius.round,
    borderTopRightRadius: radius.round,
    maxHeight: '92%',
    ...shadows.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.background.surface,
    borderTopLeftRadius: radius.round,
    borderTopRightRadius: radius.round,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    width: 30,
    height: 30,
    borderRadius: radius.pill,
    backgroundColor: colors.primary.soft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.xs,
  },
  closeBtn: {
    padding: spacing.xs,
  },
  formScroll: {
    maxHeight: 520,
  },
  formContent: {
    padding: spacing.md,
  },
  sectionWrap: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    marginBottom: spacing.xs,
  },
  daysRow: {
    gap: spacing.xs,
  },
  dayChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs + 2,
    borderRadius: radius.pill,
    backgroundColor: colors.background.surface,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  dayChipActive: {
    backgroundColor: colors.primary.main,
    borderColor: colors.primary.main,
  },
  typesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  typeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: colors.background.surface,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  typeChipActive: {
    borderColor: colors.primary.main,
    backgroundColor: colors.primary.soft,
  },
  typeIcon: {
    marginRight: 4,
  },
  searchBar: {
    marginBottom: spacing.sm,
  },
  placesListContainer: {
    marginBottom: spacing.md,
  },
  loaderWrap: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  loaderText: {
    marginTop: spacing.xs,
  },
  emptyWrap: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  placePickItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.background.surface,
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  placePickItemActive: {
    borderColor: colors.primary.main,
    backgroundColor: colors.primary.soft,
  },
  placePickThumb: {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
    marginRight: spacing.sm,
  },
  placePickPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
    backgroundColor: colors.background.subtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  placePickInfo: {
    flex: 1,
  },
  noteInput: {
    marginTop: spacing.xs,
  },
  footer: {
    padding: spacing.md,
    backgroundColor: colors.background.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border.subtle,
  },
});

