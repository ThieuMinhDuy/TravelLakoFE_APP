import { Platform } from 'react-native';
import type { TextStyle, ViewStyle } from 'react-native';

// ----------------------------------------------------------------------------
// 1. MÀU SẮC (Colors Palette - Modern Natural Travel)
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

  // Warmth & Accent (Sunset Sand - Cát biển) - Dùng hạn chế: Rating sao, Highlight chữ
  sand: {
    main: '#D97706',       // Amber-600: Rating sao, chữ "Destinations !"
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
    sand: '#D97706',       // Vàng cam cát biển
  },

  // Structural & Borders
  border: {
    subtle: '#E2E8F0',     // Viền 1px nhã nhặn cho card, divider
    focused: '#0369A1',    // Viền khi input focus
    error: '#EF4444',      // Viền khi input lỗi
    active: '#0369A1',     // Viền xanh chủ đạo (như thanh search)
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
    cardGlass: 'rgba(15, 23, 42, 0.52)',
  },
} as const;

export type ColorTokens = typeof colors;

// ----------------------------------------------------------------------------
// 2. PHÔNG CHỮ & ĐỊNH DẠNG (Typography Hierarchy - SF Pro, Outfit & Inter)
// ----------------------------------------------------------------------------
export const fontFamilies = {
  // 1. Apple San Francisco Pro (Chính xác theo thiết kế Figma của màn hình)
  sfProDisplay: {
    regular: 'SFProDisplay-Regular',
    medium: 'SFProDisplay-Medium',
    semiBold: 'SFProDisplay-Semibold',
    bold: 'SFProDisplay-Bold',
  },
  sfProText: {
    regular: 'SFProText-Regular',
    medium: 'SFProText-Medium',
    semiBold: 'SFProText-Semibold',
    bold: 'SFProText-Bold',
  },

  // 2. Outfit (Design System Headings)
  outfit: {
    regular: 'Outfit-Regular',
    medium: 'Outfit-Medium',
    semiBold: 'Outfit-SemiBold',
    bold: 'Outfit-Bold',
  },

  // 3. Inter (Design System Body Text)
  inter: {
    regular: 'Inter-Regular',
    medium: 'Inter-Medium',
    semiBold: 'Inter-SemiBold',
    bold: 'Inter-Bold',
  },

  // Semantic defaults mapping (Chuẩn thiết kế SF Pro)
  heading: {
    regular: 'SFProDisplay-Regular',
    medium: 'SFProDisplay-Medium',
    semiBold: 'SFProDisplay-Semibold',
    bold: 'SFProDisplay-Bold',
  },
  body: {
    regular: 'SFProText-Regular',
    medium: 'SFProText-Medium',
    semiBold: 'SFProText-Semibold',
    bold: 'SFProText-Bold',
  },
};

export const typography = {
  heroTitle: {
    fontFamily: fontFamilies.heading.bold,
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 34,
    letterSpacing: -0.4,
  } as TextStyle,

  h1: {
    fontFamily: fontFamilies.heading.bold,
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 30,
    letterSpacing: -0.4,
  } as TextStyle,

  h2: {
    fontFamily: fontFamilies.heading.bold,
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 26,
    letterSpacing: -0.3,
  } as TextStyle,

  h3: {
    fontFamily: fontFamilies.heading.semiBold,
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
    letterSpacing: -0.2,
  } as TextStyle,

  subtitle: {
    fontFamily: fontFamilies.heading.medium,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 22,
  } as TextStyle,

  price: {
    fontFamily: fontFamilies.heading.bold,
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 28,
    letterSpacing: -0.3,
  } as TextStyle,

  body: {
    fontFamily: fontFamilies.body.regular,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21,
  } as TextStyle,

  bodyMedium: {
    fontFamily: fontFamilies.body.medium,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
  } as TextStyle,

  bodyBold: {
    fontFamily: fontFamilies.body.semiBold,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 21,
  } as TextStyle,

  caption: {
    fontFamily: fontFamilies.body.regular,
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  } as TextStyle,

  captionMedium: {
    fontFamily: fontFamilies.body.medium,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  } as TextStyle,

  captionBold: {
    fontFamily: fontFamilies.body.semiBold,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
  } as TextStyle,

  tiny: {
    fontFamily: fontFamilies.body.medium,
    fontSize: 10,
    fontWeight: '500',
    lineHeight: 14,
  } as TextStyle,

  button: {
    fontFamily: fontFamilies.heading.semiBold,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
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
  pill: 30,
  card: 26,
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
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 12,
    },
    android: {
      elevation: 3,
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
  fontFamilies,
  typography,
  spacing,
  radius,
  shadows,
} as const;

export type Theme = typeof theme;
