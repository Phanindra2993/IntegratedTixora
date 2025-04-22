import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Movie } from '../_models/movies.model';

@Injectable({
  providedIn: 'root',
})
export class MoviesService {
  private cachedMovies: Movie[] = [];
  

  private url = 'http://localhost:3000/movies';
  constructor(private http: HttpClient) {}

  getMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(this.url);
  }
  getMovieById(id: number): Observable<Movie> {
    return this.http.get<Movie>(`http://localhost:3000/movies/${id}`);
  }

  getAllMovies(): Observable<Movie[]> {
    return this.http
      .get<Movie[]>('http://localhost:3000/movies')
      .pipe(tap((movies) => (this.cachedMovies = movies)));
  }
  getCachedMovies(): Movie[] {
    return this.cachedMovies;
  }
}
