import { TestBed } from '@angular/core/testing';

import { HomenajeAudioService } from './homenaje-audio.service';

describe('HomenajeAudioService', () => {
  let service: HomenajeAudioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomenajeAudioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
