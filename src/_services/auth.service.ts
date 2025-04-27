import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  private usersKey = 'users';
  private loggedInUserKey = 'loggedInUser';

  constructor() {
    this.ensureAdminUser();
  }

  private ensureAdminUser() {
    const users = JSON.parse(localStorage.getItem(this.usersKey) || '[]');
    const adminExists = users.some((user: any) => user.Email === 'admin@tixora.com');
    if (!adminExists) {
      users.push({
        FirstName: 'Admin',
        LastName: '',
        Email: 'admin@tixora.com',
        Password: 'admin123', // <-- Set your desired admin password here
        number: 'N/A',
        role: 'admin',
        userId: new Date().getTime()
      });
      localStorage.setItem(this.usersKey, JSON.stringify(users));
    }
  }

  registerUser(userData: any): boolean {
    const users = JSON.parse(localStorage.getItem(this.usersKey) || '[]');
    const userExists = users.some((user: any) => user.Email === userData.Email);

    if (userExists) return false;
    const newUser = {
      FirstName: userData.FirstName || 'N/A',
      LastName: userData.LastName || 'N/A',
      Email: userData.Email,
      Password: userData.Password,
      number: userData.number || 'N/A',
      role: userData.role || 'user',
      userId: new Date().getTime(),
    };

    users.push(newUser);
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

  getCurrentUserRole(): string | null {
    const user = this.getCurrentUser();
    return user ? user.role : null;
  }

  getAllUsers(): any[] {
    const users = JSON.parse(localStorage.getItem(this.usersKey) || '[]');
    return users.map((user: any) => {
      if (user.Email === 'admin@tixora.com') {
        return {
          FirstName: 'Admin',
          LastName: '',
          Email: user.Email,
          Password: user.Password,
          role: user.role || 'admin',
        };
      } else if (user.Email === 'user@example.com') {
        return {
          FirstName: 'User',
          LastName: '',
          Email: user.Email,
          Password: user.Password,
          role: user.role || 'user',
        };
      } else {
        return {
          FirstName: user.FirstName || 'N/A',
          LastName: user.LastName || 'N/A',
          Email: user.Email,
          Password: user.Password,
          role: user.role || 'user',
        };
      }
    });
  }

  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }
}

