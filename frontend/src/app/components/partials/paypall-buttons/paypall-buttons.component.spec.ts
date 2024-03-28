import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaypallButtonsComponent } from './paypall-buttons.component';

describe('PaypallButtonsComponent', () => {
  let component: PaypallButtonsComponent;
  let fixture: ComponentFixture<PaypallButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaypallButtonsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaypallButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
