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

import { AdminusershistoryComponent } from './pages/adminusershistory/adminusershistory.component';
// import { AdminUsersHistoryComponent } from './pages/admin-users-history/admin-users-history.component';

export const routes: Routes = [
  // User Dashboard Route
  {
    path: '',
    component: DashboardComponent,
  },

  {
    path: 'movie/:movieId',
    component: MovieDetailsComponent,
    canActivate: [authGuard],
  },

  {
    path: 'book/:id',
    component: BookTicketsComponent,
    canActivate: [authGuard],
  },

  // User Ticket Route
  {
    path: 'ticket/:id',
    component: TicketComponent,
    canActivate: [authGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },

  // Admin Routes
  {
    path: 'admin',
    children: [
      {
        path: 'movies',
        component: AdminDashboardComponent,
        canActivate: [authGuard],
      },
      {
        path: 'add-movies',
        component: AdminAddMoviesComponent,
        canActivate: [authGuard],
      },
      {
        path: 'users',
        component: AdminUsersComponent,
        canActivate: [authGuard],
      },

      {
        path: 'users-booking-history',
        component: AdminusershistoryComponent,
        canActivate: [authGuard],
      },
      {
        path: '',
        redirectTo: 'movies',
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
    canActivate: [authGuard],
  },

  {
    path: '**',
    redirectTo: '',
  },
];
