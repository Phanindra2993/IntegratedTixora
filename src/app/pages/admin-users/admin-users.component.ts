// import { Component, OnInit } from '@angular/core';
// import { AuthService } from '../../../_services/auth.service';
// import { CommonModule } from '@angular/common';
// import { HeaderComponent } from '../../../components/header/header.component';
// import { FooterComponent } from '../../../components/footer/footer.component';
// import { RouterLink } from '@angular/router';

// @Component({
//   selector: 'app-admin-users',
//   standalone: true,
//   imports: [CommonModule, HeaderComponent, FooterComponent,RouterLink],
//   templateUrl: './admin-users.component.html',
//   styleUrls: ['./admin-users.component.scss'],
// })
// export class AdminUsersComponent implements OnInit {
//   users: any[] = []; 

//   constructor(private authService: AuthService) {}

//   ngOnInit(): void {
//     this.fetchUsers();
//   }

//   // Fetch all users from localStorage
//   fetchUsers(): void {
//     this.users = this.authService.getAllUsers();
//   }
// }


import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../../_services/users.service';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../components/header/header.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { RouterLink } from '@angular/router';
import { User } from '../../../_models/user.model';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, RouterLink],
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss'],
})
export class AdminUsersComponent implements OnInit {
  users: User[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.usersService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching users:', err);
        this.errorMessage = 'Failed to load users. Please try again later.';
        this.isLoading = false;
      }
    });
  }
}