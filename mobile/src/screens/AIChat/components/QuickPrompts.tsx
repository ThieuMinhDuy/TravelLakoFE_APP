import React from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faCompass,
  faUtensils,
  faHotel,
  faWallet,
  faMugSaucer,
} from '@fortawesome/free-solid-svg-icons';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { AppText } from '@components/common';
import { colors, radius, spacing } from '@theme';

interface PromptItem {
  id: string;
  text: string;
  icon: IconDefinition;
}

const PROMPT_ITEMS: PromptItem[] = [
  {
    id: '1',
    text: 'Lịch trình Đà Nẵng 3N2Đ',
    icon: faCompass,
  },
  {
    id: '2',
    text: 'Món ăn ngon tại Hà Nội',
    icon: faUtensils,
  },
  {
    id: '3',
    text: 'Khách sạn view biển Phú Quốc',
    icon: faHotel,
  },
  {
    id: '4',
    text: 'Du lịch Đà Lạt tiết kiệm',
    icon: faWallet,
  },
  {
    id: '5',
    text: 'Quán cafe đẹp tại Hội An',
    icon: faMugSaucer,
  },
];

interface QuickPromptsProps {
  onSelectPrompt: (promptText: string) => void;
}

export const QuickPrompts: React.FC<QuickPromptsProps> = ({ onSelectPrompt }) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {PROMPT_ITEMS.map((item) => (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.7}
            onPress={() => onSelectPrompt(item.text)}
            style={styles.chip}
          >
            <FontAwesomeIcon
              icon={item.icon}
              size={13}
              color={colors.primary.main}
              style={styles.icon}
            />
            <AppText variant="captionMedium" color="main">
              {item.text}
            </AppText>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.xs,
    backgroundColor: colors.background.app,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    gap: spacing.xs + 2,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 3,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  icon: {
    marginRight: 6,
  },
});

