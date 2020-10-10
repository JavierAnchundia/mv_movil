import { TestBed } from '@angular/core/testing';

import { HomenajeTextoService } from './homenaje-texto.service';

describe('HomenajeTextoService', () => {
  let service: HomenajeTextoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomenajeTextoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
