import React from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { AppIcon } from '@components/common';
import { fontFamilies, shadows } from '@theme';

export interface HomeSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmitEditing?: () => void;
  onFilterPress?: () => void;
  placeholder?: string;
}

export const HomeSearchBar: React.FC<HomeSearchBarProps> = ({
  value,
  onChangeText,
  onSubmitEditing,
  onFilterPress,
  placeholder = 'Tìm kiếm điểm đến, thành phố...',
}) => {
  return (
    <View style={styles.container}>
      {/* Pill Search Input with Blue Border */}
      <View style={styles.searchPill}>
        <AppIcon name="search" size={16} color="#94A3B8" style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
          returnKeyType="search"
          onSubmitEditing={onSubmitEditing}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {value.length > 0 && (
          <TouchableOpacity
            onPress={() => onChangeText('')}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={styles.clearButton}
          >
            <AppIcon name="close" size={13} color="#94A3B8" />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Button: White circular with border & sliders icon */}
      <TouchableOpacity
        style={styles.filterButton}
        activeOpacity={0.7}
        onPress={onFilterPress}
      >
        <AppIcon name="filter" size={17} color="#151111" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 14,
  },
  searchPill: {
    flex: 1,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24, // Pill shape chuẩn Figma
    borderWidth: 1.5,
    borderColor: '#005BBF', // Viền xanh chuẩn Figma
    paddingHorizontal: 16,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    fontFamily: fontFamilies.sfProText.regular,
    fontSize: 14,
    color: '#0F172A',
    paddingVertical: 0,
  },
  clearButton: {
    padding: 4,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...shadows.sm,
  },
});
