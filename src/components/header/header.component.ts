import { Component, EventEmitter, Output } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../_services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [
    NzButtonModule,
    SearchBarComponent,
    NzIconModule,
    RouterLink,
    CommonModule,
    NzIconModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  isLoggedIn = false;

  constructor(private authService: AuthService, private router: Router) {}
  ngOnInit(): void {
    this.isLoggedIn = !!this.authService.getCurrentUser();

    const user = localStorage.getItem('loggedInUser');
    if (user) {
      this.loggedInUser = JSON.parse(user);
    }
  }
  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }

  @Output() searchEvent = new EventEmitter<string>();

  onSearchReceived(query: string) {
    this.searchEvent.emit(query);
  }
  navigateToDashboard() {
    const loggedInUser = JSON.parse(
      localStorage.getItem('loggedInUser') || '{}'
    );

    if (loggedInUser?.role === 'admin') {
      this.router.navigate(['/admin/movies']);
    } else {
      this.router.navigate(['/']);
    }
  }

  // getDisplayName(): string {
  //   if (!this.loggedInUser) return '';

  //   return this.loggedInUser.firstName ||
  //          this.loggedInUser.username ||
  //          this.loggedInUser.email.split('@')[0];
  // }
  // getGreeting(): string {
  //   if (!this.loggedInUser) return '';

  //   const name = this.loggedInUser.username ||
  //                this.loggedInUser.firstName ||
  //                this.loggedInUser.email?.split('@')[0] ||
  //                'User';

  //   return this.loggedInUser.role === 'admin'
  //     ? `Admin, ${name}`
  //     : `Hi, ${name}`;
  // }


  getGreeting(): string {
    if (!this.loggedInUser) return '';
    
    // For admin - just show "Admin"
    if (this.loggedInUser.role === 'admin') {
      return 'Admin';
    }
    
    // For regular users - show "Hi, [name]"
    const name = this.loggedInUser.firstName || 
                 this.loggedInUser.username || 
                 this.loggedInUser.email?.split('@')[0];
    return `Hi, ${name || 'User'}`;
  }
  

  loggedInUser: any = null;
  userProfileImage: string = 'assets/default-user.jpg';
}
