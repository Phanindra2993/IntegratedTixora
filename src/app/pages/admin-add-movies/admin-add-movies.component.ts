import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MoviesService } from '../../../_services/movies.service';
import { MovieCreateRequest } from '../../../_models/movies.model';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../components/header/header.component';
import { RouterLink, RouterModule } from '@angular/router';
import { FooterComponent } from "../../../components/footer/footer.component";

@Component({
  selector: 'app-admin-add-movies',
  standalone: true,
  imports: [CommonModule, HeaderComponent, ReactiveFormsModule, RouterLink, FooterComponent,FormsModule, RouterModule],
  templateUrl: './admin-add-movies.component.html',
  styleUrls: ['./admin-add-movies.component.scss'],
})

export class AdminAddMoviesComponent implements OnInit {
  movieForm!: FormGroup;
  isLoading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  genreTags: string[] = [];
  languageTags: string[] = [];
  today = new Date().toISOString().split('T')[0];


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
      language: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]],
      genre: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]],
      format: ['2D', Validators.required],
      showDate: [new Date().toISOString().split('T')[0], Validators.required],
      showTimes: ['', Validators.required],
      description: ['', Validators.required],
      imageUrl: ['', [Validators.required, Validators.pattern('https?://.+')]],
    });
  }

  get languageControl(): FormControl {
    return this.movieForm.get('language') as FormControl;
  }

  get genreControl(): FormControl {
    return this.movieForm.get('genre') as FormControl;
  }

  addGenre(event: any): void {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      const value = event.target.value.trim();
      if (value && !this.genreTags.includes(value)) {
        this.genreTags.push(value);
        this.movieForm.get('genre')?.setValue(this.genreTags.join(', '));
        event.target.value = '';
      }
    }
  }

  removeGenre(index: number): void {
    this.genreTags.splice(index, 1);
    this.movieForm.get('genre')?.setValue(this.genreTags.join(', '));
  }

  addLanguage(event: any): void {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      const value = event.target.value.trim();
      if (value && !this.languageTags.includes(value)) {
        this.languageTags.push(value);
        this.movieForm.get('language')?.setValue(this.languageTags.join(', '));
        event.target.value = '';
      }
    }
  }

  removeLanguage(index: number): void {
    this.languageTags.splice(index, 1);
    this.movieForm.get('language')?.setValue(this.languageTags.join(', '));
  }

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
        .filter((time: string) => time)  
        .map((time: string) => ({        
          movieId: 0,
          showDate: formValue.showDate,
          showTime: this.convertTo24HourFormat(time),
          availableSeats: 250,
          isActive: true
        }))
    };
    console.log('Request payload:', request);
    this.moviesService.addMovie(request).subscribe({
      next: (response) => {
        this.successMessage = 'Movie added successfully!';
        alert("Movie added successfully!")
        this.movieForm.reset();
        this.initializeForm();
        this.genreTags = [];
        this.languageTags = [];
      },
      // error: (err) => {
      //   this.errorMessage = err.error?.message || 'Failed to add movie. Please try again.';
      // },
      error: (err) => {
        console.error('Error response:', err); // Log to see the issue
        if (err.error?.message) {
          this.errorMessage = err.error.message;
        } else if (err.status === 400 && typeof err.error === 'string') {
          this.errorMessage = err.error;
        } else {
          this.errorMessage = 'Failed to add movie. Please try again.';
        }
      },
      
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  // private convertTo24HourFormat(time12h: string): string {
  //   const [time, modifier] = time12h.split(/(AM|PM)/i);
  //   let [hours, minutes] = time.split(':').map(Number);

  //   if (modifier?.toUpperCase() === 'PM' && hours < 12) {
  //     hours += 12;
  //   } else if (modifier?.toUpperCase() === 'AM' && hours === 12) {
  //     hours = 0;
  //   }

  //   return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  // }

  private convertTo24HourFormat(time12h: string): string {
    const [time, modifier] = time12h.split(/(AM|PM)/i);
    let [hours, minutes] = time?.split(':').map(Number);
  
    if (isNaN(hours) || isNaN(minutes)) {
      console.error('Invalid time format:', time12h);
      return '00:00'; // fallback value
    }
  
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