import { Platform } from 'react-native';
import type { TextStyle, ViewStyle } from 'react-native';

// ----------------------------------------------------------------------------
// 1. MÀU SẮC (Colors Palette)
// ----------------------------------------------------------------------------
export const colors = {
  // Brand & Primary (Ocean Azure - Biển trời dịu mắt)
  primary: {
    main: '#0369A1',       // Sky-700: Màu thương hiệu chính, nút CTA, active state
    dark: '#075985',       // Sky-800: Trạng thái hover / pressed
    light: '#0284C7',      // Sky-600: Nhấn nhẹ
    soft: '#F0F9FF',       // Sky-50: Nền thẻ active, highlight
    border: '#BAE6FD',     // Sky-200: Viền thẻ active
  },

  // Nature & Safety (Coastal Teal - Thiên nhiên / An toàn)
  nature: {
    main: '#0D9488',       // Teal-600: Tag địa điểm tự nhiên, check-in thành công
    light: '#CCFBF1',      // Teal-100: Nền badge thành công / check-in
    dark: '#0F766E',       // Teal-700
  },

  // Warmth & Accent (Sunset Sand - Cát biển) - Dùng hạn chế: Rating sao, Favorite heart
  sand: {
    main: '#D97706',       // Amber-600: Rating sao, nút Favorite
    light: '#FEF3C7',      // Amber-100: Nền badge rating
    dark: '#B45309',       // Amber-700
  },

  // Background & Surfaces (Apple & Notion Clean Style)
  background: {
    app: '#FAFAFA',        // Off-White dịu mắt cho nền màn hình
    surface: '#FFFFFF',    // Trắng tinh khiết cho Card, Header, Bottom Tab
    subtle: '#F1F5F9',     // Slate-100: Nền search input, tab chưa active
    disabled: '#E2E8F0',   // Slate-200
  },

  // Typography Tokens
  text: {
    main: '#0F172A',       // Slate-900: Tiêu đề chính, tên địa điểm
    sub: '#475569',        // Slate-600: Mô tả, giá cả, thông tin phụ
    muted: '#94A3B8',      // Slate-400: Placeholder, disabled text
    inverse: '#FFFFFF',    // Trắng trên nền đậm
    primary: '#0369A1',    // Xanh link hoặc text nhấn
  },

  // Structural & Borders
  border: {
    subtle: '#E2E8F0',     // Viền 1px nhã nhặn cho card, divider
    focused: '#0369A1',    // Viền khi input focus
    error: '#EF4444',      // Viền khi input lỗi
  },

  // Semantic & Feedback Status
  status: {
    success: '#0D9488',    // Check-in thành công
    successBg: '#CCFBF1',
    error: '#EF4444',      // Thất bại / Báo lỗi
    errorBg: '#FEE2E2',
    warning: '#D97706',    // Cảnh báo
    warningBg: '#FEF3C7',
    info: '#0284C7',
    infoBg: '#E0F2FE',
  },

  // Overlay & Transparency
  overlay: {
    backdrop: 'rgba(15, 23, 42, 0.45)', // Backdrop mờ cho Modal
    light: 'rgba(255, 255, 255, 0.85)',
  },
} as const;

export type ColorTokens = typeof colors;

// ----------------------------------------------------------------------------
// 2. PHÔNG CHỮ & ĐỊNH DẠNG (Typography Hierarchy)
// ----------------------------------------------------------------------------
export const typography = {
  h1: {
    fontSize: 26,
    fontWeight: '700',
    lineHeight: 32,
    letterSpacing: -0.5,
  } as TextStyle,

  h2: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 26,
    letterSpacing: -0.3,
  } as TextStyle,

  h3: {
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 22,
    letterSpacing: -0.2,
  } as TextStyle,

  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 20,
  } as TextStyle,

  body: {
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 22,
  } as TextStyle,

  bodyMedium: {
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 22,
  } as TextStyle,

  bodyBold: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
  } as TextStyle,

  caption: {
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
  } as TextStyle,

  captionMedium: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  } as TextStyle,

  tiny: {
    fontSize: 11,
    fontWeight: '500',
    lineHeight: 14,
  } as TextStyle,

  button: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
  } as TextStyle,
} as const;

export type TypographyVariant = keyof typeof typography;

// ----------------------------------------------------------------------------
// 3. KHOẢNG CÁCH (Spacing Grid 4pt / 8pt)
// ----------------------------------------------------------------------------
export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
} as const;

export type SpacingToken = keyof typeof spacing;

// ----------------------------------------------------------------------------
// 4. BO GÓC (Border Radius)
// ----------------------------------------------------------------------------
export const radius = {
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  round: 24,
  full: 9999,
} as const;

export type RadiusToken = keyof typeof radius;

// ----------------------------------------------------------------------------
// 5. ĐỔ BÓNG (Shadows & Elevation)
// ----------------------------------------------------------------------------
export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  } as ViewStyle,

  sm: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  } as ViewStyle,

  md: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  } as ViewStyle,

  lg: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  } as ViewStyle,

  card: Platform.select<ViewStyle>({
    ios: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 8,
    },
    android: {
      elevation: 2,
    },
    default: {},
  }) as ViewStyle,
} as const;

export type ShadowToken = keyof typeof shadows;

// ----------------------------------------------------------------------------
// 6. TỔNG HỢP THEME TOÀN DIỆN
// ----------------------------------------------------------------------------
export const theme = {
  colors,
  typography,
  spacing,
  radius,
  shadows,
} as const;

export type Theme = typeof theme;
