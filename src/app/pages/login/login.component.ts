// import { CommonModule } from '@angular/common';
// import { Component, NgModule } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { Router, RouterLink } from '@angular/router';
// import { HeaderComponent } from "../../../components/header/header.component";
// import { FooterComponent } from "../../../components/footer/footer.component";
// import { AuthService } from '../../../_services/auth.service';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [FormsModule, CommonModule, RouterLink, HeaderComponent, FooterComponent],
//   templateUrl: './login.component.html',
//   styleUrl: './login.component.scss',
// })
// export class LoginComponent {
//   formData = {
//     Email: '',
//     Password: '',
//   };
//   constructor(private router: Router,private authService:AuthService) {}

//   onSubmit() {

//     const success = this.authService.login(this.formData.Email,this.formData.Password)
//     if (success) {
//       alert('Login Successfull');
//       this.router.navigate(['/']);
//     } else {
//       alert('Invalid email or password');
//     }
//   }
// }

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
    Email: '',
    Password: '',
  };

  constructor(private router: Router, private authService: AuthService) {}


  onSubmit() {
    const success = this.authService.login(this.formData.Email, this.formData.Password);
    if (success) {
      const role = this.authService.getCurrentUserRole();
      if (role === 'admin') {
        // Redirect to admin page
        this.router.navigate(['/admin']);
      } else {
        // Redirect to user dashboard
        this.router.navigate(['/']);
      }

    } else {
      alert('Invalid email or password');
    }
  }
}