import React from 'react';
import { Text, TextProps, StyleSheet, TextStyle } from 'react-native';
import { colors, typography } from '@theme';
import type { TypographyVariant } from '@theme';

export type TextColorVariant =
  | 'main'
  | 'sub'
  | 'muted'
  | 'primary'
  | 'white'
  | 'success'
  | 'danger'
  | 'sand';

export interface AppTextProps extends TextProps {
  variant?: TypographyVariant;
  color?: TextColorVariant | string;
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  children: React.ReactNode;
}

const colorMap: Record<TextColorVariant, string> = {
  main: colors.text.main,
  sub: colors.text.sub,
  muted: colors.text.muted,
  primary: colors.primary.main,
  white: colors.text.inverse,
  success: colors.status.success,
  danger: colors.status.error,
  sand: colors.sand.main,
};

export const AppText: React.FC<AppTextProps> = ({
  variant = 'body',
  color = 'main',
  align,
  style,
  children,
  ...rest
}) => {
  const resolvedColor = colorMap[color as TextColorVariant] || color;

  const combinedStyles: TextStyle = {
    ...typography[variant],
    color: resolvedColor,
    ...(align && { textAlign: align }),
  };

  return (
    <Text style={[combinedStyles, style]} {...rest}>
      {children}
    </Text>
  );
};

