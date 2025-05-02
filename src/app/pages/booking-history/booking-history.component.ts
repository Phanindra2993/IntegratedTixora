
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
  
    this.isLoading = true;
    this.errorMessage = '';
  
    this.bookingService.getBookingsByUser(userId).subscribe({
      next: (response) => {
        if (response.success) {
          this.bookings = response.data.map(booking => {
            // Parse the ISO date string
            const bookingDate = new Date(booking.bookingDate);
            
            return {
              ...booking,
              movieTitle: booking.movieTitle || booking.movie?.title || 'Unknown Movie',
              date: this.formatDate(bookingDate),  // Formatted date
              time: this.formatTime(bookingDate),  // Formatted time
              quantity: booking.ticketCount || booking.quantity || 0,
              amount: booking.totalAmount || booking.amount || 0
            };
          });
          console.log('Processed bookings:', this.bookings); // Debug
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
  
  private formatDate(date: Date): string {
    return date.toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }
  
  private formatTime(date: Date): string {
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    // Output: "10:14 PM" (Indian English format)
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