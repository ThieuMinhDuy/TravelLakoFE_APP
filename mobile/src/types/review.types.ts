import type { PlaceType } from './place.types';
import type { User } from './user.types';

/**
 * Review Models
 * Ref: docs/02_Data_Models.md
 */

export interface Review {
  _id: string;
  user: string | User;
  itemType: PlaceType;
  itemId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewPayload {
  itemType: PlaceType;
  itemId: string;
  rating: number;
  comment: string;
}
