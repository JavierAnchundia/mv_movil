import { TestBed } from '@angular/core/testing';

import { HomenajesService } from './homenajes.service';

describe('HomenajesService', () => {
  let service: HomenajesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomenajesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
