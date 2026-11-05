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
  faBell,
  faGear,
  faMagnifyingGlass,
  faSliders,
  faStar as faStarSolid,
  faLocationDot,
  faBookmark as faBookmarkSolid,
  faUmbrellaBeach,
  faMountain,
  faHotel,
  faUtensils,
  faMugSaucer,
  faCompass,
  faXmark,
  faArrowUpRightFromSquare,
} from '@fortawesome/free-solid-svg-icons';
import {
  faBookmark as faBookmarkRegular,
  faStar as faStarRegular,
  faBell as faBellRegular,
} from '@fortawesome/free-regular-svg-icons';
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
  | 'profile'
  | 'bell'
  | 'bellRegular'
  | 'gear'
  | 'settings'
  | 'search'
  | 'filter'
  | 'star'
  | 'starRegular'
  | 'location'
  | 'bookmark'
  | 'bookmarkSolid'
  | 'beach'
  | 'mountain'
  | 'hotel'
  | 'utensils'
  | 'cafe'
  | 'compass'
  | 'export'
  | 'close';

const APP_ICONS: Record<AppIconName, IconDefinition> = {
  home: faHouse,
  diary: faBookOpen,
  chat: faEnvelope,
  claude: faClaude,
  schedule: faCalendarDays,
  saved: faHeart,
  profile: faCircleUser,
  bell: faBell,
  bellRegular: faBellRegular,
  gear: faGear,
  settings: faGear,
  search: faMagnifyingGlass,
  filter: faSliders,
  star: faStarSolid,
  starRegular: faStarRegular,
  location: faLocationDot,
  bookmark: faBookmarkRegular,
  bookmarkSolid: faBookmarkSolid,
  beach: faUmbrellaBeach,
  mountain: faMountain,
  hotel: faHotel,
  utensils: faUtensils,
  cafe: faMugSaucer,
  compass: faCompass,
  export: faArrowUpRightFromSquare,
  close: faXmark,
};

const colorMap: Record<string, string> = {
  primary: colors.primary.main,
  main: colors.text.main,
  sub: colors.text.sub,
  muted: colors.text.muted,
  white: colors.text.inverse,
  sand: colors.sand.main,
  success: colors.status.success,
  error: colors.status.error,
};

export interface AppIconProps {
  name: AppIconName;
  size?: number;
  color?: string;
  badge?: boolean;
  badgeCount?: number;
  style?: StyleProp<ViewStyle>;
}

export const AppIcon: React.FC<AppIconProps> = ({
  name,
  size = 22,
  color = colors.text.sub,
  badge = false,
  badgeCount,
  style,
}) => {
  const icon = APP_ICONS[name] ?? faHouse;
  const resolvedColor = colorMap[color] || color;

  return (
    <View style={[styles.container, style]}>
      <FontAwesomeIcon icon={icon} size={size} color={resolvedColor} />
      {badge && !badgeCount && <View style={styles.badgeDot} />}
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
