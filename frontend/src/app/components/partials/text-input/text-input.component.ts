import { Component, Input } from '@angular/core';
import { AbstractControl, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputContainerComponent } from '../input-container/input-container.component';
import { CommonModule } from '@angular/common';
import { InputValidationComponent } from '../input-validation/input-validation.component';

@Component({
  selector: 'text-input',
  standalone: true,
  imports: [InputContainerComponent,InputValidationComponent,CommonModule,ReactiveFormsModule],
  templateUrl: './text-input.component.html',
  styleUrl: './text-input.component.css'
})
export class TextInputComponent {

  @Input()
  control!:AbstractControl;
  @Input()
  showErrors:boolean=true;
  @Input()
  label!:string;
  @Input()
  type: 'text' | 'password' | 'email' = 'text';


  constructor() { }

    get formControl(){
      return this.control as FormControl;
    }

}
