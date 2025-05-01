// import { Component, OnInit } from '@angular/core';
// import { HeaderComponent } from '../../../components/header/header.component';
// import { FooterComponent } from '../../../components/footer/footer.component';
// import { CommonModule } from '@angular/common';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-booking-history',
//   standalone: true,
//   imports: [HeaderComponent, FooterComponent, CommonModule],
//   templateUrl: './booking-history.component.html',
//   styleUrls: ['./booking-history.component.scss'],
// })
// export class BookingHistoryComponent implements OnInit {
//   bookings: any[] = [];

//   constructor(private router: Router) {}

//   ngOnInit(): void {
//     const storedUser = localStorage.getItem('loggedInUser');

//     if (!storedUser) {
//       this.router.navigate(['/login']);
//       return;
//     }

//     const user = JSON.parse(storedUser);
//     if (!user?.userId) {
//       this.router.navigate(['/login']);
//       return;
//     }

//     const storedBookings = localStorage.getItem('bookings');
//     if (storedBookings) {
//       const allBookings = JSON.parse(storedBookings);
//       this.bookings = allBookings.filter((b: any) => b.userId === user.userId);
//     }
//   }
//   generateQRCodeUrl(booking: any) {
//     const data = `BookingID: ${booking.bookingId}\nMovie: ${booking.movieTitle}\nQuantity: ${booking.quantity}`;
//     const qrAPI = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(
//       data
//     )}`;
//     return qrAPI;
//   }
// }

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookingService } from '../../../_services/booking.service';
import { FooterComponent } from "../../../components/footer/footer.component";
import { HeaderComponent } from "../../../components/header/header.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-booking-history',
  standalone: true,
  imports: [FooterComponent, HeaderComponent, CommonModule],
  templateUrl: './booking-history.component.html',
  styleUrls: ['./booking-history.component.scss']
})
export class BookingHistoryComponent implements OnInit {
  bookings: any[] = [];
  isLoading = true;
  errorMessage = ''; 

  constructor(
    private bookingService: BookingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadBookings();
    console.log(this.bookings);

  }

  loadBookings(): void {
    const userId = this.getUserId();
    if (!userId) {
      this.router.navigate(['/login']);
      return;
    }

    console.log('Fetching bookings for user:', userId); // Add this

    this.bookingService.getBookingsByUser(userId).subscribe({
      next: (response) => {
        console.log('API Response:', response); 
        if (response.success) {
          console.log('Raw booking data:', response.data);
          // this.bookings = response.data.map(booking => ({
            
          //   ...booking,
          //   date: this.getShowDate(booking.showtime),
          //   time: this.getShowTime(booking.showtime),
          //   quantity: booking.ticketCount,
          //   amount: booking.totalAmount
          // }));
          this.bookings = response.data.map(booking => {
            // Safely handle showtime
            const showtime = booking.showtime || booking.showTime || ''; // Try common variations
            const [date = '', time = ''] = showtime.split(' ');
            
            return {
              ...booking,
              date: date,
              time: time,
              quantity: booking.ticketCount,
              amount: booking.totalAmount
            };
          });
        } else {
          this.errorMessage = response.message || 'Failed to load bookings';
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load bookings. Please try again later.';
        this.isLoading = false;
        console.error('Booking error:', err);
      }
    });
  }

  private getUserId(): number | null {
    const user = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
    return user?.userId || null;
  }

  private getShowDate(showtime: string): string {
    return showtime.split(' ')[0];
  }

  private getShowTime(showtime: string): string {
    return showtime.split(' ')[1];
  }

  generateQRCodeUrl(booking: any): string {
    const data = `BookingID: ${booking.bookingId}|Movie: ${booking.movieTitle}|Show: ${booking.date} ${booking.time}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(data)}`;
  }
}