// import { CommonModule } from '@angular/common';
// import { Component } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { Router, RouterLink } from '@angular/router';
// import { HeaderComponent } from "../../../components/header/header.component";
// import { FooterComponent } from "../../../components/footer/footer.component";
// import { AuthService } from '../../../_services/auth.service';

// @Component({
//   selector: 'app-register',
//   standalone: true,
//   imports: [FormsModule, CommonModule, RouterLink, HeaderComponent, FooterComponent],
//   templateUrl: './register.component.html',
//   styleUrl: './register.component.scss',
// })
// export class RegisterComponent {
//   formData = {
//     firstName: '',
//     lastName: '',
//     email: '',
//     phone: '',
//     password: '',
//   };

//   constructor(private router: Router,private authService:AuthService) {}

//   onSubmit() {
//     const success = this.authService.registerUser(this.formData);
//     if(success){
//       alert("Registration Successfull");
//       console.log(this.formData)
//       this.router.navigate(['/login']);
//     } else {
//       alert("User already exists with this email!");

//     }

//   }
// }

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
    RouterModule
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

  constructor(private router: Router, private authService: AuthService) {}

  onSubmit() {
    this.authService.registerUser(this.formData).subscribe({
      next: (res) => {
        alert('Registration Successful');
        console.log('Registered User:', res);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        if (err.status === 400) {
          alert(
            'Email domain must be @gmail.com, @outlook.com, @yahoo.com, @vivejaitservices.com');
          // alert(err.errorMessage);
        } else {
          alert('An error occurred during registration.');
          console.error("error-message",err);
        }
      },
    });
  }
}
