import React from 'react';
import { View, Modal, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { AppText, AppButton, AppCard } from '@components/common';
import { colors, radius, spacing } from '@theme';

interface ClearChatModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export const ClearChatModal: React.FC<ClearChatModalProps> = ({
  visible,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <AppCard style={styles.card}>
                <View style={styles.iconContainer}>
                  <FontAwesomeIcon
                    icon={faTrashCan}
                    size={24}
                    color={colors.status.error}
                  />
                </View>

                <AppText variant="h3" color="main" style={styles.title}>
                  Xóa lịch sử trò chuyện?
                </AppText>

                <AppText variant="body" color="sub" style={styles.description}>
                  Toàn bộ tin nhắn với trợ lý du lịch AI sẽ bị xóa vĩnh viễn khỏi tài khoản của bạn.
                </AppText>

                <View style={styles.buttonRow}>
                  <View style={styles.btnCol}>
                    <AppButton
                      title="Hủy"
                      variant="outline"
                      size="md"
                      onPress={onClose}
                      disabled={isLoading}
                    />
                  </View>
                  <View style={styles.btnCol}>
                    <AppButton
                      title="Xóa vĩnh viễn"
                      variant="danger"
                      size="md"
                      onPress={onConfirm}
                      isLoading={isLoading}
                    />
                  </View>
                </View>
              </AppCard>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay.backdrop,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    width: '100%',
    maxWidth: 380,
  },
  card: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.status.errorBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: {
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  description: {
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    gap: spacing.sm,
  },
  btnCol: {
    flex: 1,
  },
});

