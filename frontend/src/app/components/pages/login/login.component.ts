import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule} from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { CoreModule } from '../../../modules/core/core.module';
import { ToastrService } from 'ngx-toastr';
import { InputContainerComponent } from '../../partials/input-container/input-container.component';
import { InputValidationComponent } from '../../partials/input-validation/input-validation.component';
import { TextInputComponent } from '../../partials/text-input/text-input.component';
import { DefaultButtonComponent } from '../../partials/default-button/default-button.component';

import { SocialAuthService, GoogleSigninButtonModule,SocialUser } from '@abacritt/angularx-social-login';
import { User } from '../../../shared/models/User';

@Component({
  selector: 'app-login',
  standalone: true,
  providers: [UserService,
    ToastrService,
    
  ],
  imports: [GoogleSigninButtonModule,DefaultButtonComponent,TextInputComponent,InputValidationComponent,InputContainerComponent,CoreModule,RouterModule,ReactiveFormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  loginForm!: FormGroup;
  isSubmitted = false;
  returnUrl= '';
  user: SocialUser;
  simpleUser:User;
  loggedIn: boolean;
  constructor(private activatedRoute:ActivatedRoute,
     private formBuilder:FormBuilder,
     private userService:UserService,
     private router:Router,
     private authService: SocialAuthService,
     private toastrService: ToastrService) { 

  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required,Validators.email]],
      password: ['',Validators.required]
    });
    this.authService.authState.subscribe((user) => {
      if (user) {
        console.log(user.authToken);
        this.handleCredentialResponse(user);
      }
    });

    this.returnUrl = this.activatedRoute.snapshot.queryParams.returnUrl;
    
  }

  get fc(){
    return this.loginForm.controls;
  }

  submit(){
    this.isSubmitted = true;
    if(this.loginForm.invalid){
      return;
    }
    this.userService.login({email:this.fc.email.value,password:this.fc.password.value}).subscribe(()=>{
      this.router.navigateByUrl(this.returnUrl);
    });
  }

// În login.component.ts
handleCredentialResponse(user: SocialUser): void {
    this.userService.validateGoogleToken(user.idToken).subscribe({
      next: (user) => {
        this.isSubmitted = true;
       // console.log(user.token);
       // console.log(localStorage)
        //console.log(user);
       
      },
      error: (error) => {
        console.error("Eroare la autentificarea cu Google: ", error);
        this.toastrService.error('Autentificarea cu Google a eșuat');
      }
    });
    this.router.navigateByUrl(this.returnUrl);
  }
  
}
