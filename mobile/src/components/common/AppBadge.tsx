import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing, radius } from '@theme';
import { AppText } from './AppText';

export type BadgeVariant = 'primary' | 'teal' | 'sand' | 'slate' | 'danger';
export type BadgeSize = 'sm' | 'md';

export interface AppBadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  style?: ViewStyle;
}

export const AppBadge: React.FC<AppBadgeProps> = ({
  label,
  variant = 'primary',
  size = 'md',
  style,
}) => {
  const getBadgeColors = () => {
    switch (variant) {
      case 'primary':
        return { bg: colors.primary.soft, text: colors.primary.main };
      case 'teal':
        return { bg: colors.nature.light, text: colors.nature.main };
      case 'sand':
        return { bg: colors.sand.light, text: colors.sand.main };
      case 'danger':
        return { bg: colors.status.errorBg, text: colors.status.error };
      case 'slate':
      default:
        return { bg: colors.background.subtle, text: colors.text.sub };
    }
  };

  const palette = getBadgeColors();
  const isSmall = size === 'sm';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: palette.bg,
          paddingHorizontal: isSmall ? spacing.xs + 2 : spacing.sm + 2,
          paddingVertical: isSmall ? spacing.xxs : spacing.xs,
        },
        style,
      ]}
    >
      <AppText
        variant={isSmall ? 'tiny' : 'captionMedium'}
        style={{ color: palette.text }}
      >
        {label}
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: radius.full,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

