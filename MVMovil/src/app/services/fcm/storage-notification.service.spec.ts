import { TestBed } from '@angular/core/testing';

import { StorageNotificationService } from './storage-notification.service';

describe('StorageNotificationService', () => {
  let service: StorageNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageNotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
