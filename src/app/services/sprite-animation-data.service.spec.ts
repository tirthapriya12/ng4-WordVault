import { TestBed, inject } from '@angular/core/testing';

import { SpriteAnimationDataService } from './sprite-animation-data.service';

describe('SpriteAnimationDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SpriteAnimationDataService]
    });
  });

  it('should be created', inject([SpriteAnimationDataService], (service: SpriteAnimationDataService) => {
    expect(service).toBeTruthy();
  }));
});
