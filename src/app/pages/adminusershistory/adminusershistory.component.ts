import { Component } from '@angular/core';
import { ApiResponse, Booking } from '../../../_models/booking.model';
import { BookingService } from '../../../_services/booking.service';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../components/header/header.component';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { FooterComponent } from '../../../components/footer/footer.component';

@Component({
  selector: 'app-adminusershistory',
  imports: [CommonModule,
    HeaderComponent,
    FormsModule,
    RouterModule,
    FooterComponent,RouterLinkActive,RouterLink],
  templateUrl: './adminusershistory.component.html',
  styleUrl: './adminusershistory.component.scss'
})
export class AdminusershistoryComponent {
  bookings: any[] = [];
    isLoading = true;
    errorMessage = '';
    searchTerm = '';
  
    constructor(private bookingService: BookingService) {}
  
    ngOnInit(): void {
      this.loadAllBookings();
    }
  
    loadAllBookings(): void {
      this.isLoading = true;
      this.errorMessage = '';
      
      this.bookingService.getAllBookings().subscribe({
        next: (response:any) => {
          console.log(response);
          if (response.success) {
            this.bookings = response.data.map((booking:any) => ({
              ...booking,
              formattedShowDate: this.formatDate(booking.showDate),
              formattedShowTime: this.formatTime(booking.showTime),
              formattedBookingDate: this.formatDateTime(booking.bookingDate)
            }));
          } else {
            this.errorMessage = response.message || 'Failed to load bookings';
          }
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = 'Failed to load bookings. Please try again later.';
          this.isLoading = false;
          console.error('Error loading bookings:', err);
        }
      });
    }
  
    get filteredBookings() {
      if (!this.searchTerm) {
        return this.bookings;
      }
      
      const term = this.searchTerm.toLowerCase();
      return this.bookings.filter(booking => 
        booking.userName.toLowerCase().includes(term) ||
        booking.movieTitle.toLowerCase().includes(term) ||
        booking.status.toLowerCase().includes(term) ||
        booking.bookingId.toString().includes(term)
      );
    }
  
    formatDate(dateString: string): string {
      if (!dateString) return 'N/A';
      const options: Intl.DateTimeFormatOptions = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      };
      return new Date(dateString).toLocaleDateString(undefined, options);
    }
  
    formatTime(timeString: string): string {
      if (!timeString) return 'N/A';
      // Assuming timeString is in HH:mm format
      const [hours, minutes] = timeString.split(':');
      const hourNum = parseInt(hours);
      const period = hourNum >= 12 ? 'PM' : 'AM';
      const displayHour = hourNum > 12 ? hourNum - 12 : hourNum;
      return `${displayHour}:${minutes} ${period}`;
    }
  
    formatDateTime(dateTimeString: string): string {
      if (!dateTimeString) return 'N/A';
      const options: Intl.DateTimeFormatOptions = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      return new Date(dateTimeString).toLocaleDateString(undefined, options);
    }

}
