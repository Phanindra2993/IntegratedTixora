import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Movie } from '../_models/movies.model';
import { Showtime } from '../_models/showtimes.model';

@Injectable({
  providedIn: 'root',
})
export class MoviesService {
  private cachedMovies: Movie[] = [];

  private url = 'https://localhost:7063/api/movies';
  constructor(private http: HttpClient) {}

  // getMovies(): Observable<Movie[]> {
  //   return this.http.get<Movie[]>(this.url);
  // }

  // getMovieById(id: number): Observable<Movie> {
  //   return this.http.get<Movie>(`https://localhost:7063/api/movies/${id}`);
  // }

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

  // getAllMovies(): Observable<Movie[]> {
  //   return this.http
  //     .get<Movie[]>('https://localhost:7063/api/movies')
  //     .pipe(tap((movies) => (this.cachedMovies = movies)));
  // }

  // getAllMovies(): Observable<{
  //   success: boolean;
  //   data: Movie[];
  //   message: string;
  // }> {
  //   return this.http.get<{ success: boolean; data: Movie[]; message: string }>(
  //     'https://localhost:7063/api/movies'
  //   );
  // }

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

  bookTickets(payload: {
    userId: number;
    showtimeId: number;
    movieId: number;
    TicketCount: number;
  }): Observable<any> {
    return this.http.post('https://localhost:7063/api/bookings', payload);
  }

  getCachedMovies(): Movie[] {
    return this.cachedMovies;
  }
}
