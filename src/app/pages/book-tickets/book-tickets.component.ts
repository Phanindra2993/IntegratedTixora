import { Component } from '@angular/core';
import { HeaderComponent } from '../../../components/header/header.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { Movie } from '../../../_models/movies.model';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MoviesService } from '../../../_services/movies.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Showtime } from '../../../_models/showtimes.model';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDemoModalConfirmComponent } from '../../../components/confirm-modal/confirm-modal.component';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-book-tickets',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, CommonModule, FormsModule,NzButtonModule,NzModalModule ],
  templateUrl: './book-tickets.component.html',
  styleUrl: './book-tickets.component.scss',
})
export class BookTicketsComponent {
  showtimes: Showtime[] = [];
  groupedByDate: { [date: string]: Showtime[] } = {};
  movieId!: number;
  selectedShowtimeId: number = 0;

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
    private router: Router,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.movieId = +id;

      this.movieService.getMovieById(this.movieId).subscribe((res) => {
        this.movie = res.data;
      });

      this.movieService.getShowtimesByMovieId(this.movieId).subscribe((res) => {
        this.showtimes = res.data;
        this.groupShowtimesByDate();
      });
    }
  }

  groupShowtimesByDate() {
    this.groupedByDate = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
  
    for (let show of this.showtimes) {
      const date = show.showDate;
      const showDate = new Date(date);
      
    
      if (showDate >= today) {
        if (!this.groupedByDate[date]) {
          this.groupedByDate[date] = [];
        }
        this.groupedByDate[date].push(show);
      }
    }
    this.availableDates = Object.keys(this.groupedByDate);
  }


  selectDate(date: string) {
    this.selectedDate = date;
    this.selectedTime = '';
    this.clearErrors(); 
  }
  
  selectTime(time: string) {
    this.selectedTime = time;
    this.clearErrors(); 
  }
  
  clearErrors() {
    this.showError = false;
    this.errorMessage = '';
  }
  isLoading: boolean = false;
  maxSeats: number = 6; 

  
  confirmBooking() {
    this.showError = false;
    this.errorMessage = '';
  
    if (!this.selectedDate || !this.seatCount || !this.selectedTime) {
      this.showError = true;
      this.errorMessage = '*Please select Date, Time, and Number of Seats.';
      return;
    }
  
    if (this.seatCount < 1 || this.seatCount > this.maxSeats) {
      this.showError = true;
      this.errorMessage = `*Please select between 1 and ${this.maxSeats} seats.`;
      return;
    }
  
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
    if (!loggedInUser?.userId) {
      this.showError = true;
      this.errorMessage = '*Please login to book tickets.';
      return;
    }
  
    if (!this.movie?.movieId) {
      this.showError = true;
      this.errorMessage = '*Movie information is not available.';
      return;
    }
  
    const showsForDate = this.groupedByDate[this.selectedDate];
    if (!showsForDate) {
      this.showError = true;
      this.errorMessage = '*No shows available for selected date.';
      return;
    }
  
    const matchingShow = showsForDate.find(s => s.showTime === this.selectedTime);
    if (!matchingShow) {
      this.showError = true;
      this.errorMessage = '*Invalid showtime selection.';
      return;
    }
  
    // Create booking payload with type safety
    const bookingPayload = {
      userId: Number(loggedInUser.userId), 
      showtimeId: matchingShow.showtimeId,
      movieId: this.movie.movieId, // Now guaranteed to be number
      TicketCount: this.seatCount
    };
  
    this.isLoading = true;
  
    this.movieService.bookTickets(bookingPayload).subscribe({
      next: (res) => {
        console.log('Booking response:', res);
        
        // Prepare ticket data for the confirmation page
        const ticketData = {
          bookingId: res.data.bookingId,
          movieTitle: this.movie.title,
          movieImage: this.movie.imageUrl,
          showDate: this.selectedDate,
          showTime: this.selectedTime,
          quantity: this.seatCount,
          totalAmount: res.data.totalAmount || this.seatCount * 200,
          language: this.movie.language,
          format: this.movie.format
        };
  
        // Navigate to ticket page with the data
        this.router.navigate(['/ticket'], { 
          state: { ticket: ticketData } 
        });
      },
      error: (err) => {
        this.isLoading = false;
        this.showError = true;
        
        // Specific error handling
        if (err.status === 400 && err.error?.message?.includes('already have a booking')) {
          this.errorMessage = 'You already booked this showtime. Check your tickets.';
        } 
        else if (err.status === 400) {
          this.errorMessage = 'Not enough seats available. Please try fewer seats.';
        }
        else {
          this.errorMessage = 'Booking failed. Please try again later.';
        }
        
        console.error('Booking error:', err);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
  isPastShowTime(showTime: string, showDate: string): boolean {
    const now = new Date();
    const showDateTime = new Date(`${showDate}T${showTime}`);

    return showDateTime < now;
  }
  isPastDate(dateString: string): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to compare only dates
    
    const showDate = new Date(dateString);
    return showDate < today;
  }


  showBookingConfirmation(): void {
    // Clear previous errors
    this.clearErrors();
  
    if (!this.selectedDate || !this.selectedTime || !this.seatCount) {
      this.showError = true;
      this.errorMessage = '*Please select Date, Time, and Number of Seats.';
      return;
    }
  
    if (this.seatCount < 1 || this.seatCount > this.maxSeats) {
      this.showError = true;
      this.errorMessage = '*Please select between 1 and ${this.maxSeats} seats.';
      return;
    }
  
    const bookingDetails = {
      movieTitle: this.movie.title,
      selectedDate: this.selectedDate,
      selectedTime: this.selectedTime,
      seatCount: this.seatCount
    };
  
    this.modal.confirm({
      nzTitle: '<i>Confirm Your Booking</i>',
      nzContent: `
        <div style="padding: 10px;">
          <p><b>Movie:</b> ${bookingDetails.movieTitle}</p>
          <p><b>Date:</b> ${bookingDetails.selectedDate}</p>
          <p><b>Time:</b> ${bookingDetails.selectedTime}</p>
          <p><b>Seats:</b> ${bookingDetails.seatCount}</p>
          <p><b>Total Amount:</b> ₹${bookingDetails.seatCount * 200}</p>
        </div>
      `,
      nzOkText: 'Confirm Booking',
      nzOkType: 'primary',
      nzOnOk: () => this.confirmBooking(), // Call confirmBooking directly
      nzCancelText: 'Go Back',
      nzOnCancel: () => console.log('Booking cancelled')
    });
  }

  processBooking(): void {
    this.confirmBooking();
  }



}

// import { Component } from '@angular/core';
// import { HeaderComponent } from '../../../components/header/header.component';
// import { FooterComponent } from '../../../components/footer/footer.component';
// import { Movie } from '../../../_models/movies.model';
// import { ActivatedRoute, Router } from '@angular/router';
// import { MoviesService } from '../../../_services/movies.service';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { Showtime } from '../../../_models/showtimes.model';
// import { NzButtonModule } from 'ng-zorro-antd/button';
// import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';

// @Component({
//   selector: 'app-book-tickets',
//   standalone: true,
//   imports: [
//     HeaderComponent,
//     FooterComponent,
//     CommonModule,
//     FormsModule,
//     NzButtonModule,
//     NzModalModule,
//   ],
//   templateUrl: './book-tickets.component.html',
//   styleUrl: './book-tickets.component.scss',
// })
// export class BookTicketsComponent {
//   showtimes: Showtime[] = [];
//   groupedByDate: { [date: string]: Showtime[] } = {};
//   movieId!: number;
//   movie!: Movie;
  
//   // User selections
//   seatCount: number = 1;
//   selectedDate: string = '';
//   selectedTime: string = '';
//   availableDates: string[] = [];
  
//   // UI State
//   showError: boolean = false;
//   errorMessage: string = '';
//   isLoading: boolean = false;
//   readonly maxSeats: number = 6;

//   constructor(
//     private route: ActivatedRoute,
//     private movieService: MoviesService,
//     private router: Router,
//     private modal: NzModalService
//   ) {}

//   ngOnInit(): void {
//     const id = this.route.snapshot.paramMap.get('id');
//     if (id) {
//       this.movieId = +id;
//       this.loadMovieData();
//       this.loadShowtimes();
//     }
//   }

//   private loadMovieData(): void {
//     this.movieService.getMovieById(this.movieId).subscribe((res) => {
//       this.movie = res.data;
//     });
//   }

//   private loadShowtimes(): void {
//     this.movieService.getShowtimesByMovieId(this.movieId).subscribe((res) => {
//       this.showtimes = res.data;
//       this.groupShowtimesByDate();
//     });
//   }

//   private groupShowtimesByDate(): void {
//     this.groupedByDate = {};
//     this.showtimes.forEach((show) => {
//       const date = show.showDate;
//       if (!this.groupedByDate[date]) {
//         this.groupedByDate[date] = [];
//       }
//       this.groupedByDate[date].push(show);
//     });
//     this.availableDates = Object.keys(this.groupedByDate);
//   }

//   // Validation
//   private validateBooking(): boolean {
//     this.clearErrors();

//     if (!this.selectedDate) {
//       this.errorMessage = '*Please select Show Date.';
//     } else if (!this.selectedTime) {
//       this.errorMessage = '*Please select Show Time.';
//     } else if (!this.seatCount) {
//       this.errorMessage = '*Please select Number of Seats.';
//     } else if (this.seatCount < 1 || this.seatCount > this.maxSeats) {
//       this.errorMessage = `*Please select between 1 and 1{this.maxSeats} seats.`;
//     } else if (!this.getLoggedInUserId()) {
//       this.errorMessage = '*Please login to book tickets.';
//     } else if (!this.movie?.movieId) {
//       this.errorMessage = '*Movie information is not available.';
//     } else {
//       const matchingShow = this.findMatchingShowtime();
//       if (!matchingShow) {
//         this.errorMessage = '*Invalid showtime selection.';
//       } else {
//         return true; // All validations passed
//       }
//     }

//     this.showError = true;
//     return false;
//   }

//   private getLoggedInUserId(): number | null {
//     const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
//     return loggedInUser?.userId ? Number(loggedInUser.userId) : null;
//   }

//   private findMatchingShowtime(): Showtime | undefined {
//     const showsForDate = this.groupedByDate[this.selectedDate];
//     return showsForDate?.find((s) => s.showTime === this.selectedTime);
//   }

//   // Booking Flow
//   showBookingConfirmation(): void {
//     if (!this.validateBooking()) return;

//     this.modal.confirm({
//       nzTitle: '<i>Confirm Your Booking</i>',
//       nzContent: this.getConfirmationModalContent(),
//       nzOkText: 'Confirm Booking',
//       nzOkType: 'primary',
//       nzOnOk: () => this.processBooking(),
//       nzCancelText: 'Go Back',
//     });
//   }

//   private getConfirmationModalContent(): string {
//     return `
//       <div style="padding: 10px;">
//         <p><b>Movie:</b> ${this.movie.title}</p>
//         <p><b>Date:</b> ${this.selectedDate}</p>
//         <p><b>Time:</b> ${this.selectedTime}</p>
//         <p><b>Seats:</b> ${this.seatCount}</p>
//         <p><b>Total Amount:</b> ₹${this.seatCount * 200}</p>
//       </div>
//     `;
//   }

//   processBooking(): void {
//     if (!this.validateBooking()) return;

//     this.isLoading = true;
//     const bookingPayload = this.createBookingPayload();

//     this.movieService.bookTickets(bookingPayload).subscribe({
//       next: (res) => this.handleBookingSuccess(res),
//       error: (err) => this.handleBookingError(err),
//       complete: () => (this.isLoading = false),
//     });
//   }

//   private createBookingPayload(): any {
//     return {
//       userId: this.getLoggedInUserId(),
//       showtimeId: this.findMatchingShowtime()?.showtimeId,
//       movieId: this.movie.movieId,
//       TicketCount: this.seatCount,
//     };
//   }

//   private handleBookingSuccess(res: any): void {
//     this.router.navigate(['/ticket'], {
//       state: {
//         ticket: {
//           bookingId: res.data.bookingId,
//           movieTitle: this.movie.title,
//           movieImage: this.movie.imageUrl,
//           showDate: this.selectedDate,
//           showTime: this.selectedTime,
//           quantity: this.seatCount,
//           totalAmount: res.data.totalAmount,
//           language: this.movie.language,
//           format: this.movie.format,
//         },
//       },
//     });
//   }

//   private handleBookingError(err: any): void {
//     this.isLoading = false;
//     this.showError = true;

//     if (err.status === 400) {
//       this.errorMessage = err.error?.message?.includes('already have a booking')
//         ? 'You already booked this showtime. Check your tickets.'
//         : 'Not enough seats available. Please try fewer seats.';
//     } else {
//       this.errorMessage = 'Booking failed. Please try again later.';
//     }
//   }

//   // Helpers
//   selectDate(date: string): void {
//     this.selectedDate = date;
//     this.selectedTime = '';
//     this.clearErrors();
//   }

//   selectTime(time: string): void {
//     this.selectedTime = time;
//     this.clearErrors();
//   }

//   clearErrors(): void {
//     this.showError = false;
//     this.errorMessage = '';
//   }

//   isPastShowTime(showTime: string, showDate: string): boolean {
//     const now = new Date();
//     const showDateTime = new Date(`${showDate}T${showTime}`);
//     return showDateTime < now;
//   }
// }