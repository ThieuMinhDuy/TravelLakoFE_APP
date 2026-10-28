/**
 * City Models
 * Ref: docs/02_Data_Models.md
 */

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface City {
  _id: string;
  name: string;
  description: string;
  image: string;
  coordinates: Coordinates;
  createdAt: string;
  updatedAt: string;
}

