import type { City } from './city.types';
import type { User } from './user.types';
import type { AnyPlace, PlaceType } from './place.types';

/**
 * Trip & Itinerary Models
 * Ref: docs/02_Data_Models.md
 */

export interface PlaceInSchedule {
  _id: string;
  placeType: PlaceType;
  placeId: string | AnyPlace;
  order: number;
  note: string;
  visited: boolean;
  checkInTime?: string;
}

export interface DaySchedule {
  _id: string;
  day: number;
  date: string;
  places: PlaceInSchedule[];
}

export interface TripDiary {
  notes: string;
  photos: string[];
}

export interface Trip {
  _id: string;
  user: string | User;
  title: string;
  city: string | City;
  startDate: string;
  endDate: string;
  budget: number;
  schedule: DaySchedule[];
  diary?: TripDiary;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTripPayload {
  title: string;
  city: string;
  startDate: string;
  endDate: string;
  budget: number;
}

export interface UpdateSchedulePayload {
  dayNumber: number;
  places: {
    placeId: string;
    placeType: PlaceType;
    order: number;
    note?: string;
  }[];
}
