// import { Component } from '@angular/core';
// import { HeaderComponent } from '../../../components/header/header.component';
// import { FooterComponent } from '../../../components/footer/footer.component';
// import { Movie } from '../../../_models/movies.model';
// import { ActivatedRoute, Router, RouterLink } from '@angular/router';
// import { MoviesService } from '../../../_services/movies.service';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { Showtime } from '../../../_models/showtimes.model';

// @Component({
//   selector: 'app-book-tickets',
//   standalone: true,
//   imports: [HeaderComponent, FooterComponent, CommonModule, FormsModule],
//   templateUrl: './book-tickets.component.html',
//   styleUrl: './book-tickets.component.scss',
// })
// export class BookTicketsComponent {
//   showtimes: Showtime[] = [];
//   groupedByDate: { [date: string]: Showtime[] } = {};
//   movieId: number = 0; // Initialize with default value
//   selectedShowtimeId: number = 0;

//   movie: Movie = {
//     movieId: 0,
//     title: '',
//     language: '',
//     genre: '',
//     format: '',
//     rating: 0,
//     showTimes: [],
//     description: '',
//     imageUrl: '',
//     isActive: true
//   }; // Initialize with default values

//   seatCount: number = 1;
//   selectedDate: string = '';
//   availableDates: string[] = [];
//   selectedTime: string = '';

//   showError: boolean = false;
//   errorMessage: string = '';

//   constructor(
//     private route: ActivatedRoute,
//     private movieService: MoviesService,
//     private router: Router
//   ) {}

//   ngOnInit(): void {
//     const id = this.route.snapshot.paramMap.get('id');
//     if (id) {
//       this.movieId = +id;

//       this.movieService.getMovieById(this.movieId).subscribe((res) => {
//         this.movie = res.data;
//       });

//       this.movieService.getShowtimesByMovieId(this.movieId).subscribe((res) => {
//         this.showtimes = res.data;
//         this.groupShowtimesByDate();
//       });
//     }
//   }

//   groupShowtimesByDate() {
//     this.groupedByDate = {};
//     for (let show of this.showtimes) {
//       const date = show.showDate;
//       if (!this.groupedByDate[date]) {
//         this.groupedByDate[date] = [];
//       }
//       this.groupedByDate[date].push(show);
//     }
//     this.availableDates = Object.keys(this.groupedByDate);
//   }

//   selectDate(date: string) {
//     this.selectedDate = date;
//     this.selectedTime = '';
//   }

//   selectTime(time: string) {
//     this.selectedTime = time;
//   }

//   isLoading: boolean = false;
//   maxSeats: number = 6;

//   confirmBooking() {
//     // Reset previous errors
//     this.showError = false;
//     this.errorMessage = '';

//     // 1. Validate basic inputs
//     if (!this.selectedDate || !this.seatCount || !this.selectedTime) {
//       this.showError = true;
//       this.errorMessage = '*Please select Date, Time, and Number of Seats.';
//       return;
//     }

//     // 2. Validate seat count
//     if (this.seatCount < 1 || this.seatCount > this.maxSeats) {
//       this.showError = true;
//       this.errorMessage = `*Please select between 1 and ${this.maxSeats} seats.`;
//       return;
//     }

    

//     // 3. Check user authentication
//     const loggedInUser = JSON.parse(
//       localStorage.getItem('loggedInUser') || '{}'
//     );
//     if (!loggedInUser?.userId) {
//       this.showError = true;
//       this.errorMessage = '*Please login to book tickets.';
//       return;
//     }

//     // 4. Find showtime with safety checks
//     const showsForDate = this.groupedByDate[this.selectedDate];
//     if (!showsForDate) {
//       this.showError = true;
//       this.errorMessage = '*No shows available for selected date.';
//       return;
//     }

//     const matchingShow = showsForDate.find(
//       (s) => s.showTime === this.selectedTime
//     );
//     if (!matchingShow) {
//       this.showError = true;
//       this.errorMessage = '*Invalid showtime selection.';
//       return;
//     }

//     // Ensure all required fields are properly typed
//     const bookingPayload = {
//       userId: Number(loggedInUser.userId), // Ensure number type
//       showtimeId: matchingShow.showtimeId,
//       movieId: this.movie.movieId,
//       TicketCount: this.seatCount,
//     };

//     this.isLoading = true;

//     this.movieService.bookTickets(bookingPayload).subscribe({
//       next: (res) => {
//         this.isLoading = false;
//         // Navigate to booking confirmation page or show success message
//         this.router.navigate(['/booking-confirmation'], { 
//           state: { bookingDetails: res.data } 
//         });
//       },
//       error: (err) => {
//         this.isLoading = false;
//         this.showError = true;
        
//         if (err.status === 400 && err.error?.message?.includes('already have a booking')) {
//           this.errorMessage = 'You already booked this showtime. Check your tickets.';
//         } 
//         else if (err.status === 400) {
//           this.errorMessage = 'Not enough seats available. Please try fewer seats.';
//         }
//         else {
//           this.errorMessage = 'Booking failed. Please try again later.';
//         }
        
//         console.error('Booking error:', err);
//       }
//     });
//   }

//   isPastShowTime(showTime: string, showDate: string): boolean {
//     const now = new Date();
//     const showDateTime = new Date(`${showDate}T${showTime}`);
//     return showDateTime < now;
//   }
// }

import { Component } from '@angular/core';
import { HeaderComponent } from '../../../components/header/header.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { Movie } from '../../../_models/movies.model';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MoviesService } from '../../../_services/movies.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Showtime } from '../../../_models/showtimes.model';

@Component({
  selector: 'app-book-tickets',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, CommonModule, FormsModule],
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
    private router: Router
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
    for (let show of this.showtimes) {
      const date = show.showDate;
      if (!this.groupedByDate[date]) {
        this.groupedByDate[date] = [];
      }
      this.groupedByDate[date].push(show);
    }
    this.availableDates = Object.keys(this.groupedByDate);
  }

  // generateNextFourDates() {
  //   const today = new Date();
  //   for (let i = 0; i < 4; i++) {
  //     const date = new Date();
  //     date.setDate(today.getDate() + i);
  //     this.availableDates.push(date.toDateString());
  //   }
  // }
  selectDate(date: string) {
    this.selectedDate = date;
    this.selectedTime = '';
  }
  selectTime(time: string) {
    this.selectedTime = time;
  }

  // confirmBooking() {
  //   if ((!this.selectedDate && !this.seatCount) || !this.selectedTime) {
  //     this.showError = true;
  //     this.errorMessage = '*Please select Date, Time, and Number of Seats.';
  //     return;
  //   }

  //   this.showError = false;
  //   this.errorMessage = '';
  //   this.router.navigate(['/ticket', this.movie.movieId]);

  //   const loggedInUser = JSON.parse(
  //     localStorage.getItem('loggedInUser') || '{}'
  //   );

  //   const ticketData = {
  //     userId: loggedInUser.userId,
  //     movieTitle: this.movie.title,
  //     movieImage: this.movie.imageUrl,
  //     language: this.movie.language,
  //     format: this.movie.format,
  //     date: this.selectedDate,
  //     time: this.selectedTime,
  //     bookingId: 'BK' + Math.floor(100000 + Math.random() * 900000),
  //     quantity: this.seatCount,
  //     amount: this.seatCount * 200,
  //   };

  //   const existingBookings = JSON.parse(
  //     localStorage.getItem('bookings') || '[]'
  //   );
  //   existingBookings.push(ticketData);
  //   localStorage.setItem('bookings', JSON.stringify(existingBookings));

  //   this.router.navigate(['/ticket'], { state: { ticket: ticketData } });
  // }

  // isPastShowTime(showTime: string,showDate:string): boolean {
  //   if (this.selectedDate !== new Date().toDateString()) {
  //     return false;
  //   }

  //   const [timeStr, modifier] = showTime.split(/(AM|PM)/i);
  //   const [hours, minutes] = timeStr.split(':').map(Number);

  //   let showHours = hours;
  //   if (modifier.toUpperCase() === 'PM' && hours !== 12) {
  //     showHours += 12;
  //   } else if (modifier.toUpperCase() === 'AM' && hours === 12) {
  //     showHours = 0;
  //   }

  //   const now = new Date();
  //   const showDateTime = new Date();
  //   showDateTime.setHours(showHours, minutes, 0, 0);

  //   return showDateTime < now;
  // }

  // confirmBooking() {
  //   if (!this.selectedDate || !this.seatCount || !this.selectedTime) {
  //     this.showError = true;
  //     this.errorMessage = '*Please select Date, Time, and Number of Seats.';
  //     return;
  //   }

  //   const matchingShow = this.groupedByDate[this.selectedDate].find(
  //     s => s.showTime === this.selectedTime
  //   );

  //   if (!matchingShow) {
  //     this.showError = true;
  //     this.errorMessage = '*Invalid showtime selection.';
  //     return;
  //   }

  //   this.selectedShowtimeId = matchingShow.showtimeId;

  //   const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || '{}');

  //   const bookingPayload = {
  //     userId: loggedInUser.userId,
  //     showtimeId: this.selectedShowtimeId,
  //     movieId: this.movie.movieId,
  //     tickectCount: this.seatCount
  //   };

  //   this.movieService.bookTickets(bookingPayload).subscribe({
  //     next: (res) => {
  //       this.router.navigate(['/ticket'], { state: { ticket: res } });
  //     },
  //     error: (err) => {
  //       this.showError = true;
  //       this.errorMessage = '*Booking failed. Please try again.';
  //       console.error(err);
  //     }
  //   });
  // }

  // Add this to your component properties
  isLoading: boolean = false;
  maxSeats: number = 6; // or whatever your business rule is

  // confirmBooking() {
  //   // Reset previous errors
  //   this.showError = false;
  //   this.errorMessage = '';

  //   // 1. Validate basic inputs

  //   if (!this.selectedDate || !this.seatCount || !this.selectedTime) {
  //     this.showError = true;
  //     this.errorMessage = '*Please select Date, Time, and Number of Seats.';
  //     return;
  //   }

  //   // 2. Validate seat count
  //   if (this.seatCount < 1 || this.seatCount > this.maxSeats) {
  //     this.showError = true;
  //     this.errorMessage = *Please select between 1 and ${this.maxSeats} seats.;
  //     return;
  //   }

  //   // 3. Check user authentication
  //   const loggedInUser = JSON.parse(
  //     localStorage.getItem('loggedInUser') || '{}'
  //   );
  //   if (!loggedInUser?.userId) {
  //     this.showError = true;
  //     this.errorMessage = '*Please login to book tickets.';
  //     return;
  //   }

  //   // 4. Find showtime with safety checks
  //   const showsForDate = this.groupedByDate[this.selectedDate];
  //   if (!showsForDate) {
  //     this.showError = true;
  //     this.errorMessage = '*No shows available for selected date.';
  //     return;
  //   }

  //   const matchingShow = showsForDate.find(
  //     (s) => s.showTime === this.selectedTime
  //   );
  //   if (!matchingShow) {
  //     this.showError = true;
  //     this.errorMessage = '*Invalid showtime selection.';
  //     return;
  //   }

  //   const bookingPayload = {
  //     userId: loggedInUser.userId,
  //     showtimeId: matchingShow.showtimeId,
  //     movieId: this.movie.movieId,
  //     TicketCount: this.seatCount,
  //   };

  //   this.isLoading = true;

  //   this.movieService.bookTickets(bookingPayload).subscribe({
  //     next: (res) => {
  //       const ticketData = {
  //         ...res,

  //         movieTitle: this.movie.title,
  //         movieImage: this.movie.imageUrl,
  //         showDate: this.selectedDate,
  //         // showTime: this.movie.showTimes,
  //         date: this.selectDate,
  //         time: this.selectTime,
  //         quantity: this.seatCount,
  //         language: this.movie.language,
  //         format: this.movie.format,
  //         totalAmount: res.totalAmount || this.seatCount * 200,
  //       };

  //        this.router.navigate(['/ticket'], { state: { ticket: ticketData } });
  //     },
  //     error: (err) => {
  //       this.isLoading = false;
  //       this.showError = true;

  //       if (err.status === 400) {
  //         this.errorMessage =
  //           '*Not enough seats available. Please try fewer seats.';
  //       } else {
  //         this.errorMessage = '*Booking failed. Please try again later.';
  //       }

  //       console.error('Booking error:', err);
  //     },
  //     complete: () => {
  //       this.isLoading = false;
  //     },
  //   });
  // }

  confirmBooking() {
    // Reset previous errors
    this.showError = false;
    this.errorMessage = '';
  
    // 1. Validate basic inputs
    if (!this.selectedDate || !this.seatCount || !this.selectedTime) {
      this.showError = true;
      this.errorMessage = '*Please select Date, Time, and Number of Seats.';
      return;
    }
  
    // 2. Validate seat count
    if (this.seatCount < 1 || this.seatCount > this.maxSeats) {
      this.showError = true;
      this.errorMessage = `*Please select between 1 and ${this.maxSeats} seats.`;
      return;
    }
  
    // 3. Check user authentication
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
    if (!loggedInUser?.userId) {
      this.showError = true;
      this.errorMessage = '*Please login to book tickets.';
      return;
    }
  
    // 4. Check movie data is available
    if (!this.movie?.movieId) {
      this.showError = true;
      this.errorMessage = '*Movie information is not available.';
      return;
    }
  
    // 5. Find showtime with safety checks
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
      userId: Number(loggedInUser.userId), // Ensure number type
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
}