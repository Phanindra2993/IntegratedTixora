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
import { RouterLink, RouterModule } from '@angular/router';
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
    RouterModule
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
  today = new Date().toISOString().split('T')[0]; // yyyy-MM-dd


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

  

  // createShow(isNew: boolean = true): FormGroup {
  //   return this.fb.group({
  //     movieId: [0],
  //     showDate: ['', isNew ? [Validators.required, this.futureDateValidator()] : [Validators.required]],
  //     showTime: ['', isNew ? [Validators.required, this.futureTimeValidator()] : [Validators.required]],
  //     availableSeats: [250, [Validators.required, Validators.min(1)]],
  //     isActive: [true],
  //     showtimeId: [0],
  //     isNew: [isNew] // Add this flag to identify new shows
  //   });
  // }

  // addShow(): void {
  //   this.shows.push(this.createShow());
  // }

  createShow(isNew: boolean = true): FormGroup {
    return this.fb.group({
      movieId: [0],
      showDate: ['', isNew ? [Validators.required, this.futureDateValidator()] : [Validators.required]],
      showTime: ['', isNew ? [
        Validators.required, 
        this.futureTimeValidator(),
        this.asyncValidator()
      ] : [Validators.required]],
      availableSeats: [250, [Validators.required, Validators.min(1)]],
      isActive: [true],
      showtimeId: [0],
      isNew: [isNew]
    });
  }

  addShow(): void {
    this.shows.push(this.createShow(true));
  }
  

// private futureDateValidator() {
//   return (control: any) => {
//     // Only validate if this is a new show
//     if (control.parent && !control.parent.get('isNew')?.value) {
//       return null;
//     }

//     const selectedDate = new Date(control.value);
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
    
//     return selectedDate >= today ? null : { pastDate: true };
//   };
// }

private futureDateValidator() {
  return (control: any) => {
    // Only validate if this is a new show
    if (control.parent && !control.parent.get('isNew')?.value) {
      return null;
    }

    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return selectedDate >= today ? null : { pastDate: true };
  };
}

// private futureTimeValidator() {
//   return (control: any) => {
//     // Only validate if this is a new show
//     if (control.parent && !control.parent.get('isNew')?.value) {
//       return null;
//     }

//     if (!control.parent) return null;
    
//     const dateControl = control.parent.get('showDate');
//     if (!dateControl || !dateControl.value) return null;
    
//     const selectedDate = new Date(dateControl.value);
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
    
//     // If date is in future, time doesn't matter
//     if (selectedDate > today) return null;
    
//     // If date is today, check time
//     const selectedTime = control.value;
//     if (!selectedTime) return null;
    
//     const now = new Date();
//     const [hours, minutes] = selectedTime.split(':').map(Number);
//     const selectedDateTime = new Date();
//     selectedDateTime.setHours(hours, minutes, 0, 0);
    
//     return selectedDateTime > now ? null : { pastTime: true };
//   };
// }

private futureTimeValidator() {
  return (control: any) => {
    // Only validate if this is a new show
    if (control.parent && !control.parent.get('isNew')?.value) {
      return null;
    }

    if (!control.parent) return null;
    
    const dateControl = control.parent.get('showDate');
    if (!dateControl || !dateControl.value) return null;
    
    const selectedDate = new Date(dateControl.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // If date is in future, time doesn't matter for validation
    if (selectedDate > today) return null;
    
    // If date is today, check time
    const selectedTime = control.value;
    if (!selectedTime) return null;
    
    const now = new Date();
    const [hours, minutes] = selectedTime.split(':').map(Number);
    const selectedDateTime = new Date();
    selectedDateTime.setHours(hours, minutes, 0, 0);
    
    return selectedDateTime > now ? null : { pastTime: true };
  };
}

private asyncValidator() {
  return (control: any) => {
    // Only validate if this is a new show
    if (control.parent && !control.parent.get('isNew')?.value) {
      return null;
    }

    if (!control.parent) return null;

    const dateControl = control.parent.get('showDate');
    const timeControl = control.parent.get('showTime');
    
    if (!dateControl || !dateControl.value || !timeControl || !timeControl.value) {
      return null;
    }

    const selectedDate = new Date(dateControl.value);
    const selectedTime = timeControl.value;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Skip validation for past dates
    if (selectedDate < today) {
      return null;
    }

    // Check for conflicts with other future shows
    const allShows = this.shows.value;
    const currentShowIndex = this.shows.controls.indexOf(control.parent);

    for (let i = 0; i < allShows.length; i++) {
      if (i === currentShowIndex) continue;

      const show = allShows[i];
      if (!show.showDate || !show.showTime) continue;

      const showDate = new Date(show.showDate);
      
      // Only check against future shows
      if (showDate >= today && 
          showDate.getTime() === selectedDate.getTime() && 
          show.showTime === selectedTime) {
        return { conflict: true };
      }
    }

    return null;
  };
}

hasDuplicateShows(): boolean {
  interface Show {
    showDate?: string;
    showTime?: string;
    // Add other properties if needed
    [key: string]: any;
  }

  const futureShows = this.shows.value.filter((show: Show) => {
    if (!show.showDate) return false;
    const showDate = new Date(show.showDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return showDate >= today;
  });

  const showMap = new Map<string, boolean>();
  for (const show of futureShows) {
    if (!show.showDate || !show.showTime) continue;
    
    const key = `${show.showDate}-${show.showTime}`;
    if (showMap.has(key)) {
      return true;
    }
    showMap.set(key, true);
  }
  return false;
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
        this.movies = response.data; 
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

  // openModal(movie: any): void {
  //   this.selectedMovie = movie;
  //   this.isModalVisible = true;

  //   this.movieForm.get('movie')?.patchValue({
  //     title: movie.title,
  //     genre: movie.genre,
  //     language: movie.language,
  //     format: movie.format,
  //     description: movie.description,
  //     imageUrl: movie.imageUrl,
  //     isActive: movie.isActive,
  //   });

  //   // Clear existing shows
  //   this.shows.clear();

  //   // Populate shows if available
  //   if (movie.shows && movie.shows.length > 0) {
  //     movie.shows.forEach((show: any) => {
  //       // Format date for the input field (YYYY-MM-DD)
  //       const formattedDate = show.showDate ? 
  //         new Date(show.showDate).toISOString().split('T')[0] : '';
        
  //       // Format time for the input field (HH:MM)
  //       let formattedTime = show.showTime || '';
  //       if (formattedTime) {
  //         // Convert "2:00PM" to "14:00" if needed
  //         if (formattedTime.includes('AM') || formattedTime.includes('PM')) {
  //           formattedTime = this.convertTime12to24(formattedTime);
  //         }
  //       }
        

  //       this.shows.push(
  //         this.fb.group({
  //           movieId: show.movieId || movie.movieId || movie.id,
  //           showDate: formattedDate,
  //           showTime: formattedTime,
  //           availableSeats: show.availableSeats || 250,
  //           isActive: show.isActive !== undefined ? show.isActive : true,
  //           showtimeId: show.showtimeId || 0,
  //         })
  //       );
  //     });
  //   } else {
  //     // Fallback with the movie ID set
  //     const newShow = this.createShow();
  //     newShow.patchValue({
  //       movieId: movie.movieId || movie.id
  //     });
  //     this.shows.push(newShow);
  //   }
  // }

  // openModal(movie: any): void {
  //   this.selectedMovie = movie;
  //   this.isModalVisible = true;
  
  //   // Patch movie details
  //   this.movieForm.get('movie')?.patchValue({
  //     title: movie.title,
  //     genre: movie.genre,
  //     language: movie.language,
  //     format: movie.format,
  //     description: movie.description,
  //     imageUrl: movie.imageUrl,
  //     isActive: movie.isActive,
  //   });
  
  //   // Clear existing shows
  //   this.shows.clear();
  
  //   // Fetch showtimes for this movie
  //   this.movieService.getShowtimesByMovieId(movie.movieId).subscribe({
  //     next: (response) => {
  //       if (response.success && response.data.length > 0) {
  //         // Populate shows from API response
  //         response.data.forEach((show: any) => {
  //           this.shows.push(
  //             this.fb.group({
  //               movieId: show.movieId,
  //               showDate: this.formatDateForInput(show.showDate),
  //               showTime: this.formatTimeForInput(show.showTime),
  //               availableSeats: show.availableSeats,
  //               isActive: show.isActive,
  //               showtimeId: show.showtimeId,
  //             })
  //           );
  //         });
  //       } else {
  //         // Add one empty show if no shows exist
  //         this.shows.push(this.createShow());
  //       }
  //     },
  //     error: (err) => {
  //       console.error('Error fetching showtimes:', err);
  //       // Fallback - add one empty show
  //       this.shows.push(this.createShow());
  //     }
  //   });
  // }

  openModal(movie: any): void {
    this.selectedMovie = movie;
    this.isModalVisible = true;
  
    // Patch movie details
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
  
    // Fetch showtimes for this movie
    this.movieService.getShowtimesByMovieId(movie.movieId).subscribe({
      next: (response) => {
        if (response.success && response.data.length > 0) {
          // Populate shows from API response
          response.data.forEach((show: any) => {
            this.shows.push(
              this.fb.group({
                movieId: show.movieId,
                showDate: this.formatDateForInput(show.showDate),
                showTime: this.formatTimeForInput(show.showTime),
                availableSeats: show.availableSeats,
                isActive: show.isActive,
                showtimeId: show.showtimeId,
                isNew: false // Mark existing shows as not new
              })
            );
          });
        } else {
          // Add one empty show if no shows exist
          this.shows.push(this.createShow(true));
        }
      },
      error: (err) => {
        console.error('Error fetching showtimes:', err);
        // Fallback - add one empty show
        this.shows.push(this.createShow(true));
      }
    });
  }
  
  // Helper methods to format date and time for input fields
  private formatDateForInput(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }
  
  private formatTimeForInput(timeString: string): string {
    // Assuming timeString is in format "HH:mm:ss" or similar
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  }
  private convertTime12to24(time12h: string): string {
    const [time, modifier] = time12h.split(/(?=[AP]M)/i);
    let [hours, minutes] = time.split(':');
    
    if (hours === '12') {
      hours = '00';
    }
    
    if (modifier.toLowerCase() === 'pm') {
      hours = (parseInt(hours, 10) + 12).toString();
    }
    
    return `${hours.padStart(2, '0')}:${minutes}`;
  }
  

  closeModal(): void {
    this.isModalVisible = false;
    this.selectedMovie = null;
  }

  saveMovie(): void {
    if (this.movieForm.invalid || !this.selectedMovie) {
      this.errorMessage = 'Please fill all required fields correctly.';
      return;
    }
  
    this.isLoading = true;
    this.errorMessage = '';
    
    const requestBody = {
      movie: {
        ...this.movieForm.value.movie,
        movieId: this.selectedMovie.movieId,
      },
      shows: this.movieForm.value.shows.map((show: any) => ({
        ...show,
        movieId: this.selectedMovie.movieId,
        // Convert date/time to backend format if needed
        showDate: show.showDate,
        showTime: show.showTime,
        isNew: show.isNew // Send the flag to backend if needed
      })),
    };
  
    this.movieService
      .updateMovieWithShowtimes(this.selectedMovie.movieId, requestBody)
      .subscribe({
        next: (response) => {
          this.isModalVisible = false;
          this.fetchMovies();
          this.isLoading = false;
          this.successMessage = 'Movie and showtimes updated successfully!';
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (err) => {
          this.isLoading = false;
          if (err.error && err.error.message) {
            this.errorMessage = err.error.message;
          } else {
            this.errorMessage = 'An unexpected error occurred.';
          }
        },
      });
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
