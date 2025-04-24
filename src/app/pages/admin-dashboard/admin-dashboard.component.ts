
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HeaderComponent } from '../../../components/header/header.component';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FooterComponent } from '../../../components/footer/footer.component';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-admin-dashboard',
  imports: [HeaderComponent, FormsModule, CommonModule, RouterLink, NzCardModule, NzButtonModule, NzModalModule,ReactiveFormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent implements OnInit {
  movies: any[] = []; // Array to store movies
  isModalVisible = false; // Modal visibility
  movieForm!: FormGroup; // Form group for the modal
  selectedMovie: any = null; // Currently selected movie for editing
  availableShowTimes = ['11:00AM', '2:00PM', '6:00PM', '9:00PM']; // Show times dropdown options

  constructor(private http: HttpClient, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.fetchMovies(); // Fetch movies on component initialization

    // Initialize the form
    this.movieForm = this.fb.group({
      movieName: ['', Validators.required],
      genre: ['', Validators.required],
      language: ['', Validators.required],
      format: ['', Validators.required],
      rating: [null, [Validators.required, Validators.min(0), Validators.max(5)]],
      showTimes: ['', Validators.required],
      description: ['', Validators.required],
      imageUrl: ['', Validators.required],
    });
  }

  // Fetch movies from db.json
  fetchMovies(): void {
    this.http.get<any[]>('http://localhost:3000/movies').subscribe({
      next: (data) => {
        this.movies = data; // Store the fetched movies in the array
      },
      error: (err) => {
        console.error('Error fetching movies:', err);
      },
    });
  }

  // Open the modal and populate the form with the selected movie's details
  openModal(movie: any): void {
    this.selectedMovie = movie;
    this.movieForm.patchValue(movie); // Populate the form with movie details
    this.isModalVisible = true;
  }

  // Close the modal
  closeModal(): void {
    this.isModalVisible = false;
    this.selectedMovie = null;
  }

  // Save the updated movie details
  saveMovie(): void {
    if (this.movieForm.valid) {
      const updatedMovie = { ...this.selectedMovie, ...this.movieForm.value };

      // Send PUT request to update the movie
      this.http.put(`http://localhost:3000/movies/${updatedMovie.id}`, updatedMovie).subscribe({
        next: () => {
          alert('Movie updated successfully!');
          this.fetchMovies(); // Refresh the movie list
          this.closeModal(); // Close the modal
        },
        error: (err) => {
          console.error('Error updating movie:', err);
        },
      });
    } else {
      alert('Please fill out all required fields.');
    }
  }

  // Delete a movie
  deleteMovie(id: string): void {
    this.http.delete(`http://localhost:3000/movies/${id}`).subscribe({
      next: () => {
        alert('Movie deleted successfully!');
        this.fetchMovies(); // Refresh the movie list
      },
      error: (err) => {
        console.error('Error deleting movie:', err);
      },
    });
  }

  // Toggle the active/inactive status of a movie
toggleMovieStatus(movie: any): void {
  const updatedMovie = { ...movie, isActive: !movie.isActive };

  this.http.put(`http://localhost:3000/movies/${movie.id}`, updatedMovie).subscribe({
    next: () => {
      alert(`Movie is now ${updatedMovie.isActive ? 'Active' : 'Inactive'}!`);
      this.fetchMovies(); // Refresh the movie list
    },
    error: (err) => {
      console.error('Error toggling movie status:', err);
    },
  });
}
}