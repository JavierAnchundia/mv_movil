import { TestBed } from '@angular/core/testing';

import { HomenajeMensajeService } from './homenaje-mensaje.service';

describe('HomenajeMensajeService', () => {
  let service: HomenajeMensajeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomenajeMensajeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
