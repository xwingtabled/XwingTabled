import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Events } from '@ionic/angular';
import { DownloadService } from './download.service';

describe('XwingDataService', () => {
  let injector: TestBed;
  let service: DownloadService;
  let httpMock: HttpTestingController;

  beforeEach(() => { 
    TestBed.configureTestingModule({
      providers: [ 
        Events
      ],
      imports: [ HttpClientTestingModule ]  
    });
    injector = getTestBed();
    service = injector.get(DownloadService);
    httpMock = injector.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    const service: DownloadService = TestBed.get(DownloadService);
    expect(service).toBeTruthy();
  });

  it ('should calculate download progress', () => {
    service.queued = [ ];
    service.error_urls = [ ];
    service.downloaded = [ ];
    service.update_download_progress();
    expect(service.progress).toEqual(0);
    service.queued = [ 'file1' ];
    service.error_urls = [ ];
    service.downloaded = [ 'file2' ];
    service.update_download_progress();
    expect(service.progress).toEqual(50);
    service.queued = [ 'file1' ];
    service.error_urls = [ 'file2' ];
    service.downloaded = [ ];
    service.update_download_progress();
    expect(service.progress).toEqual(50);
    service.queued = [ ];
    service.error_urls = [ 'file1' ];
    service.downloaded = [ 'file2' ];
    service.update_download_progress();
    expect(service.progress).toEqual(100);
  });

  it ('should transfer queued download items that are completed to downloaded list', () => {
    service.queued = [ 'file1', 'file2', 'file3' ];
    service.error_urls = [ ];
    service.downloaded = [ ];
    service.mark_download_complete('file2');
    expect(service.downloaded.length).toEqual(1);
    expect(service.queued.length).toEqual(2);
  });

  it ('should transfer download error items to error list', () => {
    service.queued = [ 'file1', 'file2', 'file3' ];
    service.error_urls = [ ];
    service.mark_download_error('file2');
    expect(service.queued.length).toEqual(2);
    expect(service.error_urls.length).toEqual(1);
  })

  it ('should sequentially download a list of files', () => {
    let mock_urls = ['file1', 'file2', 'file3'];
    let downloaded_data = [ ];
    service.download_urls(['file1', 'file2', 'file3']).subscribe(
      (response) => {
        downloaded_data.push(response.body);
      }
    );

    let req = httpMock.expectOne('file1');
    req.flush('file1');
    req = httpMock.expectOne('file2');
    req.error(new ErrorEvent("Error on file2"));
    req = httpMock.expectOne('file3');
    req.flush('file3');


    expect(downloaded_data.indexOf('file1')).toEqual(0);
    expect(downloaded_data.indexOf('file3')).toEqual(1);
    expect(service.error_urls.indexOf('file2')).toEqual(0);
    expect(service.progress).toEqual(100);

  });
});
