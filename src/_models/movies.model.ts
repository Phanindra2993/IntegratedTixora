// export interface Movie {
//   movieId: number;
//   title: string;
//   language: string;
//   genre: string;
//   format: string;
//   rating: number;
//   showTimes: string[];
//   description: string;
//   imageUrl: string;
//   isActive: boolean; 
// }


// // Base interface with all common properties
// interface BaseMovie {
//   title: string;
//   language: string;
//   genre: string;
//   format: string;
//   // rating: number;
//   showTimes: string[];
//   description: string;
//   imageUrl: string;
//   isActive: boolean;
// }

// // For existing movies (with ID)
// export interface Movie extends BaseMovie {
//   movieId: number;
// }

// // For creating new movies (without ID)
// export interface NewMovie extends BaseMovie {
//   movieId?: never; // Ensures this can't be provided
// }

// export interface ApiResponse<T> {
//   success: boolean;
//   data: T;
//   message?: string;  // Make optional
// }

// export type MovieResponse = ApiResponse<Movie>;

export interface Movie {
  movieId?: number;
  title: string;
  genre: string;
  language: string;
  format: string;
  description: string;
  imageUrl: string;
  isActive: boolean;

}
export interface MovieStatusResponse {
  success: boolean;
  message: string;
}


export interface Showtime {
  movieId?: number;
  showDate: string;
  showTime: string;
  availableSeats: number;
  isActive: boolean;
}



export interface MovieCreateRequest {
  movie: Movie;
  shows: Showtime[];
}