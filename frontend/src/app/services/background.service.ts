import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackgroundService {
  private backgroundSource = new BehaviorSubject<number>(1); // Default background index
  currentBackground = this.backgroundSource.asObservable();

  constructor() { }

  changeBackground(index: number) {
    this.backgroundSource.next(index);
  }
}
