import React from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  StyleSheet,
  ViewStyle,
  RefreshControlProps,
} from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import { colors, spacing } from '@theme';
import { LoadingOverlay } from './LoadingOverlay';

export interface ScreenWrapperProps {
  children: React.ReactNode;
  scrollable?: boolean;
  withKeyboardAvoiding?: boolean;
  dismissKeyboardOnTap?: boolean;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  isLoading?: boolean;
  loadingMessage?: string;
  backgroundColor?: string;
  safeAreaEdges?: Edge[];
  refreshControl?: React.ReactElement<RefreshControlProps>;
  contentContainerStyle?: ViewStyle;
  style?: ViewStyle;
}

/**
 * ScreenWrapper
 * Standardized Master Layout for all screens in TravelLako
 * Provides Safe Area, Theme Background, ScrollView, and Keyboard Handling
 */
export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  scrollable = false,
  withKeyboardAvoiding = true,
  dismissKeyboardOnTap = true,
  header,
  footer,
  isLoading = false,
  loadingMessage,
  backgroundColor = colors.background.app,
  safeAreaEdges = ['top', 'left', 'right'],
  refreshControl,
  contentContainerStyle,
  style,
}) => {
  // Main body content (Scrollable vs Fixed)
  const renderBody = () => {
    if (scrollable) {
      return (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.scrollContent,
            contentContainerStyle,
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          refreshControl={refreshControl}
        >
          {children}
        </ScrollView>
      );
    }

    return (
      <View style={[styles.fixedContent, contentContainerStyle]}>
        {children}
      </View>
    );
  };

  // Keyboard dismiss wrapper
  const wrapWithKeyboardDismiss = (content: React.ReactNode) => {
    if (dismissKeyboardOnTap) {
      return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.flexOne}>{content}</View>
        </TouchableWithoutFeedback>
      );
    }
    return <View style={styles.flexOne}>{content}</View>;
  };

  // Keyboard avoiding wrapper
  const wrapWithKeyboardAvoiding = (content: React.ReactNode) => {
    if (withKeyboardAvoiding) {
      return (
        <KeyboardAvoidingView
          style={styles.flexOne}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
        >
          {content}
        </KeyboardAvoidingView>
      );
    }
    return <View style={styles.flexOne}>{content}</View>;
  };

  return (
    <SafeAreaView
      edges={safeAreaEdges}
      style={[styles.container, { backgroundColor }, style]}
    >
      {/* 1. Fixed Header Slot (Always sticks to top) */}
      {header && <View style={styles.headerContainer}>{header}</View>}

      {/* 2. Main Body with Keyboard & Scroll handling */}
      {wrapWithKeyboardAvoiding(wrapWithKeyboardDismiss(renderBody()))}

      {/* 3. Fixed Footer Slot (e.g. CTA Buttons, Sticky Bar) */}
      {footer && <View style={styles.footerContainer}>{footer}</View>}

      {/* 4. Fullscreen Loading Overlay */}
      {isLoading && <LoadingOverlay message={loadingMessage} />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flexOne: {
    flex: 1,
  },
  headerContainer: {
    zIndex: 10,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexGrow: 1,
  },
  fixedContent: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  footerContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border.subtle,
  },
});

