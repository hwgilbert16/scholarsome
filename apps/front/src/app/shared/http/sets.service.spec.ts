import { TestBed } from '@angular/core/testing';

import { SetsService } from './sets.service';

describe('SetsService', () => {
  let service: SetsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SetsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
