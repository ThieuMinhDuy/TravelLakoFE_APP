import React, { useState } from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faXmark,
  faWandMagicSparkles,
  faRoute,
  faLightbulb,
} from '@fortawesome/free-solid-svg-icons';
import { AppText, AppButton, AppTextInput } from '@components/common';
import { colors, spacing, radius, shadows } from '@theme';
import { aiService } from '@services';

export interface AIOptimizeModalProps {
  visible: boolean;
  tripId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const AIOptimizeModal: React.FC<AIOptimizeModalProps> = ({
  visible,
  tripId,
  onClose,
  onSuccess,
}) => {
  const [notes, setNotes] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleOptimize = async () => {
    try {
      setIsOptimizing(true);
      await aiService.optimizeTrip(tripId, {
        notes: notes.trim() || undefined,
        preview: false,
      });

      Alert.alert(
        'Tối ưu thành công! 🎉',
        'Gemini AI đã tính toán tọa độ địa lý và sắp xếp lại thứ tự các địa điểm tối ưu nhất cho hành trình của bạn.',
        [
          {
            text: 'Tuyệt vời',
            onPress: () => {
              setNotes('');
              onClose();
              onSuccess();
            },
          },
        ],
      );
    } catch (err: any) {
      Alert.alert(
        'Lỗi tối ưu hóa',
        err?.message || 'Không thể tối ưu lộ trình lúc này. Vui lòng thử lại sau.',
      );
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleClose = () => {
    setNotes('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <View style={styles.headerIcon}>
                <FontAwesomeIcon
                  icon={faWandMagicSparkles}
                  size={16}
                  color={colors.primary.main}
                />
              </View>
              <AppText variant="h3" color="main">
                Tối Ưu Lộ Trình Bằng AI
              </AppText>
            </View>

            <TouchableOpacity
              onPress={handleClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={styles.closeBtn}
            >
              <FontAwesomeIcon icon={faXmark} size={18} color={colors.text.muted} />
            </TouchableOpacity>
          </View>

          {/* Body */}
          <View style={styles.body}>
            {/* Giới thiệu tính năng */}
            <View style={styles.introCard}>
              <FontAwesomeIcon
                icon={faRoute}
                size={24}
                color={colors.primary.main}
                style={styles.introIcon}
              />
              <View style={styles.introTextWrap}>
                <AppText variant="bodyBold" color="main">
                  Tự động tối ưu thứ tự di chuyển
                </AppText>
                <AppText variant="caption" color="sub" style={styles.introDesc}>
                  AI sẽ dựa vào tọa độ GPS thực tế của các địa điểm để sắp xếp thứ tự ngắn nhất, tránh đi vòng và tiết kiệm thời gian.
                </AppText>
              </View>
            </View>

            {/* Ô nhập ghi chú tùy chọn */}
            <View style={styles.tipRow}>
              <FontAwesomeIcon
                icon={faLightbulb}
                size={13}
                color={colors.sand.main}
                style={styles.tipIcon}
              />
              <AppText variant="caption" color="sub">
                Bạn có thể thêm yêu cầu đặc biệt (tùy chọn):
              </AppText>
            </View>

            <AppTextInput
              placeholder="VD: Hãy ghé quán cafe vào buổi sáng, xếp nhà hàng ăn tối cuối cùng..."
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
              containerStyle={styles.notesInput}
            />

            {/* CTA Button */}
            <AppButton
              title="Tối Ưu Hóa Ngay"
              onPress={handleOptimize}
              variant="primary"
              size="md"
              isLoading={isOptimizing}
              leftIcon={
                <FontAwesomeIcon
                  icon={faWandMagicSparkles}
                  size={15}
                  color={colors.text.inverse}
                />
              }
              style={styles.submitBtn}
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
    marginRight: spacing.xs,
  },
  closeBtn: {
    padding: spacing.xs,
  },
  body: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  introCard: {
    flexDirection: 'row',
    backgroundColor: colors.primary.soft,
    padding: spacing.md,
    borderRadius: radius.lg,
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  introIcon: {
    marginRight: spacing.sm,
    marginTop: 2,
  },
  introTextWrap: {
    flex: 1,
  },
  introDesc: {
    marginTop: spacing.xxs,
    lineHeight: 18,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  tipIcon: {
    marginRight: spacing.xs,
  },
  notesInput: {
    marginBottom: spacing.lg,
  },
  submitBtn: {
    marginTop: spacing.xs,
  },
});

