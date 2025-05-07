import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, catchError, throwError  } from 'rxjs';
// import { Movie, NewMovie } from '../_models/movies.model';
import { Showtime } from '../_models/showtimes.model';
import { Movie, MovieCreateRequest, MovieStatusResponse } from '../_models/movies.model';

@Injectable({
  providedIn: 'root',
})
export class MoviesService {
  private cachedMovies: Movie[] = [];

  private baseUrl = 'https://localhost:7063/api/movie-showtimes';
  private apiUrl = 'https://localhost:7063/api/movie-showtimes'
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

 

  addMovie(movieRequest: MovieCreateRequest): Observable<any> {
    console.log('Sending movie data to API:', movieRequest);
    return this.http.post<any>(this.apiUrl, movieRequest);
  }

  // updateMovie(movie: Movie): Observable<any> {
  //   return this.http.put(`${this.baseUrl}/${movie.movieId}`, movie);
  // }

  updateMovieWithShowtimes(movieId: number, requestBody: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${movieId}`, requestBody).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error); // so component can catch
      })
    );
  }
  
  toggleMovieStatus(movieId: number, isActive: boolean): Observable<MovieStatusResponse > {
    const params = new HttpParams().set('isActive', isActive.toString());
    const url = `https://localhost:7063/api/movies/${movieId}/toggle-status`;
    return this.http.patch<MovieStatusResponse >(url, null, { params });
  }


  bookTickets(payload: {
    userId: number;
    showtimeId: number;
    movieId: number;
    TicketCount: number;
  }): Observable<any> {
    return this.http.post('https://localhost:7063/api/bookings', payload);
  }
}



