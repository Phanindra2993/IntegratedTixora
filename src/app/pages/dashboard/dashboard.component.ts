import { Component, OnInit, resource } from '@angular/core';
import { HeaderComponent } from '../../../components/header/header.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { MovieCardComponent } from '../../../components/movie-card/movie-card.component';
import { MoviesService } from '../../../_services/movies.service';
import { Movie } from '../../../_models/movies.model';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { RouterLink } from '@angular/router';
import { BookTicketsComponent } from '../book-tickets/book-tickets.component';

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

  constructor(private data: MoviesService) {}

  toggleSelection<T>(selectedArray: T[], value: T): T[] {
    // If the value is already in the array, remove it; otherwise, add it
    return selectedArray.includes(value)
      ? selectedArray.filter((v) => v !== value) // remove if already selected
      : [...selectedArray, value]; // add if not present
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.data.getMovies().subscribe({
      next: (response) => {
        this.movies = response;
        this.filteredMovies = response;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error', error);
        this.errorMessage = 'Error while fetching movies';
        this.isLoading = false;
      },
    });
  }
  onSearch(query: string) {
    const lower = query.toLowerCase();

    this.filteredMovies = this.movies.filter((movie) =>
      movie.movieName.toLowerCase().includes(lower)
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
