import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http:HttpClient) { }

  getAllUsers():Observable<any> {
    return this.http.get<any>("https://localhost:7063/api/user");
  }

  
  addUsers(user:any):Observable<any> {
    return this.http.post<any>("https://localhost:7063/api/user/register", user);
  }
  
  
  login(user: any): Observable<any> {
    return this.http.post<any>('https://localhost:7063/api/user/login', user);
  }
  
}
