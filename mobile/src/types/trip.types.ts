import type { PlaceItemType } from './review.types';

export interface PlaceInSchedule {
  _id?: string;
  placeType: PlaceItemType;
  placeId: any;
  order?: number;
  note?: string;
  visited?: boolean;
  checkInTime?: string;
}

export interface DaySchedule {
  _id?: string;
  day: number;
  date: string;
  places: PlaceInSchedule[];
}

export interface Trip {
  _id: string;
  user: string;
  title: string;
  city: any;
  startDate: string;
  endDate: string;
  budget?: number;
  schedule: DaySchedule[];
  createdAt?: string;
  updatedAt?: string;
}

export interface TripsResponse {
  upcoming: Trip[];
  ongoing: Trip[];
  past: Trip[];
}

export interface AddPlaceToSchedulePayload {
  day: number;
  placeType: PlaceItemType;
  placeId: string;
  note?: string;
}

