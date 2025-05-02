import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Booking } from '../_models/booking.model';
import { Movie } from '../_models/movies.model';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private baseUrl = 'http://localhost:5000/api/bookings';
  private getallusershistoryUrl = 'https://localhost:7063/api/bookings';
  private updateMovieUrl = 'https://localhost:7063/api/movie-showtimes';
  private toggleUrl = 'https://localhost:7063/api/movies';
  constructor(private http: HttpClient) {}

  getBookingsByUser(
    userId: number
  ): Observable<{ success: boolean; data: any[]; message: string }> {
    return this.http.get<{ success: boolean; data: any[]; message: string }>(
      `https://localhost:7063/api/bookings/user/${userId}`
    );
  }

  getAllBookings(): Observable<{
    success: boolean;
    data: any[];
    message: string;
  }> {
    return this.http.get<{ success: boolean; data: any[]; message: string }>(
      `${this.getallusershistoryUrl}`
    );
  }

  // Add this method for updating movie with showtimes
  updateMovieWithShowtimes(movieId: number, data: any): Observable<any> {
    return this.http.put(`${this.updateMovieUrl}/${movieId}`, data);
  }

  bookTickets(payload: {
    userId: number;
    showtimeId: number;
    movieId: number;
    TicketCount: number;
  }): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(
      this.baseUrl,
      payload
    );
  }
}
