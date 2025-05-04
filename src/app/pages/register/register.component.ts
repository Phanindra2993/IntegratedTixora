import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../../components/header/header.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { AuthService } from '../../../_services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    RouterLink,
    HeaderComponent,
    FooterComponent,
    RouterLink,
    RouterModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  formData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
  };

  backendErrors: any = {};

  constructor(private router: Router, private authService: AuthService) {}

  onSubmit() {
    this.backendErrors = {};
    this.authService.registerUser(this.formData).subscribe({
      next: (res) => {
        alert('Registration Successful');
        console.log('Registered User:', res);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        if (err.status === 400 && err.error?.errors) {
          this.backendErrors = err.error.errors;
        } else {
          alert(err.message || 'An error occurred during registration');
          console.error('error-message', err.message);
        }
      },
    });
  }
}
