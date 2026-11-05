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
  categoryBeach: require('./images/categories/beach_3d.png'),
  categoryMountain: require('./images/categories/mountain_3d.png'),
  cityAbuja: require('./images/cities/abuja.jpg'),
  cityNewYork: require('./images/cities/newyork.jpg'),
  citySydney: require('./images/cities/sydney.jpg'),
  cityToronto: require('./images/cities/toronto.jpg'),
  cityLondon: require('./images/cities/london.jpg'),
  destNautilus: require('./images/destinations/nautilus_maldives.jpg'),
  destErinIjesha: require('./images/destinations/erin_ijesha_falls.jpg'),
} as const;

export type ImageToken = keyof typeof IMAGES;
