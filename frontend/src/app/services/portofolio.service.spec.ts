import { TestBed } from '@angular/core/testing';

import { PortofolioService } from './portofolio.service';

describe('PortofolioService', () => {
  let service: PortofolioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PortofolioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
