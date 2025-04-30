import { Injectable } from '@angular/core';
import { UsersService } from './users.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private usersKey = 'users';
  private loggedInUserKey = 'loggedInUser';

  constructor(private userService:UsersService) {
    this.ensureAdminUser();
  }

  private ensureAdminUser() {
    const users = JSON.parse(localStorage.getItem(this.usersKey) || '[]');
    const adminExists = users.some(
      (user: any) => user.email === 'admin@tixora.com'
    );
    if (!adminExists) {
      users.push({
        firstName: 'Admin',
        lastName: '',
        email: 'admin@tixora.com',
        password: 'Admin@123',
        phone: 'N/A',
        // role: 'admin',
        // userId: new Date().getTime(),
      });
      localStorage.setItem(this.usersKey, JSON.stringify(users));
    }
  }

  registerUser(userData: any): boolean {
    const users = JSON.parse(localStorage.getItem(this.usersKey) || '[]');
    const userExists = users.some((user: any) => user.email === userData.email);

    if (userExists) return false;
    const newUser = {
      firstName: userData.firstName || 'N/A',
      lastName: userData.lastName || 'N/A',
      email: userData.email,
      phone: userData.phone || 'N/A',
      password: userData.password,
     
      // role: userData.role || 'user',
      // userId: new Date().getTime(),
    };
    const d={...newUser}

    


    users.push(newUser);
    localStorage.setItem(this.usersKey, JSON.stringify(users));
    // this.userService.addUsers(d).subscribe({
    //   next:()=>{console.log("Successfull");
    //   },
    //   error:(error)=>{console.log("Error Occured",error);
    //   }
    // })
    this.userService.addUsers(newUser).subscribe({
      next: () => { console.log("Success"); },
      error: (error) => {
        console.error("Error while registering:", error);
        alert("Failed to register: " + (error.error?.message || 'Unknown error'));
      }
    });
    return true;
  }

  // login(email: string, password: string): any {
  //   const users = JSON.parse(localStorage.getItem(this.usersKey) || '[]');

  //   const matchedUser = users.find(
  //     (user: any) => user.email === email && user.password === password
  //   );

  //   if (matchedUser) {
  //     localStorage.setItem(this.loggedInUserKey, JSON.stringify(matchedUser));
  //     this.userService.addUsers(matchedUser)
  //     return matchedUser;
  //   }

  //   return null;
  // }
  login(email: string, password: string): Observable<any> {
    const credentials = { email, password };
    return this.userService.login(credentials);
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
