export interface Review {
  title: string;
  emoji: number;
  lastUpdatedAt: string | null;
  lastUpdatedBy: string | null;
  reviewId: number;
  status: number;
}

export interface AddReview {
  title: string;
  emoji: number;
}

export interface UpdateReview {
  reviewId: number;
  newTitle: string;
  newEmoji: number;
}

export interface DeployReview {
  reviewId: number;
  newStatus: number;
}
