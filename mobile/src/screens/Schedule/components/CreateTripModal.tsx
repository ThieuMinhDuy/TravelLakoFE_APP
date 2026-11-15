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
  faSuitcaseRolling,
  faCity,
  faCalendarDays,
  faWallet,
  faPen,
} from '@fortawesome/free-solid-svg-icons';
import { AppText, AppButton, AppTextInput } from '@components/common';
import { colors, spacing, radius, shadows } from '@theme';
import { tripService } from '@services';
import type { TripCity } from '@appTypes';

export interface CreateTripModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateTripModal: React.FC<CreateTripModalProps> = ({
  visible,
  onClose,
  onSuccess,
}) => {
  const [title, setTitle] = useState('');
  const [selectedCityId, setSelectedCityId] = useState<string>('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('');

  const [cities, setCities] = useState<TripCity[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Lấy danh sách thành phố khi modal mở ra
  useEffect(() => {
    if (visible) {
      loadCities();
    }
  }, [visible]);

  const loadCities = async () => {
    try {
      setLoadingCities(true);
      const data = await tripService.getCities();
      setCities(data);
      if (data.length > 0 && !selectedCityId) {
        setSelectedCityId(data[0]._id);
      }
    } catch (err) {
      console.warn('Lỗi tải danh sách thành phố:', err);
    } finally {
      setLoadingCities(false);
    }
  };

  const normalizeDateInput = (val: string): string => {
    const trimmed = val.trim();
    const parts = trimmed.split(/[-/]/);
    if (parts.length === 3) {
      if (parts[0].length === 4) {
        return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
      } else if (parts[2].length === 4) {
        return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
      }
    }
    return trimmed;
  };

  const handleCreateTrip = async () => {
    if (!title.trim()) {
      Alert.alert('Thông báo', 'Vui lòng nhập tên chuyến đi.');
      return;
    }
    if (!selectedCityId) {
      Alert.alert('Thông báo', 'Vui lòng chọn thành phố điểm đến.');
      return;
    }
    if (!startDate.trim() || !endDate.trim()) {
      Alert.alert('Thông báo', 'Vui lòng nhập ngày bắt đầu và kết thúc.');
      return;
    }

    const normStart = normalizeDateInput(startDate);
    const normEnd = normalizeDateInput(endDate);
    const numBudget = Number(budget.replace(/\D/g, '')) || 0;

    try {
      setIsSubmitting(true);
      await tripService.createTrip({
        title: title.trim(),
        city: selectedCityId,
        startDate: normStart,
        endDate: normEnd,
        budget: numBudget,
      });

      Alert.alert('Thành công', 'Chuyến đi mới đã được tạo thành công!', [
        {
          text: 'OK',
          onPress: () => {
            resetForm();
            onSuccess();
          },
        },
      ]);
    } catch (error: any) {
      Alert.alert('Lỗi', error?.message || 'Không thể tạo chuyến đi. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setStartDate('');
    setEndDate('');
    setBudget('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={resetForm}>
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <View style={styles.headerIcon}>
                <FontAwesomeIcon icon={faSuitcaseRolling} size={16} color={colors.primary.main} />
              </View>
              <AppText variant="h3" color="main">
                Tạo Chuyến Đi Mới
              </AppText>
            </View>

            <TouchableOpacity
              onPress={resetForm}
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
            {/* Tên chuyến đi */}
            <AppTextInput
              label="Tên chuyến đi *"
              placeholder="VD: Du lịch Đà Nẵng 3 ngày 2 đêm"
              value={title}
              onChangeText={setTitle}
              leftIcon={<FontAwesomeIcon icon={faPen} size={14} color={colors.text.muted} />}
            />

            {/* Chọn thành phố */}
            <View style={styles.sectionRow}>
              <FontAwesomeIcon icon={faCity} size={14} color={colors.primary.main} />
              <AppText variant="captionMedium" color="main" style={styles.sectionLabel}>
                Điểm đến (Thành phố) *
              </AppText>
            </View>

            {loadingCities ? (
              <ActivityIndicator size="small" color={colors.primary.main} style={styles.cityLoader} />
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.citiesScroll}
              >
                {cities.map((city) => {
                  const isSelected = selectedCityId === city._id;
                  return (
                    <TouchableOpacity
                      key={city._id}
                      activeOpacity={0.8}
                      onPress={() => setSelectedCityId(city._id)}
                      style={[styles.cityChip, isSelected && styles.cityChipActive]}
                    >
                      {city.image ? (
                        <Image source={{ uri: city.image }} style={styles.cityThumb} />
                      ) : (
                        <View style={styles.cityThumbPlaceholder}>
                          <FontAwesomeIcon icon={faCity} size={12} color={colors.primary.main} />
                        </View>
                      )}
                      <AppText
                        variant={isSelected ? 'captionMedium' : 'caption'}
                        color={isSelected ? 'primary' : 'main'}
                      >
                        {city.name}
                      </AppText>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}

            {/* Thời gian */}
            <View style={styles.datesRow}>
              <View style={styles.dateCol}>
                <AppTextInput
                  label="Ngày bắt đầu *"
                  placeholder="DD/MM/YYYY"
                  value={startDate}
                  onChangeText={setStartDate}
                  leftIcon={
                    <FontAwesomeIcon icon={faCalendarDays} size={14} color={colors.text.muted} />
                  }
                />
              </View>
              <View style={styles.dateCol}>
                <AppTextInput
                  label="Ngày kết thúc *"
                  placeholder="DD/MM/YYYY"
                  value={endDate}
                  onChangeText={setEndDate}
                  leftIcon={
                    <FontAwesomeIcon icon={faCalendarDays} size={14} color={colors.text.muted} />
                  }
                />
              </View>
            </View>

            {/* Ngân sách */}
            <AppTextInput
              label="Ngân sách dự kiến (VNĐ)"
              placeholder="VD: 5000000"
              value={budget}
              onChangeText={setBudget}
              keyboardType="numeric"
              leftIcon={<FontAwesomeIcon icon={faWallet} size={14} color={colors.text.muted} />}
            />
          </ScrollView>

          {/* Footer actions */}
          <View style={styles.footer}>
            <AppButton
              title="Tạo Chuyến Đi"
              onPress={handleCreateTrip}
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
    maxHeight: '90%',
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
    width: 32,
    height: 32,
    borderRadius: radius.pill,
    backgroundColor: colors.primary.soft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  closeBtn: {
    padding: spacing.xs,
  },
  formScroll: {
    maxHeight: 460,
  },
  formContent: {
    padding: spacing.md,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  sectionLabel: {
    marginLeft: spacing.xs,
  },
  cityLoader: {
    marginVertical: spacing.md,
  },
  citiesScroll: {
    paddingVertical: spacing.xs,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  cityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: colors.background.surface,
    borderWidth: 1.2,
    borderColor: colors.border.subtle,
  },
  cityChipActive: {
    borderColor: colors.primary.main,
    backgroundColor: colors.primary.soft,
  },
  cityThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    marginRight: spacing.xs,
  },
  cityThumbPlaceholder: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.background.subtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.xs,
  },
  datesRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  dateCol: {
    flex: 1,
  },
  footer: {
    padding: spacing.md,
    backgroundColor: colors.background.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border.subtle,
  },
});

