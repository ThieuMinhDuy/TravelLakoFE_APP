import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faHouse,
  faBookOpen,
  faEnvelope,
  faCalendarDays,
  faHeart,
  faCircleUser,
} from '@fortawesome/free-solid-svg-icons';
import { faClaude } from '@fortawesome/free-brands-svg-icons';
import { colors } from '@theme';

// ----------------------------------------------------------------------------
// Danh mục icon chính cho Navbar Footer & Common UI
// ----------------------------------------------------------------------------
export type AppIconName =
  | 'home'
  | 'diary'
  | 'chat'
  | 'claude'
  | 'schedule'
  | 'saved'
  | 'profile';

const NAVBAR_ICONS: Record<AppIconName, IconDefinition> = {
  home: faHouse,
  diary: faBookOpen,
  chat: faEnvelope,
  claude: faClaude,
  schedule: faCalendarDays,
  saved: faHeart,
  profile: faCircleUser,
};

const colorMap: Record<string, string> = {
  primary: colors.primary.main,
  main: colors.text.main,
  sub: colors.text.sub,
  muted: colors.text.muted,
};

export interface AppIconProps {
  name: AppIconName;
  size?: number;
  color?: string;
  badge?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const AppIcon: React.FC<AppIconProps> = ({
  name,
  size = 22,
  color = colors.text.sub,
  badge = false,
  style,
}) => {
  const icon = NAVBAR_ICONS[name] ?? faHouse;
  const resolvedColor = colorMap[color] || color;

  return (
    <View style={[styles.container, style]}>
      <FontAwesomeIcon icon={icon} size={size} color={resolvedColor} />
      {badge && <View style={styles.badgeDot} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badgeDot: {
    position: 'absolute',
    top: -2,
    right: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
});
