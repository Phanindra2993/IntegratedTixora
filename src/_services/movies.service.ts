import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Movie } from '../_models/movies.model';

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

  getMovieById(id: number): Observable<Movie> {
    return this.http.get<Movie>(`https://localhost:7063/api/movies/${id}`);
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


  getAllMovies(): Observable<{ success: boolean; data: Movie[]; message: string }> {
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
  
  
  getCachedMovies(): Movie[] {
    return this.cachedMovies;
  }
}
