import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  PanResponder,
  LayoutChangeEvent,
} from 'react-native';
import Svg, { Defs, ClipPath, Rect, Path } from 'react-native-svg';
import { AppText } from '@components/common';
import { fontFamilies, shadows } from '@theme';

interface PriceWaveSliderProps {
  minPrice: number;
  maxPrice: number;
  minLimit?: number;
  maxLimit?: number;
  step?: number;
  onChange: (min: number, max: number) => void;
}

const THUMB_SIZE = 24;
const SVG_HEIGHT = 65;
// Đường cong sóng mô phỏng phân bố giá theo thiết kế Figma
const WAVE_PATH =
  'M 0 52 C 15 52, 20 40, 30 28 C 40 16, 46 25, 52 22 C 60 18, 65 4, 72 4 C 78 4, 82 22, 90 32 C 95 38, 98 48, 100 52 L 100 60 L 0 60 Z';

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

  // Tính tỷ lệ % cho ClipPath trong SVG viewBox (0 -> 100)
  const minPercent = Math.max(0, Math.min(100, (localMin - minLimit) / (maxLimit - minLimit) * 100));
  const maxPercent = Math.max(0, Math.min(100, (localMax - minLimit) / (maxLimit - minLimit) * 100));

  // PanResponder cho Thumb Min
  const minPan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        const newX = gestureState.dx;
        // Lấy toạ độ xuất phát
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
      return `${(maxLimit).toLocaleString('vi-VN')} đ+`;
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

      {/* Vùng biểu đồ dạng sóng & Slider Track */}
      <View style={styles.sliderArea} onLayout={onLayout}>
        {/* SVG Biểu đồ sóng */}
        <Svg
          width="100%"
          height={SVG_HEIGHT}
          viewBox="0 0 100 60"
          preserveAspectRatio="none"
          style={styles.svgWave}
        >
          <Defs>
            <ClipPath id="waveRangeClip">
              <Rect
                x={`${minPercent}`}
                y="0"
                width={`${Math.max(maxPercent - minPercent, 0)}`}
                height="60"
              />
            </ClipPath>
          </Defs>
          {/* Lớp nền sóng mờ bên ngoài khoảng giá */}
          <Path d={WAVE_PATH} fill="#F1F5F9" />
          {/* Lớp sóng nổi màu xanh bên trong khoảng giá */}
          <Path d={WAVE_PATH} fill="#005BBF" clipPath="url(#waveRangeClip)" />
        </Svg>

        {/* Thanh ray (Track) ngang phía đáy */}
        <View style={styles.trackBackground} />
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
    color: '#64748B',
  },
  sliderArea: {
    width: '100%',
    height: SVG_HEIGHT + 14,
    position: 'relative',
    justifyContent: 'flex-end',
  },
  svgWave: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  trackBackground: {
    position: 'absolute',
    bottom: 9,
    left: THUMB_SIZE / 2,
    right: THUMB_SIZE / 2,
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
  },
  trackActive: {
    position: 'absolute',
    bottom: 9,
    height: 4,
    backgroundColor: '#005BBF',
    borderRadius: 2,
  },
  thumb: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#005BBF',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  thumbCenter: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#005BBF',
  },
});

