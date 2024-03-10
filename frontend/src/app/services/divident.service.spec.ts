import { TestBed } from '@angular/core/testing';

import { DividentService } from './divident.service';

describe('DividentService', () => {
  let service: DividentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DividentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
