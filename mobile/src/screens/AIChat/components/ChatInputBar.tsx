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
import { colors, radius, spacing, fontFamilies, shadows } from '@theme';

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

        <TouchableOpacity
          activeOpacity={0.7}
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
              size={15}
              color={canSend ? '#FFFFFF' : colors.text.muted}
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs + 2,
    paddingBottom: spacing.sm,
    backgroundColor: colors.background.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border.subtle,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.background.subtle,
    borderRadius: radius.full,
    paddingLeft: spacing.md,
    paddingRight: 4,
    paddingVertical: Platform.OS === 'ios' ? 6 : 4,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    minHeight: 46,
    maxHeight: 120,
  },
  input: {
    flex: 1,
    fontFamily: fontFamilies.sfProText.regular,
    fontSize: 15,
    color: colors.text.main,
    paddingVertical: Platform.OS === 'ios' ? 6 : 4,
    paddingRight: spacing.sm,
    lineHeight: 20,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Platform.OS === 'ios' ? 1 : 2,
  },
  sendButtonActive: {
    backgroundColor: colors.primary.main,
    ...shadows.sm,
  },
  sendButtonDisabled: {
    backgroundColor: 'transparent',
  },
});

