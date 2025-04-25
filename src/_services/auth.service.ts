// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root',
// })
// export class AuthService {
//   private userskey = 'users';
//   private loggedInUserKey = 'loggedInUser';

//   constructor() {}

//   registerUser(userData: any): boolean {
//     const users = JSON.parse(localStorage.getItem(this.userskey)|| '[]');
//     const userExists = users.some((user: any) => user.Email === userData.Email);
//     if (userExists) return false;

//     users.push(userData);
//     localStorage.setItem(this.userskey, JSON.stringify(users));
//     return true;
//   }

  
//   login(email: string, password: string): boolean {
//     const users =JSON.parse(localStorage.getItem(this.userskey) || '[]'); 
//     const matchedUser = users.find((user:any)=>user.Email ===email && user.Password ===password); 

//     if(matchedUser){
//       localStorage.setItem(this.loggedInUserKey,JSON.stringify(matchedUser));
//       return true
//     }
//     return false
//   }
//   // we are logging out current user
//   logout(): void {
//     // localStorage.getItem('user');
//     localStorage.removeItem(this.loggedInUserKey);
//   }
//   getCurrentUser(): any {
//     return JSON.parse(localStorage.getItem(this.loggedInUserKey) || 'null');
//   }
//   getCurrentUserRole(): string | null {
//          const user = this.getCurrentUser();
//          return user ? user.role : null;
//        }
// }

// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root',
// })
// export class AuthService {
//   private usersKey = 'users'; // Key for storing all users
//   private loggedInUserKey = 'loggedInUser'; // Key for storing the logged-in user

//   constructor() {}

//   // Register a new user
//   registerUser(userData: any): boolean {
//     const users = JSON.parse(localStorage.getItem(this.usersKey) || '[]');
//     const userExists = users.some((user: any) => user.Email === userData.Email);
//     if (userExists) return false;

//     users.push(userData);
//     localStorage.setItem(this.usersKey, JSON.stringify(users));
//     return true;
//   }

//   // Login a user
//   login(email: string, password: string): boolean {
//     const users = JSON.parse(localStorage.getItem(this.usersKey) || '[]');
//     const matchedUser = users.find(
//       (user: any) => user.Email === email && user.Password === password
//     );

//     if (matchedUser) {
//       localStorage.setItem(this.loggedInUserKey, JSON.stringify(matchedUser));
//       return true;
//     }
//     return false;
//   }

//   // Logout the current user
//   logout(): void {
//     localStorage.removeItem(this.loggedInUserKey);
//   }

//   // Get the currently logged-in user
//   getCurrentUser(): any {
//     return JSON.parse(localStorage.getItem(this.loggedInUserKey) || 'null');
//   }

//   // Get the role of the currently logged-in user
//   getCurrentUserRole(): string | null {
//     const user = this.getCurrentUser();
//     return user ? user.role : null;
//   }

//   getAllUsers(): any[] {
//     return JSON.parse(localStorage.getItem(this.usersKey) || '[]');
//   }
// }

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

export class AuthService {

  private usersKey = 'users'; // Key for storing all users
  private loggedInUserKey = 'loggedInUser'; // Key for storing the logged-in user


  constructor() {}

  // Register a new user
  registerUser(userData: any): boolean {
    const users = JSON.parse(localStorage.getItem(this.usersKey) || '[]');
    const userExists = users.some((user: any) => user.Email === userData.Email);

    if (userExists) return false;
// Ensure FirstName, LastName, role, and userId fields are added
const newUser = {
  FirstName: userData.FirstName || 'N/A',
  LastName: userData.LastName || 'N/A',
  Email: userData.Email,
  Password: userData.Password,
  number: userData.number || 'N/A',
  role: userData.role || 'user', // Default role is 'user'
  userId: new Date().getTime(),  // Unique user ID
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


  // Get the role of the currently logged-in user
  getCurrentUserRole(): string | null {
    const user = this.getCurrentUser();
    return user ? user.role : null;
  }

  getAllUsers(): any[] {
    const users = JSON.parse(localStorage.getItem(this.usersKey) || '[]');
  
    // Ensure all users have FirstName and LastName fields
    return users.map((user: any) => {
      if (user.Email === 'admin@example.com') {
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

  
}

  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }
}

