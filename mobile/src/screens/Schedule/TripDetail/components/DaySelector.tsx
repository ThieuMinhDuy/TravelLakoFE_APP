import React from 'react';
import { ScrollView, TouchableOpacity, View, StyleSheet } from 'react-native';
import { AppText } from '@components/common';
import { colors, spacing, radius } from '@theme';
import { formatDate } from '@utils';
import type { DaySchedule } from '@appTypes';

export interface DaySelectorProps {
  schedule: DaySchedule[];
  activeDay: number;
  onSelectDay: (day: number) => void;
}

export const DaySelector: React.FC<DaySelectorProps> = ({
  schedule,
  activeDay,
  onSelectDay,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {schedule.map((dayItem) => {
          const isActive = dayItem.day === activeDay;
          const placesCount = dayItem.places?.length || 0;

          return (
            <TouchableOpacity
              key={dayItem.day}
              activeOpacity={0.8}
              onPress={() => onSelectDay(dayItem.day)}
              style={[styles.dayItem, isActive && styles.dayItemActive]}
            >
              <AppText
                variant={isActive ? 'captionMedium' : 'caption'}
                color={isActive ? 'surface' : 'main'}
                style={styles.dayTitle}
              >
                Ngày {dayItem.day}
              </AppText>

              {dayItem.date ? (
                <AppText
                  variant="tiny"
                  color={isActive ? 'surface' : 'muted'}
                  style={styles.dayDate}
                >
                  {formatDate(dayItem.date)}
                </AppText>
              ) : (
                <AppText
                  variant="tiny"
                  color={isActive ? 'surface' : 'muted'}
                  style={styles.dayDate}
                >
                  {placesCount} địa điểm
                </AppText>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.surface,
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  dayItem: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.card,
    backgroundColor: colors.background.subtle,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    alignItems: 'center',
    minWidth: 84,
  },
  dayItemActive: {
    backgroundColor: colors.primary.main,
    borderColor: colors.primary.main,
  },
  dayTitle: {
    fontSize: 13,
  },
  dayDate: {
    marginTop: 2,
  },
});

