import { TestBed } from '@angular/core/testing';

import { OnlinePublishingService } from './online-publishing.service';

describe('OnlinePublishingService', () => {
  let service: OnlinePublishingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OnlinePublishingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
