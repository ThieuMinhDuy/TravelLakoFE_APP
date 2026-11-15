import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faCalendarDays,
  faCompass,
  faClockRotateLeft,
} from '@fortawesome/free-solid-svg-icons';
import { AppText } from '@components/common';
import { colors, spacing, radius } from '@theme';

export type TripStatusType = 'upcoming' | 'ongoing' | 'past';

export interface TripStatusTabsProps {
  activeTab: TripStatusType;
  onChangeTab: (tab: TripStatusType) => void;
  counts: {
    upcoming: number;
    ongoing: number;
    past: number;
  };
}

interface TabConfig {
  key: TripStatusType;
  label: string;
  icon: typeof faCalendarDays;
}

const TABS: TabConfig[] = [
  { key: 'upcoming', label: 'Sắp tới', icon: faCalendarDays },
  { key: 'ongoing', label: 'Đang diễn ra', icon: faCompass },
  { key: 'past', label: 'Đã đi', icon: faClockRotateLeft },
];

export const TripStatusTabs: React.FC<TripStatusTabsProps> = ({
  activeTab,
  onChangeTab,
  counts,
}) => {
  return (
    <View style={styles.container}>
      {TABS.map((tab) => {
        const isActive = activeTab === tab.key;
        const count = counts[tab.key] || 0;

        return (
          <TouchableOpacity
            key={tab.key}
            activeOpacity={0.8}
            onPress={() => onChangeTab(tab.key)}
            style={[styles.tabButton, isActive && styles.tabButtonActive]}
          >
            <FontAwesomeIcon
              icon={tab.icon}
              size={14}
              color={isActive ? colors.primary.main : colors.text.muted}
              style={styles.tabIcon}
            />
            <AppText
              variant={isActive ? 'captionMedium' : 'caption'}
              color={isActive ? 'primary' : 'muted'}
              style={styles.tabLabel}
            >
              {tab.label}
            </AppText>
            {count > 0 && (
              <View
                style={[
                  styles.badge,
                  isActive ? styles.badgeActive : styles.badgeInactive,
                ]}
              >
                <AppText
                  variant="tiny"
                  color={isActive ? 'surface' : 'muted'}
                  style={styles.badgeText}
                >
                  {count}
                </AppText>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.background.surface,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.card,
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
  },
  tabButtonActive: {
    backgroundColor: colors.primary.soft,
  },
  tabIcon: {
    marginRight: spacing.xs,
  },
  tabLabel: {
    fontSize: 12.5,
  },
  badge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.xs,
    paddingHorizontal: 4,
  },
  badgeActive: {
    backgroundColor: colors.primary.main,
  },
  badgeInactive: {
    backgroundColor: colors.border.subtle,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
});

