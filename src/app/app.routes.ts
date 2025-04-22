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

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'movie/:id',
    component: MovieDetailsComponent,
  },
  {
    path: 'book/:id',
    component: BookTicketsComponent,
  },
  {
    path: 'ticket/:id',
    component: TicketComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },

  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'terms-of-service', component: TermsOfServiceComponent },
  { path: 'help', component: HelpPageComponent },
  {
    path: 'movie-details/:id',
    component: MovieDetailsComponent,
  },
  {
    path: 'book-tickets',
    component: BookTicketsComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
