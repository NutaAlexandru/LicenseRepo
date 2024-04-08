import { Injectable } from '@angular/core';
import { User } from '../shared/models/User';
import { BehaviorSubject, Observable } from 'rxjs';
import { IUserLogin } from '../shared/interfaces/IUserLogin';
import { HttpClient } from '@angular/common/http';
import { USER_LOGIN_URL, USER_REGISTER_URL,USER_LOGIN_WITH_GOOGLE_URL,USER_UPDATE_URL,USER_DATA_URL } from '../shared/constants/urls';
import { tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { IUserRegister } from '../shared/interfaces/IUserRegister';

import { SocialAuthService } from '@abacritt/angularx-social-login';


const USER_KEY ='User';
@Injectable({
  providedIn: 'any'
})
export class UserService {
  private userSubject = new BehaviorSubject<User>(this.getUserFromLocalStorage());
  public userObservable:Observable<User>;
  
  constructor(private http:HttpClient,private toastrService:ToastrService,private authService: SocialAuthService) { 
    this.userObservable = this.userSubject.asObservable();
  }


  login(userLogin:IUserLogin):Observable<User>{
    return this.http.post<User>(USER_LOGIN_URL,userLogin).pipe(
      tap({
        next:(user)=>{
          this.setUserToLocalStorage(user);
          this.userSubject.next(user);
          this.toastrService.success('Login successful');
          window.location.reload();
        },
        error:(errorResponse)=>{
          this.toastrService.error(errorResponse.error,'Login failed');
        }
      })
    );
  }

  register(userRegiser:IUserRegister):Observable<User>{
    return this.http.post<User>(USER_REGISTER_URL,userRegiser).pipe(
      tap({
        next:(user)=>{
          this.setUserToLocalStorage(user);
          this.userSubject.next(user);
          this.toastrService.success('Registration successful');
        },
        error:(errorResponse)=>{
          this.toastrService.error(errorResponse.error,'Registration failed');
        }
      })
    )
  }
  logout() {
    this.userSubject.next(new User());
    if (typeof window !== 'undefined') {
      localStorage.removeItem(USER_KEY);
      this.logoutFromGoogle();
      window.location.reload();
    }
    
  }

  logoutFromGoogle(): void {
    this.authService.signOut()
      .then(() => {
        console.log('Logout from Google successful');
      })
      .catch((error) => {
        console.error('Error logging out from Google:', error);
      });
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
  // depositUpdateUserToLocalStorage(userId: string) {
  //   return this.http.get<{user: User, token: string}>(USER_DATA_URL + userId).pipe(
  //     tap({
  //       next: (response) => {
  //         console.log(response);
  //         const user = response.user;
  //         user.token = response.token; // Presupunând că vrei să actualizezi și tokenul în modelul de User
  //         this.setUserToLocalStorage(user);
  //         this.userSubject.next(user);
  //         this.toastrService.success('Deposit Successful');
  //         window.location.reload();
  //         // Nu este recomandat să folosești window.location.reload(); în aplicațiile SPA, deoarece reîncărcați întreaga pagină, ceea ce încalcă principiul Single Page Application.
  //         // În schimb, ar trebui să actualizezi UI-ul prin Angular bindings.
  //       },
  //       error: (errorResponse) => {
  //         this.toastrService.error(errorResponse.error, 'Deposit failed');
  //       }
  //     })
  //   );
  // }
  public get currentUser():User{
    return this.userSubject.value;
  }

  updateUser(userId: string, address: string): Observable<any> {
    return this.http.put<any>(USER_UPDATE_URL+userId, { address }).pipe(
      tap({
        next: (response) => {
          this.setUserToLocalStorage(response.user);
          this.userSubject.next(response.user);
          this.toastrService.success('Address updated successfully');
          window.location.reload();
        },
        error: (error) => {
          this.toastrService.error(error.error, 'Error updating address');
        }
      })
    );
  }

  validateGoogleToken(token: string): Observable<User> {
    return this.http.post<User>(USER_LOGIN_WITH_GOOGLE_URL, { token }).pipe(
      tap({
        next:(user) => {
          this.setUserToLocalStorage(user);
          this.userSubject.next(user);
          window.location.reload();
        },
        error:(errorResponse)=>{
          this.toastrService.error(errorResponse.error,'Login failed');
        }
      })
      
    );
    
  }

  
}