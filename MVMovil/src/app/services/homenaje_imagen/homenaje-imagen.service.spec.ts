import { TestBed } from '@angular/core/testing';

import { HomenajeImagenService } from './homenaje-imagen.service';

describe('HomenajeImagenService', () => {
  let service: HomenajeImagenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomenajeImagenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
