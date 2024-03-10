import { NgModule } from '@angular/core';
import {ToastrModule} from 'ngx-toastr';



@NgModule({
  declarations: [],
  imports: [
    ToastrModule.forRoot()
  ],
  exports: [
    ToastrModule
  ]
})
export class CoreModule { }
