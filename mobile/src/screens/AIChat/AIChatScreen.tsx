import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  ScreenWrapper,
  AppHeader,
  AppText,
  AppTextInput,
  AppButton,
  AppCard,
  AppBadge,
} from '@components/common';
import { colors, spacing } from '@theme';

export const AIChatScreen: React.FC = () => {
  const [inputMessage, setInputMessage] = useState('');

  return (
    <ScreenWrapper
      scrollable
      header={
        <AppHeader
          title="Trợ lý Gemini AI"
          subtitle="Tư vấn du lịch & tối ưu lịch trình"
        />
      }
      footer={
        <View style={styles.inputBar}>
          <AppTextInput
            placeholder="Hỏi AI bất kỳ điều gì về chuyến đi..."
            value={inputMessage}
            onChangeText={setInputMessage}
            containerStyle={styles.textInputContainer}
          />
          <AppButton
            title="Gửi"
            onPress={() => setInputMessage('')}
            size="md"
            fullWidth={false}
            style={styles.sendButton}
          />
        </View>
      }
    >
      <AppCard style={styles.assistantBubble}>
        <AppBadge label="Gemini AI" variant="teal" size="sm" />
        <AppText variant="body" color="main" style={styles.bubbleText}>
          Xin chào! Tôi có thể giúp bạn gợi ý các khách sạn tốt nhất, quán ăn ngon và lập lịch trình di chuyển tối ưu nhất tại Đà Nẵng, Hà Nội hay Hội An. Bạn dự định đi mấy ngày?
        </AppText>
      </AppCard>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  assistantBubble: {
    backgroundColor: colors.primary.soft,
    borderColor: colors.primary.border,
    alignSelf: 'flex-start',
    maxWidth: '90%',
    marginBottom: spacing.md,
  },
  bubbleText: {
    marginTop: spacing.xs,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  textInputContainer: {
    flex: 1,
    marginBottom: 0,
  },
  sendButton: {
    minWidth: 70,
    height: 48,
  },
});

