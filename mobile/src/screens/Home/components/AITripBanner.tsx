import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppText, AppIcon } from '@components/common';
import { colors, fontFamilies, shadows } from '@theme';

export const AITripBanner: React.FC = () => {
  const navigation = useNavigation<any>();

  const handlePressCTA = () => {
    try {
      navigation.navigate('AIChatTab');
    } catch {
      // Fallback
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.bannerCard}>
        {/* Top Badge: AI Tag */}
        <View style={styles.badgeRow}>
          <View style={styles.aiBadge}>
            <AppIcon name="claude" size={13} color="#FFFFFF" style={styles.badgeIcon} />
            <AppText style={styles.badgeText}>TRỢ LÝ DU LỊCH AI</AppText>
          </View>
        </View>

        {/* Title & Description */}
        <AppText style={styles.title}>
          Lên kế hoạch du lịch thông minh
        </AppText>
        <AppText style={styles.subtitle}>
          Tạo lịch trình trọn gói theo ngày, sở thích và ngân sách của bạn chỉ trong 30 giây.
        </AppText>

        {/* CTA Button */}
        <TouchableOpacity
          style={styles.ctaButton}
          activeOpacity={0.85}
          onPress={handlePressCTA}
        >
          <AppText style={styles.ctaText}>Khám phá ngay ✨</AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 28,
  },
  bannerCard: {
    backgroundColor: '#0369A1', // Ocean Azure
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 22,
    position: 'relative',
    overflow: 'hidden',
    ...shadows.md,
  },
  badgeRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  badgeIcon: {
    marginRight: 6,
  },
  badgeText: {
    fontFamily: fontFamilies.sfProText.bold,
    fontSize: 10,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  title: {
    fontFamily: fontFamilies.sfProDisplay.bold,
    fontSize: 20,
    color: '#FFFFFF',
    lineHeight: 26,
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: fontFamilies.sfProText.regular,
    fontSize: 13,
    color: '#E0F2FE',
    lineHeight: 18,
    marginBottom: 16,
  },
  ctaButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    ...shadows.sm,
  },
  ctaText: {
    fontFamily: fontFamilies.sfProText.bold,
    fontSize: 13,
    color: colors.primary.main,
  },
});

