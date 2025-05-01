
// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { HttpClient } from '@angular/common/http';
// import { HeaderComponent } from '../../../components/header/header.component';
// import { RouterLink } from '@angular/router';

// @Component({
//   selector: 'app-admin-add-movies',
//   imports: [HeaderComponent,ReactiveFormsModule, RouterLink],
//   templateUrl: './admin-add-movies.component.html',
//   styleUrls: ['./admin-add-movies.component.scss'],
// })
// export class AdminAddMoviesComponent implements OnInit {
//   movieForm!: FormGroup;

//   constructor(private fb: FormBuilder, private http: HttpClient) {}

//   ngOnInit(): void {
//     this.movieForm = this.fb.group({
//       movieName: ['', Validators.required],
//       language: ['', Validators.required],
//       genre: ['', Validators.required],
//       format: ['', Validators.required],
//       rating: [null, [Validators.required, Validators.min(0), Validators.max(5)]],
//       showTimes: ['', Validators.required],
//       description: ['', Validators.required],
//       imageUrl: ['', Validators.required],
//     });
//   }

//   onSubmit(): void {
//     if (this.movieForm.valid) {
//       const movie = { ...this.movieForm.value };

//       // Convert showTimes to an array
//       movie.showTimes = movie.showTimes.split(',').map((time: string) => time.trim());

//       // Fetch the current list of movies to determine the max id
//       this.http.get<any[]>('http://localhost:3000/movies').subscribe({
//         next: (movies) => {
//           // Find the maximum id and assign the next id
//           const maxId = movies
//             .map((m) => parseInt(m.id, 10))
//             .filter((id) => !isNaN(id))
//             .reduce((max, id) => Math.max(max, id), 0);

//           movie.id = (maxId + 1).toString();

//           // Send POST request to add the new movie
//           this.http.post('http://localhost:3000/movies', movie).subscribe(() => {
//             alert('Movie added successfully!');
//             this.movieForm.reset();
//           });
//         },
//         error: (err) => {
//           console.error('Error fetching movies:', err);
//           alert('Failed to fetch movies. Please try again later.');
//         },
//       });
//     } else {
//       alert('Please fill out all required fields.');
//     }
//   }
// }

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MoviesService } from '../../../_services/movies.service';
import { MovieCreateRequest } from '../../../_models/movies.model';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../components/header/header.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-add-movies',
  standalone: true,
  imports: [CommonModule, HeaderComponent, ReactiveFormsModule, RouterLink],
  templateUrl: './admin-add-movies.component.html',
  styleUrls: ['./admin-add-movies.component.scss'],
})
export class AdminAddMoviesComponent implements OnInit {
  movieForm!: FormGroup;
  isLoading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  // availableShowTimes = ['11:00AM', '2:00PM', '6:00PM', '9:00PM'];

  constructor(
    private fb: FormBuilder,
    private moviesService: MoviesService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.movieForm = this.fb.group({
      title: ['', Validators.required],
      language: ['English', Validators.required],
      genre: ['Drama', Validators.required],
      format: ['2D', Validators.required],
      showDate: [new Date().toISOString().split('T')[0], Validators.required], // Added showDate
      showTimes: ['', Validators.required],
      description: ['', Validators.required],
      imageUrl: ['', [Validators.required, Validators.pattern('https?://.+')]],
    });
  }

  // onSubmit(): void {
  //   if (this.movieForm.invalid) {
  //     this.markFormGroupTouched(this.movieForm);
  //     return;
  //   }

  //   this.isLoading = true;
  //   const formValue = this.movieForm.value;

  //   const request: MovieCreateRequest = {
  //     movie: {
  //       title: formValue.title,
  //       genre: formValue.genre,
  //       language: formValue.language,
  //       format: formValue.format,
  //       description: formValue.description,
  //       imageUrl: formValue.imageUrl,
  //       isActive: true
  //     },
  //     shows: formValue.showTimes
  //       .split(',')
  //       .map((time: string) => time.trim())
  //       .filter(time => time)
  //       .map(time => ({
  //         movieId: 0, // Will be set by backend
  //         showDate: formValue.showDate,
  //         showTime: this.convertTo24HourFormat(time),
  //         availableSeats: 250, // Default value
  //         isActive: true
  //       }))
  //   };

  //   this.moviesService.addMovie(request).subscribe({
  //     next: (response) => {
  //       this.successMessage = 'Movie added successfully!';
  //       this.movieForm.reset();
  //       this.initializeForm();
  //     },
  //     error: (err) => {
  //       console.error('Error:', err);
  //       this.errorMessage = err.error?.message || 'Failed to add movie. Please try again.';
  //     },
  //     complete: () => {
  //       this.isLoading = false;
  //     }
  //   });
  // }

  onSubmit(): void {
    if (this.movieForm.invalid) {
      this.markFormGroupTouched(this.movieForm);
      return;
    }
  
    this.isLoading = true;
    const formValue = this.movieForm.value;
  
    const request: MovieCreateRequest = {
      movie: {
        title: formValue.title,
        genre: formValue.genre,
        language: formValue.language,
        format: formValue.format,
        description: formValue.description,
        imageUrl: formValue.imageUrl,
        isActive: true
      },
      shows: formValue.showTimes
        .split(',')
        .map((time: string) => time.trim())
        .filter((time: string) => time)  // Explicitly type the parameter
        .map((time: string) => ({        // Explicitly type the parameter
          movieId: 0,
          showDate: formValue.showDate,
          showTime: this.convertTo24HourFormat(time),
          availableSeats: 250,
          isActive: true
        }))
    };
  
    this.moviesService.addMovie(request).subscribe({
      next: (response) => {
        this.successMessage = 'Movie added successfully!';
        this.movieForm.reset();
        this.initializeForm();
      },
      error: (err) => {
        console.error('Error:', err);
        this.errorMessage = err.error?.message || 'Failed to add movie. Please try again.';
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  private convertTo24HourFormat(time12h: string): string {
    const [time, modifier] = time12h.split(/(AM|PM)/i);
    let [hours, minutes] = time.split(':').map(Number);

    if (modifier?.toUpperCase() === 'PM' && hours < 12) {
      hours += 12;
    } else if (modifier?.toUpperCase() === 'AM' && hours === 12) {
      hours = 0;
    }

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}