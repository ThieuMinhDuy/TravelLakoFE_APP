import React from 'react';
import {
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { colors, typography, spacing, radius } from '@theme';
import { AppText } from './AppText';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface AppButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
}

export const AppButton: React.FC<AppButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  fullWidth = true,
  leftIcon,
  rightIcon,
  style,
}) => {
  const isInteractive = !disabled && !isLoading;

  const getContainerStyle = (): ViewStyle => {
    // Size paddings
    const sizePaddings: Record<ButtonSize, { paddingVertical: number; paddingHorizontal: number }> = {
      sm: { paddingVertical: spacing.xs + 2, paddingHorizontal: spacing.md },
      md: { paddingVertical: spacing.md, paddingHorizontal: spacing.lg },
      lg: { paddingVertical: spacing.lg - 2, paddingHorizontal: spacing.xl },
    };

    // Variant backgrounds and borders
    let variantStyle: ViewStyle = {};
    switch (variant) {
      case 'primary':
        variantStyle = {
          backgroundColor: isInteractive ? colors.primary.main : colors.background.disabled,
        };
        break;
      case 'secondary':
        variantStyle = {
          backgroundColor: isInteractive ? colors.primary.soft : colors.background.disabled,
          borderWidth: 1,
          borderColor: isInteractive ? colors.primary.border : colors.border.subtle,
        };
        break;
      case 'outline':
        variantStyle = {
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderColor: isInteractive ? colors.primary.main : colors.border.subtle,
        };
        break;
      case 'ghost':
        variantStyle = {
          backgroundColor: 'transparent',
        };
        break;
      case 'danger':
        variantStyle = {
          backgroundColor: isInteractive ? colors.status.error : colors.background.disabled,
        };
        break;
    }

    return {
      ...sizePaddings[size],
      ...variantStyle,
      borderRadius: radius.lg,
      alignSelf: fullWidth ? 'stretch' : 'flex-start',
      opacity: disabled ? 0.6 : 1,
    };
  };

  const getTextColor = (): 'white' | 'primary' | 'danger' | 'muted' => {
    if (disabled) return 'muted';
    switch (variant) {
      case 'primary':
      case 'danger':
        return 'white';
      case 'secondary':
      case 'outline':
      case 'ghost':
        return 'primary';
      default:
        return 'white';
    }
  };

  const spinnerColor = variant === 'primary' || variant === 'danger' ? colors.text.inverse : colors.primary.main;

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      disabled={!isInteractive}
      style={[styles.base, getContainerStyle(), style]}
    >
      {isLoading ? (
        <ActivityIndicator color={spinnerColor} size="small" />
      ) : (
        <View style={styles.contentRow}>
          {leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}
          <AppText
            variant={size === 'sm' ? 'captionMedium' : 'button'}
            color={getTextColor()}
          >
            {title}
          </AppText>
          {rightIcon && <View style={styles.rightIconContainer}>{rightIcon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftIconContainer: {
    marginRight: spacing.sm,
  },
  rightIconContainer: {
    marginLeft: spacing.sm,
  },
});

