import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { ScreenWrapper, AppText, AppIcon } from '@components/common';
import { colors, fontFamilies, shadows } from '@theme';
import { TOURISM_ACTIVITIES, ActivityItem } from '@appTypes';
import type { RootStackParamList } from '@navigation/types';

type SelectActivitiesRouteProp = RouteProp<
  RootStackParamList,
  'SelectActivitiesScreen'
>;

const ItemSeparator = () => <View style={styles.separator} />;

export const SelectActivitiesScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<SelectActivitiesRouteProp>();

  const initialSelected = route.params?.selectedActivities || [];
  const onSave = route.params?.onSelect;

  const [selectedIds, setSelectedIds] = useState<string[]>(initialSelected);

  const toggleActivity = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleDone = () => {
    if (onSave) {
      onSave(selectedIds);
    }
    navigation.goBack();
  };

  const renderItem = ({ item }: { item: ActivityItem }) => {
    const isSelected = selectedIds.includes(item.id);

    return (
      <TouchableOpacity
        style={styles.itemRow}
        activeOpacity={0.7}
        onPress={() => toggleActivity(item.id)}
      >
        <AppText style={styles.emojiText}>{item.emoji}</AppText>
        <AppText style={styles.activityName}>{item.name}</AppText>

        <View
          style={[
            styles.checkboxCircle,
            isSelected && styles.checkboxCircleSelected,
          ]}
        >
          {isSelected && (
            <AppIcon name="check" size={10} color="#FFFFFF" />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScreenWrapper
      noPadding
      backgroundColor="#FFFFFF"
      safeAreaEdges={['top', 'bottom']}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <AppIcon name="arrowLeft" size={18} color="#0F172A" />
        </TouchableOpacity>

        <AppText style={styles.headerTitle}>Chọn hoạt động</AppText>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleDone}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <AppText style={styles.doneText}>Xong</AppText>
        </TouchableOpacity>
      </View>

      {/* Activities List */}
      <FlatList
        data={TOURISM_ACTIVITIES}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={ItemSeparator}
      />

      {/* Bottom CTA Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.continueButton}
          activeOpacity={0.88}
          onPress={handleDone}
        >
          <AppText style={styles.continueText}>
            Tiếp tục {selectedIds.length > 0 ? `(${selectedIds.length})` : ''}
          </AppText>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: fontFamilies.sfProDisplay.bold,
    fontSize: 18,
    color: '#0F172A',
  },
  doneText: {
    fontFamily: fontFamilies.sfProText.medium,
    fontSize: 15,
    color: colors.primary.main,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 100,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  emojiText: {
    fontSize: 22,
    width: 36,
  },
  activityName: {
    flex: 1,
    fontFamily: fontFamilies.sfProText.medium,
    fontSize: 15,
    color: '#1E293B',
    marginLeft: 10,
  },
  checkboxCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxCircleSelected: {
    backgroundColor: colors.primary.main,
    borderColor: colors.primary.main,
  },
  separator: {
    height: 1,
    backgroundColor: '#F8FAFC',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    ...shadows.lg,
  },
  continueButton: {
    backgroundColor: colors.primary.main,
    borderRadius: 26,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  continueText: {
    fontFamily: fontFamilies.sfProText.bold,
    fontSize: 16,
    color: '#FFFFFF',
  },
});
