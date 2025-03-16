export enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}

export enum Nutrition {
  HEALTHY = 'healthy',
  UNHEALTHY = 'unhealthy'
}

export interface Meal {
  id?: string;
  userId: string;
  name: string;
  date: string; // ISO string format
  difficulty: Difficulty;
  nutrition: Nutrition;
  cuisine: string;
  rating: number; // 0-5 with 0.5 increments
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Validation function for rating (0-5 with 0.5 increments)
export const isValidRating = (rating: number): boolean => {
  return rating >= 0 && rating <= 5 && (rating * 10) % 5 === 0;
};
