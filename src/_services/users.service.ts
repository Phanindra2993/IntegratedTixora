// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class UsersService {

//   constructor(private http:HttpClient) { }

//   getAllUsers():Observable<any> {
//     return this.http.get<any>("https://localhost:7063/api/user");
//   }

  
//   addUsers(user:any):Observable<any> {
//     return this.http.post<any>("https://localhost:7063/api/user/register", user);
//   }
  
  
//   login(user: any): Observable<any> {
//     return this.http.post<any>('https://localhost:7063/api/user/login', user);
//   }
  
// }

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../_models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private apiUrl = 'https://localhost:7063/api/user';

  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  // Keep your existing methods
  addUsers(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, user);
  }
  
  login(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, user);
  }
}