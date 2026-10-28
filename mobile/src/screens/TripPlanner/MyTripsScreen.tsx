import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  ScreenWrapper,
  AppHeader,
  AppButton,
  EmptyState,
} from '@components/common';
import { spacing } from '@theme';

export const MyTripsScreen: React.FC = () => {
  return (
    <ScreenWrapper
      scrollable
      header={
        <AppHeader
          title="Chuyến đi của tôi"
          rightAction={
            <AppButton
              title="+ Tạo mới"
              onPress={() => console.log('Create trip')}
              variant="primary"
              size="sm"
              fullWidth={false}
            />
          }
        />
      }
    >
      <View style={styles.content}>
        <EmptyState
          title="Chưa có chuyến đi nào"
          description="Hãy tạo chuyến đi mới hoặc trò chuyện với trợ lý Gemini AI để được gợi ý lịch trình tự động."
          actionTitle="Lập kế hoạch ngay"
          onAction={() => console.log('Create plan')}
        />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: spacing.xl,
  },
});

