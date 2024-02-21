import { Component, NgModule, OnInit } from '@angular/core';
import { DefaultButtonComponent } from '../../partials/default-button/default-button.component';
import { TextInputComponent } from '../../partials/text-input/text-input.component';
import { InputValidationComponent } from '../../partials/input-validation/input-validation.component';
import { InputContainerComponent } from '../../partials/input-container/input-container.component';
import { CoreModule } from '../../../modules/core/core.module';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { PasswordsMatchValidator } from '../../../shared/validators/password_match_validator';
import { IUserRegister } from '../../../shared/interfaces/IUserRegister';


@Component({
  selector: 'app-register',
  standalone: true,
  providers: [UserService,ToastrService],
  imports: [ReactiveFormsModule,DefaultButtonComponent,TextInputComponent,InputValidationComponent,InputContainerComponent,CoreModule,RouterModule,CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit{
  registerForm!: FormGroup;
  isSubmitted = false;

  returnUrl= '';
  constructor(
    private formBuilder:FormBuilder,
    private userService:UserService,
    private router:Router,
    private activatedRoute:ActivatedRoute
  ){}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      confirmPassword: ['', Validators.required],
      address: ['', [Validators.required, Validators.minLength(10)]]
    },{
      validators: PasswordsMatchValidator('password','confirmPassword')
    });

    this.returnUrl= this.activatedRoute.snapshot.queryParams.returnUrl;
  }

  get fc() {
    return this.registerForm.controls;
  }

  submit(){
    this.isSubmitted = true;
    if(this.registerForm.invalid) return;

    const fv= this.registerForm.value;
    const user :IUserRegister = {
      name: fv.name,
      email: fv.email,
      password: fv.password,
      confirmPassword: fv.confirmPassword,
      address: fv.address
    };

    this.userService.register(user).subscribe(_ => {
      this.router.navigateByUrl(this.returnUrl);
    })
  }
}


