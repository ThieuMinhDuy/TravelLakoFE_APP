import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  useWindowDimensions,
  StatusBar,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '@components/common';
import { colors, spacing, radius } from '@theme';
import { IMAGES } from '../../assets';
import { SCREEN_NAMES } from '@constants/screenNames';
import { useAppNavigation } from '@hooks/useAppNavigation';

export const OnboardingScreen: React.FC = () => {
  const navigation = useAppNavigation();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const handleSkip = () => {
    navigation.navigate(SCREEN_NAMES.LOGIN as any);
  };

  const handleLogin = () => {
    navigation.navigate(SCREEN_NAMES.LOGIN as any);
  };

  const handleCreateAccount = () => {
    navigation.navigate(SCREEN_NAMES.REGISTER as any);
  };

  // Dynamic responsive collage sizing
  const contentWidth = width - spacing.xl * 2;
  const colLeftWidth = Math.floor(contentWidth * 0.44);
  const colRightWidth = Math.floor(contentWidth * 0.52);

  return (
    <View style={[styles.root, { paddingTop: Math.max(insets.top, 12), paddingBottom: Math.max(insets.bottom, 16) }]}>
      <StatusBar barStyle="dark-content" />

      {/* Top Header: Skip Button */}
      <View style={styles.topBar}>
        <View style={styles.topPlaceholder} />
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleSkip}
          style={styles.skipButton}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <AppText style={styles.skipText}>Skip</AppText>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Figma Modern Collage Hero Section */}
        <View style={[styles.collageContainer, { width: contentWidth }]}>
          <View style={styles.collageTopRow}>
            {/* Top-Left Image: Traveler with backpack looking out */}
            <View style={[styles.imageCard, { width: colLeftWidth, height: 210 }]}>
              <Image
                source={IMAGES.scenic1}
                style={styles.fullImage}
                resizeMode="cover"
              />
            </View>

            {/* Top-Right Image: Scenic Island Lake */}
            <View style={[styles.imageCard, { width: colRightWidth, height: 185, marginTop: 14 }]}>
              <Image
                source={IMAGES.scenic2}
                style={styles.fullImage}
                resizeMode="cover"
              />
            </View>
          </View>

          {/* Bottom Center Image: Old Town Harbor Marina */}
          <View style={[styles.imageCard, styles.bottomCollageCard, { width: contentWidth, height: 160 }]}>
            <Image
              source={IMAGES.scenic3}
              style={styles.fullImage}
              resizeMode="cover"
            />
          </View>
        </View>

        {/* Headline Section */}
        <View style={styles.headlineContainer}>
          <AppText style={styles.titleLine}>Discover</AppText>
          <AppText style={styles.titleLine}>Amazing</AppText>

          {/* Amber Highlight Ribbon for 'Destinations' */}
          <View style={styles.ribbonRow}>
            <View style={styles.ribbon}>
              <AppText style={styles.ribbonText}>Destinations</AppText>
            </View>
          </View>

          <AppText style={styles.subtitle}>
            We believe traveling around the world shouldn't be hard.
          </AppText>
        </View>

        {/* Modern Dot Pagination Indicator */}
        <View style={styles.paginationRow}>
          <View style={styles.dotActive} />
          <View style={styles.dotInactive} />
          <View style={styles.dotInactiveLight} />
        </View>

        {/* Primary & Secondary Pill CTA Buttons */}
        <View style={styles.actionsContainer}>
          {/* Primary 'Log in' Pill Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleLogin}
            style={styles.primaryPillBtn}
          >
            <AppText style={styles.primaryPillText}>Log in</AppText>
          </TouchableOpacity>

          {/* Secondary 'Create Account' Outline Pill Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleCreateAccount}
            style={styles.outlinePillBtn}
          >
            <AppText style={styles.outlinePillText}>Create Account</AppText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    height: 44,
  },
  topPlaceholder: {
    width: 44,
  },
  skipButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: spacing.lg,
  },
  collageContainer: {
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  collageTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  imageCard: {
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: '#F1F5F9',
  },
  fullImage: {
    width: '100%',
    height: '100%',
  },
  bottomCollageCard: {
    marginTop: -45,
    zIndex: 2,
    elevation: 3,
  },
  headlineContainer: {
    width: '100%',
    paddingHorizontal: spacing.xl,
    marginTop: spacing.lg,
    alignItems: 'flex-start',
  },
  titleLine: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 38,
    letterSpacing: -0.5,
  },
  ribbonRow: {
    flexDirection: 'row',
    marginTop: 4,
    marginBottom: spacing.xs,
  },
  ribbon: {
    backgroundColor: '#E5A638',
    paddingHorizontal: 16,
    paddingVertical: 3,
    borderRadius: 6,
    transform: [{ skewX: '-12deg' }],
  },
  ribbonText: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 36,
    letterSpacing: 0.2,
    transform: [{ skewX: '12deg' }],
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: '#64748B',
    marginTop: spacing.sm,
    maxWidth: '92%',
  },
  paginationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.xl,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  dotActive: {
    width: 26,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#2563EB',
    marginRight: 6,
  },
  dotInactive: {
    width: 14,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#93C5FD',
    marginRight: 6,
  },
  dotInactiveLight: {
    width: 14,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#DBEAFE',
  },
  actionsContainer: {
    width: '100%',
    paddingHorizontal: spacing.xl,
    gap: 12,
  },
  primaryPillBtn: {
    width: '100%',
    height: 52,
    borderRadius: 9999,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryPillText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  outlinePillBtn: {
    width: '100%',
    height: 52,
    borderRadius: 9999,
    borderWidth: 1.5,
    borderColor: '#1E293B',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outlinePillText: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '600',
  },
});

