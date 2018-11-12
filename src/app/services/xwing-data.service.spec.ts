import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { XwingJsonDataService } from './xwing-json-data.service';
import { Events } from '@ionic/angular';
import { XwingDataService } from './xwing-data.service';

describe('XwingDataService', () => {
  let injector: TestBed;
  let service: XwingDataService;
  let httpMock: HttpTestingController;

  beforeEach(() => { 
    TestBed.configureTestingModule({
      providers: [ 
        Events
      ],
      imports: [ HttpClientTestingModule ]  
    });
    injector = getTestBed();
    service = injector.get(XwingJsonDataService);
    httpMock = injector.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    const service: XwingDataService = TestBed.get(XwingDataService);
    expect(service).toBeTruthy();
  });

  it ('should calculate download progress', () => {
    service.queued = [ ];
    service.downloaded = [ ];
    service.update_download_progress();
    expect(service.download_progress).toEqual(0);
    service.queued = [ 'file1' ];
    service.downloaded = [ 'file2' ];
    service.update_download_progress();
    expect(service.download_progress).toEqual(50);
  });
  
  it ('should transfer queued download items that are completed to downloaded list', () => {
    service.queued = [ 'file1', 'file2', 'file3' ];
    service.downloaded = [ ];
    service.mark_download_complete('file2');
    expect(service.downloaded.length).toEqual(1);
    expect(service.queued.length).toEqual(2);
  });
});
