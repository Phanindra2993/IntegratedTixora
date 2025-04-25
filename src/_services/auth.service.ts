import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private usersKey = 'users';
  private loggedInUserKey = 'loggedInUser';

  constructor() {}

  registerUser(userData: any): boolean {
    const users = JSON.parse(localStorage.getItem(this.usersKey) || '[]');
    const userExists = users.some((user: any) => user.Email === userData.Email);

    if (userExists) return false;

    userData.userId = new Date().getTime(); 
    users.push(userData);
    localStorage.setItem(this.usersKey, JSON.stringify(users));
    return true;
  }

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

  logout(): void {
    localStorage.removeItem(this.loggedInUserKey);
  }

  getCurrentUser(): any {
    return JSON.parse(localStorage.getItem(this.loggedInUserKey) || 'null');
  }

  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }
}
