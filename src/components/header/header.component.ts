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

  loggedInUser: any = null;
  userProfileImage: string = 'assets/default-user.jpg'; // default fallback
}
