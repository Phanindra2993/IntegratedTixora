import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../components/header/header.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { Movie } from '../../../_models/movies.model';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MoviesService } from '../../../_services/movies.service';
import { MovieCardComponent } from '../../../components/movie-card/movie-card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-movie-details',
  imports: [
    HeaderComponent,
    FooterComponent,
    MovieCardComponent,
    CommonModule,
    RouterLink,
  ],
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.scss'],
})
export class MovieDetailsComponent implements OnInit {
  movie!: Movie;
 
  relatedMovies: Movie[] = [];

  constructor(
    private route: ActivatedRoute,
    private movieService: MoviesService
  ) {}

  // ngOnInit(): void {
  //   this.route.paramMap.subscribe((params) => {
  //     const id = params.get('id');
  //     if (id) {
  //       this.movieService.getAllMovies().subscribe(() => {
  //         this.movieService.getMovieById(+id).subscribe((res) => {
  //           this.movie = res;

  //           this.relatedMovies = this.movieService
  //             .getCachedMovies()
  //             .filter(
  //               (m) => m.genre === this.movie.genre && m.id !== this.movie.id
  //             );

  //           // console.log('Related Movies:', this.relatedMovies);
  //         });
  //       });
  //     }
  //   });
  // }

  ngOnInit(): void {
    console.log(this.movie);
    
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      console.log('Fetching movie with ID:', id);
      if (id) {
        this.movieService.getAllMovies().subscribe((allRes) => {
          const allMovies = allRes.data; 
  
          this.movieService.getMovieById(+id).subscribe((res) => {
            this.movie = res.data;
            console.log('Movie response:', res); 
  
            this.relatedMovies = allMovies.filter(
              (m) => m.genre === this.movie.genre && m.movieId !== this.movie.movieId
            );
          });
        });
      }
    });
  }
  
  
}
