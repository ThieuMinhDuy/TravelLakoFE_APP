export type PlaceItemType = 'Attraction' | 'Hotel' | 'Restaurant' | 'Cafe';

export interface ReviewUser {
  _id: string;
  name: string;
  avatar?: string;
}

export interface Review {
  _id: string;
  user: ReviewUser;
  itemType: PlaceItemType;
  itemId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ReviewsResponse {
  total: number;
  reviews: Review[];
}

export interface CreateReviewPayload {
  itemType: PlaceItemType;
  itemId: string;
  rating: number;
  comment: string;
}

