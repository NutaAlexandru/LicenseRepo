import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AbstractControl } from '@angular/forms';
const VALIDATORS:any={
  required:'This field is required',
  email:'Please enter a valid email address',
  minlength: 'Field is too short',
  notMatch: 'Password and Confirm does not match'
};
@Component({
  selector: 'input-validation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './input-validation.component.html',
  styleUrl: './input-validation.component.css'
})
export class InputValidationComponent implements OnChanges,OnInit {
  
 
  @Input()
  control!:AbstractControl;
  @Input()
  showErrors:boolean=true;
  errorMsg:string[]=[];

  checkValidity(){
    const errors=this.control.errors;
    if(!errors){
      return;
    }
    const keys=Object.keys(errors);
    this.errorMsg=keys.map(key=>VALIDATORS[key]);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.checkValidity();
  }

  ngOnInit(): void {
    this.control.statusChanges.subscribe(()=>{
      this.checkValidity();
    });
    this.control.valueChanges.subscribe(()=>{
      this.checkValidity();
    });
  }
}
