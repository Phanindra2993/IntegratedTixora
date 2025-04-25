
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
import { HttpClient } from '@angular/common/http';
import { HeaderComponent } from '../../../components/header/header.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-add-movies',
  imports: [HeaderComponent,ReactiveFormsModule, RouterLink],
  templateUrl: './admin-add-movies.component.html',
  styleUrls: ['./admin-add-movies.component.scss'],
})
export class AdminAddMoviesComponent implements OnInit {
  movieForm!: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.movieForm = this.fb.group({
      movieName: ['', Validators.required],
      language: ['', Validators.required],
      genre: ['', Validators.required],
      format: ['', Validators.required],
      rating: [null, [Validators.required, Validators.min(0), Validators.max(5)]],
      showTimes: ['', Validators.required], // Accepts a comma-separated string
      description: ['', Validators.required],
      imageUrl: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.movieForm.valid) {
      const movie = { ...this.movieForm.value };

      // Convert the comma-separated showTimes string into an array
      movie.showTimes = movie.showTimes
        .split(',')
        .map((time: string) => time.trim());

      // Fetch the current list of movies to determine the max id
      this.http.get<any[]>('http://localhost:3000/movies').subscribe({
        next: (movies) => {
          // Find the maximum id and assign the next id
          const maxId = movies
            .map((m) => parseInt(m.id, 10))
            .filter((id) => !isNaN(id))
            .reduce((max, id) => Math.max(max, id), 0);

          movie.id = (maxId + 1).toString();

          // Send POST request to add the new movie
          this.http.post('http://localhost:3000/movies', movie).subscribe(() => {
            alert('Movie added successfully!');
            this.movieForm.reset();
          });
        },
        error: (err) => {
          console.error('Error fetching movies:', err);
          alert('Failed to fetch movies. Please try again later.');
        },
      });
    } else {
      alert('Please fill out all required fields.');
    }
  }
}