import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DividentsComponent } from './dividents.component';

describe('DividentsComponent', () => {
  let component: DividentsComponent;
  let fixture: ComponentFixture<DividentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DividentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DividentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
