import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  PanResponder,
  LayoutChangeEvent,
} from 'react-native';
import { AppText } from '@components/common';
import { colors, fontFamilies, shadows } from '@theme';

interface PriceWaveSliderProps {
  minPrice: number;
  maxPrice: number;
  minLimit?: number;
  maxLimit?: number;
  step?: number;
  onChange: (min: number, max: number) => void;
}

const THUMB_SIZE = 26;
const TRACK_HEIGHT = 6;

export const PriceWaveSlider: React.FC<PriceWaveSliderProps> = ({
  minPrice,
  maxPrice,
  minLimit = 0,
  maxLimit = 10000000, // 10.000.000 đ
  step = 100000, // Bước nhảy 100.000 đ
  onChange,
}) => {
  const [sliderWidth, setSliderWidth] = useState(300);
  const [localMin, setLocalMin] = useState(minPrice);
  const [localMax, setLocalMax] = useState(maxPrice);

  useEffect(() => {
    setLocalMin(minPrice);
  }, [minPrice]);

  useEffect(() => {
    setLocalMax(maxPrice);
  }, [maxPrice]);

  const onLayout = (event: LayoutChangeEvent) => {
    const width = event.nativeEvent.layout.width;
    if (width > 0) {
      setSliderWidth(width);
    }
  };

  const usableWidth = Math.max(sliderWidth - THUMB_SIZE, 1);

  // Chuyển đổi giá trị tiền sang toạ độ X
  const getXFromValue = (val: number) => {
    const ratio = Math.max(0, Math.min(1, (val - minLimit) / (maxLimit - minLimit)));
    return ratio * usableWidth;
  };

  // Chuyển đổi toạ độ X sang giá trị tiền
  const getValueFromX = (x: number) => {
    const ratio = Math.max(0, Math.min(1, x / usableWidth));
    const rawVal = minLimit + ratio * (maxLimit - minLimit);
    return Math.round(rawVal / step) * step;
  };

  const minX = getXFromValue(localMin);
  const maxX = getXFromValue(localMax);

  // PanResponder cho Thumb Min
  const minPan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        const newX = gestureState.dx;
        const targetX = getXFromValue(localMin) + newX;
        let newVal = getValueFromX(targetX);
        newVal = Math.max(minLimit, Math.min(newVal, localMax - step));
        setLocalMin(newVal);
      },
      onPanResponderRelease: () => {
        onChange(localMin, localMax);
      },
    })
  ).current;

  // PanResponder cho Thumb Max
  const maxPan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        const newX = gestureState.dx;
        const targetX = getXFromValue(localMax) + newX;
        let newVal = getValueFromX(targetX);
        newVal = Math.min(maxLimit, Math.max(newVal, localMin + step));
        setLocalMax(newVal);
      },
      onPanResponderRelease: () => {
        onChange(localMin, localMax);
      },
    })
  ).current;

  // Định dạng hiển thị tiền tệ
  const formatPrice = (val: number, isMax = false) => {
    if (isMax && val >= maxLimit) {
      return `${maxLimit.toLocaleString('vi-VN')} đ+`;
    }
    return `${val.toLocaleString('vi-VN')} đ`;
  };

  return (
    <View style={styles.container}>
      {/* Header dòng thông tin giá */}
      <View style={styles.priceRow}>
        <AppText style={styles.label}>Khoảng giá</AppText>
        <AppText style={styles.valueText}>
          {formatPrice(localMin)} - {formatPrice(localMax, true)}
        </AppText>
      </View>

      {/* Thanh trượt điều chỉnh khoảng giá */}
      <View style={styles.sliderArea} onLayout={onLayout}>
        {/* Thanh ray nền xám */}
        <View style={styles.trackBackground} />

        {/* Thanh ray kích hoạt màu xanh nằm giữa 2 nút kéo */}
        <View
          style={[
            styles.trackActive,
            {
              left: minX + THUMB_SIZE / 2,
              width: Math.max(0, maxX - minX),
            },
          ]}
        />

        {/* Con trỏ kéo Giá tối thiểu (Min Thumb) */}
        <View
          {...minPan.panHandlers}
          style={[
            styles.thumb,
            {
              transform: [{ translateX: minX }],
            },
          ]}
        >
          <View style={styles.thumbCenter} />
        </View>

        {/* Con trỏ kéo Giá tối đa (Max Thumb) */}
        <View
          {...maxPan.panHandlers}
          style={[
            styles.thumb,
            {
              transform: [{ translateX: maxX }],
            },
          ]}
        >
          <View style={styles.thumbCenter} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  label: {
    fontFamily: fontFamilies.sfProDisplay.bold,
    fontSize: 16,
    color: '#0F172A',
  },
  valueText: {
    fontFamily: fontFamilies.sfProText.medium,
    fontSize: 14,
    color: colors.primary.main,
  },
  sliderArea: {
    width: '100%',
    height: 40,
    position: 'relative',
    justifyContent: 'center',
  },
  trackBackground: {
    position: 'absolute',
    left: THUMB_SIZE / 2,
    right: THUMB_SIZE / 2,
    height: TRACK_HEIGHT,
    backgroundColor: '#E2E8F0',
    borderRadius: TRACK_HEIGHT / 2,
  },
  trackActive: {
    position: 'absolute',
    height: TRACK_HEIGHT,
    backgroundColor: colors.primary.main,
    borderRadius: TRACK_HEIGHT / 2,
  },
  thumb: {
    position: 'absolute',
    left: 0,
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: '#FFFFFF',
    borderWidth: 2.5,
    borderColor: colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  thumbCenter: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary.main,
  },
});
