import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { HeaderComponent } from '../../../components/header/header.component';
import { FooterComponent } from '../../../components/footer/footer.component';

import { AuthService } from '../../../_services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,

  imports: [
    FormsModule,
    CommonModule,
    HeaderComponent,
    FooterComponent,
    RouterLink,
  ],

  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  formData = {
    email: '',
    password: '',
  };

  constructor(private router: Router, private authService: AuthService) {}


  onSubmit() {
    this.authService
      .login(this.formData.email, this.formData.password)
      .subscribe({
        next: (user) => {
          // Save user to localStorage
          localStorage.setItem('loggedInUser', JSON.stringify(user));
         // Redirect to home or dashboard
          if(this.formData.email=='admin@tixora.com' && this.formData.password=='Admin@123'){
            alert('Login Successful!');
            this.router.navigate(['/admin']); 

          }else{
            this.router.navigate(['/'])
          }
        },
        error: (err) => {
          alert('Login failed: Invalid credentials');
          console.error('Login error:', err);
        },
      });
  }
}
