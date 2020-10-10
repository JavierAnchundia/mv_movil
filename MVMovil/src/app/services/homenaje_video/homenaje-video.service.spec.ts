import { TestBed } from '@angular/core/testing';

import { HomenajeVideoService } from './homenaje-video.service';

describe('HomenajeVideoService', () => {
  let service: HomenajeVideoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomenajeVideoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
