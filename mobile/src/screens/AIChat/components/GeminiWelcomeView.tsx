import React from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faWandMagicSparkles,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { AppText } from '@components/common';
import { colors, radius, spacing } from '@theme';

const SUGGESTIONS = [
  'Lên lịch trình Đà Nẵng 3N2Đ',
  'Khách sạn view biển Phú Quốc',
  'Món ngon đặc sản Hà Nội',
  'Du lịch tiết kiệm với ngân sách 4 triệu',
];

interface GeminiWelcomeViewProps {
  userName: string;
  onSelectPrompt: (promptText: string) => void;
}

export const GeminiWelcomeView: React.FC<GeminiWelcomeViewProps> = ({
  userName,
  onSelectPrompt,
}) => {
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* 1. Biểu tượng AI lấp lánh (Gemini Sparkle) */}
      <View style={styles.sparkleCircle}>
        <FontAwesomeIcon icon={faWandMagicSparkles} size={30} color={colors.primary.main} />
      </View>

      {/* 2. Lời chào */}
      <AppText variant="h1" color="main" align="center" style={styles.greetingTitle}>
        Xin chào, {userName}!
      </AppText>
      <AppText variant="h3" color="primary" align="center" style={styles.greetingSubTitle}>
        Hôm nay bạn muốn đi đâu?
      </AppText>

      {/* 3. Danh sách các câu hỏi gợi ý đơn giản (giãn cách rộng rãi với lời chào) */}
      <View style={styles.suggestionsList}>
        {SUGGESTIONS.map((promptText, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.7}
            onPress={() => onSelectPrompt(promptText)}
            style={styles.suggestionCard}
          >
            <AppText variant="body" color="main" style={styles.suggestionText}>
              {promptText}
            </AppText>
            <FontAwesomeIcon icon={faChevronRight} size={12} color={colors.text.muted} />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxl,
    alignItems: 'center',
  },
  sparkleCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary.soft,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.primary.border,
    marginBottom: spacing.md,
  },
  greetingTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: spacing.xxs,
  },
  greetingSubTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: spacing.xxs,
  },
  suggestionsList: {
    width: '100%',
    marginTop: 36, // Giãn cách rộng rãi hơn với phần lời chào bên trên
    gap: 12,
  },
  suggestionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: 15,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  suggestionText: {
    fontSize: 14.5,
    flex: 1,
    marginRight: spacing.sm,
  },
});
