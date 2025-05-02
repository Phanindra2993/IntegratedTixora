import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HeaderComponent } from '../../../components/header/header.component';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FooterComponent } from '../../../components/footer/footer.component';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { MoviesService } from '../../../_services/movies.service';
import { Movie, MovieStatusResponse } from '../../../_models/movies.model';
import { NzFormModule } from 'ng-zorro-antd/form';
import { BookingService } from '../../../_services/booking.service';

@Component({
  selector: 'app-admin-dashboard',
  imports: [
    HeaderComponent,
    FormsModule,
    CommonModule,
    RouterLink,
    NzCardModule,
    NzButtonModule,
    NzModalModule,
    ReactiveFormsModule,
    FooterComponent,
    NzFormModule,
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent implements OnInit {
  movies: any[] = [];
  filteredMovies: Movie[] = [];
  isModalVisible = false;
  isLoading = false;
  errorMessage = '';
  movieForm!: FormGroup;
  selectedMovie: any = null;
  // availableShowTimes = ['11:00AM', '2:00PM', '6:00PM', '9:00PM'];
  searchQuery: string = '';
  successMessage = '';

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private movieService: MoviesService,
    private bookService: BookingService
  ) {}

  ngOnInit(): void {
    this.fetchMovies();
    this.initializeForm();
  }

  initializeForm(): void {
    this.movieForm = this.fb.group({
      movie: this.fb.group({
        title: ['', Validators.required],
        genre: ['', Validators.required],
        language: ['', Validators.required],
        format: ['', Validators.required],
        description: ['', Validators.required],
        imageUrl: [
          '',
          [Validators.required, Validators.pattern('https?://.+')],
        ],
        isActive: [true],
      }),
      shows: this.fb.array([this.createShow()]),
    });
  }

  createShow(): FormGroup {
    return this.fb.group({
      movieId: [0],
      showDate: ['', Validators.required],
      showTime: ['', Validators.required],
      availableSeats: [250, [Validators.required, Validators.min(1)]],
      isActive: [true],
      showtimeId: [0],
    });
  }

  addShow(): void {
    this.shows.push(this.createShow());
  }

  removeShow(index: number): void {
    this.shows.removeAt(index);
  }
  get shows(): FormArray {
    return this.movieForm.get('shows') as FormArray;
  }

  fetchMovies(): void {
    this.movieService.getAllMovies().subscribe({
      next: (response) => {
        this.movies = response.data; // <- Do not filter here
        this.filteredMovies = this.movies;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching movies from backend:', err);
        this.errorMessage = 'Error while fetching movies';
        this.isLoading = false;
      },
    });
  }

  openModal(movie: any): void {
    this.selectedMovie = movie;
    this.isModalVisible = true;

    this.movieForm.get('movie')?.patchValue({
      title: movie.title,
      genre: movie.genre,
      language: movie.language,
      format: movie.format,
      description: movie.description,
      imageUrl: movie.imageUrl,
      isActive: movie.isActive,
    });

    // Clear existing shows
    this.shows.clear();

    // Populate shows if available
    if (movie.shows && movie.shows.length > 0) {
      movie.shows.forEach((show: any) => {
        this.shows.push(
          this.fb.group({
            movieId: show.movieId || movie.id,
            showDate: show.showDate,
            showTime: show.showTime,
            availableSeats: show.availableSeats,
            isActive: show.isActive,
            showtimeId: show.showtimeId,
          })
        );
      });
    } else {
      this.shows.push(this.createShow()); // fallback
    }
  }

  closeModal(): void {
    this.isModalVisible = false;
    this.selectedMovie = null;
  }

  saveMovie(): void {
    if (this.movieForm.valid && this.selectedMovie) {
      this.isLoading = true;
      const requestBody = {
        movie: {
          ...this.movieForm.value.movie,
          movieId: this.selectedMovie.movieId, // Include the movie ID
        },
        shows: this.movieForm.value.shows.map((show: any) => ({
          ...show,
          movieId: this.selectedMovie.movieId, // Ensure each show has the movie ID
        })),
      };

      this.bookService
        .updateMovieWithShowtimes(this.selectedMovie.movieId, requestBody)
        .subscribe({
          next: (response) => {
            console.log('Update successful', response);
            // Show success message
            this.isModalVisible = false;
            this.fetchMovies(); // Refresh your movie list
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Error updating movie', err);
            // Show error message
            this.isLoading = false;
          },
        });
    } else {
      console.error('Form is invalid or no movie selected');
    }
  }

  onSearch(query: string) {
    this.searchQuery = query;
    if (!query) {
      this.filteredMovies = this.movies;
    } else {
      const lowerQuery = query.toLowerCase();
      this.filteredMovies = this.movies.filter(
        (movie) =>
          movie.title.toLowerCase().includes(lowerQuery) ||
          movie.genre.toLowerCase().includes(lowerQuery) ||
          movie.language.toLowerCase().includes(lowerQuery)
      );
    }
  }

  onSubmit() {
    if (this.movieForm.invalid) return;

    const formValues = this.movieForm.value;

    const requestBody = {
      movie: {
        title: formValues.title,
        genre: formValues.genre,
        language: formValues.language,
        format: formValues.format,
        description: formValues.description,
        imageUrl: formValues.imageUrl,
        isActive: formValues.isActive,
      },
      shows: [
        {
          movieId: formValues.movieId,
          showDate: formValues.showDate,
          showTime: formValues.showTime,
          availableSeats: formValues.availableSeats,
          isActive: formValues.showIsActive,
          showtimeId: formValues.showtimeId,
        },
      ],
    };

    this.isLoading = true;
    this.http.post('http://your-api-endpoint/movies', requestBody).subscribe({
      next: (response) => {
        this.successMessage = 'Movie added successfully!';
        this.errorMessage = '';
        this.movieForm.reset();
        this.isLoading = false;
        this.closeModal(); // Optional: close modal after submit
      },
      error: (error) => {
        this.errorMessage = 'Failed to add movie. Please try again.';
        this.successMessage = '';
        this.isLoading = false;
      },
    });
  }

  toggleMovieStatus(movie: Movie) {
    if (!movie.movieId) {
      console.error('Cannot toggle - missing movieId');
      return;
    }

    // Call API with the opposite of current status
    this.movieService
      .toggleMovieStatus(movie.movieId, !movie.isActive)
      .subscribe({
        next: (res: MovieStatusResponse) => {
          console.log('API returned:', res);

          if (res.message.includes('Active')) {
            movie.isActive = true;
          } else if (res.message.includes('Inactive')) {
            movie.isActive = false;
          }

          console.log(
            `Movie ${movie.title} is now ${
              movie.isActive ? 'Active' : 'Inactive'
            }`
          );
        },
        error: (error) => {
          console.error('Toggle failed:', error);
          alert(`Failed to update status: ${error.message}`);
        },
      });
  }

 

 
}
