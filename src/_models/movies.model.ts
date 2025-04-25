export interface Movie {
  id: number;
  movieName: string;
  language: string;
  genre: string;
  format: string;
  rating: number;
  showTimes: string[];
  description: string;
  imageUrl: string;
  isActive: boolean; // New property to track active/inactive state
}
