import type { City, Coordinates } from './city.types';

/**
 * Places Models (Attraction, Hotel, Restaurant, Cafe)
 * Ref: docs/02_Data_Models.md
 */

export type PlaceType = 'attraction' | 'hotel' | 'restaurant' | 'cafe';

export interface BasePlace {
  _id: string;
  name: string;
  city: string | City;
  description: string;
  images: string[];
  address: string;
  coordinates: Coordinates;
  rating: number;
  numReviews: number;
  placeType?: PlaceType;
  createdAt: string;
  updatedAt: string;
}

export interface Attraction extends BasePlace {
  admissionFee: number;
}

export interface Hotel extends BasePlace {
  stars: number;
  pricePerNight: number;
}

export interface Restaurant extends BasePlace {
  cuisineType: string;
  price: number;
}

export interface Cafe extends BasePlace {
  price: number;
}

export type AnyPlace = Attraction | Hotel | Restaurant | Cafe;
