import { TestBed } from '@angular/core/testing';

import { YoutrackService } from './youtrack.service';

describe('YoutrackService', () => {
  let service: YoutrackService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(YoutrackService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
