import { TestBed } from '@angular/core/testing';

import { EventsCollectionService } from './events-collection.service';

describe('EventsCollectionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EventsCollectionService = TestBed.get(EventsCollectionService);
    expect(service).toBeTruthy();
  });
});
