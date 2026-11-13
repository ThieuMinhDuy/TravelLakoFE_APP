import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faWandMagicSparkles,
  faCompass,
  faBookmark,
  faRotateRight,
  faClock,
} from '@fortawesome/free-solid-svg-icons';
import { AppText } from '@components/common';
import { colors, radius, spacing, shadows } from '@theme';
import type { AIChatMessageUI } from '@appTypes';
import { FormattedAIMessage } from './FormattedAIMessage';

interface ChatMessageBubbleProps {
  message: AIChatMessageUI;
  onSaveItinerary?: (text: string) => void;
  onRetry?: (message: AIChatMessageUI) => void;
}

/**
 * Tự động phát hiện nếu nội dung tin nhắn AI chứa cấu trúc lịch trình
 */
const detectItinerary = (text: string): boolean => {
  const lower = text.toLowerCase();
  const hasDayKeywords =
    lower.includes('ngày 1') ||
    lower.includes('ngày 2') ||
    lower.includes('day 1') ||
    lower.includes('lịch trình') ||
    lower.includes('buổi sáng') ||
    lower.includes('buổi chiều');

  const hasLength = text.length > 80;
  return hasDayKeywords && hasLength;
};

export const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({
  message,
  onSaveItinerary,
  onRetry,
}) => {
  const isUser = message.role === 'user';
  const isItinerary = !isUser && (message.isItinerary || detectItinerary(message.text));

  const formatTime = (iso?: string) => {
    if (!iso) return '';
    try {
      const d = new Date(iso);
      const hours = String(d.getHours()).padStart(2, '0');
      const mins = String(d.getMinutes()).padStart(2, '0');
      return `${hours}:${mins}`;
    } catch {
      return '';
    }
  };

  if (isUser) {
    return (
      <View style={styles.userContainer}>
        <View style={styles.userBubble}>
          <AppText variant="body" color="white" style={styles.userText}>
            {message.text}
          </AppText>
          <View style={styles.userMeta}>
            <AppText variant="tiny" style={styles.userTime}>
              {formatTime(message.createdAt)}
            </AppText>
            {message.status === 'sending' && (
              <AppText variant="tiny" style={styles.userStatus}>
                • Đang gửi...
              </AppText>
            )}
            {message.status === 'error' && (
              <TouchableOpacity
                onPress={() => onRetry?.(message)}
                activeOpacity={0.7}
                style={styles.retryBadge}
              >
                <FontAwesomeIcon icon={faRotateRight} size={10} color="#FFFFFF" />
                <AppText variant="tiny" style={styles.retryText}>
                  Thử lại
                </AppText>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  }

  // Tin nhắn của AI (Model)
  return (
    <View style={styles.aiContainer}>
      <View style={styles.aiAvatar}>
        <FontAwesomeIcon
          icon={faWandMagicSparkles}
          size={14}
          color={colors.primary.main}
        />
      </View>

      <View style={styles.aiBubbleWrapper}>
        <View style={styles.aiBubble}>
          <FormattedAIMessage text={message.text} />

          <View style={styles.aiMeta}>
            <FontAwesomeIcon
              icon={faClock}
              size={10}
              color={colors.text.muted}
              style={styles.timeIcon}
            />
            <AppText variant="tiny" color="muted">
              {formatTime(message.createdAt)} • Gemini AI
            </AppText>
          </View>
        </View>

        {/* Action Card lưu lịch trình nếu AI phản hồi lịch trình */}
        {isItinerary && onSaveItinerary && (
          <View style={styles.actionCard}>
            <View style={styles.actionHeader}>
              <View style={styles.actionIconBadge}>
                <FontAwesomeIcon
                  icon={faCompass}
                  size={18}
                  color={colors.primary.main}
                />
              </View>
              <View style={styles.actionTextCol}>
                <AppText variant="bodyBold" color="main">
                  Lịch trình gợi ý bởi AI
                </AppText>
                <AppText variant="caption" color="sub">
                  Chuyển nội dung này thành chuyến đi trong kế hoạch của bạn.
                </AppText>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => onSaveItinerary(message.text)}
              style={styles.saveTripButton}
            >
              <FontAwesomeIcon
                icon={faBookmark}
                size={14}
                color="#FFFFFF"
                style={styles.btnIcon}
              />
              <AppText variant="captionMedium" color="white" style={styles.saveTripButtonText}>
                Lưu lịch trình này
              </AppText>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  userContainer: {
    alignSelf: 'flex-end',
    maxWidth: '82%',
    marginVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  userBubble: {
    backgroundColor: colors.primary.main,
    borderRadius: radius.xl,
    borderBottomRightRadius: radius.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    ...shadows.sm,
  },
  userText: {
    lineHeight: 22,
  },
  userMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  userTime: {
    color: 'rgba(255, 255, 255, 0.75)',
  },
  userStatus: {
    color: 'rgba(255, 255, 255, 0.75)',
    marginLeft: 4,
  },
  retryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 6,
    backgroundColor: 'rgba(239, 68, 68, 0.85)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  retryText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 4,
  },

  aiContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    maxWidth: '92%',
    marginVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary.soft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.xs,
    borderWidth: 1,
    borderColor: colors.primary.border,
    marginTop: 2,
  },
  aiBubbleWrapper: {
    flex: 1,
  },
  aiBubble: {
    backgroundColor: colors.background.surface,
    borderRadius: radius.xl,
    borderBottomLeftRadius: radius.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    ...shadows.sm,
  },
  aiMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: spacing.xs,
  },
  timeIcon: {
    marginRight: 4,
  },

  actionCard: {
    marginTop: spacing.xs,
    backgroundColor: colors.primary.soft,
    borderWidth: 1,
    borderColor: colors.primary.border,
    borderRadius: radius.lg,
    padding: spacing.sm + 2,
    ...shadows.sm,
  },
  actionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs + 2,
  },
  actionIconBadge: {
    width: 34,
    height: 34,
    borderRadius: radius.md,
    backgroundColor: colors.background.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.xs + 2,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  actionTextCol: {
    flex: 1,
  },
  saveTripButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary.main,
    borderRadius: radius.md,
    paddingVertical: spacing.xs + 3,
    marginTop: 4,
  },
  btnIcon: {
    marginRight: 6,
  },
  saveTripButtonText: {
    fontWeight: '700',
  },
});
