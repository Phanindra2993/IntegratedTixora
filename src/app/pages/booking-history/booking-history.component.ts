import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../components/header/header.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-booking-history',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, CommonModule],
  templateUrl: './booking-history.component.html',
  styleUrls: ['./booking-history.component.scss'],
})
export class BookingHistoryComponent implements OnInit {
  bookings: any[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    const storedUser = localStorage.getItem('loggedInUser');

    if (!storedUser) {
      this.router.navigate(['/login']);
      return;
    }

    const user = JSON.parse(storedUser);
    if (!user?.userId) {
      this.router.navigate(['/login']);
      return;
    }

    const storedBookings = localStorage.getItem('bookings');
    if (storedBookings) {
      const allBookings = JSON.parse(storedBookings);
      this.bookings = allBookings.filter((b: any) => b.userId === user.userId);
    }
  }
}
