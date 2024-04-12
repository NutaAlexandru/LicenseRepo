import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortofolioPageComponent } from './portofolio-page.component';

describe('PortofolioPageComponent', () => {
  let component: PortofolioPageComponent;
  let fixture: ComponentFixture<PortofolioPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortofolioPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PortofolioPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
