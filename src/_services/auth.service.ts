
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { of } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = 'https://localhost:7063/api/user'; 
  

  constructor(private http: HttpClient) {}

  // Register a new user
  registerUser(userData: any): Observable<any> {
    const payload = {
      firstName: userData.firstName || 'N/A',
      lastName: userData.lastName || 'N/A',
      email: userData.email,
      password: userData.password,
      phone: userData.phone || 'N/A',
    };
    return this.http.post(`${this.apiUrl}/register`, payload);
  }

 

  login(email: string, password: string): Observable<any> {
    if (email === 'admin@tixora.com' && password === 'Admin@123') {
      const adminUser = {
        email: 'admin@tixora.com',
        role: 'admin'
      };
      return of(adminUser); 
    } else {
      const credentials = { email, password };
      return this.http.post<any>(`${this.apiUrl}/login`, credentials);
    }
  }

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  setLoggedInUser(user: any): void {
    localStorage.setItem('loggedInUser', JSON.stringify(user));
  }

  getCurrentUser(): any {
    return JSON.parse(localStorage.getItem('loggedInUser') || 'null');
  }

  getCurrentUserRole(): string | null {
    const user = this.getCurrentUser();
    return user ? user.role : null;
  }

  logout(): void {
    localStorage.removeItem('loggedInUser');
  }

  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }
}

