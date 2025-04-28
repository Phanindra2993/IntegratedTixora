
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
  imports: [HeaderComponent, FormsModule, CommonModule, RouterLink, NzCardModule, NzButtonModule, NzModalModule, ReactiveFormsModule, FooterComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent implements OnInit {
  movies: any[] = []; 
  isModalVisible = false; 
  movieForm!: FormGroup; 
  selectedMovie: any = null; 
  availableShowTimes = ['11:00AM', '2:00PM', '6:00PM', '9:00PM']; 

  constructor(private http: HttpClient, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.fetchMovies(); 

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

  fetchMovies(): void {
    this.http.get<any[]>('http://localhost:3000/movies').subscribe({
      next: (data) => {
        this.movies = data; 
      },
      error: (err) => {
        console.error('Error fetching movies:', err);
      },
    });
  }

  openModal(movie: any): void {
    this.selectedMovie = movie;
    this.movieForm.patchValue(movie); 
    this.isModalVisible = true;
  }

  closeModal(): void {
    this.isModalVisible = false;
    this.selectedMovie = null;
  }

  saveMovie(): void {
    if (this.movieForm.valid) {
      const updatedMovie = { ...this.selectedMovie, ...this.movieForm.value };

      this.http.put(`http://localhost:3000/movies/${updatedMovie.id}`, updatedMovie).subscribe({
        next: () => {
          alert('Movie updated successfully!');
          this.fetchMovies(); 
          this.closeModal(); 
        },
        error: (err) => {
          console.error('Error updating movie:', err);
        },
      });
    } else {
      alert('Please fill out all required fields.');
    }
  }

  deleteMovie(id: string): void {
    this.http.delete(`http://localhost:3000/movies/${id}`).subscribe({
      next: () => {
        alert('Movie deleted successfully!');
        this.fetchMovies(); 
      },
      error: (err) => {
        console.error('Error deleting movie:', err);
      },
    });
  }

toggleMovieStatus(movie: any): void {
  const updatedMovie = { ...movie, isActive: !movie.isActive };

  this.http.put(`http://localhost:3000/movies/${movie.id}`, updatedMovie).subscribe({
    next: () => {
      alert(`Movie is now ${updatedMovie.isActive ? 'Active' : 'Inactive'}!`);
      this.fetchMovies(); 
    },
    error: (err) => {
      console.error('Error toggling movie status:', err);
    },
  });
}
}