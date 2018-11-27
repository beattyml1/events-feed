import { TestBed } from '@angular/core/testing';

import { StarredCollectionService } from './starred-collection.service';

describe('StarredCollectionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StarredCollectionService = TestBed.get(StarredCollectionService);
    expect(service).toBeTruthy();
  });
});
