import { TestBed, inject } from '@angular/core/testing';

import { TemplateDataService } from './template-data.service';

describe('TemplateDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TemplateDataService]
    });
  });

  it('should be created', inject([TemplateDataService], (service: TemplateDataService) => {
    expect(service).toBeTruthy();
  }));
});
