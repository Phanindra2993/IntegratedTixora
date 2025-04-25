import { Component } from '@angular/core';
import { HeaderComponent } from '../../../components/header/header.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { Movie } from '../../../_models/movies.model';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MoviesService } from '../../../_services/movies.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-book-tickets',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, CommonModule, FormsModule],
  templateUrl: './book-tickets.component.html',
  styleUrl: './book-tickets.component.scss',
})
export class BookTicketsComponent {
  movie!: Movie;
  seatCount: number = 1;
  selectedDate: string = '';
  availableDates: string[] = [];
  selectedTime: string = '';

  showError: boolean = false;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private movieService: MoviesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.movieService.getMovieById(+id).subscribe((res) => {
        this.movie = res;
      });
    }
    this.generateNextFourDates();
  }

  generateNextFourDates() {
    const today = new Date();
    for (let i = 0; i < 4; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      this.availableDates.push(date.toDateString());
    }
  }
  selectDate(date: string) {
    this.selectedDate = date;
  }

  confirmBooking() {
    if ((!this.selectedDate && !this.seatCount) || !this.selectedTime) {
      this.showError = true;
      this.errorMessage = '*Please select Date, Time, and Number of Seats.';
      return;
    }

    this.showError = false;
    this.errorMessage = '';
    this.router.navigate(['/ticket', this.movie.id]);

    const loggedInUser = JSON.parse(
      localStorage.getItem('loggedInUser') || '{}'
    );
   
    const ticketData = {
      userId: loggedInUser.userId, 
      movieTitle: this.movie.movieName,
      movieImage: this.movie.imageUrl,
      language: this.movie.language,
      format: this.movie.format,
      date: this.selectedDate,
      time: this.selectedTime,
      bookingId: 'BK' + Math.floor(100000 + Math.random() * 900000),
      quantity: this.seatCount,
      amount: this.seatCount * 250,
    };

    const existingBookings = JSON.parse(
      localStorage.getItem('bookings') || '[]'
    );
    existingBookings.push(ticketData);
    localStorage.setItem('bookings', JSON.stringify(existingBookings));

    this.router.navigate(['/ticket'], { state: { ticket: ticketData } });
  }
}
