import type { Coordinates } from './api.types';

export interface City {
  _id: string;
  name: string;
  description: string;
  image: string;
  coordinates?: Coordinates;
  country?: string;
}

export interface CitiesResponse {
  total: number;
  cities: City[];
}

