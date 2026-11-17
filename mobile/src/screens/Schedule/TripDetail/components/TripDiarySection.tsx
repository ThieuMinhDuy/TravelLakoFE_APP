import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
} from 'react-native';
import {
  launchImageLibrary,
  launchCamera,
  Asset,
} from 'react-native-image-picker';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faBookOpen,
  faImage,
  faCamera,
  faXmark,
  faFloppyDisk,
  faPen,
  faImages,
} from '@fortawesome/free-solid-svg-icons';
import { AppText, AppButton, AppTextInput, AppCard } from '@components/common';
import { colors, spacing, radius, shadows } from '@theme';
import { tripService } from '@services';
import type { TripDiary } from '@appTypes';

export interface TripDiarySectionProps {
  tripId: string;
  diary?: TripDiary;
  onDiaryUpdated: () => void;
}

export const TripDiarySection: React.FC<TripDiarySectionProps> = ({
  tripId,
  diary,
  onDiaryUpdated,
}) => {
  const [notes, setNotes] = useState(diary?.notes || '');
  const [photos, setPhotos] = useState<string[]>(diary?.photos || []);
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  useEffect(() => {
    setNotes(diary?.notes || '');
    setPhotos(diary?.photos || []);
  }, [diary]);

  // Lưu ghi chú nhật ký
  const handleSaveNotes = async () => {
    try {
      setIsSavingNotes(true);
      await tripService.updateDiary(tripId, {
        notes: notes.trim(),
        photos,
      });

      Alert.alert('Thành công', 'Đã lưu ghi chú nhật ký chuyến đi.');
      onDiaryUpdated();
    } catch (err: any) {
      Alert.alert('Lỗi', err?.message || 'Không thể lưu ghi chú.');
    } finally {
      setIsSavingNotes(false);
    }
  };

  // Upload file ảnh lên backend qua POST /upload rồi lưu vào diary
  const uploadAndSavePhoto = async (asset: Asset) => {
    if (!asset.uri) return;

    try {
      setIsUploading(true);

      const fileData = {
        uri: asset.uri,
        name: asset.fileName || `trip_photo_${Date.now()}.jpg`,
        type: asset.type || 'image/jpeg',
      };

      // 1. Gọi API POST /upload
      const res = await tripService.uploadImage(fileData);
      const uploadedUrl = res.url;

      if (!uploadedUrl) {
        throw new Error('Không nhận được đường dẫn ảnh từ máy chủ.');
      }

      // 2. Cập nhật mảng ảnh mới
      const newPhotos = [...photos, uploadedUrl];
      setPhotos(newPhotos);

      // 3. Gọi PUT /trips/:id/diary lưu URL mới vào database
      await tripService.updateDiary(tripId, {
        notes: notes.trim(),
        photos: newPhotos,
      });

      Alert.alert('Thành công', 'Đã tải ảnh kỷ niệm lên chuyến đi!');
      onDiaryUpdated();
    } catch (err: any) {
      Alert.alert('Lỗi tải ảnh', err?.message || 'Không thể tải ảnh lên máy chủ.');
    } finally {
      setIsUploading(false);
    }
  };

  // Mở thư viện ảnh
  const handlePickFromLibrary = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
        selectionLimit: 1,
      });

      if (result.assets && result.assets.length > 0) {
        await uploadAndSavePhoto(result.assets[0]);
      }
    } catch (err) {
      console.warn('Lỗi chọn ảnh từ thư viện:', err);
    }
  };

  // Mở Camera chụp ảnh
  const handleCaptureCamera = async () => {
    try {
      const result = await launchCamera({
        mediaType: 'photo',
        quality: 0.8,
        saveToPhotos: true,
      });

      if (result.assets && result.assets.length > 0) {
        await uploadAndSavePhoto(result.assets[0]);
      }
    } catch (err) {
      console.warn('Lỗi chụp ảnh:', err);
    }
  };

  // Xóa ảnh khỏi nhật ký
  const handleDeletePhoto = (photoUrl: string) => {
    Alert.alert(
      'Xóa ảnh kỷ niệm',
      'Bạn có chắc chắn muốn xóa ảnh này khỏi nhật ký chuyến đi?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa ảnh',
          style: 'destructive',
          onPress: async () => {
            const updated = photos.filter((p) => p !== photoUrl);
            setPhotos(updated);
            try {
              await tripService.updateDiary(tripId, {
                notes: notes.trim(),
                photos: updated,
              });
              onDiaryUpdated();
            } catch (err: any) {
              Alert.alert('Lỗi', err?.message || 'Không thể xóa ảnh lúc này.');
            }
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      {/* 1. Phần Ghi Chú Nhật Ký */}
      <AppCard style={styles.card}>
        <View style={styles.sectionHeader}>
          <View style={styles.iconCircle}>
            <FontAwesomeIcon icon={faPen} size={14} color={colors.primary.main} />
          </View>
          <View style={styles.headerTextGroup}>
            <AppText variant="h3" color="main">
              Ghi Chú Nhật Ký
            </AppText>
            <AppText variant="caption" color="sub">
              Lưu giữ những suy nghĩ và cảm xúc đáng nhớ
            </AppText>
          </View>
        </View>

        <AppTextInput
          placeholder="Hãy viết lại những trải nghiệm, món ăn ngon hoặc kỷ niệm đáng nhớ trong hành trình này..."
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={4}
          containerStyle={styles.notesInputContainer}
          style={styles.notesInput}
        />

        <View style={styles.saveBtnRow}>
          <AppButton
            title="Lưu Ghi Chú"
            onPress={handleSaveNotes}
            variant="secondary"
            size="sm"
            isLoading={isSavingNotes}
            leftIcon={<FontAwesomeIcon icon={faFloppyDisk} size={13} color={colors.primary.main} />}
            fullWidth={false}
          />
        </View>
      </AppCard>

      {/* 2. Phần Ảnh Kỷ Niệm */}
      <AppCard style={styles.card}>
        <View style={styles.sectionHeader}>
          <View style={styles.iconCircle}>
            <FontAwesomeIcon icon={faImages} size={14} color={colors.primary.main} />
          </View>
          <View style={styles.headerTextGroup}>
            <AppText variant="h3" color="main">
              Album Ảnh Kỷ Niệm ({photos.length})
            </AppText>
            <AppText variant="caption" color="sub">
              Những khoảnh khắc đẹp trong chuyến đi
            </AppText>
          </View>
        </View>

        {/* Action Buttons: Thư viện & Camera */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handlePickFromLibrary}
            disabled={isUploading}
            style={[styles.actionBtn, styles.libraryBtn]}
          >
            <FontAwesomeIcon icon={faImage} size={14} color={colors.primary.main} />
            <AppText variant="captionMedium" color="primary" style={styles.actionBtnText}>
              Chọn từ Thư Viện
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleCaptureCamera}
            disabled={isUploading}
            style={[styles.actionBtn, styles.cameraBtn]}
          >
            <FontAwesomeIcon icon={faCamera} size={14} color={colors.nature.dark} />
            <AppText variant="captionMedium" color="main" style={styles.actionBtnText}>
              Chụp Ảnh Mới
            </AppText>
          </TouchableOpacity>
        </View>

        {/* Trạng thái đang tải ảnh lên */}
        {isUploading && (
          <View style={styles.uploadingBox}>
            <ActivityIndicator size="small" color={colors.primary.main} />
            <AppText variant="caption" color="primary" style={styles.uploadingText}>
              Đang tải ảnh lên Cloudinary...
            </AppText>
          </View>
        )}

        {/* Grid danh sách ảnh */}
        {photos.length === 0 ? (
          <View style={styles.emptyPhotos}>
            <FontAwesomeIcon icon={faImage} size={32} color={colors.border.subtle} />
            <AppText variant="caption" color="muted" style={styles.emptyPhotosText}>
              Chưa có hình ảnh kỷ niệm nào được lưu.
            </AppText>
          </View>
        ) : (
          <View style={styles.photosGrid}>
            {photos.map((url, idx) => (
              <View key={idx} style={styles.photoItemWrap}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => setPreviewImageUrl(url)}
                  style={styles.photoThumbTouch}
                >
                  <Image source={{ uri: url }} style={styles.photoThumb} resizeMode="cover" />
                </TouchableOpacity>

                {/* Nút xóa ảnh */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => handleDeletePhoto(url)}
                  style={styles.deletePhotoBtn}
                  hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                >
                  <FontAwesomeIcon icon={faXmark} size={11} color={colors.text.inverse} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </AppCard>

      {/* Modal Xem Ảnh Phóng To */}
      <Modal
        visible={!!previewImageUrl}
        transparent
        animationType="fade"
        onRequestClose={() => setPreviewImageUrl(null)}
      >
        <View style={styles.previewModalOverlay}>
          <TouchableOpacity
            style={styles.closePreviewBtn}
            onPress={() => setPreviewImageUrl(null)}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <FontAwesomeIcon icon={faXmark} size={22} color={colors.text.inverse} />
          </TouchableOpacity>

          {previewImageUrl && (
            <Image
              source={{ uri: previewImageUrl }}
              style={styles.fullPreviewImage}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: spacing.xxl,
  },
  card: {
    marginBottom: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: radius.pill,
    backgroundColor: colors.primary.soft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  headerTextGroup: {
    flex: 1,
  },
  notesInputContainer: {
    marginBottom: spacing.sm,
  },
  notesInput: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  saveBtnRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  libraryBtn: {
    backgroundColor: colors.primary.soft,
    borderColor: colors.primary.border,
  },
  cameraBtn: {
    backgroundColor: colors.nature.light,
    borderColor: colors.nature.main,
  },
  actionBtnText: {
    marginLeft: spacing.xs,
  },
  uploadingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    backgroundColor: colors.primary.soft,
    borderRadius: radius.md,
    marginBottom: spacing.md,
  },
  uploadingText: {
    marginLeft: spacing.xs,
  },
  emptyPhotos: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
  },
  emptyPhotosText: {
    marginTop: spacing.xs,
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  photoItemWrap: {
    width: '31%',
    aspectRatio: 1,
    borderRadius: radius.md,
    overflow: 'hidden',
    position: 'relative',
  },
  photoThumbTouch: {
    width: '100%',
    height: '100%',
  },
  photoThumb: {
    width: '100%',
    height: '100%',
  },
  deletePhotoBtn: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closePreviewBtn: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    padding: spacing.xs,
  },
  fullPreviewImage: {
    width: '92%',
    height: '80%',
  },
});

