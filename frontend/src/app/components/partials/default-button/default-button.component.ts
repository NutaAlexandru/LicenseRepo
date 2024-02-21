import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'default-button',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './default-button.component.html',
  styleUrl: './default-button.component.css'
})
export class DefaultButtonComponent {
@Input()
type:'submit' | 'button' = 'submit';
@Input()
text:string='Submit';
@Input()
bgColor='blue';
@Input()
color='white';
@Input()
fontSize='16px';
@Input()
width='100%';
@Output()
onClick= new EventEmitter();
}
