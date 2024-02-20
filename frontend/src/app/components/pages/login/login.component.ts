import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule,ReactiveFormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm!: FormGroup;
  isSubmitted = false;
  constructor(private formBuilder:FormBuilder) { 

  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required,Validators.email]],
      password: ['',Validators.required]
    });
  }

  get fc(){
    return this.loginForm.controls;
  }

  submit(){
    this.isSubmitted = true;
    if(this.loginForm.invalid){
      return;
    }
    console.table(this.loginForm.value);
  }

}
