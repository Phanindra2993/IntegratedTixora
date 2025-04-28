import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../_services/auth.service';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../components/header/header.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent,RouterLink],
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss'],
})
export class AdminUsersComponent implements OnInit {
  users: any[] = []; 

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  // Fetch all users from localStorage
  fetchUsers(): void {
    this.users = this.authService.getAllUsers();
  }
}