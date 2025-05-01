import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
// import { Movie, NewMovie } from '../_models/movies.model';
import { Showtime } from '../_models/showtimes.model';
import { Movie, MovieCreateRequest } from '../_models/movies.model';

@Injectable({
  providedIn: 'root',
})
export class MoviesService {
  private cachedMovies: Movie[] = [];

  private baseUrl = 'https://localhost:7063/api/movies';
  private apiUrl = 'https://localhost:7063/api/movie-showtimes'
  private toggleUrl = 'https://localhost:7063/api/movies/${movie.id}/toggle-status?isActive=${newStatus}'
  constructor(private http: HttpClient) {}

  getMovieById(
    id: number
  ): Observable<{ success: boolean; data: Movie; message: string }> {
    return this.http.get<{ success: boolean; data: Movie; message: string }>(
      `https://localhost:7063/api/movies/${id}`
    );
  }



  getShowtimesByMovieId(
    movieId: number
  ): Observable<{ success: boolean; data: Showtime[]; message: string }> {
    return this.http.get<{
      success: boolean;
      data: Showtime[];
      message: string;
    }>(`https://localhost:7063/api/movies/${movieId}/showtimes`);
  }

  
  

  getAllMovies(): Observable<{
    success: boolean;
    data: Movie[];
    message: string;
  }> {
    return this.http
      .get<{ success: boolean; data: Movie[]; message: string }>(
        'https://localhost:7063/api/movies'
      )
      .pipe(
        tap((res) => {
          this.cachedMovies = res.data;
        })
      );
  }

  // addMovie(movie: NewMovie): Observable<any> {
  //   return this.http.post<any>(this.baseUrl, movie);
  // }

  addMovie(movieRequest: MovieCreateRequest): Observable<any> {
    console.log('Sending movie data to API:', movieRequest);
    return this.http.post<any>(this.apiUrl, movieRequest);
  }

// For booking tickets


  // getMovieById(id: number): Observable<Movie> {
  //   return this.http.get<Movie>(`${this.baseUrl}/${id}`);
  // }

  updateMovie(movie: Movie): Observable<any> {
    return this.http.put(`${this.baseUrl}/${movie.movieId}`, movie);
  }

  deleteMovie(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  toggleMovieStatus(movie: Movie): Observable<any> {
    const updatedMovie = { ...movie, isActive: !movie.isActive };
    return this.http.put(`${this.toggleUrl}/${movie.movieId}`, updatedMovie);
  }

  bookTickets(payload: {
    userId: number;
    showtimeId: number;
    movieId: number;
    TicketCount: number;
  }): Observable<any> {
    return this.http.post('https://localhost:7063/api/bookings', payload);
  }

  // getCachedMovies(): Movie[] {
  //   return this.cachedMovies;
  // }
}
