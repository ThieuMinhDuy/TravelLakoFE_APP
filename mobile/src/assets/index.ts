/**
 * Centralized Asset Registry
 * Provides type-safe and clean image references for TravelLako Mobile
 */

export const IMAGES = {
  logo: require('./images/logo.webp'),
  authBanner: require('./images/authbanner.webp'),
  avatarDefault: require('./images/avatar_default.jpg'),
  beachPhuQuoc: require('./images/beach_phuquoc.jpg'),
  halongBay: require('./images/halong_bay.jpg'),
  vietnam: require('./images/vietnam.jpg'),
  scenic1: require('./images/scenic_1.jpg'),
  scenic2: require('./images/scenic_2.jpg'),
  scenic3: require('./images/scenic_3.jpg'),
} as const;

export type ImageToken = keyof typeof IMAGES;

