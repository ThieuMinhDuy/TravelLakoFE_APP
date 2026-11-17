import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ScreenWrapper, AppText } from '@components/common';
import { colors, spacing } from '@theme';
import { QUERY_KEYS } from '@constants/queryKeys';
import { SCREEN_NAMES } from '@constants/screenNames';
import { useAuthStore } from '@store/useAuthStore';
import { useAppNavigation } from '@hooks/useAppNavigation';
import { aiService } from '@services/ai.service';
import type {
  AIChatMessageUI,
  AIChatHistoryItem,
  AISuggestResponse,
} from '@appTypes';
import {
  ChatHeader,
  ChatMessageBubble,
  ChatTypingIndicator,
  ChatInputBar,
  ClearChatModal,
  PlanPreviewModal,
  GeminiWelcomeView,
} from './components';

export const AIChatScreen: React.FC = () => {
  const navigation = useAppNavigation();
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const userName = user?.name || 'bạn';

  // State
  const [inputText, setInputText] = useState('');
  const [localMessages, setLocalMessages] = useState<AIChatMessageUI[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [isClearModalVisible, setIsClearModalVisible] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  // Preview & Save Itinerary Modal state
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [previewPlanData, setPreviewPlanData] = useState<AISuggestResponse | null>(null);

  const flatListRef = useRef<FlatList>(null);

  // 1. Tải lịch sử trò chuyện từ Server
  const {
    data: serverHistory,
    isLoading: isLoadingHistory,
  } = useQuery({
    queryKey: [QUERY_KEYS.AI_CHAT_HISTORY],
    queryFn: () => aiService.getChatHistory(),
    staleTime: 1000 * 60 * 5, // 5 phút cache
  });

  // Chuyển đổi dữ liệu serverHistory sang localMessages
  useEffect(() => {
    if (serverHistory && Array.isArray(serverHistory)) {
      if (serverHistory.length === 0) {
        // Chưa có tin nhắn nào -> Để mảng rỗng để hiện GeminiWelcomeView
        setLocalMessages([]);
      } else {
        const formatted: AIChatMessageUI[] = serverHistory.map(
          (item: AIChatHistoryItem, index: number) => ({
            id: item._id || `history-${index}-${Date.now()}`,
            role: item.role,
            text: item.parts?.map((p) => p.text).join('\n') || '',
            createdAt: item.createdAt || new Date().toISOString(),
            status: 'sent',
          }),
        );
        setLocalMessages(formatted);
      }
    } else if (!isLoadingHistory) {
      setLocalMessages([]);
    }
  }, [serverHistory, isLoadingHistory]);

  // Tự động cuộn xuống đáy khi có tin nhắn mới
  const scrollToBottom = (animated = true) => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated });
    }, 100);
  };

  // 2. Gửi tin nhắn đến Gemini AI (Optimistic Update)
  const handleSendMessage = async (textToSend?: string) => {
    const messageContent = (textToSend ?? inputText).trim();
    if (!messageContent || isThinking) return;

    // Reset input
    setInputText('');

    const userMessageId = `msg-user-${Date.now()}`;
    const userMessage: AIChatMessageUI = {
      id: userMessageId,
      role: 'user',
      text: messageContent,
      createdAt: new Date().toISOString(),
      status: 'sending',
    };

    // Chuẩn bị payload lịch sử gửi lên Backend theo đúng chuẩn API
    const historyPayload = localMessages.map((m) => ({
      role: m.role,
      parts: [{ text: m.text }],
    }));

    // Cập nhật Optimistic ngay lên UI
    setLocalMessages((prev) => [...prev, userMessage]);
    setIsThinking(true);
    scrollToBottom();

    try {
      const response = await aiService.sendMessage({
        message: messageContent,
        history: historyPayload,
      });

      // Đánh dấu tin nhắn user gửi thành công
      setLocalMessages((prev) =>
        prev.map((m) => (m.id === userMessageId ? { ...m, status: 'sent' } : m)),
      );

      // Thêm phản hồi của AI vào danh sách
      const aiMessage: AIChatMessageUI = {
        id: `msg-model-${Date.now()}`,
        role: 'model',
        text: response.reply,
        createdAt: new Date().toISOString(),
        status: 'sent',
      };

      setLocalMessages((prev) => [...prev, aiMessage]);
      scrollToBottom();
    } catch (error: any) {
      // Đánh dấu tin nhắn bị lỗi
      setLocalMessages((prev) =>
        prev.map((m) => (m.id === userMessageId ? { ...m, status: 'error' } : m)),
      );

      const errorMessage =
        error?.statusCode === 429
          ? 'Hệ thống AI đang quá tải yêu cầu. Vui lòng thử lại sau giây lát.'
          : error?.message || 'Không thể gửi tin nhắn. Vui lòng kiểm tra kết nối mạng.';

      Alert.alert('Lỗi gửi tin nhắn', errorMessage);
    } finally {
      setIsThinking(false);
    }
  };

  // 3. Thử lại khi tin nhắn bị lỗi
  const handleRetryMessage = (failedMessage: AIChatMessageUI) => {
    setLocalMessages((prev) => prev.filter((m) => m.id !== failedMessage.id));
    handleSendMessage(failedMessage.text);
  };

  // 4. Xóa lịch sử cuộc trò chuyện
  const handleConfirmClearChat = async () => {
    try {
      setIsClearing(true);
      await aiService.clearChatHistory();
      queryClient.setQueryData([QUERY_KEYS.AI_CHAT_HISTORY], []);
      // Reset về mảng rỗng -> Hiện lại màn hình chào GeminiWelcomeView
      setLocalMessages([]);
      setIsClearModalVisible(false);
    } catch (error: any) {
      Alert.alert('Lỗi', error?.message || 'Không thể xóa lịch sử chat.');
    } finally {
      setIsClearing(false);
    }
  };

  // 5. Bóc tách và Xem trước lịch trình từ đoạn chat AI
  const handleSaveItinerary = async (itineraryText: string) => {
    setIsPreviewVisible(true);
    setIsPreviewLoading(true);
    setPreviewPlanData(null);

    try {
      const planResponse = await aiService.suggestItinerary({
        notes: itineraryText,
        isParse: true,
      });
      setPreviewPlanData(planResponse);
    } catch (error: any) {
      Alert.alert(
        'Lỗi bóc tách lịch trình',
        error?.message || 'Không thể trích xuất lịch trình từ đoạn tin nhắn này.',
      );
      setIsPreviewVisible(false);
    } finally {
      setIsPreviewLoading(false);
    }
  };

  const handleTripCreated = () => {
    setIsPreviewVisible(false);
    navigation.navigate(SCREEN_NAMES.SCHEDULE_TAB as any);
  };

  const messageCount = localMessages.length;

  return (
    <ScreenWrapper
      withKeyboardAvoiding={false}
      scrollable={false}
      header={
        <ChatHeader
          onClearHistory={() => setIsClearModalVisible(true)}
          messageCount={messageCount}
        />
      }
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Loading Spinner khi tải lịch sử lần đầu */}
        {isLoadingHistory ? (
          <View style={styles.centerLoading}>
            <ActivityIndicator size="large" color={colors.primary.main} />
            <AppText variant="caption" color="sub" style={styles.loadingText}>
              Đang tải lịch sử trò chuyện...
            </AppText>
          </View>
        ) : messageCount === 0 && !isThinking ? (
          /* Màn hình chào mừng phong cách Gemini khi chưa có tin nhắn */
          <GeminiWelcomeView
            userName={userName}
            onSelectPrompt={(prompt) => handleSendMessage(prompt)}
          />
        ) : (
          /* Danh sách tin nhắn khi cuộc trò chuyện bắt đầu */
          <FlatList
            ref={flatListRef}
            data={localMessages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ChatMessageBubble
                message={item}
                onSaveItinerary={handleSaveItinerary}
                onRetry={handleRetryMessage}
              />
            )}
            contentContainerStyle={styles.listContent}
            onContentSizeChange={() => scrollToBottom(false)}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={isThinking ? <ChatTypingIndicator /> : undefined}
          />
        )}

        {/* Thanh soạn tin nhắn cố định ở đáy màn hình */}
        <ChatInputBar
          value={inputText}
          onChangeText={setInputText}
          onSend={() => handleSendMessage()}
          isLoading={isThinking}
        />
      </KeyboardAvoidingView>

      {/* Modal xác nhận xóa lịch sử */}
      <ClearChatModal
        visible={isClearModalVisible}
        onClose={() => setIsClearModalVisible(false)}
        onConfirm={handleConfirmClearChat}
        isLoading={isClearing}
      />

      {/* Modal xem trước và lưu lịch trình */}
      <PlanPreviewModal
        visible={isPreviewVisible}
        onClose={() => setIsPreviewVisible(false)}
        planData={previewPlanData}
        isLoading={isPreviewLoading}
        onTripCreated={handleTripCreated}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.app,
  },
  centerLoading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
  },
  loadingText: {
    marginTop: spacing.sm,
  },
  listContent: {
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
    flexGrow: 1,
  },
});
