import { TestBed, inject } from '@angular/core/testing';

import { UserResponseService } from './user-response.service';

describe('UserResponseService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserResponseService]
    });
  });

  it('should be created', inject([UserResponseService], (service: UserResponseService) => {
    expect(service).toBeTruthy();
  }));
});
