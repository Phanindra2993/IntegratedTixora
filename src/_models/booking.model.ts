// export interface Booking {
//     id: number;
//     userId: number;
//     movieName: string;
//     showTime: string;
//     bookingDate: string;
//     TicketCount: number;
//     totalAmount: number;
//   }
  
export interface Booking {
  bookingId: number;
  userId: number;
  userName: string;
  showtimeId: number;
  showtime: string;  
  movieId: number;
  movieTitle: string;
  ticketCount: number;
  totalAmount: number;
  bookingDate: string; 
  status: string;
}