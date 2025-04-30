import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../components/header/header.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { MovieCardComponent } from '../../../components/movie-card/movie-card.component';
import { Movie } from '../../../_models/movies.model';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MoviesService } from '../../../_services/movies.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    CommonModule,
    NzButtonModule,
    RouterLink,
    MovieCardComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  movies: Movie[] = [];
  filteredMovies: Movie[] = [];
  isLoading = false;
  errorMessage = '';
  inputValue: string = '';

  selectedLanguage: string[] = [];
  selectedGenre: string[] = [];
  selectedRating: number[] = [];
  selectedFormat: string[] = [];

  constructor(private moviesService: MoviesService) {}

  toggleSelection<T>(selectedArray: T[], value: T): T[] {
    return selectedArray.includes(value)
      ? selectedArray.filter((v) => v !== value)
      : [...selectedArray, value];
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.fetchMovies();
  }

  // Fetch movies from db.json and filter only active movies
  // fetchMovies(): void {
  //   this.http.get<Movie[]>('http://localhost:3000/movies').subscribe({
  //     next: (data) => {
  //       this.movies = data.filter((movie) => movie.isActive);
  //       this.filteredMovies = this.movies;
  //       this.isLoading = false;
  //     },
  //     error: (err) => {
  //       console.error('Error fetching movies:', err);
  //       this.errorMessage = 'Error while fetching movies';
  //       this.isLoading = false;
  //     },
  //   });
  // }

  fetchMovies(): void {
    this.moviesService.getAllMovies().subscribe({
      next: (response) => {
        this.movies = response.data.filter((movie) => movie.isActive );
         console.log(this.movies);
        this.filteredMovies = this.movies;
      //  console.log(this.filterMovies);
               
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching movies from backend:', err);
        this.errorMessage = 'Error while fetching movies';
        this.isLoading = false;
      },
    });
  }
  

  onSearch(query: string) {
    const lower = query.toLowerCase();
    this.filteredMovies = this.movies.filter((movie) =>
      movie.title.toLowerCase().includes(lower)
    );
    this.inputValue = '';
  }

  onInputChange() {
    if (this.inputValue.trim() === '') {
      this.filteredMovies = this.movies;
    }
  }

  onLanguageFilter(language: string) {
    this.selectedLanguage = this.toggleSelection(
      this.selectedLanguage,
      language
    );
    this.filterMovies();
  }

  onGenreFilter(genre: string) {
    this.selectedGenre = this.toggleSelection(this.selectedGenre, genre);
    this.filterMovies();
  }

  onRatingFilter(rating: number) {
    this.selectedRating = this.toggleSelection(this.selectedRating, rating);
    this.filterMovies();
  }

  onFormatFilter(format: string) {
    this.selectedFormat = this.toggleSelection(this.selectedFormat, format);
    this.filterMovies();
  }

  filterMovies() {
    this.filteredMovies = this.movies.filter((movie) => {
      return (
        (this.selectedLanguage.length
          ? this.selectedLanguage.includes(movie.language)
          : true) &&
        (this.selectedGenre.length
          ? this.selectedGenre.includes(movie.genre)
          : true) &&
        (this.selectedRating.length
          ? this.selectedRating.some((r) =>
              this.ratingFilterCheck(movie.rating, r)
            )
          : true) &&
        (this.selectedFormat.length
          ? this.selectedFormat.includes(movie.format)
          : true)
      );
    });
  }

  ratingFilterCheck(movieRating: number, filterRating: number): boolean {
    if (filterRating === 5) return movieRating === 5;
    if (filterRating === 4) return movieRating >= 4 && movieRating < 5;
    if (filterRating === 3) return movieRating >= 3 && movieRating < 4;
    if (filterRating === 2) return movieRating >= 2 && movieRating < 3;
    if (filterRating === 1) return movieRating >= 1 && movieRating < 2;
    return true;
  }

  resetFilters() {
    this.selectedLanguage = [];
    this.selectedGenre = [];
    this.selectedRating = [];
    this.selectedFormat = [];
    this.filteredMovies = this.movies;
  }
}
