import { TestBed } from '@angular/core/testing';

import { HomenajeYoutubeService } from './homenaje-youtube.service';

describe('HomenajeYoutubeService', () => {
  let service: HomenajeYoutubeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomenajeYoutubeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
