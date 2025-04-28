import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from "../../../components/footer/footer.component";
import { HeaderComponent } from "../../../components/header/header.component";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FooterComponent, HeaderComponent, RouterLink],
  templateUrl: './admin-users-h.component.html',
  styleUrls: ['admin-users-h.component.scss']
})
export class AdminUsersHComponent implements OnInit {
  users: any[] = [];
  bookingData: Array<{
    id: string;
    name: string;
    movieName: string;
    bookingDate: string;
    showTime: string;
    numberOfTickets: number;
    totalAmount: number;
  }> = [];

  ngOnInit(): void {
    // Get all users
    this.users = JSON.parse(localStorage.getItem('users') || '[]');
    // Get all bookings
    const bookings: any[] = JSON.parse(localStorage.getItem('bookings') || '[]');
    // Merge booking with user info
    this.bookingData = bookings.map((booking: any) => {
      const user = this.users.find((u: any) => u.userId === booking.userId) || {};
      return {
        id: booking.bookingId,
        name: `${user.FirstName || ''} ${user.LastName || ''}`.trim(),
        movieName: booking.movieTitle,
        bookingDate: booking.date,
        showTime: booking.time,
        numberOfTickets: booking.quantity,
        totalAmount: booking.amount
      };
    });
  }
}