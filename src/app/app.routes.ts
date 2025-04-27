// import { Routes } from '@angular/router';
// import { DashboardComponent } from './pages/dashboard/dashboard.component';
// import { MovieDetailsComponent } from './pages/movie-details/movie-details.component';
// import { BookTicketsComponent } from './pages/book-tickets/book-tickets.component';
// import { TicketComponent } from './pages/ticket/ticket.component';
// import { LoginComponent } from './pages/login/login.component';
// import { RegisterComponent } from './pages/register/register.component';
// import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';
// import { TermsOfServiceComponent } from './pages/terms-of-service/terms-of-service.component';
// import { HelpPageComponent } from './pages/help-page/help-page.component';
// // import { AdminComponent } from './pages/admin-dashboard/admin-dashboard.component';
// // import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
// // import { AdminDeleteComponent } from './pages/admin-delete/admin-delete.component';
// import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';

// export const routes: Routes = [
//   {
//     path: '',
//     component: DashboardComponent,
//   },
//   {
//     path: 'register',
//     component: RegisterComponent,
//   },
//   {
//     path: 'admin',
//     component: AdminDashboardComponent
//   },

//   // { path: 'admin/delete-movies', component: AdminDeleteComponent },
//   {
//     path: 'login',
//     component: LoginComponent,
//   },
//   {
//     path: 'movie/:id',
//     component: MovieDetailsComponent,
//   },
//   {
//     path: 'book/:id',
//     component: BookTicketsComponent,
//   },
//   {
//     path: 'ticket/:id',
//     component: TicketComponent,
//   },
//   // {
//   //   path: 'login',
//   //   component: LoginComponent,
//   // },
//   // {
//   //   path: 'register',
//   //   component: RegisterComponent,
//   // },

//   {
//     path: 'admin',
//     children: [
//       {
//         path: 'movies',
//         component: AdminDashboardComponent, // Movies page
//       },
//       // {
//       //   path: 'add-movies',
//       //   component: AddMoviesComponent, // Add Movies page
//       // },
//       // {
//       //   path: 'users',
//       //   component: UsersComponent, // Users page
//       // },
//       // {
//       //   path: 'users-booking-history',
//       //   component: UsersBookingHistoryComponent, // Users Booking History page
//       // },
//       {
//         path: '',
//         redirectTo: 'movies', // Default route for admin
//         pathMatch: 'full',
//       },
//     ],
//   },
//   {
//     path: '',
//     redirectTo: '/admin/movies', // Default route for the application
//     pathMatch: 'full',
//   },
//   {
//     path: '**',
//     redirectTo: '/admin/movies', // Fallback route for undefined paths
//   },

//   { path: 'privacy-policy', component: PrivacyPolicyComponent },
//   { path: 'terms-of-service', component: TermsOfServiceComponent },
//   { path: 'help', component: HelpPageComponent },
//   {
//     path: 'movie-details/:id',
//     component: MovieDetailsComponent,
//   },
//   {
//     path: 'book-tickets',
//     component: BookTicketsComponent,
//   },
//   {
//     path: '**',
//     redirectTo: '',
//   },
// ];

// import { Routes } from '@angular/router';
// import { DashboardComponent } from './pages/dashboard/dashboard.component';
// import { MovieDetailsComponent } from './pages/movie-details/movie-details.component';
// import { BookTicketsComponent } from './pages/book-tickets/book-tickets.component';
// import { TicketComponent } from './pages/ticket/ticket.component';
// import { LoginComponent } from './pages/login/login.component';
// import { RegisterComponent } from './pages/register/register.component';
// import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';
// import { TermsOfServiceComponent } from './pages/terms-of-service/terms-of-service.component';
// import { HelpPageComponent } from './pages/help-page/help-page.component';
// import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
// import { AdminAddMoviesComponent } from './pages/admin-add-movies/admin-add-movies.component';

// export const routes: Routes = [
//   // User Dashboard Route
//   {
//     path: '',
//     component: DashboardComponent, // Default route for user dashboard
//   },

//   // User Movie Details Route
//   {
//     path: 'movie/:id',
//     component: MovieDetailsComponent, // User movie details page
//   },

//   // User Book Tickets Route
//   {
//     path: 'book/:id',
//     component: BookTicketsComponent, // Book tickets page
//   },

//   // User Ticket Route
//   {
//     path: 'ticket/:id',
//     component: TicketComponent, // Ticket details page
//   },

//   // User Login and Register Routes
//   {
//     path: 'login',
//     component: LoginComponent, // Login page
//   },
//   {
//     path: 'register',
//     component: RegisterComponent, // Register page
//   },

//   // Admin Routes
//   {
//     path: 'admin',
//     children: [
//       {
//         path: 'movies',
//         component: AdminDashboardComponent, // Admin movies page
//       },
//       {
//         path: '',
//         redirectTo: 'movies', // Default route for admin
//         pathMatch: 'full',
//       },
//       {
//         path: 'add-movies',
//         component: AdminAddMoviesComponent, // Add Movies page
//       },
//     ],
//   },

//   // Privacy Policy, Terms of Service, and Help Routes
//   { path: 'privacy-policy', component: PrivacyPolicyComponent },
//   { path: 'terms-of-service', component: TermsOfServiceComponent },
//   { path: 'help', component: HelpPageComponent },

//   // Fallback Route
//   // {
//   //   path: '**',
//   //   redirectTo: '', // Redirect to user dashboard for undefined paths
//   // },
// ];

import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { MovieDetailsComponent } from './pages/movie-details/movie-details.component';
import { BookTicketsComponent } from './pages/book-tickets/book-tickets.component';
import { TicketComponent } from './pages/ticket/ticket.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';
import { TermsOfServiceComponent } from './pages/terms-of-service/terms-of-service.component';
import { HelpPageComponent } from './pages/help-page/help-page.component';

import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { AdminAddMoviesComponent } from './pages/admin-add-movies/admin-add-movies.component';
import { AdminUsersComponent } from './pages/admin-users/admin-users.component';

import { authGuard } from './guards/auth.guard';
import { BookingHistoryComponent } from './pages/booking-history/booking-history.component';
import { AdminUsersHComponent } from './pages/admin-users-h/admin-users-h.component';



export const routes: Routes = [
  // User Dashboard Route
  {
    path: '',
    component: DashboardComponent, // Default route for user dashboard
  },

  // User Movie Details Route
  {
    path: 'movie/:id',
    component: MovieDetailsComponent, // User movie details page
  },

  // User Book Tickets Route
  {
    path: 'book/:id',
    component: BookTicketsComponent, // Book tickets page
  },

  // User Ticket Route
  {
    path: 'ticket/:id',
    component: TicketComponent, // Ticket details page
  },


  // User Login and Register Routes
  {
    path: 'login',
    component: LoginComponent, // Login page
  },
  {
    path: 'register',
    component: RegisterComponent, // Register page
  },


  // Admin Routes
  {
    path: 'admin',
    children: [
      {
        path: 'movies',
        component: AdminDashboardComponent, // Admin movies page
      },
      {
        path: 'add-movies',
        component: AdminAddMoviesComponent, // Add Movies page
      },
      {
        path: 'users',
        component: AdminUsersComponent, // Admin users page
      },
      {
        path: 'users-booking-history',
        component: AdminUsersHComponent
      },
      {
        path: '',
        redirectTo: 'movies', // Default route for admin
        pathMatch: 'full',
      },
    ],
  },

  // Privacy Policy, Terms of Service, and Help Routes
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'terms-of-service', component: TermsOfServiceComponent },
  { path: 'help', component: HelpPageComponent },


  // Fallback Route

  {
    path: 'movie-details/:id',
    component: MovieDetailsComponent,
    canActivate: [authGuard],
  },

  {
    path: 'book-tickets/:id',
    component: BookTicketsComponent,
    canActivate: [authGuard],
  },

  {
    path: 'ticket',
    component: TicketComponent,
  },
  {
    path: 'ticket/:id',
    component: TicketComponent,
    canActivate: [authGuard],
  },
  {
    path: 'booking-history',
    component: BookingHistoryComponent,
  },

  {
    path: '**',
    redirectTo: '', // Redirect to user dashboard for undefined paths
  },
];