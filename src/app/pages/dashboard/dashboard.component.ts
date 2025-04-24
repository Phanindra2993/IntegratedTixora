// // import { Component } from '@angular/core';

// // @Component({
// //   selector: 'app-dashboard',
// //   imports: [],
// //   templateUrl: './dashboard.component.html',
// //   styleUrl: './dashboard.component.scss'
// // })
// // export class DashboardComponent {

// // }

// import { Component, OnInit, resource } from '@angular/core';
// import { HeaderComponent } from '../../../components/header/header.component';
// import { FooterComponent } from '../../../components/footer/footer.component';
// import { MovieCardComponent } from '../../../components/movie-card/movie-card.component';
// import { MoviesService } from '../../../_services/movies.service';
// import { Movie } from '../../../_models/movies.model';
// import { CommonModule } from '@angular/common';
// import { NzButtonModule } from 'ng-zorro-antd/button';
// import { RouterLink } from '@angular/router';
// import { HttpClient } from '@angular/common/http';

// @Component({
//   selector: 'app-dashboard',
//   standalone: true,
//   imports: [
//     HeaderComponent,
//     FooterComponent,
//     MovieCardComponent,
//     CommonModule,
//     NzButtonModule,
//     RouterLink,
    
//   ],
//   templateUrl: './dashboard.component.html',
//   styleUrls: ['./dashboard.component.scss'],
// })
// export class DashboardComponent implements OnInit {
//   movies: Movie[] = [];
//   filteredMovies: Movie[] = [];
//   isLoading = false;
//   errorMessage = '';
//   inputValue: string = '';

//   selectedLanguage: string = '';
//   selectedGenre: string = '';
//   selectedRating: number | null=null;
//   selectedFormat: string = '';

//   constructor(private data: MoviesService) {}

//   ngOnInit(): void {
//     this.isLoading = true;
//     this.data.getMovies().subscribe({
//       next: (response) => {
//         this.movies = response;
//         this.filteredMovies = response;
//         this.isLoading = false;
//       },
//       error: (error) => {
//         console.error('Error', error);
//         this.errorMessage = 'Error while fetching movies';
//         this.isLoading = false;
//       },
//     });
//   }
//   onSearch(query: string) {
//     const lower = query.toLowerCase();

//     this.filteredMovies = this.movies.filter((movie) =>
//       movie.movieName.toLowerCase().includes(lower)
//     );
//     this.inputValue = '';
//   }
//   onInputChange() {
//     if (this.inputValue.trim() === '') {
//       this.filteredMovies = this.movies;
//     }
//   }

//   onLanguageFilter(language: string) {
//     this.selectedLanguage = language;
//     this.filterMovies();
//   }
//   onGenreFilter(genre: string) {
//     this.selectedGenre = genre;
//     this.filterMovies();
//   }

//   onRatingFilter(rating: number) {
//     this.selectedRating = rating;
//     this.filterMovies();
//   }
//   onFormatFilter(format: string) {
//     this.selectedFormat = format;
//     this.filterMovies();
//   }

//   filterMovies() {
//     this.filteredMovies = this.movies.filter((movie) => {
//       return (
//         (this.selectedLanguage
//           ? movie.language.toLowerCase() === this.selectedLanguage.toLowerCase()
//           : true) &&
//         (this.selectedGenre
//           ? movie.genre.toLowerCase() === this.selectedGenre.toLowerCase()
//           : true) &&
//         (this.selectedRating ? this.ratingFilterCheck(movie.rating) : true) &&
//         (this.selectedFormat
//           ? movie.format.toLowerCase() === this.selectedFormat.toLowerCase()
//           : true)
//       );
//     });
//   }

//   ratingFilterCheck(rating: number): boolean {
//     if (this.selectedRating === 5) {
//       return rating === 5;
//     } else if (this.selectedRating === 4) {
//       return rating >= 4 && rating < 5;
//     } else if (this.selectedRating === 3) {
//       return rating >= 3 && rating < 4;
//     } else if (this.selectedRating === 2) {
//       return rating >= 2 && rating < 3;
//     } else if (this.selectedRating === 1) {
//       return rating >= 1 && rating < 2;
//     }
//     return true;
//   }

//   resetFilters() {
//     this.selectedLanguage = '';
//     this.selectedGenre = '';
//     this.selectedRating = 0;
//     this.selectedFormat = '';
//     this.filteredMovies = this.movies;
//   }

//   // ---------------------------------------------------------------------------------
//   fetchMovies(): void {
//     this.http.get<any[]>('http://localhost:3000/movies').subscribe({
//       next: (data) => {
//         // Filter only active movies
//         this.movies = data.filter((movie) => movie.isActive);
//       },
//       error: (err) => {
//         console.error('Error fetching movies:', err);
//       },
//     });
//   }
//   // ---------------------------------------------------------------------------------
// }

import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../components/header/header.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { MovieCardComponent } from '../../../components/movie-card/movie-card.component';
import { Movie } from '../../../_models/movies.model';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    MovieCardComponent,
    CommonModule,
    NzButtonModule,
    RouterLink,
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

  selectedLanguage: string = '';
  selectedGenre: string = '';
  selectedRating: number | null = null;
  selectedFormat: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.fetchMovies(); // Fetch only active movies
  }

  // Fetch movies from db.json and filter only active movies
  fetchMovies(): void {
    this.http.get<Movie[]>('http://localhost:3000/movies').subscribe({
      next: (data) => {
        // Filter only active movies
        this.movies = data.filter((movie) => movie.isActive);
        this.filteredMovies = this.movies; // Initialize filteredMovies
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching movies:', err);
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
    this.selectedLanguage = language;
    this.filterMovies();
  }

  onGenreFilter(genre: string) {
    this.selectedGenre = genre;
    this.filterMovies();
  }

  onRatingFilter(rating: number) {
    this.selectedRating = rating;
    this.filterMovies();
  }

  onFormatFilter(format: string) {
    this.selectedFormat = format;
    this.filterMovies();
  }

  filterMovies() {
    this.filteredMovies = this.movies.filter((movie) => {
      return (
        (this.selectedLanguage
          ? movie.language.toLowerCase() === this.selectedLanguage.toLowerCase()
          : true) &&
        (this.selectedGenre
          ? movie.genre.toLowerCase() === this.selectedGenre.toLowerCase()
          : true) &&
        (this.selectedRating ? this.ratingFilterCheck(movie.rating) : true) &&
        (this.selectedFormat
          ? movie.format.toLowerCase() === this.selectedFormat.toLowerCase()
          : true)
      );
    });
  }

  ratingFilterCheck(rating: number): boolean {
    if (this.selectedRating === 5) {
      return rating === 5;
    } else if (this.selectedRating === 4) {
      return rating >= 4 && rating < 5;
    } else if (this.selectedRating === 3) {
      return rating >= 3 && rating < 4;
    } else if (this.selectedRating === 2) {
      return rating >= 2 && rating < 3;
    } else if (this.selectedRating === 1) {
      return rating >= 1 && rating < 2;
    }
    return true;
  }

  resetFilters() {
    this.selectedLanguage = '';
    this.selectedGenre = '';
    this.selectedRating = 0;
    this.selectedFormat = '';
    this.filteredMovies = this.movies;
  }
}