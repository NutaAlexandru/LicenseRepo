import { Injectable } from '@angular/core';
import { User } from '../shared/models/User';
import { BehaviorSubject, Observable } from 'rxjs';
import { IUserLogin } from '../shared/interfaces/IUserLogin';
import { HttpClient } from '@angular/common/http';
import { USER_LOGIN_URL } from '../shared/constants/urls';
import { tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

const USER_KEY ='User';
@Injectable({
  providedIn: 'any'
})
export class UserService {
  private userSubject = new BehaviorSubject<User>(this.getUserFromLocalStorage());
  public userObservable:Observable<User>;
  constructor(private http:HttpClient,private toastrService:ToastrService) { 
    this.userObservable = this.userSubject.asObservable();
  }

  login(userLogin:IUserLogin):Observable<User>{
    return this.http.post<User>(USER_LOGIN_URL,userLogin).pipe(
      tap({
        next:(user)=>{
          this.setUserToLocalStorage(user);
          this.userSubject.next(user);
          this.toastrService.success('Login successful');
        },
        error:(errorResponse)=>{
          this.toastrService.error(errorResponse.error,'Login failed');
        }
      })
    );
  }

  logout() {
    this.userSubject.next(new User());
    if (typeof window !== 'undefined') {
      localStorage.removeItem(USER_KEY);
      window.location.reload();
    }
  }
  

  private getUserFromLocalStorage(): User {
    if (typeof localStorage !== 'undefined') {
      let userString = localStorage.getItem(USER_KEY);
      if (userString) {
        return JSON.parse(userString);
      }
    }
    return new User();
  }
  
  private setUserToLocalStorage(user: User) {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  }
  
}
