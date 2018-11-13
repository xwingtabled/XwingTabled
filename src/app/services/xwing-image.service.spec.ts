import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { XwingImageService } from './xwing-image.service';
import { configureTestbed } from '../app.test-config';

describe('XwingImageService', () => {
  let injector: TestBed;
  let service: XwingImageService;
  let httpMock: HttpTestingController;

  beforeEach(() => { 
    configureTestbed();
    injector = getTestBed();
    service = injector.get(XwingImageService);
    httpMock = injector.get(HttpTestingController);
  });
  
  it('should be created', () => {
    const service: XwingImageService = TestBed.get(XwingImageService);
    expect(service).toBeTruthy();
  });
});
