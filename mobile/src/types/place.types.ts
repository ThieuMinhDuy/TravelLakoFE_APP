import type { Coordinates } from './api.types';

export interface Place {
  _id: string;
  name: string;
  description: string;
  images: string[];
  address: string;
  city?: string;
  coordinates?: Coordinates;
  rating?: number;
  numReviews?: number;
  admissionFee?: number;
  pricePerNight?: number;
  stars?: number;
  category?: string;
  cuisineType?: string;
  price?: number;
  itemType?: 'Attraction' | 'Hotel' | 'Restaurant' | 'Cafe';
  isFavorite?: boolean;
}

export interface PlaceFilterParams {
  city?: string;
  search?: string;
  stars?: number;
  minPrice?: number;
  maxPrice?: number;
  minFee?: number;
  maxFee?: number;
  cuisineType?: string;
  page?: number;
  limit?: number;
}

export interface PlacesResponse {
  total: number;
  places: Place[];
}

export interface FavoriteItem {
  _id: string;
  user: string;
  itemType: 'Attraction' | 'Hotel' | 'Restaurant' | 'Cafe';
  itemId: string | Place;
  createdAt?: string;
}

export interface FavoritesResponse {
  total: number;
  favorites: FavoriteItem[];
}
