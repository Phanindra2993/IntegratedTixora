import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HeaderComponent } from '../../../components/header/header.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { AuthService } from '../../../_services/auth.service';

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
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  formData = {
    Email: '',
    Password: '',
  };

  constructor(private router: Router, private authService: AuthService) {}

  onSubmit() {
    const user = this.authService.login(
      this.formData.Email,
      this.formData.Password
    );
    if (user) {
      // localStorage.setItem('loggedInUser', JSON.stringify(user));
      this.router.navigate(['/']);
    } else {
      alert('Invalid email or password');
    }
  }
}
