import { TestBed } from '@angular/core/testing';

import { XwingImageService } from './xwing-image.service';

describe('XwingImageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: XwingImageService = TestBed.get(XwingImageService);
    expect(service).toBeTruthy();
  });
});
