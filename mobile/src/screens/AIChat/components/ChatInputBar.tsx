import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { colors, spacing, fontFamilies, shadows } from '@theme';

interface ChatInputBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  isLoading?: boolean;
  placeholder?: string;
}

export const ChatInputBar: React.FC<ChatInputBarProps> = ({
  value,
  onChangeText,
  onSend,
  isLoading = false,
  placeholder = 'Nhập tin nhắn cho trợ lý AI...',
}) => {
  const canSend = value.trim().length > 0 && !isLoading;

  return (
    <View style={styles.container}>
      {/* 1. Khung nhập văn bản độc lập */}
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.text.muted}
          multiline
          maxLength={1000}
          textAlignVertical="center"
          returnKeyType="default"
        />
      </View>

      {/* 2. Nút gửi tin nhắn cố định riêng biệt bên phải (Không bị dính vào khung chat) */}
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={canSend ? onSend : undefined}
        disabled={!canSend}
        style={[
          styles.sendButton,
          canSend ? styles.sendButtonActive : styles.sendButtonDisabled,
        ]}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <FontAwesomeIcon
            icon={faPaperPlane}
            size={16}
            color={canSend ? '#FFFFFF' : colors.text.muted}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs + 2,
    paddingBottom: Platform.OS === 'ios' ? spacing.md : spacing.sm,
    backgroundColor: colors.background.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border.subtle,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: colors.background.subtle,
    borderRadius: 24,
    paddingHorizontal: spacing.md,
    paddingVertical: Platform.OS === 'ios' ? 8 : 4,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    minHeight: 46,
    maxHeight: 120,
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  input: {
    fontFamily: fontFamilies.sfProText.regular,
    fontSize: 15,
    color: colors.text.main,
    paddingVertical: Platform.OS === 'ios' ? 4 : 2,
    lineHeight: 20,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 1,
    backgroundColor: colors.background.subtle,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  sendButtonActive: {
    backgroundColor: colors.primary.main,
    borderColor: colors.primary.main,
    ...shadows.sm,
  },
  sendButtonDisabled: {
    backgroundColor: colors.background.subtle,
    opacity: 0.6,
  },
});
