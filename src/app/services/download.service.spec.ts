import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Events } from '@ionic/angular';
import { DownloadService } from './download.service';
import { configureTestbed } from '../app.test-config';

describe('DownloadService', () => {
  let injector: TestBed;
  let service: DownloadService;
  let httpMock: HttpTestingController;

  beforeEach(() => { 
    configureTestbed();
    injector = getTestBed();
    service = injector.get(DownloadService);
    httpMock = injector.get(HttpTestingController);
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
});
