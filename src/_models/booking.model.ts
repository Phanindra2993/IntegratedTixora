
// export interface Booking {
//   bookingId: number;
//   userId: number;
//   userName: string;
//   showtimeId: number;
//   showtime: string;  
//   movieId: number;
//   movieTitle: string;
//   ticketCount: number;
//   totalAmount: number;
//   bookingDate: string; 
//   status: string;
// }



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

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: Booking[];  // T would be Booking[] in this case
}