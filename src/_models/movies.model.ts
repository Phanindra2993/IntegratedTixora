export interface Movie {
  movieId: number;
  title: string;
  language: string;
  genre: string;
  format: string;
  rating: number;
  showTimes: string[];
  description: string;
  imageUrl: string;
  isActive: boolean; 
}
