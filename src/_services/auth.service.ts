import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private usersKey = 'users';
  private loggedInUserKey = 'loggedInUser';

  constructor() {}

  // Register a new user
  registerUser(userData: any): boolean {
    const users = JSON.parse(localStorage.getItem(this.usersKey) || '[]');
    const userExists = users.some((user: any) => user.Email === userData.Email);

    if (userExists) return false;

    // Assign a unique userId to the new user
    userData.userId = new Date().getTime(); // simple unique ID
    users.push(userData);
    localStorage.setItem(this.usersKey, JSON.stringify(users));
    return true;
  }

  // Login a user
  login(email: string, password: string): any {
    const users = JSON.parse(localStorage.getItem(this.usersKey) || '[]');
    const matchedUser = users.find(
      (user: any) => user.Email === email && user.Password === password
    );

    if (matchedUser) {
      localStorage.setItem(this.loggedInUserKey, JSON.stringify(matchedUser));
      return matchedUser;
    }

    return null;
  }

  // Logout the current user
  logout(): void {
    localStorage.removeItem(this.loggedInUserKey);
  }

  // Get the currently logged-in user
  getCurrentUser(): any {
    return JSON.parse(localStorage.getItem(this.loggedInUserKey) || 'null');
  }

  // Check if a user is logged in
  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }
}
