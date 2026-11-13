import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faWandMagicSparkles, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { AppText } from '@components/common';
import { colors, radius, spacing, shadows } from '@theme';

interface ChatHeaderProps {
  onClearHistory: () => void;
  messageCount: number;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  onClearHistory,
  messageCount,
}) => {
  return (
    <View style={styles.header}>
      <View style={styles.leftCol}>
        <View style={styles.botIconWrapper}>
          <FontAwesomeIcon
            icon={faWandMagicSparkles}
            size={18}
            color={colors.primary.main}
          />
        </View>
        <View style={styles.titleCol}>
          <AppText variant="h3" color="main" style={styles.title}>
            Trợ lý du lịch AI
          </AppText>
          <View style={styles.statusRow}>
            <View style={styles.onlineDot} />
            <AppText variant="tiny" color="sub">
              Sẵn sàng • Gemini 2.5 Flash
            </AppText>
          </View>
        </View>
      </View>

      {messageCount > 0 && (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onClearHistory}
          style={styles.clearButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <FontAwesomeIcon
            icon={faTrashCan}
            size={16}
            color={colors.text.sub}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    backgroundColor: colors.background.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
    ...shadows.sm,
  },
  leftCol: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  botIconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primary.soft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
    borderWidth: 1.5,
    borderColor: colors.primary.border,
  },
  titleCol: {
    justifyContent: 'center',
  },
  title: {
    fontWeight: '700',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: colors.nature.main,
    marginRight: 5,
  },
  clearButton: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.background.subtle,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
});
